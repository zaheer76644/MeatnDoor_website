import {
	GRAPHQL_ENDPOINT,
	WALLET_BALANCE_ENDPOINT,
	WALLET_CONFIG_ENDPOINT,
	WALLET_CREDITS_ENDPOINT,
	walletRestoreEndpoint,
	walletUseEndpoint,
} from "@/config/SaleorApi";

export type WalletCredit = {
	amount: number;
	createdAt?: string;
	note?: string;
	source?: string;
	isExpired?: boolean;
	checkoutToken?: string;
	orderId?: string;
};

export type WalletBalanceResponse = {
	balance: number;
	credits?: WalletCredit[];
	error?: string;
};

export type WalletConfig = {
	maxWalletLimit?: number;
	max_wallet_limit?: number;
	creditValidityDays?: number;
	credit_validity_days?: number;
	maxWalletUsagePerOrder?: number;
	max_wallet_usage_per_order?: number;
	referralRewardAmount?: number;
	referral_reward_amount?: number;
};

export type WalletConfigResponse = {
	walletConfig?: WalletConfig | null;
	max_wallet_limit?: number;
	error?: string;
};

const b64decode = (str: string) => {
	if (typeof atob === "function") return atob(str);
	return Buffer.from(str, "base64").toString("utf8");
};

/** Extract raw checkout UUID from GraphQL id (`Checkout:<uuid>` base64). */
export const checkoutTokenFromId = (checkoutId: string) => {
	try {
		const decoded = b64decode(checkoutId);
		const sep = decoded.indexOf(":");
		if (sep > 0) return decoded.slice(sep + 1);
		return decoded;
	} catch {
		return checkoutId;
	}
};

export const getAccessToken = (): string | null => {
	if (typeof window === "undefined") return null;
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "";
	return (
		localStorage.getItem(`${apiUrl}+saleor_auth_access_token`) ||
		localStorage.getItem("access_token") ||
		null
	);
};

