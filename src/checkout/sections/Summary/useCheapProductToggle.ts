import { useCallback, useState } from "react";
import { useCheckoutLinesUpdateMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { type CheapProduct } from "@/checkout/sections/Summary/couponUtils";

export const useCheapProductToggle = () => {
	const { checkout } = useCheckout();
	const [, updateLines] = useCheckoutLinesUpdateMutation();
	const [loadingVariantId, setLoadingVariantId] = useState<string | null>(null);

	const isInCart = useCallback(
		(variantId: string) => checkout?.lines.some((line) => line.variant.id === variantId) ?? false,
		[checkout?.lines],
	);

	const toggleProduct = useCallback(
		async (product: CheapProduct) => {
			const variant = product.variants?.[0];
			if (!variant || !checkout?.id) {
				return;
			}

			const variantId = variant.id;
			const quantity = isInCart(variantId) ? 0 : 1;

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
		[checkout?.id, isInCart, updateLines],
	);

	return { toggleProduct, loadingVariantId, isInCart };
};
