import { DEFAULT_CHANNEL, DISCOUNTS_AND_CHEAP_PRODUCTS_ENDPOINT, SALEOR_API_URL } from "@/config/SaleorApi";

export interface ApiDiscount {
	id: string;
	code: string;
	name: string;
	discountValueType: string;
	discountValue: number;
	minSpent?: number | null;
	usageLimit?: number | null;
}

export interface Coupon {
	id: string;
	code: string;
	title: string;
	description: string;
	terms: string[];
}

export const buildCouponDescription = (discount: ApiDiscount): string => {
	const lines: string[] = [];

	if (discount.discountValueType === "percentage") {
		lines.push(`Flat ${discount.discountValue}% off`);
	} else {
		lines.push(`Flat ₹${discount.discountValue} off`);
	}

	if (discount.minSpent) {
		lines.push(`Applicable on orders above ₹${discount.minSpent}`);
	}

	if (discount.usageLimit) {
		lines.push(`Limited to ${discount.usageLimit} uses`);
	}

	lines.push("Meatndoor reserves the right to change the offer without any prior notice.");
	lines.push("Offer will be void on cancelled and not delivered orders.");

	return lines.join("\n");
};

export const parseDescriptionLines = (description: string): string[] =>
	description
		.split("\n")
		.map((line) => line.replace(/^•\s*/, "").trim())
		.filter(Boolean);

export const mapDiscountToCoupon = (discount: ApiDiscount): Coupon => {
	const description = buildCouponDescription(discount);

	return {
		id: discount.id,
		code: discount.code,
		title: discount.name,
		description,
		terms: parseDescriptionLines(description),
	};
};

export interface CheapProductVariant {
	id: string;
	name: string;
	price: number;
	discountedPrice?: number | null;
	currency?: string;
	attributes?: Array<{
		attribute?: { slug?: string; name?: string };
		values?: Array<{ name?: string }>;
	}>;
}

export interface CheapProduct {
	id: string;
	slug: string;
	name: string;
	variants?: CheapProductVariant[];
	attributes?: CheapProductVariant["attributes"];
}

export interface DiscountsAndCheapProductsResult {
	coupons: Coupon[];
	cheapProducts: CheapProduct[];
}

export const getCheapProductWeight = (product: CheapProduct): string | null => {
	const variant = product?.variants?.[0];
	const fromAttrs = [...(product?.attributes || []), ...(variant?.attributes || [])].find(
		(attr) =>
			attr.attribute?.slug === "net-weight" ||
			attr.attribute?.name === "Net Weight" ||
			attr.attribute?.slug === "weight",
	)?.values?.[0]?.name;

	if (fromAttrs) {
		return fromAttrs;
	}

	if (variant?.name && variant.name.trim() && variant.name !== "Default Title") {
		return variant.name.trim();
	}

	return null;
};

export const getCheapProductMinimumOrderTotal = (product: CheapProduct): number | null => {
	const variant = product?.variants?.[0];
	const rawValue = [...(product?.attributes || []), ...(variant?.attributes || [])].find(
		(attr) =>
			attr.attribute?.slug === "minimum-order-total" ||
			attr.attribute?.name === "Minimum Order Total",
	)?.values?.[0]?.name;

	if (!rawValue) {
		return null;
	}

	const parsed = Number(rawValue);
	return Number.isFinite(parsed) ? parsed : null;
};

/** "Saving Amount" stores the original/MRP price used for strikethrough display. */
export const getCheapProductSavingAmount = (product: CheapProduct): number | null => {
	const variant = product?.variants?.[0];
	const rawValue = [...(product?.attributes || []), ...(variant?.attributes || [])].find(
		(attr) =>
			attr.attribute?.slug === "saving-amount" ||
			attr.attribute?.name === "Saving Amount",
	)?.values?.[0]?.name;

	if (!rawValue) {
		return null;
	}

	const parsed = Number(rawValue);
	return Number.isFinite(parsed) ? parsed : null;
};

export const fetchProductThumbnail = async (slug: string): Promise<string | null> => {
	try {
		const response = await fetch(SALEOR_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `{ product(slug: "${slug}", channel: "${DEFAULT_CHANNEL}") { thumbnail { url } } }`,
			}),
		});
		const json = (await response.json()) as {
			data?: { product?: { thumbnail?: { url?: string } } };
		};

		return json?.data?.product?.thumbnail?.url ?? null;
	} catch {
		return null;
	}
};

export const fetchDiscountsAndCheapProducts = async (): Promise<DiscountsAndCheapProductsResult> => {
	const response = await fetch(DISCOUNTS_AND_CHEAP_PRODUCTS_ENDPOINT);

	if (!response.ok) {
		throw new Error("Failed to fetch coupons");
	}

	const data = (await response.json()) as {
		discounts?: ApiDiscount[];
		cheapProducts?: CheapProduct[];
	};

	return {
		coupons: (data.discounts || []).map(mapDiscountToCoupon),
		cheapProducts: data.cheapProducts || [],
	};
};

export const fetchCoupons = async (): Promise<Coupon[]> => {
	const { coupons } = await fetchDiscountsAndCheapProducts();
	return coupons;
};

export const COUPON_COLOR_THEMES = [
	{
		border: "border-orange-400",
		text: "text-orange-500",
	},
	{
		border: "border-green-500",
		text: "text-green-600",
	},
	{
		border: "border-[#ed4264]",
		text: "text-[#ed4264]",
	},
	{
		border: "border-blue-400",
		text: "text-blue-600",
	},
] as const;
