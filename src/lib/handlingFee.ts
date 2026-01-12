import { find } from "./checkout";
import {
	CheckoutAddLineDocument,
	CheckoutLineUpdateDocument,
	ProductDetailsDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function ensureHandlingFee(checkoutId: string) {
	console.log(`ensureHandlingFee called for checkoutId: ${checkoutId}`);

	// 1. Fetch checkout to get the channel
	const checkout = await find(checkoutId);
	if (!checkout) {
		console.error("Checkout not found in ensureHandlingFee");
		return;
	}

	const channel = checkout.channel.slug;
	console.log(`Checkout found. Channel: ${channel}`);

	// 2. Find the "Handling Fee" product in this channel
	const searchResult = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: "handling-fee",
			channel,
		},
		cache: "no-cache",
	});
	
	const handlingFeeProduct = searchResult.product;

	if (!handlingFeeProduct || !handlingFeeProduct.variants?.length) {
		console.warn(`Handling Fee product not found in channel ${channel}`);
		// Log what was found to be sure
		return;
	}

	console.log("Handling Fee product found:", handlingFeeProduct.id, handlingFeeProduct.name);

	const handlingFeeVariantId = handlingFeeProduct.variants[0].id; // Use the first variant

	// 3. Check if it's in the checkout
	const handlingFeeLine = checkout.lines.find((line) => line.variant?.id === handlingFeeVariantId);

	if (!handlingFeeLine) {
		// Add it
		console.log("Adding Handling Fee to checkout...");
		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkoutId,
				productVariantId: handlingFeeVariantId,
			},
			cache: "no-cache",
		});
		console.log("Handling Fee added.");
	} else if (handlingFeeLine.quantity !== 1) {
		// Update quantity to 1
		console.log("Fixing Handling Fee quantity...");
		await executeGraphQL(CheckoutLineUpdateDocument, {
			variables: {
				id: checkoutId,
				lines: [
					{
						variantId: handlingFeeVariantId,
						quantity: 1,
					},
				],
			},
			cache: "no-cache",
		});
		console.log("Handling Fee quantity fixed.");
	} else {
		console.log("Handling Fee already present and correct.");
	}
}
