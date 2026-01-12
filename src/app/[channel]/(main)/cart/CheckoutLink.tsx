"use client";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
	className?: string;
};

export const CheckoutLink = ({ disabled, checkoutId, className = "" }: Props) => {
	return (
		<a
			data-testid="CheckoutLink"
			aria-disabled={disabled}
			onClick={(e) => disabled && e.preventDefault()}
			href={`/checkout?checkout=${checkoutId}`}
			className={`group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-8 py-4 text-center text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ed4264]/50 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 aria-disabled:hover:scale-100 sm:px-16 ${className}`}
		>
			{/* Shimmer effect */}
			<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
			{/* Button content */}
			<span className="relative z-10 flex items-center justify-center gap-2">
				<svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
				</svg>
				<span>Checkout</span>
			</span>
		</a>
	);
};
