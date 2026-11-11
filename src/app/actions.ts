"use server";

import { revalidatePath } from "next/cache";
import { invariant } from "ts-invariant";
import { getServerAuthClient } from "@/app/config";


import { CheckoutAddLineDocument, CheckoutDeleteLinesDocument, CheckoutLineUpdateDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import * as Checkout from "@/lib/checkout";

export async function logout() {
	"use server";
	(await getServerAuthClient()).signOut();
}

export async function removeFromCart(lineId: string, channel: string) {
	"use server";
	const checkoutId = await Checkout.getIdFromCookies(channel);
	invariant(checkoutId, "Checkout ID missing");

	await executeGraphQL(CheckoutDeleteLinesDocument, {
		variables: {
			checkoutId,
			lineIds: [lineId],
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
	revalidatePath("/");
}

export async function updateCartItem(lineId: string, variantId: string, quantity: number, channel: string) {
	"use server";
	const checkoutId = await Checkout.getIdFromCookies(channel);
	invariant(checkoutId, "Checkout ID missing");

	if (quantity === 0) {
		await removeFromCart(lineId, channel);
		return;
	}

	try {
		await executeGraphQL(CheckoutLineUpdateDocument, {
			variables: {
				id: checkoutId,
				lines: [
					{
						variantId,
						quantity,
					},
				],
			},
			cache: "no-cache",
		});
	} catch (e) {
		console.error("CheckoutLineUpdate failed", e);
		throw e;
	}

	revalidatePath("/cart");
	revalidatePath("/");
}

const CHECKOUT_COMBO_ADD_MUTATION = `
	mutation CheckoutComboAdd($id: ID!, $comboId: ID!, $quantity: Int!) {
		checkoutComboAdd(id: $id, comboId: $comboId, quantity: $quantity) {
			checkout {
				id
			}
			errors {
				field
				code
				message
			}
		}
	}
`;

type CheckoutComboAddResponse = {
	data?: {
		checkoutComboAdd?: {
			checkout?: { id: string } | null;
			errors?: { field: string | null; code: string; message: string }[];
		} | null;
	};
	errors?: { message: string }[];
};

export async function addComboToCart(comboId: string, channel: string, quantity = 1) {
	"use server";
	const checkout = await Checkout.findOrCreate({
		checkoutId: await Checkout.getIdFromCookies(channel),
		channel,
	});
	invariant(checkout, "This should never happen");

	await Checkout.saveIdToCookie(channel, checkout.id);

	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: CHECKOUT_COMBO_ADD_MUTATION,
			variables: { id: checkout.id, comboId, quantity },
		}),
		cache: "no-cache",
	});

	const result = (await response.json()) as CheckoutComboAddResponse;

	if (result.errors?.length) {
		throw new Error(result.errors[0].message);
	}

	const comboAdd = result.data?.checkoutComboAdd;

	if (!comboAdd || comboAdd.errors?.length) {
		throw new Error(comboAdd?.errors?.[0]?.message ?? "Could not add this combo to your cart.");
	}

	revalidatePath("/cart");
	revalidatePath("/");
}

export async function addToCart(variantId: string, channel: string) {
	"use server";
	const checkout = await Checkout.findOrCreate({
		checkoutId: await Checkout.getIdFromCookies(channel),
		channel,
	});
	invariant(checkout, "This should never happen");

	await Checkout.saveIdToCookie(channel, checkout.id);

	await executeGraphQL(CheckoutAddLineDocument, {
		variables: {
			id: checkout.id,
			productVariantId: variantId,
		},
		cache: "no-cache",
	});

	revalidatePath("/cart");
	revalidatePath("/");
}

