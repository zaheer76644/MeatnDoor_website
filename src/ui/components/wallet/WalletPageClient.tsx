"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { getWalletBalance, getWalletTransactions, type WalletCredit } from "@/lib/wallet";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

const MAROON = "#47141e";
const PINK = "#ed4264";
const GREEN = "#1b7a3d";

const formatTime = (iso?: string) => {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleTimeString("en-IN", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};

const formatSectionDate = (iso?: string) => {
	if (!iso) return "Other";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "Other";

	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	const sameDay = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

	if (sameDay(d, today)) return "Today";
	if (sameDay(d, yesterday)) return "Yesterday";

	return d.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const dateKey = (iso?: string) => {
	if (!iso) return "other";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "other";
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const sourceLabel = (source?: string) => {
	if (!source) return "Wallet transaction";
	const s = String(source).replace(/_/g, " ");
	return s.charAt(0).toUpperCase() + s.slice(1);
};

const statusText = (item: WalletCredit, isCredit: boolean) => {
	if (item.isExpired) return "Expired";
	return isCredit ? "Credited" : "Debited";
};

type Props = {
	isLoggedIn: boolean;
	userName?: string | null;
};

export function WalletPageClient({ isLoggedIn, userName }: Props) {
	const [balance, setBalance] = useState(0);
	const [credits, setCredits] = useState<WalletCredit[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const load = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const [balanceRes, txnRes] = await Promise.all([getWalletBalance(), getWalletTransactions()]);
			if (balanceRes.error === "unauthorized" || txnRes.error === "unauthorized") {
				setError("Please log in to view your wallet.");
				setBalance(0);
				setCredits([]);
			} else {
				if (!balanceRes.error) setBalance(balanceRes.balance || 0);
				if (txnRes.error) {
					setError(txnRes.error);
				} else {
					setCredits(txnRes.credits || []);
				}
			}
		} catch {
			setError("Could not load wallet.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			void load();
		} else {
			setLoading(false);
			setError("Please log in to view your wallet.");
		}
	}, [isLoggedIn, load]);

	const totalEarned = credits.reduce((sum, c) => sum + (c.amount > 0 ? c.amount : 0), 0);
	const totalSpent = credits.reduce((sum, c) => sum + (c.amount < 0 ? Math.abs(c.amount) : 0), 0);

	const grouped = useMemo(() => {
		const sorted = [...credits].sort((a, b) => {
			const ta = new Date(a.createdAt || 0).getTime();
			const tb = new Date(b.createdAt || 0).getTime();
			return tb - ta;
		});

		const map = new Map<string, { key: string; title: string; items: WalletCredit[] }>();
		sorted.forEach((item) => {
			const key = dateKey(item.createdAt);
			if (!map.has(key)) {
				map.set(key, {
					key,
					title: formatSectionDate(item.createdAt),
					items: [],
				});
			}
			map.get(key)!.items.push(item);
		});
		return Array.from(map.values());
	}, [credits]);

	const displayName = userName?.trim() || "Your";

	if (!isLoggedIn) {
		return (
			<div className="bg-[#f7f7f8] px-4 py-10 sm:px-6">
				<div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ed4264] to-[#47141e] text-white">
						<Wallet className="h-7 w-7" />
					</div>
					<h1 className="text-2xl font-bold text-neutral-900">Your Wallet</h1>
					<p className="mt-2 text-sm text-neutral-500">Log in to see your wallet balance and transactions.</p>
					<LinkWithChannel
						href="/login"
						className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#ed4264] to-[#47141e] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95"
					>
						Log in
					</LinkWithChannel>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100dvh-64px)] bg-[#f7f7f8]">
			<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
				<header className="mb-6">
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
						{displayName}&apos;s Wallet
					</h1>
					<p className="mt-1 text-sm text-neutral-500 sm:text-base">
						Track your balance, earnings, and spending
					</p>
				</header>

				{loading ? (
					<div className="flex flex-col items-center justify-center gap-3 py-20">
						<div className="h-10 w-10 animate-spin rounded-full border-2 border-[#ed4264] border-t-transparent" />
						<p className="text-sm font-medium text-neutral-500">Loading wallet…</p>
					</div>
				) : (
					<>
						{/* Remaining balance hero card */}
						<div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#47141e] via-[#5a1a28] to-[#6b2234] px-6 py-7 text-white shadow-md sm:px-8 sm:py-8">
							<p className="text-sm font-medium text-white/80">Remaining balance</p>
							<p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
								₹{Math.round(balance)}
							</p>
							<p className="mt-3 text-sm text-white/70">Meatndoor Cash available for checkout</p>
						</div>

						{/* Wallet activity */}
						<div className="mt-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm sm:px-6">
							<p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
								Wallet activity
							</p>
							<div className="mt-3 flex items-stretch">
								<div className="flex-1">
									<p className="text-sm text-neutral-500">Total earned</p>
									<p className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: GREEN }}>
										+₹{Math.round(totalEarned)}
									</p>
								</div>
								<div className="mx-4 w-px self-stretch bg-neutral-200 sm:mx-6" />
								<div className="flex-1">
									<p className="text-sm text-neutral-500">Total spent</p>
									<p className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: PINK }}>
										−₹{Math.round(totalSpent)}
									</p>
								</div>
							</div>
						</div>

						{/* Transactions */}
						<section className="mt-8">
							<h2 className="mb-4 text-lg font-bold text-neutral-900">Transactions</h2>

							{error && credits.length === 0 ? (
								<div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
									<p className="text-base font-bold text-neutral-900">Something went wrong</p>
									<p className="mt-2 text-sm text-neutral-500">{error}</p>
								</div>
							) : credits.length === 0 ? (
								<div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
									<p className="text-base font-bold text-neutral-900">No transactions yet</p>
									<p className="mt-2 text-sm text-neutral-500">
										Your wallet credits and payments will show up here.
									</p>
								</div>
							) : (
								<div className="space-y-6">
									{grouped.map((section) => (
										<div key={section.key}>
											<p className="mb-2 text-xs font-medium text-neutral-500">{section.title}</p>
											<div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
												{section.items.map((item, index) => {
													const isCredit = item.amount > 0;
													const amount = Math.abs(item.amount);
													const note = item.note || sourceLabel(item.source);
													const time = formatTime(item.createdAt);
													const status = statusText(item, isCredit);
													const muted = item.isExpired;

													return (
														<div
															key={
																item.checkoutToken ||
																item.orderId ||
																item.createdAt ||
																`${section.key}-${index}`
															}
															className={`flex items-center gap-3 px-4 py-3.5 ${
																index < section.items.length - 1
																	? "border-b border-neutral-100"
																	: ""
															}`}
														>
															<div
																className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
																	isCredit ? "bg-[#e8f7ef]" : "bg-[#fff0f3]"
																}`}
															>
																{isCredit ? (
																	<ArrowDownLeft className="h-4 w-4" style={{ color: GREEN }} />
																) : (
																	<ArrowUpRight className="h-4 w-4" style={{ color: PINK }} />
																)}
															</div>
															<div className="min-w-0 flex-1">
																<p
																	className="truncate text-sm font-semibold text-neutral-900"
																	style={{ color: MAROON }}
																>
																	{note}
																</p>
																<p className="mt-0.5 truncate text-xs text-neutral-500">
																	{[time, status].filter(Boolean).join(" · ")}
																</p>
															</div>
															<div className="shrink-0 text-right">
																<p
																	className="text-sm font-bold"
																	style={{
																		color: muted ? "#9a858c" : isCredit ? GREEN : PINK,
																	}}
																>
																	{isCredit ? "+" : "−"}₹{Math.round(amount)}
																</p>
																<p
																	className="mt-0.5 text-[11px] font-medium"
																	style={{
																		color: muted ? "#9a858c" : isCredit ? GREEN : PINK,
																	}}
																>
																	{status}
																</p>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									))}
								</div>
							)}
						</section>
					</>
				)}
			</div>
		</div>
	);
}
