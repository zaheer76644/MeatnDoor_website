/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import AdyenCheckout from "@adyen/adyen-web";
import { PaymentResponse as AdyenApiPaymentResponse } from "@adyen/api-library/lib/src/typings/checkout/paymentResponse";
import { type CreateCheckoutSessionResponse } from "@adyen/api-library/lib/src/typings/checkout/createCheckoutSessionResponse";
import {
	type AdyenCheckoutInstanceOnAdditionalDetails,
	type AdyenCheckoutInstanceOnSubmit,
	type AdyenDropinElement,
	type AdyenPaymentResponse,
	type ApplePayCallback,
} from "./types";
import { replaceUrl } from "@/checkout/lib/utils/url";

export type AdyenDropInCreateSessionResponse = {
	session: CreateCheckoutSessionResponse;
	clientKey?: string;
};
export type PostAdyenDropInPaymentsDetailsResponse = {
	payment: AdyenPaymentResponse;
	orderId: string;
};
export type PostAdyenDropInPaymentsResponse = {
	payment: AdyenPaymentResponse;
	orderId: string;
};

export function createAdyenCheckoutInstance(
	adyenSessionResponse: AdyenDropInCreateSessionResponse,
	{
		onSubmit,
		onAdditionalDetails,
	}: {
		onSubmit: AdyenCheckoutInstanceOnSubmit;
		onAdditionalDetails: AdyenCheckoutInstanceOnAdditionalDetails;
	},
) {
	return AdyenCheckout({
		locale: "en-US",
		environment: "test",
		clientKey: adyenSessionResponse.clientKey,
		session: {
			id: adyenSessionResponse.session.id,
			sessionData: adyenSessionResponse.session.sessionData,
		},
		onPaymentCompleted: (result: any, component: any) => {
			console.info(result, component);
		},
		onError: (error: any, component: any) => {
			console.error(error.name, error.message, error.stack, component);
		},
		onSubmit,
		onAdditionalDetails,
		// Any payment method specific configuration. Find the configuration specific to each payment method: https://docs.adyen.com/payment-methods
		// For example, this is 3D Secure configuration for cards:
		paymentMethodsConfiguration: {
			card: {
				hasHolderName: true,
				holderNameRequired: true,
				billingAddressRequired: false,
			},
			applepay: {
				buttonType: "plain",
				buttonColor: "black",
				onPaymentMethodSelected: (
					resolve: ApplePayCallback,
					_reject: ApplePayCallback,
					event: ApplePayJS.ApplePayPaymentMethodSelectedEvent,
				) => {
					resolve(event.paymentMethod);
				},
				onShippingContactSelected: (
					resolve: ApplePayCallback,
					_reject: ApplePayCallback,
					event: ApplePayJS.ApplePayShippingContactSelectedEvent,
				) => {
					resolve(event.shippingContact);
				},
				onShippingMethodSelected: (
					resolve: ApplePayCallback,
					_reject: ApplePayCallback,
					event: ApplePayJS.ApplePayShippingMethodSelectedEvent,
				) => {
					resolve(event.shippingMethod);
				},
			},
		},
		analytics: {
			enabled: false,
		},
	});
}

export function handlePaymentResult(
	saleorApiUrl: string,
	result: PostAdyenDropInPaymentsResponse | PostAdyenDropInPaymentsDetailsResponse,
	component: AdyenDropinElement,
) {
	switch (result.payment.resultCode) {
		// @todo https://docs.adyen.com/online-payments/payment-result-codes
		case AdyenApiPaymentResponse.ResultCodeEnum.AuthenticationFinished:
		case AdyenApiPaymentResponse.ResultCodeEnum.Cancelled:
		case AdyenApiPaymentResponse.ResultCodeEnum.ChallengeShopper:
		case AdyenApiPaymentResponse.ResultCodeEnum.Error:
		case AdyenApiPaymentResponse.ResultCodeEnum.IdentifyShopper:
		case AdyenApiPaymentResponse.ResultCodeEnum.Pending:
		case AdyenApiPaymentResponse.ResultCodeEnum.PresentToShopper:
		case AdyenApiPaymentResponse.ResultCodeEnum.Received:
		case AdyenApiPaymentResponse.ResultCodeEnum.RedirectShopper:
		case AdyenApiPaymentResponse.ResultCodeEnum.Refused: {
			console.error(result);
			component.setStatus("error", {
				message: `${result.payment.resultCode}: ${result.payment.refusalReason as string}`,
			});
			return;
		}

		case AdyenApiPaymentResponse.ResultCodeEnum.Authorised:
		case AdyenApiPaymentResponse.ResultCodeEnum.Success: {
			component.setStatus("success");
			const domain = new URL(saleorApiUrl).hostname;
			const newUrl = replaceUrl({
				query: {
					checkout: undefined,
					order: result.orderId,
					saleorApiUrl,
					// @todo remove `domain`
					// https://github.com/saleor/saleor-dashboard/issues/2387
					// https://github.com/saleor/saleor-app-sdk/issues/87
					domain,
				},
			});
			window.location.href = newUrl;
			return;
		}
	}
}
