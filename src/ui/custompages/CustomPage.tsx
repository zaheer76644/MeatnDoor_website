// import CustomCarousel from "../customcomponents/CustomCarousel";
// import { CustomSlider } from "../customcomponents/CustomSlider";
// import { type ProductListItemFragment } from "@/gql/graphql";

// // eslint-disable-next-line import/no-default-export
// export default function CustomPage({ products }: { products: ProductListItemFragment[] }) {
// 	return (
// 		<div>
// 			<CustomSlider />
// 			<CustomCarousel products={products} />
// 		</div>
// 	);
// }

import CustomCarousel from "../customcomponents/CustomCarousel";
import { CustomSlider } from "../customcomponents/CustomSlider";
import { ComboSection } from "../customcomponents/ComboSection";
import { type ProductListItemFragment } from "@/gql/graphql";
import { getCombos } from "@/lib/combos";
import { filterProductsForListing, sortProductsBySortIndex } from "@/lib/productSort";

export interface BestSellerProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail: { url: string; alt: string | null } | null;
	category: { id: string; name: string; slug: string } | null;
	variants: { id: string; name: string; pricing: any }[] | null;
	attributes: {
		attribute: { id: string; name: string; slug: string };
		values: { id: string; name: string; slug?: string | null; value?: string | null }[];
	}[];
	pricing: {
		priceRange: {
			start: { gross: { amount: number; currency: string } };
		} | null;
	} | null;
}

export interface BestSellerCollectionResponse {
	collection: {
		id: string;
		name: string;
		products: { edges: { node: BestSellerProduct }[] };
	} | null;
}

// GraphQL query as a string
const BEST_SELLERS_QUERY = `
  query BestSellerCollection {
  collection(slug: "best-seller") {
    id
    name
    products(first: 20) {
      edges {
        node {
          id
          name
          slug
          attributes {
            attribute {
              id
              name
              slug
            }
            values {
              id
              name
              slug
              value
            }
          }
          thumbnail(size: 1024) {
            url
            alt
          }
		collections {
            id
            name
            slug
          }
		  variants {
				id
				name
				sku
				pricing {
				price {
					gross {
					amount
					currency
					}
				}
				}
				quantityAvailable
				media {
				url
				alt
				}
				attributes {
				attribute {
					id
					name
					slug
				}
				values {
					id
					name
					value
				}
				}
			}
          category { id name slug }  # <-- ADD THIS
          pricing {
            priceRange {
              start { gross { amount currency } }
              stop { gross { amount currency } } # optional
            }
          }
        }
      }
    }
  }
}

`;

// Fetch function using native fetch
async function getBestSellerProducts(): Promise<ProductListItemFragment[]> {
	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query: BEST_SELLERS_QUERY }),
	});

	const { data } = (await response.json()) as { data: BestSellerCollectionResponse };
	const products =
		(data.collection?.products.edges.map((edge) => edge.node) as unknown as ProductListItemFragment[]) ?? [];

	return sortProductsBySortIndex(filterProductsForListing(products));
}

// Page component
// eslint-disable-next-line import/no-default-export
export default async function CustomPage({
	cartItems,
	channel = "in",
}: {
	cartItems?: Record<string, { lineId: string; quantity: number }>;
	channel?: string;
}) {
	const [products, combos] = await Promise.all([getBestSellerProducts(), getCombos(channel)]);
// console.log('products==============', products)
	return (
		<div>
			<CustomSlider />
			<CustomCarousel products={products} cartItems={cartItems}/>
			<ComboSection combos={combos} />
		</div>
	);
}
