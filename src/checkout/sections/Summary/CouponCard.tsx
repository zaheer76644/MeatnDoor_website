import { type FC } from "react";
import { type Coupon, COUPON_COLOR_THEMES } from "./couponUtils";

interface CouponCardProps {
	coupon: Coupon;
	selected: boolean;
	colorIndex: number;
	onSelect: (code: string) => void;
}

export const CouponCard: FC<CouponCardProps> = ({ coupon, selected, colorIndex, onSelect }) => {
	const theme = COUPON_COLOR_THEMES[colorIndex % COUPON_COLOR_THEMES.length];

	return (
		<label className="flex w-full cursor-pointer gap-3 rounded-xl border border-gray-300 bg-white p-3 shadow-sm transition hover:shadow-md">
			<input
				type="radio"
				name="coupon"
				checked={selected}
				onChange={() => onSelect(coupon.code)}
				className="mt-1"
			/>

			<div
				className={`min-w-[60px] self-start rounded-md border-2 border-dashed px-3 py-1 text-center text-sm font-bold ${theme.border} ${theme.text}`}
			>
				{coupon.code}
			</div>

			<div className="w-full text-xs text-gray-700">
				<p className="font-semibold">{coupon.title}</p>

				{coupon.terms.length > 0 && (
					<details className="mt-1">
						<summary className="cursor-pointer select-none text-[11px] text-blue-500">
							More Details
						</summary>
						<ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
							{coupon.terms.map((term) => (
								<li key={term}>{term}</li>
							))}
						</ul>
					</details>
				)}
			</div>
		</label>
	);
};
