"use client";

import { useEffect, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
	buildCouponOffers,
	buildDealOffers,
	parseDescriptionLines,
	type CheapProduct,
	type Coupon,
	type Offer,
} from "./couponUtils";
import { getSummaryLineProps } from "./utils";
import {
	useCheckoutAddPromoCodeMutation,
	useCheckoutLinesUpdateMutation,
	useCheckoutRemovePromoCodeMutation,
} from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";

interface CouponsDrawerProps {
	open: boolean;
	onClose: () => void;
	coupons: Coupon[];
	cheapProducts: CheapProduct[];
	thumbnails: Record<string, string>;
	loading?: boolean;
}

interface OfferCardProps {
	offer: Offer;
	applying: boolean;
	onApply: (offer: Offer) => void;
}

const OfferCard: FC<OfferCardProps> = ({ offer, applying, onApply }) => {
	const [expanded, setExpanded] = useState(false);
	const lines = parseDescriptionLines(offer.description);
	const hasMore = lines.length > 1;
	const visibleLines = expanded ? lines : lines.slice(0, 1);
	const isLocked = offer.locked && !offer.applied;

	return (
		<div
			className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
				offer.applied
					? "border-green-300 bg-green-50/40"
					: isLocked
						? "border-gray-200 bg-gray-50 opacity-90"
						: "border-[rgba(71,20,30,0.08)]"
			}`}
		>
			<div
				className={`absolute inset-y-0 left-0 w-1.5 ${
					offer.applied ? "bg-green-600" : isLocked ? "bg-[#b89aa3]" : "bg-gradient-to-b from-[#47141e] to-[#ed4264]"
				}`}
			/>

			<div className="p-3.5 pl-4">
				<div className="mb-2 flex items-start justify-between gap-2">
					<div
						className={`inline-flex max-w-[65%] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white ${
							offer.applied
								? "bg-gradient-to-r from-[#1b7a3d] to-[#2d9a55]"
								: isLocked
									? "bg-gradient-to-r from-[#9a7a82] to-[#b89aa3]"
									: "bg-gradient-to-r from-[#47141e] via-[#6b1c32] to-[#ed4264]"
						}`}
					>
						{offer.type === "deal" ? (
							<svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						) : (
							<svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
								/>
							</svg>
						)}
						<span className="truncate">{offer.code}</span>
					</div>

					<button
						type="button"
						disabled={applying || isLocked}
						onClick={() => onApply(offer)}
						className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
							offer.applied
								? "border border-[#ed4264]/30 bg-white text-[#ed4264]"
								: isLocked
									? "bg-gray-200 text-gray-500"
									: "bg-gradient-to-r from-[#ed4264] to-[#47141e] text-white"
						}`}
					>
						{applying ? (
							<span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
						) : offer.applied ? (
							"Remove"
						) : (
							"Apply"
						)}
					</button>
				</div>

				<p className="mb-1.5 text-sm font-semibold text-[#47141e]">{offer.title}</p>

				{offer.applied && (
					<div className="mb-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
						<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
						</svg>
						Applied to your order
					</div>
				)}

				{isLocked && offer.lockReason && (
					<div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#f3e8ea] px-2 py-0.5 text-[11px] font-medium text-[#8a6b73]">
						<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						{offer.lockReason}
					</div>
				)}

				{lines.length > 0 && (
					<div className="space-y-1">
						{visibleLines.map((line) => (
							<div key={line} className="flex gap-2 text-[11px] text-gray-600">
								<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#ed4264]" />
								<span>{line}</span>
							</div>
						))}
						{hasMore && (
							<button
								type="button"
								onClick={() => setExpanded((prev) => !prev)}
								className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#ed4264]"
							>
								{expanded ? "Show less" : "+ MORE"}
								<svg
									className={`h-3 w-3 transition ${expanded ? "rotate-180" : ""}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export const CouponsDrawer: FC<CouponsDrawerProps> = ({
	open,
	onClose,
	coupons,
	cheapProducts,
	thumbnails,
	loading = false,
}) => {
	const { checkout } = useCheckout();
	const [, addPromoCode] = useCheckoutAddPromoCodeMutation();
	const [, removePromoCode] = useCheckoutRemovePromoCodeMutation();
	const [, updateLines] = useCheckoutLinesUpdateMutation();
	const [applyingCode, setApplyingCode] = useState<string | null>(null);
	const [manualCode, setManualCode] = useState("");

	const cheapVariantIds = new Set(
		cheapProducts.flatMap((product) => product.variants?.map((variant) => variant.id) || []),
	);

	const hasCheapInCart =
		checkout?.lines.some((line) => {
			const { productName } = getSummaryLineProps(line);
			if (productName?.toLowerCase() === "handling fee") return false;
			return cheapVariantIds.has(line.variant.id);
		}) ?? false;

	const baseCartTotal =
		checkout?.lines.reduce((sum, line) => {
			const { productName } = getSummaryLineProps(line);
			if (productName?.toLowerCase() === "handling fee") return sum;
			if (cheapVariantIds.has(line.variant.id)) return sum;
			return sum + (line.totalPrice?.gross?.amount ?? 0);
		}, 0) ?? 0;

	const appliedCouponCode = checkout?.voucherCode || "";

	const couponOffers: Offer[] = buildCouponOffers({
		coupons,
		appliedCouponCode,
		hasCheapInCart,
		baseCartTotal,
	});

	const dealOffers: Offer[] = buildDealOffers({
		products: cheapProducts,
		thumbnails,
		appliedCouponCode,
		hasCheapInCart,
		baseCartTotal,
		isDealInCart: (variantId) =>
			checkout?.lines.some((line) => line.variant.id === variantId && line.quantity > 0) ?? false,
	});

	const appliedCount =
		couponOffers.filter((offer) => offer.applied).length + dealOffers.filter((offer) => offer.applied).length;

	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	const applyCouponOffer = async (offer: Offer) => {
		if (!checkout?.id) return;

		if (!offer.applied && hasCheapInCart) {
			toast.error("Remove the ₹1 deal from your cart before applying a coupon.");
			return;
		}

		if (!offer.applied && offer.minOrder > 0 && baseCartTotal < offer.minOrder) {
			toast.error(`Add items worth ₹${Math.round(offer.minOrder)} or more to use this coupon.`);
			return;
		}

		setApplyingCode(offer.code);
		try {
			if (offer.applied) {
				const result = await removePromoCode({
					checkoutId: checkout.id,
					languageCode: "EN_US",
					promoCode: offer.code,
				});
				if (result.data?.checkoutRemovePromoCode?.errors?.length) {
					toast.error(result.data.checkoutRemovePromoCode.errors[0]?.message || "Could not remove promo code.");
				} else {
					toast.success("Coupon removed");
				}
			} else {
				const result = await addPromoCode({
					checkoutId: checkout.id,
					languageCode: "EN_US",
					promoCode: offer.code,
				});
				if (result.data?.checkoutAddPromoCode?.errors?.length) {
					toast.error(result.data.checkoutAddPromoCode.errors[0]?.message || "Promo code is not valid.");
				} else {
					toast.success(`${offer.code} applied successfully`);
					onClose();
				}
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not update coupon");
		} finally {
			setApplyingCode(null);
		}
	};

	const applyDealOffer = async (offer: Offer) => {
		if (!checkout?.id || !offer.product) return;
		const variant = offer.product.variants?.[0];
		if (!variant?.id) return;

		setApplyingCode(offer.code);
		try {
			if (offer.applied) {
				await updateLines({
					checkoutId: checkout.id,
					languageCode: "EN_US",
					lines: [{ variantId: variant.id, quantity: 0 }],
				});
				toast.success("Deal removed");
				return;
			}

			if (appliedCouponCode) {
				toast.error("Remove the coupon before adding a ₹1 deal.");
				return;
			}

			if (hasCheapInCart) {
				toast.error("Only one ₹1 deal can be added per order.");
				return;
			}

			if (offer.minOrder > 0 && baseCartTotal < offer.minOrder) {
				toast.error(`Add items worth ₹${Math.round(offer.minOrder)} or more to add this deal.`);
				return;
			}

			await updateLines({
				checkoutId: checkout.id,
				languageCode: "EN_US",
				lines: [{ variantId: variant.id, quantity: 1 }],
			});
			toast.success(`${offer.product.name} added for ₹${Math.round(offer.price || 1)}`);
			onClose();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not update deal");
		} finally {
			setApplyingCode(null);
		}
	};

	const handleApply = async (offer: Offer) => {
		if (offer.type === "deal") {
			await applyDealOffer(offer);
			return;
		}
		await applyCouponOffer(offer);
	};

	const handleManualApply = async () => {
		const code = manualCode.trim();
		if (!code) return;
		await applyCouponOffer({
			id: code,
			type: "coupon",
			code,
			title: code,
			description: "",
			minOrder: 0,
			applied: false,
			locked: false,
			lockReason: "",
		});
		setManualCode("");
	};

	if (!open || typeof document === "undefined") return null;

	return createPortal(
		<div className="fixed inset-0 z-[9999]">
			<button
				type="button"
				aria-label="Close coupons drawer"
				className="absolute inset-0 bg-black/45"
				onClick={onClose}
			/>

			<aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#f7f2f1] shadow-2xl animate-in slide-in-from-right duration-300">
				<div className="bg-gradient-to-r from-[#47141e] via-[#6b1c32] to-[#ed4264] px-4 py-4 text-white">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-base font-bold">Coupons & deals</p>
							<p className="text-xs text-white/80">
								{appliedCount > 0
									? `${appliedCount} offer applied to your order`
									: "Pick a coupon or ₹1 deal below"}
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
							aria-label="Close"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
					<div className="rounded-2xl border border-[rgba(71,20,30,0.08)] bg-white p-3.5">
						<p className="mb-2 text-sm font-semibold text-[#47141e]">Have a coupon code?</p>
						<div className="flex gap-2">
							<input
								value={manualCode}
								onChange={(event) => setManualCode(event.target.value.toUpperCase())}
								placeholder="Enter code here"
								disabled={hasCheapInCart || !!applyingCode}
								className="min-w-0 flex-1 rounded-lg border border-[rgba(71,20,30,0.08)] bg-[#fff8f9] px-3 py-2.5 text-sm font-semibold text-[#47141e] outline-none focus:border-[#ed4264]"
							/>
							<button
								type="button"
								disabled={!manualCode.trim() || hasCheapInCart || !!applyingCode}
								onClick={() => void handleManualApply()}
								className="rounded-lg bg-gradient-to-r from-[#ed4264] to-[#47141e] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
							>
								Apply
							</button>
						</div>
						{hasCheapInCart && (
							<p className="mt-2 text-[11px] text-[#8a6b73]">Remove the ₹1 deal to apply a coupon code</p>
						)}
					</div>

					{loading ? (
						<p className="py-8 text-center text-sm text-gray-500">Loading available offers...</p>
					) : (
						<>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="h-1.5 w-1.5 rounded-full bg-[#ed4264]" />
									<p className="text-sm font-bold text-[#47141e]">Available coupons</p>
								</div>
								<span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#47141e] shadow-sm">
									{couponOffers.length}
								</span>
							</div>

							{couponOffers.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
									<p className="text-sm font-semibold text-[#47141e]">No coupons right now</p>
									<p className="mt-1 text-xs text-gray-500">Check back later for new coupon offers.</p>
								</div>
							) : (
								couponOffers.map((offer) => (
									<OfferCard
										key={offer.id}
										offer={offer}
										applying={applyingCode === offer.code}
										onApply={(selected) => void handleApply(selected)}
									/>
								))
							)}

							<div className="flex items-center justify-between pt-1">
								<div className="flex items-center gap-2">
									<span className="h-1.5 w-1.5 rounded-full bg-[#ed4264]" />
									<p className="text-sm font-bold text-[#47141e]">Deals starting at ₹1</p>
								</div>
								<span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#47141e] shadow-sm">
									{dealOffers.length}
								</span>
							</div>

							{dealOffers.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
									<p className="text-sm font-semibold text-[#47141e]">No deals right now</p>
									<p className="mt-1 text-xs text-gray-500">Check back later for ₹1 product deals.</p>
								</div>
							) : (
								dealOffers.map((offer) => (
									<OfferCard
										key={offer.id}
										offer={offer}
										applying={applyingCode === offer.code}
										onApply={(selected) => void handleApply(selected)}
									/>
								))
							)}
						</>
					)}
				</div>
			</aside>
		</div>,
		document.body,
	);
};
