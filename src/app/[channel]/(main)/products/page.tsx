import { notFound } from "next/navigation";
import { CategoriesDocument, ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { CategoryFilter } from "@/ui/components/CategoryFilter";
import { ProductsPerPage } from "@/app/config";
import * as Checkout from "@/lib/checkout";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor: string | string[] | undefined;
		categories: string | string[] | undefined;
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const categoryIds = Array.isArray(searchParams.categories)
		? searchParams.categories
		: searchParams.categories
			? [searchParams.categories]
			: undefined;

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: cursor,
			channel: params.channel,
			filter: categoryIds ? { categories: categoryIds } : undefined,
		},
		revalidate: 60,
	});

	const { categories } = await executeGraphQL(CategoriesDocument, {
		revalidate: 3600,
	});

	if (!products) {
		notFound();
	}


	const nextSearchParams = new URLSearchParams({
		...(products.pageInfo.endCursor && { cursor: products.pageInfo.endCursor }),
	});
	if (categoryIds) {
		categoryIds.forEach((id) => nextSearchParams.append("categories", id));
	}

	// Previous page: remove cursor to go back (maintains category filters)
	const previousSearchParams = new URLSearchParams();
	if (categoryIds) {
		categoryIds.forEach((id) => previousSearchParams.append("categories", id));
	}

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
			<div className="flex flex-col gap-4 md:gap-8 md:flex-row">
				{categories?.edges && (
					<CategoryFilter categories={categories.edges.map((e) => e.node)} />
				)}
				<div className="flex-1">
					<ProductList
						products={products.edges.map((e) => e.node)}
						cartItems={cartItems}
					/>
					<Pagination
						pageInfo={{
							...products.pageInfo,
							basePathname: `/products`,
							nextUrlSearchParams: nextSearchParams,
							previousUrlSearchParams: previousSearchParams,
						}}
					/>
					
				</div>
			</div>
		</section>
	);
}
