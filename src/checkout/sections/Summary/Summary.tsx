import { useState, useEffect, useMemo, type FC } from "react";
import clsx from "clsx";
import { SummaryItem, type SummaryLine } from "./SummaryItem";
import { PromoCodeAdd } from "./PromoCodeAdd";
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
 type ShippingMethod } from "@/checkout/graphql";
import { SummaryItemMoneySection } from "@/checkout/sections/Summary/SummaryItemMoneySection";
import { type GrossMoney, type GrossMoneyWithTax } from "@/checkout/lib/globalTypes";

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
	const [selectedCoupon, setSelectedCoupon] = useState("");
	const [handlingFeeAmount, setHandlingFeeAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [totalSavings, setTotalSavings] = useState<{ amount: number; currency: string } | null>(null);
	const [shippingPriceAmount, setShippingPriceAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [maxShippingPriceAmount, setMaxShippingPriceAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [includesShippingSavings, setIncludesShippingSavings] = useState(false);
	useEffect(() => {
		if (shippingMethods?.length > 0) {
			const minShippingPrice = shippingMethods?.reduce((min, method) =>
				method.price.amount < min.price.amount ? method : min
			);
			setShippingPriceAmount(minShippingPrice?.price);
			const maxShippingPrice = shippingMethods?.reduce((min, method) =>
				method.price.amount > min.price.amount ? method : min
			);
			setMaxShippingPriceAmount(maxShippingPrice?.price);
		}
	}, [shippingMethods]);
	// Filter out "Handling Fee" product from the lines (memoized to prevent infinite loops)
	const filteredLines = useMemo(() => {
		return lines.filter((line) => {
			const { productName } = getSummaryLineProps(line);
			return productName?.toLowerCase() !== "handling fee";
		});
	}, [lines]);

	// Extract and store handling fee amount from lines
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

	// Calculate total savings from all lines
	useEffect(() => {
		let savings = 0;
		let currency = "";

		filteredLines.forEach((line) => {
			if ("variant" in line && line.variant && line.unitPrice) {
				let lineSavings = 0;
				let foundSaving = false;

				// Method 1: Try to find "Saving Amount" attribute
				if (line.variant.attributes) {
					for (const attr of line.variant.attributes) {
						// Check if attribute name is "Saving Amount"
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

				// Method 2: Fallback to undiscountedUnitPrice vs unitPrice
				if (!foundSaving && line.undiscountedUnitPrice) {
					// For CheckoutLineFragment, undiscountedUnitPrice is Money (has amount directly)
					// For OrderLineFragment, undiscountedUnitPrice is TaxedMoney (has gross.amount)
					const originalPrice = "gross" in line.undiscountedUnitPrice
						? parseFloat(String(line.undiscountedUnitPrice.gross?.amount || 0))
						: parseFloat(String(line.undiscountedUnitPrice.amount || 0));
					const discountedPrice = parseFloat(String(line.unitPrice.gross.amount || 0));
					
					// Only calculate savings if there's a difference
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

		// Add shipping savings if minimum shipping price is 0 but user is being charged
		let shippingSavingsAdded = false;
		if (shippingPriceAmount?.amount === 0 &&  maxShippingPriceAmount?.amount && maxShippingPriceAmount.amount > 0) {
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
	return (
		<div
			className={clsx(
				"z-0 flex h-fit w-full flex-col",
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
					<PromoCodeAdd inputCouponLabel={selectedCoupon} />
					<Divider />
				</>
			)}
			<div className="space-y-4 my-4">
				{/* WC10 Coupon */}
				<label className="flex w-full cursor-pointer gap-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm transition hover:shadow-md">
					{/* Radio Button */}
					<input
						type="radio"
						name="coupon"
						checked={selectedCoupon === "WC10"}
						onChange={() => setSelectedCoupon("WC10")}
						className="mt-1"
					/>

					{/* Coupon Code Box */}
					<div className="min-w-[60px] self-start rounded-md border-2 border-dashed border-orange-400 px-3 py-1 text-center text-sm font-bold text-orange-500">
						WC10
					</div>

					{/* Details */}
					<div className="w-full text-xs text-gray-700">
						<p className="font-semibold">Flat 10% off on first order</p>

						<details className="mt-1">
							<summary className="cursor-pointer select-none text-[11px] text-blue-500">
								Terms & Conditions
							</summary>
							<ol className="mt-1 list-inside list-decimal space-y-0.5 pl-1 text-[11px]">
								<li>Flat 10% off on first order</li>
								<li>Applicable only on first order</li>
								<li>Subject to change without notice</li>
								<li>Void on cancelled or undelivered orders</li>
							</ol>
						</details>
					</div>
				</label>

				{/* MEET20 Coupon */}
				<label className="flex w-full cursor-pointer gap-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm transition hover:shadow-md">
					{/* Radio Button */}
					<input
						type="radio"
						name="coupon"
						checked={selectedCoupon === "MEET20"}
						onChange={() => setSelectedCoupon("MEET20")}
						className="mt-1"
					/>

					{/* Coupon Code Box */}
					<div className="min-w-[60px] self-start rounded-md border-2 border-dashed border-green-500 py-1 pl-2 pr-4 text-center text-sm font-bold text-green-600">
						MEET20
					</div>

					{/* Details */}
					<div className="w-full text-xs text-gray-700">
						<p className="font-semibold">₹100 off on orders above ₹499</p>

						<details className="mt-1">
							<summary className="cursor-pointer select-none text-[11px] text-blue-500">
								Terms & Conditions
							</summary>
							<ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
								<li>Maximum discount ₹100</li>
								<li>Applicable on orders above ₹499</li>
								<li>Valid for first 5 orders</li>
								<li>Subject to change without notice</li>
								<li>Void on cancelled or undelivered orders</li>
							</ul>
						</details>
					</div>
				</label>
			</div>

			{/* <div className="space-y-4 p-4">
				{/* WC10 Coupon 
				<button
					onClick={() => setSelectedCoupon("WC10")}
					className="w-full rounded-md border p-3 text-left text-sm transition hover:bg-gray-50"
				>
					<h1 className="text-lg font-semibold">WC10</h1>

					<p className="mt-1 font-medium">Terms & Conditions</p>

					<ol className="mt-1 list-inside list-decimal space-y-0.5">
						<li>Flat 10% off on first order</li>
						<li>Applicable only on first order</li>
						<li>Offer may change without prior notice</li>
						<li>Offer void on cancelled or undelivered orders</li>
					</ol>
				</button>

				{/* MEET20 Coupon  
				<button
					onClick={() => setSelectedCoupon("MEET20")}
					className="w-full rounded-md border p-3 text-left text-sm transition hover:bg-gray-50"
				>
					<h1 className="text-lg font-semibold">MEET20</h1>

					<p className="mt-1 font-medium">Terms & Conditions</p>

					<ul className="mt-1 list-inside list-disc space-y-0.5">
						<li>Maximum discount of ₹100</li>
						<li>Applicable on orders above ₹499</li>
						<li>Applicable for the first 5 orders</li>
						<li>Offer may change without prior notice</li>
						<li>Offer void on cancelled or undelivered orders</li>
					</ul>
				</button>
			</div> */}

			<Divider />
			<div className="mt-4 flex max-w-full flex-col">
				<SummaryMoneyRow label="Subtotal" money={
					subtotalPrice?.gross
						? {
								amount: (subtotalPrice.gross.amount || 0) + (discount?.amount || 0) - (handlingFeeAmount?.amount ?? 0),
								currency: subtotalPrice.gross.currency,
							}
						: undefined
				} ariaLabel="subtotal price" />
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
				{/* delivery fee  */}
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
					<Money ariaLabel="total price" money={subtotalPrice?.gross
						? {
								amount: Math.round((subtotalPrice.gross.amount || 0) + (shippingPriceAmount?.amount ?? 0)),
								currency: subtotalPrice.gross.currency,
							}
						: undefined} data-testid="totalOrderPrice" className="text-[#ed2464] font-bold"/>
				</div>
				{totalSavings && totalSavings.amount > 0 && (
					<div className="mt-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3">
						<div className="flex flex-row items-center justify-between">
							<div className="flex items-center gap-2">
								{/* <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg> */}
								<p className="font-semibold text-green-700">You are saving</p>
							</div>
							<Money 
								ariaLabel="total savings" 
								money={totalSavings} 
								className="text-green-600 font-bold text-lg"
							/>
						</div>
						{includesShippingSavings && (
							<p className="mt-2 text-xs text-green-600 italic">
								* Shipping amount also included
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
