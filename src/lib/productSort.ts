import { type ProductListItemFragment } from "@/gql/graphql";

type SortableProduct = Pick<ProductListItemFragment, "attributes" | "variants" | "category">;

const SORT_INDEX_SLUG = "sort-index";
const SORT_INDEX_NAME = "Sort index";

export const isProductOutOfStock = (product: SortableProduct) =>
	product.variants?.every((variant) => variant?.quantityAvailable === 0) ?? false;

export const getProductSortIndex = (product: SortableProduct) => {
	const rawValue = product.attributes?.find(
		(entry) => entry.attribute?.slug === SORT_INDEX_SLUG || entry.attribute?.name === SORT_INDEX_NAME,
	)?.values?.[0]?.name;

	const value = Number(rawValue);

	return Number.isFinite(value) ? value : 0;
};

/**
 * Product listings are ordered by the numeric "Sort index" product attribute.
 * Out-of-stock products are always pushed to the bottom.
 */
export const sortProductsBySortIndex = <T extends SortableProduct>(products: readonly T[]): T[] =>
	[...products].sort((a, b) => {
		const aOutOfStock = isProductOutOfStock(a);
		const bOutOfStock = isProductOutOfStock(b);

		if (aOutOfStock && !bOutOfStock) return 1;
		if (!aOutOfStock && bOutOfStock) return -1;

		const aIndex = getProductSortIndex(a);
		const bIndex = getProductSortIndex(b);

		if (!aIndex && !bIndex) return 0;
		if (!aIndex) return 1;
		if (!bIndex) return -1;

		return aIndex - bIndex;
	});

export const filterProductsForListing = <T extends SortableProduct>(products: readonly T[]): T[] =>
	products.filter((product) => product.category?.name);
