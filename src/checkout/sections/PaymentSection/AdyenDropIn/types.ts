export const adyenGatewayId = "app.saleor.adyen";
export type AdyenGatewayId = typeof adyenGatewayId;

type AdyenCheckoutCtor = typeof import("@adyen/adyen-web").default;
type AdyenCheckoutInstance = Awaited<ReturnType<AdyenCheckoutCtor>>;
type AdyenCheckoutConfig = Parameters<AdyenCheckoutCtor>[0];

const _dropinElementType = (checkout: AdyenCheckoutInstance) =>
	checkout.create("dropin").mount("#dropin-container");

/** Inferred from the public Adyen Checkout API (internal dist/types paths are not exported). */
export type AdyenDropinElement = ReturnType<typeof _dropinElementType>;

export type AdyenCheckoutConfigOptions = AdyenCheckoutConfig;

export type AdyenPaymentMethodsResponse = NonNullable<AdyenCheckoutConfig["paymentMethodsResponse"]>;

// because it's defined to these in the docs but it's a string in the response type
type AdyenResultCode = "Authorised" | "Error" | "Pending" | "PresentToShopper" | "Refused" | "Received";

export interface AdyenGatewayInitializePayload {
	paymentMethodsResponse: AdyenPaymentMethodsResponse;
	clientKey: string;
	environment: string;
}

export interface AdyenPaymentResponse {
	action?: Parameters<AdyenDropinElement["handleAction"]>[0];
	resultCode: AdyenResultCode;
	refusalReason?: string;
}

export interface AdyenTransactionInitializeResponse {
	paymentResponse: AdyenPaymentResponse;
}

export interface AdyenTransactionProcessResponse {
	paymentDetailsResponse: AdyenPaymentResponse;
}

// -------

export type ApplePayCallback = <T>(value: T) => void;

export type AdyenCheckoutInstanceState = {
	isValid?: boolean;
	data: Record<string, unknown>;
};

export type AdyenCheckoutInstanceOnSubmit = (
	state: AdyenCheckoutInstanceState,
	component: AdyenDropinElement,
) => Promise<void> | void;

export type AdyenCheckoutInstanceOnAdditionalDetails = (
	state: AdyenCheckoutInstanceState,
	component: AdyenDropinElement,
) => Promise<void> | void;
