import { useState, useEffect, useMemo, type FC } from "react";
import clsx from "clsx";
import { SummaryItem, type SummaryLine } from "./SummaryItem";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { getSummaryLineProps } from "./utils";
import { ChevronDownIcon } from "@/checkout/ui-kit/icons";

import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { Divider, Money, Title } from "@/checkout/components";
import {
	type CheckoutLineFragment,
	type GiftCardFragment,
	type Money as MoneyType,
	type OrderLineFragment,
	type ShippingMethod,
} from "@/checkout/graphql";
import { SummaryItemMoneySection } from "@/checkout/sections/Summary/SummaryItemMoneySection";
import { type GrossMoney, type GrossMoneyWithTax } from "@/checkout/lib/globalTypes";
import { CouponsDrawer } from "@/checkout/sections/Summary/CouponsDrawer";
import {
	fetchDiscountsAndCheapProducts,
	fetchProductThumbnail,
} from "@/checkout/sections/Summary/couponApi";
import { type CheapProduct, type Coupon } from "@/checkout/sections/Summary/couponUtils";

interface SummaryProps {
	editable?: boolean;
	lines: SummaryLine[];
	totalPrice?: GrossMoneyWithTax;
	subtotalPrice?: GrossMoney;
	giftCards?: GiftCardFragment[];
	voucherCode?: string | null;
	discount?: MoneyType | null;
	shippingPrice: GrossMoney;
	shippingMethods: ShippingMethod[];
}

