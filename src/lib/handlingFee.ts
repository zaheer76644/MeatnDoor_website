import { find } from "./checkout";
import {
	CheckoutAddLineDocument,
	CheckoutDeleteLinesDocument,
	CheckoutLineUpdateDocument,
	ProductDetailsDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

/** One in-flight ensure per checkout so overlapping page loads don't both add the fee. */
const inflight = new Map<string, Promise<void>>();

type CheckoutLine = {
	id: string;
	quantity: number;
	variant?: {
		id?: string | null;
		product?: { name?: string | null; slug?: string | null } | null;
	} | null;
};

const isHandlingFeeLine = (line: CheckoutLine, variantId: string) => {
	const name = line.variant?.product?.name?.toLowerCase();
	const slug = line.variant?.product?.slug?.toLowerCase();
	return line.variant?.id === variantId || name === "handling fee" || slug === "handling-fee";
};

async function setQuantityToOne(checkoutId: string, lineId: string) {
	await executeGraphQL(CheckoutLineUpdateDocument, {
		variables: {
			id: checkoutId,
			lines: [{ lineId, quantity: 1 }],
		},
		cache: "no-cache",
	});
}

async function ensureHandlingFeeOnce(checkoutId: string) {
	const checkout = await find(checkoutId);
	if (!checkout) {
		return;
	}

	const channel = checkout.channel.slug;
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
		return;
	}

	const handlingFeeVariantId = handlingFeeProduct.variants[0].id;
	let feeLines = (checkout.lines as CheckoutLine[]).filter((line) =>
		isHandlingFeeLine(line, handlingFeeVariantId),
	);

	if (feeLines.length === 0) {
		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkoutId,
				productVariantId: handlingFeeVariantId,
			},
			cache: "no-cache",
		});

		// A parallel request may have added the same line, which Saleor merges by increasing quantity.
		const refreshed = await find(checkoutId);
		feeLines = ((refreshed?.lines ?? []) as CheckoutLine[]).filter((line) =>
			isHandlingFeeLine(line, handlingFeeVariantId),
		);
	}

	if (feeLines.length === 0) {
		return;
	}

	const [keep, ...extras] = feeLines;
	if (extras.length > 0) {
		await executeGraphQL(CheckoutDeleteLinesDocument, {
			variables: {
				checkoutId,
				lineIds: extras.map((line) => line.id),
			},
			cache: "no-cache",
		});
	}

	if (keep.quantity !== 1) {
		await setQuantityToOne(checkoutId, keep.id);
	}
}

export function ensureHandlingFee(checkoutId: string) {
	const running = inflight.get(checkoutId);
	if (running) {
		return running;
	}

	const task = ensureHandlingFeeOnce(checkoutId).finally(() => {
		inflight.delete(checkoutId);
	});
	inflight.set(checkoutId, task);
	return task;
}
