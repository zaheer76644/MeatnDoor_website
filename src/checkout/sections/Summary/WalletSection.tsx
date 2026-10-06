"use client";

import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useUser } from "@/checkout/hooks/useUser";
import {
	getWalletBalance,
	getWalletConfig,
	setPendingWalletApplyAmount,
} from "@/lib/wallet";

type Props = {
	onAppliedChange?: (amount: number) => void;
};

export const WalletSection: FC<Props> = ({ onAppliedChange }) => {
	const { authenticated } = useUser();
	const { checkout } = useCheckout();
	const checkoutId = checkout?.id;

	const [walletBalance, setWalletBalance] = useState(0);
	const [walletMaxPerOrder, setWalletMaxPerOrder] = useState(0);
	const [walletApplied, setWalletApplied] = useState(0);
	const [walletInput, setWalletInput] = useState("");
	const [message, setMessage] = useState("");

	const setApplied = useCallback(
		(amount: number) => {
			const next = Math.max(0, amount);
			setWalletApplied(next);
			setPendingWalletApplyAmount(next);
			onAppliedChange?.(next);
		},
		[onAppliedChange],
	);

	const orderTotalBeforeWallet = useMemo(() => {
		const subtotal = checkout?.subtotalPrice?.gross?.amount ?? 0;
		const methods = checkout?.shippingMethods ?? [];
		const shippingFromMethods =
			methods.length > 0
				? methods.reduce((min, method) => (method.price.amount < min.price.amount ? method : min))
						.price.amount
				: undefined;
		const shipping = shippingFromMethods ?? checkout?.shippingPrice?.gross?.amount ?? 0;
		return Math.max(subtotal + shipping, 0);
	}, [checkout]);

	const walletSpendable = Math.max(
		Math.min(walletBalance, walletMaxPerOrder > 0 ? walletMaxPerOrder : walletBalance),
		0,
	);

	/** Display balance after local apply (API not hit until checkout). */
	const displayBalance = Math.max(walletBalance - walletApplied, 0);

	const loadWallet = useCallback(async () => {
		if (!authenticated || !checkoutId) return;
		const [balanceRes, configRes] = await Promise.all([getWalletBalance(), getWalletConfig()]);
		if (!balanceRes.error) setWalletBalance(balanceRes.balance || 0);
		const maxPerOrder =
			configRes?.walletConfig?.maxWalletUsagePerOrder ??
			configRes?.walletConfig?.max_wallet_usage_per_order ??
			0;
		setWalletMaxPerOrder(maxPerOrder);
	}, [authenticated, checkoutId]);

	useEffect(() => {
		void loadWallet();
	}, [loadWallet]);

	const removeWallet = () => {
		setApplied(0);
		setWalletInput("");
		setMessage("");
	};

	const handleApplyWallet = () => {
		const amount = parseFloat(walletInput);
		if (Number.isNaN(amount) || amount <= 0) {
			setMessage("Enter a valid amount to apply.");
			return;
		}
		if (amount > walletSpendable) {
			setMessage(`You can apply up to ₹${Math.round(walletSpendable)} on this checkout.`);
			return;
		}
		const appliedAmount = Math.min(amount, orderTotalBeforeWallet);
		if (appliedAmount <= 0) {
			setMessage("No amount available to apply on this checkout.");
			return;
		}
		setMessage("");
		setApplied(appliedAmount);
		setWalletInput("");
	};

	if (!authenticated) return null;

	return (
		<div className="my-4 overflow-hidden rounded-xl border border-[rgba(71,20,30,0.08)] bg-gradient-to-br from-[#fff8f9] to-white p-4 shadow-sm">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ed4264] to-[#47141e] text-white shadow-md">
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
							/>
						</svg>
					</div>
					<p className="text-sm font-semibold text-[#47141e]">Wallet</p>
				</div>
				<p className="text-xs font-semibold text-[#8a6b73]">
					Balance: ₹{Number(displayBalance).toFixed(0)}
				</p>
			</div>

			<p className="mt-2 text-xs text-[#8a6b73]">
				{walletApplied > 0
					? `₹${Math.round(walletApplied)} will be used from your wallet on this order.`
					: `You can use up to ₹${Math.round(walletSpendable)} on this checkout.`}
			</p>

			{Number(walletBalance) === 0 ? (
				<p className="mt-2 text-[11px] font-medium text-[#ed4264]">
					0 wallet balance — Refer others to earn wallet credits
				</p>
			) : null}

			{walletApplied > 0 ? (
				<div className="mt-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2">
					<p className="text-sm font-semibold text-[#1b7a3d]">
						₹{Number(walletApplied).toFixed(0)} applied
					</p>
					<button
						type="button"
						onClick={removeWallet}
						className="text-xs font-bold text-[#ed4264] hover:underline"
					>
						Remove
					</button>
				</div>
			) : (
				<div className="mt-3 flex gap-2">
					<input
						type="number"
						min={0}
						inputMode="numeric"
						placeholder="Amount"
						value={walletInput}
						onChange={(e) => setWalletInput(e.target.value)}
						className="min-w-0 flex-1 rounded-lg border border-[rgba(71,20,30,0.12)] bg-white px-3 py-2 text-sm text-[#47141e] outline-none placeholder:text-[#b09aa1] focus:border-[#ed4264]"
					/>
					<button
						type="button"
						onClick={handleApplyWallet}
						disabled={walletSpendable <= 0}
						className="shrink-0 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#47141e] px-4 py-2 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Apply
					</button>
				</div>
			)}

			{message ? <p className="mt-2 text-xs font-medium text-[#ed4264]">{message}</p> : null}
		</div>
	);
};
