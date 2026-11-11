import { type ComboProduct } from "@/ui/customcomponents/ComboSection";

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
							attributes {
								attribute {
									slug
									name
								}
								values {
									name
								}
							}
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

export async function getCombos(channel: string): Promise<ComboProduct[]> {
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