export const Summary: FC<SummaryProps> = ({
	editable = true,
	lines,
	totalPrice,
	subtotalPrice,
	giftCards = [],
	voucherCode,
	shippingPrice,
	discount,
	shippingMethods,
}) => {
	const [couponsOpen, setCouponsOpen] = useState(false);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [cheapProducts, setCheapProducts] = useState<CheapProduct[]>([]);
	const [cheapProductThumbnails, setCheapProductThumbnails] = useState<Record<string, string>>({});
	const [couponsLoading, setCouponsLoading] = useState(false);
	const [handlingFeeAmount, setHandlingFeeAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [totalSavings, setTotalSavings] = useState<{ amount: number; currency: string } | null>(null);
	const [shippingPriceAmount, setShippingPriceAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [maxShippingPriceAmount, setMaxShippingPriceAmount] = useState<{ amount: number; currency: string } | null>(
		null,
	);
	const [includesShippingSavings, setIncludesShippingSavings] = useState(false);

	useEffect(() => {
		if (shippingMethods?.length > 0) {
			const minShippingPrice = shippingMethods?.reduce((min, method) =>
				method.price.amount < min.price.amount ? method : min,
			);
			setShippingPriceAmount(minShippingPrice?.price);
			const maxShippingPrice = shippingMethods?.reduce((min, method) =>
				method.price.amount > min.price.amount ? method : min,
			);
			setMaxShippingPriceAmount(maxShippingPrice?.price);
		}
	}, [shippingMethods]);

	const filteredLines = useMemo(() => {
		return lines.filter((line) => {
			const { productName } = getSummaryLineProps(line);
			return productName?.toLowerCase() !== "handling fee";
		});
	}, [lines]);

	const cheapVariantIds = useMemo(
		() => new Set(cheapProducts.flatMap((product) => product.variants?.map((variant) => variant.id) || [])),
		[cheapProducts],
	);

	const hasCheapDealApplied = useMemo(
		() =>
			filteredLines.some((line) => {
				if (!("variant" in line) || !line.variant || !("id" in line.variant)) {
					return false;
				}
				return cheapVariantIds.has(line.variant.id);
			}),
		[filteredLines, cheapVariantIds],
	);

	useEffect(() => {
		const handlingFeeLine = lines.find((line) => {
			const { productName } = getSummaryLineProps(line);
			return productName?.toLowerCase() === "handling fee";
		});

		if (handlingFeeLine && "totalPrice" in handlingFeeLine && handlingFeeLine.totalPrice) {
			setHandlingFeeAmount(handlingFeeLine.totalPrice.gross);
		} else {
			setHandlingFeeAmount(null);
		}
	}, [lines]);

	useEffect(() => {
		let savings = 0;
		let currency = "";

		filteredLines.forEach((line) => {
			if ("variant" in line && line.variant && line.unitPrice) {
				let lineSavings = 0;
				let foundSaving = false;

				if (line.variant.attributes) {
					for (const attr of line.variant.attributes) {
						const attributeName = "attribute" in attr ? attr.attribute?.name : undefined;
						if (attributeName === "Saving Amount" || attributeName === "saving-amount") {
							const savingValue = attr.values?.[0];
							if (savingValue) {
								const savingAmountStr = savingValue.translation?.name || savingValue.name;
								if (savingAmountStr) {
									const originalPrice = parseFloat(savingAmountStr);
									const discountedPrice = parseFloat(String(line.unitPrice.gross.amount || 0));
									lineSavings = (originalPrice - discountedPrice) * line.quantity;
									foundSaving = true;
									break;
								}
							}
						}
					}
				}

				if (!foundSaving && line.undiscountedUnitPrice) {
					const originalPrice =
						"gross" in line.undiscountedUnitPrice
							? parseFloat(String(line.undiscountedUnitPrice.gross?.amount || 0))
							: parseFloat(String(line.undiscountedUnitPrice.amount || 0));
					const discountedPrice = parseFloat(String(line.unitPrice.gross.amount || 0));

					if (originalPrice > discountedPrice) {
						lineSavings = (originalPrice - discountedPrice) * line.quantity;
					}
				}

				if (lineSavings > 0) {
					savings += lineSavings;
					if (!currency && line.unitPrice.gross.currency) {
						currency = line.unitPrice.gross.currency;
					}
				}
			}
		});

		let shippingSavingsAdded = false;
		if (shippingPriceAmount?.amount === 0 && maxShippingPriceAmount?.amount && maxShippingPriceAmount.amount > 0) {
			savings += maxShippingPriceAmount?.amount ?? 0;
			shippingSavingsAdded = true;
			if (!currency && shippingPrice.gross.currency) {
				currency = shippingPrice.gross.currency;
			}
		}
		setIncludesShippingSavings(shippingSavingsAdded);

		if (savings > 0 && currency) {
			setTotalSavings({ amount: savings, currency });
		} else {
			setTotalSavings(null);
		}
	}, [filteredLines, shippingPriceAmount, shippingPrice, maxShippingPriceAmount]);

	useEffect(() => {
		if (!editable) {
			return;
		}

		let cancelled = false;

		const loadCoupons = async () => {
			setCouponsLoading(true);
			try {
				const { coupons: fetchedCoupons, cheapProducts: fetchedCheapProducts } =
					await fetchDiscountsAndCheapProducts();
				if (!cancelled) {
					setCoupons(fetchedCoupons);
					setCheapProducts(fetchedCheapProducts);

					fetchedCheapProducts.forEach((product) => {
						void fetchProductThumbnail(product.slug).then((url) => {
							if (!cancelled && url) {
								setCheapProductThumbnails((prev) => ({ ...prev, [product.id]: url }));
							}
						});
					});
				}
			} catch {
				if (!cancelled) {
					setCoupons([]);
					setCheapProducts([]);
				}
			} finally {
				if (!cancelled) {
					setCouponsLoading(false);
				}
			}
		};

		void loadCoupons();

		return () => {
			cancelled = true;
		};
	}, [editable]);

	const appliedOfferLabel = voucherCode ? voucherCode : hasCheapDealApplied ? "₹1 deal" : null;

	return (
		<div
			className={clsx(
				"flex h-fit w-full flex-col",
			)}
		>
			<details open className="group">
				<summary className="-mb-2 flex cursor-pointer flex-row items-center">
					<Title className="text-[#47141e]">Summary</Title>
					<ChevronDownIcon className="mb-2 group-open:rotate-180" />
				</summary>
				<ul className="py-2" data-testid="SummaryProductList">
					{filteredLines.map((line) => (
						<SummaryItem line={line} key={line?.id}>
							{editable ? (
								<SummaryItemMoneyEditableSection line={line as CheckoutLineFragment} />
							) : (
								<SummaryItemMoneySection line={line as OrderLineFragment} />
							)}
						</SummaryItem>
					))}
				</ul>
			</details>

			{editable && (
				<>
					<button
						type="button"
						onClick={() => setCouponsOpen(true)}
						className={`my-4 flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border p-4 text-left shadow-sm transition ${
							appliedOfferLabel
								? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-400"
								: "border-[rgba(71,20,30,0.08)] bg-gradient-to-br from-[#fff8f9] to-white hover:border-[#ed4264]/30 hover:shadow-md"
						}`}
					>
						<div className="flex min-w-0 items-center gap-3">
							<div
								className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-md ${
									appliedOfferLabel
										? "bg-gradient-to-br from-[#1b7a3d] to-[#2d9a55]"
										: "bg-gradient-to-br from-[#ed4264] to-[#47141e]"
								}`}
							>
								{appliedOfferLabel ? (
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
									</svg>
								) : (
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
										/>
									</svg>
								)}
							</div>
							<div className="min-w-0">
								<p className="text-sm font-semibold text-[#47141e]">Coupons & deals</p>
								{appliedOfferLabel ? (
									<p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-medium text-green-700">
										<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
											Applied
										</span>
										<span className="truncate">{appliedOfferLabel}</span>
									</p>
								) : (
									<p className="truncate text-xs text-gray-500">
										{couponsLoading ? "Loading offers..." : "Apply a coupon or ₹1 deal"}
									</p>
								)}
							</div>
						</div>
						<span
							className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${
								appliedOfferLabel
									? "border border-green-300 bg-white text-green-700"
									: "bg-gradient-to-r from-[#ed4264] to-[#47141e] text-white"
							}`}
						>
							{appliedOfferLabel ? "Change" : "Apply"}
						</span>
					</button>
					<Divider />
				</>
			)}

			{editable && (
				<CouponsDrawer
					open={couponsOpen}
					onClose={() => setCouponsOpen(false)}
					coupons={coupons}
					cheapProducts={cheapProducts}
					thumbnails={cheapProductThumbnails}
					loading={couponsLoading}
				/>
			)}

			<Divider />
			<div className="mt-4 flex max-w-full flex-col">
				<SummaryMoneyRow
					label="Subtotal"
					money={
						subtotalPrice?.gross
							? {
									amount: Math.round(
										(subtotalPrice.gross.amount || 0) + (discount?.amount || 0) - (handlingFeeAmount?.amount ?? 0),
									),
									currency: subtotalPrice.gross.currency,
								}
							: undefined
					}
					ariaLabel="subtotal price"
				/>
				{voucherCode && (
					<SummaryPromoCodeRow
						editable={editable}
						promoCode={voucherCode}
						ariaLabel="voucher"
						label={`Voucher code: ${voucherCode}`}
						money={discount}
						negative
						className="text-green-600"
					/>
				)}
				{giftCards.map(({ currentBalance, displayCode, id }) => (
					<SummaryPromoCodeRow
						key={id}
						editable={editable}
						promoCodeId={id}
						ariaLabel="gift card"
						label={`Gift Card: •••• •••• ${displayCode}`}
						money={currentBalance}
						negative
					/>
				))}
				<SummaryMoneyRow label="Delivery Fee" ariaLabel="shipping cost" money={shippingPriceAmount} />
				{handlingFeeAmount && (
					<SummaryMoneyRow label="Handling Fee" ariaLabel="handling cost" money={handlingFeeAmount} />
				)}
				<Divider className="my-4" />
				<div className="flex flex-row items-baseline justify-between pb-4">
					<div className="flex flex-row items-baseline">
						<p className="font-bold text-[#47141e]">Total price</p>
						<p color="secondary" className="ml-2">
							includes {getFormattedMoney(totalPrice?.tax)} tax
						</p>
					</div>
					<Money
						ariaLabel="total price"
						money={
							subtotalPrice?.gross
								? {
										amount: Math.round((subtotalPrice.gross.amount || 0) + (shippingPriceAmount?.amount ?? 0)),
										currency: subtotalPrice.gross.currency,
									}
								: undefined
						}
						data-testid="totalOrderPrice"
						className="font-bold text-[#ed2464]"
					/>
				</div>
				{totalSavings && totalSavings.amount > 0 && (
					<div className="mt-3 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
						<div className="flex flex-row items-center gap-1">
							<div className="flex items-center gap-2">
								<p className="font-semibold text-green-700">You are saving</p>
							</div>
							<Money ariaLabel="total savings" money={totalSavings} className="text-lg font-bold text-green-600" />
							<p className="mb-1 font-semibold text-green-700">on this order</p>
						</div>
						{includesShippingSavings && (
							<p className="mt-2 text-xs italic text-green-600">* Shipping amount also included</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
