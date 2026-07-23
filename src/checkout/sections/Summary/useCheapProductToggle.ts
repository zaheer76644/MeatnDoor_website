import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { getSummaryLineProps } from "./utils";
import { useCheckoutLinesUpdateMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import {
	type CheapProduct,
	getCheapProductMinimumOrderTotal,
} from "@/checkout/sections/Summary/couponUtils";

const MAX_CHEAP_PRODUCT_QTY = 1;

export const useCheapProductToggle = () => {
	const { checkout } = useCheckout();
	const [, updateLines] = useCheckoutLinesUpdateMutation();
	const [loadingVariantId, setLoadingVariantId] = useState<string | null>(null);

	const getQuantity = useCallback(
		(variantId: string) =>
			checkout?.lines.find((line) => line.variant.id === variantId)?.quantity ?? 0,
		[checkout?.lines],
	);

	const isInCart = useCallback((variantId: string) => getQuantity(variantId) > 0, [getQuantity]);

	const updateQuantity = useCallback(
		async (product: CheapProduct, quantity: number) => {
			const variant = product.variants?.[0];
			if (!variant || !checkout?.id) {
				return;
			}

			const variantId = variant.id;

			setLoadingVariantId(variantId);
			try {
				await updateLines({
					checkoutId: checkout.id,
					languageCode: "EN_US",
					lines: [{ variantId, quantity }],
				});
			} finally {
				setLoadingVariantId(null);
			}
		},
		[checkout?.id, updateLines],
	);

	const increment = useCallback(
		async (product: CheapProduct) => {
			const variant = product.variants?.[0];
			if (!variant || !checkout?.id) {
				return;
			}

			const currentQty = getQuantity(variant.id);

			if (currentQty >= MAX_CHEAP_PRODUCT_QTY) {
				toast.error("Only 1 unit(s) of this item can added per order");
				return;
			}

			const minimumOrderTotal = getCheapProductMinimumOrderTotal(product);
			const cartTotal = checkout.subtotalPrice?.gross?.amount ?? 0;
			const handlingFeeLine = checkout?.lines.find((line) => {
				const { productName } = getSummaryLineProps(line);
				return productName?.toLowerCase() === "handling fee";
			});
			const handlingFee = handlingFeeLine?.totalPrice?.gross?.amount ?? 0;
			const total = cartTotal - handlingFee;
			if (minimumOrderTotal != null && total < minimumOrderTotal) {
				toast.error(
					`Add items worth ₹${minimumOrderTotal} or more to unlock this add-on. Current cart total: ₹${Math.round(total)}.`,
				);
				return;
			}

			await updateQuantity(product, currentQty + 1);
		},
		[checkout, getQuantity, updateQuantity],
	);

	const decrement = useCallback(
		async (product: CheapProduct) => {
			const variant = product.variants?.[0];
			if (!variant || !checkout?.id) {
				return;
			}

			const currentQty = getQuantity(variant.id);
			if (currentQty <= 0) {
				return;
			}

			await updateQuantity(product, currentQty - 1);
		},
		[checkout?.id, getQuantity, updateQuantity],
	);

	return { increment, decrement, getQuantity, loadingVariantId, isInCart };
};
