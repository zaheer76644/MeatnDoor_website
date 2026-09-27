import {
	type ApiDiscount,
	type CheapProduct,
	type Coupon,
	type DiscountsAndCheapProductsResult,
	mapDiscountToCoupon,
} from "./couponUtils";
import {
	DEFAULT_CHANNEL,
	DISCOUNTS_AND_CHEAP_PRODUCTS_ENDPOINT,
	SALEOR_API_URL,
} from "@/config/SaleorApi";

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
		cheap_products?: CheapProduct[];
		products?: CheapProduct[];
	};

	const discounts = (data.discounts ?? []).filter(
		(discount) => String(discount.code || "").toUpperCase() !== "DF40",
	);
	const cheapProducts = data.cheapProducts ?? data.cheap_products ?? data.products ?? [];

	return {
		discounts,
		coupons: discounts.map(mapDiscountToCoupon),
		cheapProducts,
	};
};

export const fetchCoupons = async (): Promise<Coupon[]> => {
	const { coupons } = await fetchDiscountsAndCheapProducts();
	return coupons;
};

