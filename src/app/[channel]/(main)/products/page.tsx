import {
	CategoriesDocument,
	ProductListPaginatedDocument,
	type ProductFilterInput,
	type ProductListItemFragment,
	type ProductListPaginatedQuery,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { CategoryFilter } from "@/ui/components/CategoryFilter";
import { ComboSection } from "@/ui/customcomponents/ComboSection";
import { ProductsPerPage } from "@/app/config";
import * as Checkout from "@/lib/checkout";
import { getCombos } from "@/lib/combos";
import { filterProductsForListing, sortProductsBySortIndex } from "@/lib/productSort";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

/**
 * Fetch one page of the catalog. Keeping this in its own function with an
 * explicit return type avoids a TypeScript circular-inference issue between the
 * mutable `after` cursor and the query's generic result type.
 */
async function getProductsPage(
	channel: string,
	filter: ProductFilterInput | undefined,
	after: string | null,
): Promise<ProductListPaginatedQuery["products"]> {
	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: { first: 100, after, channel, filter },
		revalidate: 60,
	});

	return products;
}

/**
 * Fetch the whole matching catalog so products can be ordered by the
 * "Sort index" attribute before we paginate locally.
 */
async function getAllProducts({
	channel,
	filter,
}: {
	channel: string;
	filter?: ProductFilterInput;
}): Promise<ProductListItemFragment[]> {
	const products: ProductListItemFragment[] = [];
	let after: string | null = null;

	for (let page = 0; page < 25; page += 1) {
		const productPage = await getProductsPage(channel, filter, after);

		if (!productPage) {
			break;
		}

		products.push(...productPage.edges.map(({ node }) => node));

		if (!productPage.pageInfo.hasNextPage || !productPage.pageInfo.endCursor) {
			break;
		}

		after = productPage.pageInfo.endCursor;
	}

	return products;
}

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor: string | string[] | undefined;
		categories: string | string[] | undefined;
		page: string | string[] | undefined;
		view: string | string[] | undefined;
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const categoryIds = Array.isArray(searchParams.categories)
		? searchParams.categories
		: searchParams.categories
			? [searchParams.categories]
			: undefined;

	const view = searchParams.view === "combos" ? "combos" : "products";
	const requestedPage = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
	const pageNumber = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;

	const { categories } = await executeGraphQL(CategoriesDocument, {
		revalidate: 3600,
	});

	const sidebar = categories?.edges && (
		<CategoryFilter categories={categories.edges.map((e) => e.node)} />
	);

	if (view === "combos") {
		const combos = await getCombos(params.channel);

		return (
			<section className="container mx-auto px-4 py-8 pb-16 md:p-8">
				<h2 className="sr-only">Combos</h2>
				<div className="flex flex-col gap-4 md:gap-8 md:flex-row">
					{sidebar}
					<div className="flex-1">
						<ComboSection combos={combos} />
					</div>
				</div>
			</section>
		);
	}

	const allProducts = await getAllProducts({
		channel: params.channel,
		filter: categoryIds ? { categories: categoryIds } : undefined,
	});

	const sortedProducts = sortProductsBySortIndex(filterProductsForListing(allProducts));
	const totalCount = sortedProducts.length;
	const start = (pageNumber - 1) * ProductsPerPage;
	const pageProducts = sortedProducts.slice(start, start + ProductsPerPage);

	const buildSearchParams = (targetPage: number) => {
		const nextParams = new URLSearchParams();
		categoryIds?.forEach((id) => nextParams.append("categories", id));
		if (targetPage > 1) {
			nextParams.set("page", String(targetPage));
		}
		return nextParams;
	};

	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout = await Checkout.find(checkoutId);

	const cartItems =
		checkout?.lines.reduce(
			(acc, line) => {
				if (line.variant?.id) {
					acc[line.variant.id] = {
						lineId: line.id,
						quantity: line.quantity,
					};
				}
				return acc;
			},
			{} as Record<string, { lineId: string; quantity: number }>,
		) || {};

	return (
		<section className="container mx-auto px-4 py-8 pb-16 md:p-8">
			<h2 className="sr-only">Product list</h2>
			<div className="flex flex-col gap-4 md:flex-row md:gap-8">
				{sidebar}
				<div className="flex-1">
					{pageProducts.length > 0 ? (
						<ProductList products={pageProducts} cartItems={cartItems} />
					) : (
						<p className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
							No products found.
						</p>
					)}
					{totalCount > 0 && (
						<Pagination
							pageInfo={{
								basePathname: "/products",
								hasNextPage: start + ProductsPerPage < totalCount,
								hasPreviousPage: pageNumber > 1,
								nextUrlSearchParams: buildSearchParams(pageNumber + 1),
								previousUrlSearchParams: buildSearchParams(pageNumber - 1),
							}}
						/>
					)}
				</div>
			</div>
		</section>
	);
}
