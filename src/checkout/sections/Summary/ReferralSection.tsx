"use client";

import { useCallback, useEffect, useState, type FC } from "react";
import { useUser } from "@/checkout/hooks/useUser";
import { fetchReferralUserInfo, setReferredBy } from "@/lib/wallet";

export const ReferralSection: FC = () => {
	const { authenticated } = useUser();
	const [referrerPhone, setReferrerPhone] = useState("");
	const [referralError, setReferralError] = useState("");
	const [referralSuccess, setReferralSuccess] = useState(false);
	const [isFirstOrder, setIsFirstOrder] = useState(false);
	const [isReferred, setIsReferred] = useState(false);
	const [referredByName, setReferredByName] = useState("");
	const [referralLoading, setReferralLoading] = useState(false);
	const [ready, setReady] = useState(false);

	const loadReferralInfo = useCallback(async () => {
		if (!authenticated) {
			setReady(true);
			return;
		}
		const info = await fetchReferralUserInfo();
		if (info) {
			setIsFirstOrder(info.isFirstOrder);
			setIsReferred(info.isReferred);
			if (info.referredByName) setReferredByName(info.referredByName);
			if (info.isReferred) setReferralSuccess(true);
		}
		setReady(true);
	}, [authenticated]);

	useEffect(() => {
		void loadReferralInfo();
	}, [loadReferralInfo]);

	const applyReferral = async () => {
		const phone = referrerPhone.replace(/[^0-9]/g, "");
		if (phone.length !== 10) {
			setReferralError("Enter the 10-digit mobile number of your referrer.");
			return;
		}
		setReferralError("");
		setReferralLoading(true);
		try {
			const json = await setReferredBy(phone);
			const payload = json?.data?.accountSetReferredBy;
			const errors = payload?.accountErrors;
			if (errors && errors.length > 0) {
				const code = errors[0].code;
				let msg = errors[0].message || "Could not apply referral.";
				if (code === "INVALID") msg = "Enter a valid 10-digit mobile number.";
				else if (code === "NOT_FOUND") msg = "No account found with this mobile number.";
				else if (code === "SELF_REFERRAL") msg = "You cannot use your own number as a referral.";
				else if (code === "REFERRAL_ALREADY_APPLIED")
					msg = "A referral has already been applied to this account.";
				setReferralError(msg);
				return;
			}
			setReferralSuccess(true);
			setIsReferred(true);
			const rb = payload?.user?.referredBy;
			if (rb) {
				const name =
					[rb.firstName, rb.lastName].filter(Boolean).join(" ").trim() || rb.email || "";
				if (name) setReferredByName(name);
			}
		} catch (e) {
			setReferralError(e instanceof Error ? e.message : "Could not apply referral.");
		} finally {
			setReferralLoading(false);
		}
	};

	if (!authenticated || !ready || !isFirstOrder) return null;

	const phoneDigits = referrerPhone.replace(/[^0-9]/g, "");
	const canApply = phoneDigits.length === 10 && !referralLoading;

	return (
		<div className="my-4 overflow-hidden rounded-xl border border-[rgba(71,20,30,0.08)] bg-gradient-to-br from-[#fff8f9] to-white p-4 shadow-sm">
			<div className="flex items-center gap-2">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ed4264] to-[#47141e] text-white shadow-md">
					<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
						/>
					</svg>
				</div>
				<p className="text-sm font-semibold text-[#47141e]">Referred by a friend?</p>
			</div>

			{(referralSuccess || isReferred) && referredByName ? (
				<div className="mt-3 flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-[#1b7a3d]">
					Referred by {referredByName}
				</div>
			) : referralSuccess ? (
				<div className="mt-3 flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-[#1b7a3d]">
					Referral applied. Thank you!
				</div>
			) : null}

			<p className="mt-2 text-xs text-[#8a6b73]">
				Enter the mobile number of the friend who referred you.
			</p>

			<div className="mt-3 flex gap-2">
				<div className="flex min-w-0 flex-1 items-center rounded-lg border border-[rgba(71,20,30,0.12)] bg-white px-3">
					<span className="mr-2 shrink-0 text-sm font-semibold text-[#8a6b73]">+91</span>
					<input
						type="tel"
						inputMode="numeric"
						maxLength={10}
						placeholder="10-digit mobile number"
						value={referrerPhone}
						onChange={(e) => setReferrerPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
						className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-[#47141e] outline-none placeholder:text-[#b09aa1]"
					/>
				</div>
				<button
					type="button"
					onClick={() => void applyReferral()}
					disabled={!canApply}
					className="shrink-0 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#47141e] px-4 py-2 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{referralLoading ? "…" : isReferred || referralSuccess ? "Update" : "Apply"}
				</button>
			</div>

			{referralError ? <p className="mt-2 text-xs font-medium text-[#ed4264]">{referralError}</p> : null}
		</div>
	);
};
