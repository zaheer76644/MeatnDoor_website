// export const SALEOR_API_URL = 'http://localhost:8000/graphql/';
// export const SALEOR_BACKEND_URI = 'http://localhost:8000';

// export const SALEOR_API_URL = "http://192.168.1.192:8000/graphql/";
// export const SALEOR_BAKEND_URI = "http://192.168.1.192:8000";

// export const SALEOR_API_URL = 'http://192.168.1.13:8000/graphql/';
// export const SALEOR_BAKEND_URI = 'http://192.168.1.13:8000';
export const DEFAULT_CHANNEL = "in";
// export const RAZORPAY_PUBLIC_KEY="rzp_test_8swUcpx10LhxpH"
export const RAZORPAY_PUBLIC_KEY = "rzp_live_OujUgN4UdSkIhu";

export const SALEOR_BACKEND_URI = "https://api.meatify.in";
export const SALEOR_API_URL = "https://api.meatify.in/graphql/";

export const GRAPHQL_ENDPOINT = `${SALEOR_BACKEND_URI}/graphql/`;
export const SEND_OTP_ENDPOINT = `${SALEOR_BACKEND_URI}/auth/send-otp/`;
export const VERIFY_OTP_ENDPOINT = `${SALEOR_BACKEND_URI}/auth/verify-otp/`;

export const RAZORPAY_GATEWAY_ENDPOINT = `${SALEOR_BACKEND_URI}/payments/gateways/razorpay/`;
export const DELIVERY_SLOTS_ENDPOINT = `${SALEOR_BACKEND_URI}/delivery-slots/`;
export const DELIVERY_CONFIG_ENDPOINT = `${SALEOR_BACKEND_URI}/delivery-config/`;

export const apiConfig = {
	SALEOR_BACKEND_URI,
	GRAPHQL_ENDPOINT,
	SEND_OTP_ENDPOINT,
	VERIFY_OTP_ENDPOINT,
	RAZORPAY_GATEWAY_ENDPOINT,
	DELIVERY_SLOTS_ENDPOINT,
	DELIVERY_CONFIG_ENDPOINT,
};

// if we use export defaulut for api config
// export default apiConfig;
// | Export Type                      | ESLint Reaction                          | Import Syntax                                    | Notes                                  |
// | -------------------------------- | ---------------------------------------- | ------------------------------------------------ | -------------------------------------- |
// | `export default apiConfig`       | ❌ If rule “no-default-export” is enabled | `import config from "@/config/apiConfig"`        | Easy to use, but some teams avoid it   |
// | `export const apiConfig = {...}` | ✅ Lint safe                              | `import { apiConfig } from "@/config/apiConfig"` | Recommended for teams & large projects |

// default export (optional)
// export default {
// 	SALEOR_BACKEND_URI,
// 	GRAPHQL_ENDPOINT,
// 	SEND_OTP_ENDPOINT,
// 	VERIFY_OTP_ENDPOINT,
// };
// with nameobject and without nameobject
// | Style                                                  | ESLint Friendly | Debug Friendly | Future Proof | Looks Clean |
// | ------------------------------------------------------ | --------------- | -------------- | ------------ | ----------- |
// | `export default { ... }`                               | ❌               | ❌              | ⚠️           | ✅ Short     |
// | `const apiConfig = { ... }; export default apiConfig;` | ✅               | ✅              | ✅            | ✅ Clear     |
