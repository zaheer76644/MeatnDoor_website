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
import { ComboSection, type ComboProduct } from "../customcomponents/ComboSection";
import { type ProductListItemFragment } from "@/gql/graphql";

export interface BestSellerProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail: { url: string; alt: string | null } | null;
	category: { id: string; name: string; slug: string } | null;
	variants: { id: string; name: string; pricing: any }[] | null;
	attributes: { attribute: { name: string }; values: { name: string }[] }[];
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
	return (data.collection?.products.edges.map((edge) => edge.node) as unknown as ProductListItemFragment[]) ?? [];
}

const COMBOS_QUERY = `
	query Combos($channel: String!) {
		combos(first: 20, channel: $channel) {
			edges {
				node {
					id
					name
					slug
					description
					image {
						url
						alt
					}
					imageAlt
					isAvailableForPurchase(channel: $channel)
					pricing(channel: $channel) {
						price {
							amount
							currency
						}
						undiscountedPrice {
							amount
						}
						savings {
							amount
						}
					}
					items {
						id
						quantity
						variant {
							id
							name
							product {
								id
								name
								slug
								thumbnail(size: 1024) {
									url
									alt
								}
							}
						}
					}
				}
			}
		}
	}
`;

type ComboCollectionResponse = {
	combos: {
		edges: { node: ComboProduct }[];
	} | null;
};

async function getCombos(channel: string): Promise<ComboProduct[]> {
	try {
		const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query: COMBOS_QUERY, variables: { channel } }),
			next: { revalidate: 60 },
		});

		if (!response.ok) {
			return [];
		}

		const { data } = (await response.json()) as { data: ComboCollectionResponse };
		return data.combos?.edges.map((edge) => edge.node) ?? [];
	} catch (error) {
		console.error("Could not load combos", error);
		return [];
	}
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
