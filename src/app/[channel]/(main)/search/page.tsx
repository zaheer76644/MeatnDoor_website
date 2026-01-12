import { notFound, redirect } from "next/navigation";
import { SearchX } from "lucide-react";
import { OrderDirection, ProductOrderField, SearchProductsDocument, type CheckoutFindQuery } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";
import * as Checkout from "@/lib/checkout";

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};

export default async function Page(props: {
	searchParams: Promise<Record<"query" | "cursor", string | string[] | undefined>>;
	params: Promise<{ channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const searchValue = searchParams.query;

	if (!searchValue) {
		notFound();
	}

	if (Array.isArray(searchValue)) {
		const firstValidSearchValue = searchValue.find((v) => v.length > 0);
		if (!firstValidSearchValue) {
			notFound();
		}
		redirect(`/search?${new URLSearchParams({ query: firstValidSearchValue }).toString()}`);
	}

	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables: {
			first: ProductsPerPage,
			search: searchValue,
			after: cursor,
			sortBy: ProductOrderField.Rating,
			sortDirection: OrderDirection.Asc,
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const newSearchParams = new URLSearchParams({
		query: searchValue,
		...(products.pageInfo.endCursor && { cursor: products.pageInfo.endCursor }),
	});

	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout: CheckoutFindQuery["checkout"] | undefined = await Checkout.find(checkoutId);
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
		<section className="mx-auto max-w-7xl p-8 pb-16">
			{products.totalCount && products.totalCount > 0 ? (
				<div>
					<h1 className="pb-8 text-xl font-semibold text-[#47141e]">
						Search results for &quot;<span className="text-[#ed4264]">{searchValue}</span>&quot;:
					</h1>
					<ProductList products={products.edges.map((e) => e.node)} cartItems={cartItems}/>
					<Pagination
						pageInfo={{
							...products.pageInfo,
							basePathname: `/search`,
							urlSearchParams: newSearchParams,
						}}
					/>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-16 px-4">
					<div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#ed4264]/10 to-[#47141e]/10">
						<SearchX className="h-12 w-12 text-[#ed4264]" strokeWidth={1.5} />
					</div>
					<h2 className="mb-3 text-2xl font-bold text-[#47141e]">No products found</h2>
					<p className="mb-2 max-w-md text-center text-gray-600">
						We couldn&apos;t find any products matching{' '}
						<span className="font-semibold text-[#ed4264]">&quot;{searchValue}&quot;</span>
					</p>
					<p className="text-sm text-gray-500">Try adjusting your search terms or browse our categories</p>
				</div>
			)}
		</section>
	);
}
