import { ProductsPerPage } from "@/app/config";
import {
	// ProductListByCollectionDocument,
	ProductListPaginatedDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
// import { ProductList } from "@/ui/components/ProductList";
import CustomPage from "@/ui/custompages/CustomPage";

export const metadata = {
	title: "MeatnDoor",
	description: "Quality at Doorstep",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	// const data = await executeGraphQL(ProductListByCollectionDocument, {
	// 	variables: {
	// 		slug: "featured-products",
	// 		channel: params.channel,
	// 	},
	// 	revalidate: 60,
	// });

	// if (!data.collection?.products) {
	// 	return null;
	// }
	// console.log("hey");
	const data = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: null,
			channel: params.channel,
		},
		revalidate: 60,
	});
	// const products = data.collection?.products.edges.map(({ node: product }) => product);
	const productList = data.products?.edges.map((edge) => edge.node) || [];

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<CustomPage products={productList} />
			{/* <h2 className="sr-only">Product list</h2> */}
			{/* <ProductList products={products} /> */}
		</section>
	);
}
