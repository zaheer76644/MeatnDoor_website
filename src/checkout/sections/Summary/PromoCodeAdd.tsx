import clsx from "clsx";
import { useEffect, type FC } from "react";
import { Button } from "@/checkout/components/Button";
import { TextInput } from "@/checkout/components/TextInput";
import { useCheckoutAddPromoCodeMutation, useCheckoutRemovePromoCodeMutation } from "@/checkout/graphql";
import { type Classes } from "@/checkout/lib/globalTypes";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useForm } from "@/checkout/hooks/useForm";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { getFormattedMoney } from "@/checkout/lib/utils/money";

interface PromoCodeFormData {
	promoCode: string;
}

interface PromoCodeAddProps extends Classes {
	inputCouponLabel?: string;
}

export const PromoCodeAdd: FC<PromoCodeAddProps> = ({ className, inputCouponLabel }) => {
	const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();
	const [, checkoutRemovePromoCode] = useCheckoutRemovePromoCodeMutation();
	const { checkout } = useCheckout();

	const hasAppliedCode = checkout?.voucherCode && checkout.voucherCode.length > 0;

	const handleRemoveCoupon = () => {
		if (checkout?.id && checkout.voucherCode) {
			void checkoutRemovePromoCode({
				languageCode: "EN_US",
				checkoutId: checkout.id,
				promoCode: checkout.voucherCode,
			});
		}
	};

	const onSubmit = useFormSubmit<PromoCodeFormData, typeof checkoutAddPromoCode>({
		scope: "checkoutAddPromoCode",
		onSubmit: checkoutAddPromoCode,
		parse: ({ promoCode, languageCode, checkoutId }) => ({
			promoCode,
			checkoutId,
			languageCode,
		}),
		onSuccess: ({ formHelpers: { resetForm } }) => {
			resetForm();
		},
	});

	const form = useForm<PromoCodeFormData>({
		onSubmit,
		initialValues: { promoCode: inputCouponLabel || "" },
	});
	const {
		values: { promoCode },
	} = form;

	const showApplyButton = promoCode.length > 0 && !hasAppliedCode;
	
	useEffect(() => {
		form.setFieldValue("promoCode", inputCouponLabel || "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputCouponLabel]);

	// Creative UI when promo code is applied
	if (hasAppliedCode) {
		return (
			<div className={clsx("my-4", className)}>
				<div className="relative overflow-hidden rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-lg transition-all duration-500 animate-in slide-in-from-top">
					{/* Animated background decoration */}
					<div className="absolute inset-0 opacity-10 pointer-events-none">
						<div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-400 blur-2xl"></div>
						<div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-emerald-400 blur-2xl"></div>
					</div>
					
					<div className="relative z-10 flex items-center justify-between">
						<div className="flex items-center gap-3">
							{/* Success icon with animation */}
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-md">
								<svg
									className="h-6 w-6 animate-bounce text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							
							<div>
								<p className="text-sm font-semibold text-green-800">Promo Code Applied!</p>
								<p className="text-xs text-green-600">
									Code: <span className="font-mono font-bold">{checkout.voucherCode}</span>
								</p>
							</div>
						</div>
					</div>
					
					{/* Discount badge */}
					{checkout.discount && (
						<div className="relative z-10 mt-3 flex items-center justify-between gap-2 rounded-lg bg-white/60 px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-gray-600">You saved:</span>
								<span className="text-lg font-bold text-green-600">
									{getFormattedMoney(checkout.discount)}
								</span>
							</div>
							<button
								onClick={handleRemoveCoupon}
								type="button"
								className="relative z-20 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 active:scale-95"
								aria-label="Remove coupon"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								Remove
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Default input UI
	return (
		<FormProvider form={form}>
			<div className={clsx("my-4", className)}>
				<div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300">
					{/* Subtle background decoration */}
					<div className="absolute inset-0 opacity-5">
						<div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-400 blur-3xl"></div>
						<div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-purple-400 blur-3xl"></div>
					</div>
					
					<div className="relative">
						{/* Header with icon */}
						<div className="mb-4 flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#ed4264] to-[#47141e] shadow-md">
								<svg
									className="h-5 w-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
									/>
								</svg>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-[#47141e]">Have a promo code?</h3>
								<p className="text-xs text-gray-500">Enter your code below to apply discount</p>
							</div>
						</div>
						
						{/* Input field with enhanced styling */}
						<div className="relative">
							<TextInput
								required={false}
								name="promoCode"
								value={inputCouponLabel}
								// onChange={(e) => handleChange(e.target.value)}
								label="Add gift card or discount code"
								className="pr-24"
							/>
							{showApplyButton && (
								<Button
									className="absolute bottom-[4.5px] right-2 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#47141e] px-4 py-1 font-medium text-white shadow-md transition-all duration-200 hover:from-[#d63856] hover:to-[#3a1018] hover:shadow-lg active:scale-95"
									variant="tertiary"
									ariaLabel="apply"
									label="Apply"
									type="submit"
								/>
							)}
						</div>
						
					</div>
				</div>
			</div>
		</FormProvider>
	);
};
