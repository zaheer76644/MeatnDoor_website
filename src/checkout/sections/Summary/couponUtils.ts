export interface ApiDiscount {
	id: string;
	code: string;
	name: string;
	discountValueType: string;
	discountValue: number;
	minSpent?: number | null;
	minimumOrderTotal?: number | null;
	minimum_order_total?: number | null;
	usageLimit?: number | null;
}

export interface Coupon {
	id: string;
	code: string;
	title: string;
	description: string;
	terms: string[];
	minOrder: number;
}

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

export type OfferType = "coupon" | "deal";

export interface Offer {
	id: string;
	type: OfferType;
	code: string;
	title: string;
	description: string;
	minOrder: number;
	applied: boolean;
	locked: boolean;
	lockReason: string;
	product?: CheapProduct;
	price?: number;
	thumbnail?: string;
}

export interface DiscountsAndCheapProductsResult {
	discounts: ApiDiscount[];
	coupons: Coupon[];
	cheapProducts: CheapProduct[];
}

const getAttr = (product: CheapProduct, names: string[]): string | null => {
	const variant = product?.variants?.[0];
	const lists = [...(variant?.attributes || []), ...(product?.attributes || [])];
	const found = lists.find((attr) => {
		const name = attr.attribute?.name;
		const slug = attr.attribute?.slug;
		return (name && names.includes(name)) || (slug && names.includes(slug));
	});
	return found?.values?.[0]?.name || null;
};

export const getDiscountMinOrder = (discount: ApiDiscount): number =>
	Number(discount.minSpent ?? discount.minimumOrderTotal ?? discount.minimum_order_total ?? 0);

export const buildCouponDescription = (discount: ApiDiscount): string => {
	const lines: string[] = [];
	const isWc20 = String(discount.code || "").toUpperCase() === "WC20";

	if (discount.discountValueType === "percentage") {
		lines.push(`Flat ${discount.discountValue}% off${isWc20 ? " (max ₹100)" : ""}`);
	} else {
		lines.push(`Flat ₹${discount.discountValue} off${isWc20 ? " (max ₹100)" : ""}`);
	}

	const minOrder = getDiscountMinOrder(discount);
	if (minOrder) {
		lines.push(`Applicable on orders above ₹${minOrder}`);
	}

	if (discount.usageLimit) {
		lines.push(`Limited to ${discount.usageLimit} uses`);
	}

	lines.push("Cannot be combined with ₹1 deals");
	lines.push("Meatndoor reserves the right to change the offer without any prior notice.");

	return lines.join("\n");
};

export const buildDealDescription = (product: CheapProduct, price: number): string => {
	const minOrderRaw = getAttr(product, ["minimum-order-total", "Minimum Order Total"]);
	const minOrder = minOrderRaw ? Number(minOrderRaw) : 0;
	const lines = [
		`Get this product for ₹${Math.round(price)}`,
		minOrder > 0 ? `Applicable on orders above ₹${Math.round(minOrder)}` : null,
		"Only 1 unit can be added per order",
		"Cannot be combined with coupons or other deals",
	].filter((line): line is string => Boolean(line));

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
		minOrder: getDiscountMinOrder(discount),
	};
};

export const getDealPrice = (product: CheapProduct): number => {
	const variant = product?.variants?.[0];
	return Number(variant?.discountedPrice ?? variant?.price ?? 0);
};

export const getCheapProductWeight = (product: CheapProduct): string | null => {
	const fromAttrs = getAttr(product, ["net-weight", "Net Weight", "weight"]);
	if (fromAttrs) return fromAttrs;

	const variant = product?.variants?.[0];
	if (variant?.name && variant.name.trim() && variant.name !== "Default Title") {
		return variant.name.trim();
	}

	return null;
};

export const getCheapProductMinimumOrderTotal = (product: CheapProduct): number | null => {
	const rawValue = getAttr(product, ["minimum-order-total", "Minimum Order Total"]);
	if (!rawValue) return null;
	const parsed = Number(rawValue);
	return Number.isFinite(parsed) ? parsed : null;
};

export const getCheapProductSavingAmount = (product: CheapProduct): number | null => {
	const rawValue = getAttr(product, ["saving-amount", "Saving Amount"]);
	if (!rawValue) return null;
	const parsed = Number(rawValue);
	return Number.isFinite(parsed) ? parsed : null;
};

export const getDealShortName = (product: CheapProduct): string => {
	const nameMatch = String(product.name || "").match(/^(.*?@\s*1)\b/i);
	return (nameMatch ? nameMatch[1] : product.name || "").trim();
};

export const buildCouponOffers = ({
	coupons,
	appliedCouponCode,
	hasCheapInCart,
	baseCartTotal,
}: {
	coupons: Coupon[];
	appliedCouponCode?: string | null;
	hasCheapInCart: boolean;
	baseCartTotal: number;
}): Offer[] =>
	coupons.map((coupon) => {
		let locked = false;
		let lockReason = "";

		if (hasCheapInCart) {
			locked = true;
			lockReason = "Remove the ₹1 deal to apply a coupon";
		} else if (coupon.minOrder > 0 && baseCartTotal < coupon.minOrder) {
			locked = true;
			lockReason = `Add items worth ₹${Math.round(coupon.minOrder)} or more`;
		}

		return {
			id: coupon.id,
			type: "coupon" as const,
			code: coupon.code,
			title: coupon.title,
			description: coupon.description,
			minOrder: coupon.minOrder,
			applied: coupon.code === appliedCouponCode,
			locked,
			lockReason,
		};
	});

export const buildDealOffers = ({
	products,
	thumbnails,
	appliedCouponCode,
	hasCheapInCart,
	baseCartTotal,
	isDealInCart,
}: {
	products: CheapProduct[];
	thumbnails: Record<string, string>;
	appliedCouponCode?: string | null;
	hasCheapInCart: boolean;
	baseCartTotal: number;
	isDealInCart: (variantId: string) => boolean;
}): Offer[] =>
	products.map((product) => {
		const variant = product.variants?.[0];
		const price = getDealPrice(product);
		const minOrder = getCheapProductMinimumOrderTotal(product) ?? 0;
		const inCart = variant ? isDealInCart(variant.id) : false;
		let locked = false;
		let lockReason = "";

		if (!inCart && appliedCouponCode) {
			locked = true;
			lockReason = "Remove the coupon to add a ₹1 deal";
		} else if (!inCart && hasCheapInCart) {
			locked = true;
			lockReason = "Only one ₹1 deal can be added per order";
		} else if (!inCart && minOrder > 0 && baseCartTotal < minOrder) {
			locked = true;
			lockReason = `Add items worth ₹${Math.round(minOrder)} or more`;
		}

		const shortName = getDealShortName(product);
		const netWeight = getCheapProductWeight(product);

		return {
			id: product.id,
			type: "deal" as const,
			code: `#${shortName}`,
			title: netWeight ? `${shortName} (${netWeight})` : shortName,
			description: buildDealDescription(product, price || 1),
			minOrder,
			applied: inCart,
			locked,
			lockReason,
			product,
			price,
			thumbnail: thumbnails[product.id] || "",
		};
	});

export const COUPON_COLOR_THEMES = [
	{ border: "border-orange-400", text: "text-orange-500" },
	{ border: "border-green-500", text: "text-green-600" },
	{ border: "border-[#ed4264]", text: "text-[#ed4264]" },
	{ border: "border-blue-400", text: "text-blue-600" },
] as const;