/** Refresh access token from stored refresh token when needed. */
export const ensureAccessToken = async (): Promise<string | null> => {
	const existing = getAccessToken();
	if (existing) return existing;

	if (typeof window === "undefined") return null;
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "";
	const refreshToken =
		localStorage.getItem(`${apiUrl}+saleor_auth_module_refresh_token`) ||
		localStorage.getItem("refresh_token");
	if (!refreshToken) return null;

	try {
		const res = await fetch(GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
					mutation refreshToken($refreshToken: String!) {
						tokenRefresh(refreshToken: $refreshToken) {
							token
							errors { message }
						}
					}
				`,
				variables: { refreshToken },
			}),
		});
		const json = (await res.json()) as {
			data?: { tokenRefresh?: { token?: string } };
		};
		const token = json?.data?.tokenRefresh?.token;
		if (token) {
			localStorage.setItem(`${apiUrl}+saleor_auth_access_token`, token);
			localStorage.setItem("access_token", token);
			return token;
		}
	} catch {
		return null;
	}
	return null;
};

const authHeaders = (token: string) => ({
	"Content-Type": "application/json",
	Authorization: `Bearer ${token}`,
});

export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) return { balance: 0, credits: [], error: "unauthorized" };
	try {
		const res = await fetch(WALLET_BALANCE_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) return { balance: 0, credits: [], error: `${res.status}` };
		return (await res.json()) as WalletBalanceResponse;
	} catch (error) {
		return { balance: 0, credits: [], error: error instanceof Error ? error.message : "error" };
	}
};

export const getWalletConfig = async (): Promise<WalletConfigResponse> => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) return { walletConfig: null };
	try {
		const res = await fetch(WALLET_CONFIG_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) return { walletConfig: null };
		return (await res.json()) as WalletConfigResponse;
	} catch {
		return { walletConfig: null };
	}
};

export const getWalletTransactions = async (): Promise<{
	credits: WalletCredit[];
	error: string | null;
}> => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) return { credits: [], error: "unauthorized" };
	try {
		const res = await fetch(WALLET_CREDITS_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) return { credits: [], error: `${res.status}` };
		const data = (await res.json()) as
			| WalletCredit[]
			| { credits?: WalletCredit[]; transactions?: WalletCredit[] };
		const credits = Array.isArray(data)
			? data
			: Array.isArray(data?.credits)
				? data.credits
				: Array.isArray(data?.transactions)
					? data.transactions
					: [];
		return { credits, error: null };
	} catch (error) {
		return { credits: [], error: error instanceof Error ? error.message : "error" };
	}
};

/** Pending wallet amount selected in UI; committed via applyWallet on successful checkout. */
let pendingWalletApplyAmount = 0;

export const setPendingWalletApplyAmount = (amount: number) => {
	pendingWalletApplyAmount = Math.max(0, amount);
};

export const getPendingWalletApplyAmount = () => pendingWalletApplyAmount;

export const clearPendingWalletApplyAmount = () => {
	pendingWalletApplyAmount = 0;
};

export const applyWallet = async (checkoutId: string, amount: number) => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) throw new Error("Not authenticated");
	const checkoutToken = checkoutTokenFromId(checkoutId);
	const res = await fetch(walletUseEndpoint(checkoutToken), {
		method: "POST",
		headers: authHeaders(token),
		body: JSON.stringify({ amount }),
	});
	return res.json() as Promise<{
		walletAllocation?: { amount?: number };
		applied?: number;
		error?: string;
	}>;
};

/** Commit pending wallet amount to the API (call once checkout/payment succeeds). */
export const commitPendingWallet = async (checkoutId: string) => {
	const amount = getPendingWalletApplyAmount();
	if (!checkoutId || amount <= 0) return { ok: true as const, amount: 0 };
	const res = await applyWallet(checkoutId, amount);
	if (res?.error) return { ok: false as const, amount, error: res.error };
	clearPendingWalletApplyAmount();
	return { ok: true as const, amount: res?.walletAllocation?.amount ?? amount };
};

export const restoreWallet = async (checkoutId: string) => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) throw new Error("Not authenticated");
	const checkoutToken = checkoutTokenFromId(checkoutId);
	const res = await fetch(walletRestoreEndpoint(checkoutToken), {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.json() as Promise<{ restored?: boolean; error?: string }>;
};

export type ReferralUserInfo = {
	isReferred: boolean;
	isFirstOrder: boolean;
	referredByName: string;
};

export const fetchReferralUserInfo = async (): Promise<ReferralUserInfo | null> => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) return null;

	const query = `
		query {
			me {
				isReferred
				referredBy {
					id
					firstName
					lastName
					email
				}
				orders(first: 1) {
					totalCount
				}
			}
		}
	`;

	try {
		const res = await fetch(GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: authHeaders(token),
			body: JSON.stringify({ query }),
		});
		const json = (await res.json()) as {
			data?: {
				me?: {
					isReferred?: boolean;
					referredBy?: {
						firstName?: string;
						lastName?: string;
						email?: string;
					} | null;
					orders?: { totalCount?: number };
				};
			};
		};
		const me = json?.data?.me;
		if (!me) return null;
		const rb = me.referredBy;
		const name =
			[rb?.firstName, rb?.lastName].filter(Boolean).join(" ").trim() || rb?.email || "";
		return {
			isReferred: !!me.isReferred,
			isFirstOrder: (me.orders?.totalCount ?? 0) === 0,
			referredByName: name,
		};
	} catch {
		return null;
	}
};

export const setReferredBy = async (phone: string) => {
	const token = (await ensureAccessToken()) || getAccessToken();
	if (!token) throw new Error("Not authenticated");

	const mutation = `
		mutation SetReferredBy($phone: String!) {
			accountSetReferredBy(referrerPhone: $phone) {
				user {
					id
					email
					isReferred
					referredBy {
						id
						email
						firstName
						lastName
					}
				}
				accountErrors {
					field
					message
					code
				}
			}
		}
	`;

	const res = await fetch(GRAPHQL_ENDPOINT, {
		method: "POST",
		headers: authHeaders(token),
		body: JSON.stringify({ query: mutation, variables: { phone } }),
	});
	const json = (await res.json()) as {
		data?: {
			accountSetReferredBy?: {
				user?: {
					isReferred?: boolean;
					referredBy?: {
						firstName?: string;
						lastName?: string;
						email?: string;
					} | null;
				};
				accountErrors?: Array<{ field?: string; message?: string; code?: string }>;
			};
		};
		errors?: Array<{ message?: string }>;
	};

	return json;
};
