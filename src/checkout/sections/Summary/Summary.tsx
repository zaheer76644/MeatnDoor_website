import { useState, type FC } from "react";
import clsx from "clsx";
import { SummaryItem, type SummaryLine } from "./SummaryItem";
import { PromoCodeAdd } from "./PromoCodeAdd";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { ChevronDownIcon } from "@/checkout/ui-kit/icons";

import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { Divider, Money, Title } from "@/checkout/components";
import {
	type CheckoutLineFragment,
	type GiftCardFragment,
	type Money as MoneyType,
	type OrderLineFragment,
} from "@/checkout/graphql";
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
}) => {
	const [selectedCoupon, setSelectedCoupon] = useState("");

	return (
		<div
			className={clsx(
				"z-0 flex h-fit w-full flex-col",
			)}
		>
			<details open className="group">
				<summary className="-mb-2 flex cursor-pointer flex-row items-center pt-4">
					<Title>Summary</Title>
					<ChevronDownIcon className="mb-2 group-open:rotate-180" />
				</summary>
				<ul className="py-2" data-testid="SummaryProductList">
					{lines.map((line) => (
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
			<div className="space-y-4 p-4">
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
				<SummaryMoneyRow label="Subtotal" money={subtotalPrice?.gross} ariaLabel="subtotal price" />
				{voucherCode && (
					<SummaryPromoCodeRow
						editable={editable}
						promoCode={voucherCode}
						ariaLabel="voucher"
						label={`Voucher code: ${voucherCode}`}
						money={discount}
						negative
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
				<SummaryMoneyRow label="Delivery Fee" ariaLabel="shipping cost" money={shippingPrice?.gross} />
				<Divider className="my-4" />
				<div className="flex flex-row items-baseline justify-between pb-4">
					<div className="flex flex-row items-baseline">
						<p className="font-bold">Total price</p>
						<p color="secondary" className="ml-2">
							includes {getFormattedMoney(totalPrice?.tax)} tax
						</p>
					</div>
					<Money ariaLabel="total price" money={totalPrice?.gross} data-testid="totalOrderPrice" />
				</div>
			</div>
		</div>
	);
};
