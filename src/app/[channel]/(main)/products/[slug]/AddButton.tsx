"use client";

import { useTransition } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { addToCart, updateCartItem } from "@/app/actions";

export function AddButton({
	disabled,
	channel,
	variantId,
	cartItem,
	quantityAvailable,
	maxBuyLimit,
}: {
	disabled?: boolean;
	channel: string;
	variantId?: string;
	cartItem?: { lineId: string; quantity: number };
	quantityAvailable?: number;
	maxBuyLimit?: number | undefined;
}) {
	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!variantId) return;
		startTransition(async () => {
			await addToCart(variantId, channel);
		});
	};

	const handleIncrease = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!cartItem || !variantId) return;
		
		const availableQty = quantityAvailable ?? 0;
		
		// Calculate maximum allowed quantity (minimum of quantityAvailable and maxBuyLimit)
		const maxAllowedQuantity = maxBuyLimit !== null && maxBuyLimit !== undefined
			? Math.min(availableQty, maxBuyLimit) 
			: availableQty;
		
		const newQuantity = cartItem.quantity + 1;
		
		if (newQuantity > maxAllowedQuantity) {
			if (maxBuyLimit !== undefined && maxBuyLimit < availableQty) {
				toast.warning(`Maximum purchase limit is ${maxBuyLimit} items`);
			} else {
				toast.warning(`We only have ${availableQty} quantity at the moment`);
			}
			return;
		}
		
		startTransition(async () => {
			await updateCartItem(cartItem.lineId, variantId, newQuantity, channel);
		});
	};

	const handleDecrease = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!cartItem || !variantId) return;
		startTransition(async () => {
			await updateCartItem(cartItem.lineId, variantId, cartItem.quantity - 1, channel);
		});
	};

	const isButtonDisabled = disabled || isPending;

	if (cartItem) {
		return (
			<div className="flex items-center justify-center gap-4">
				<button
					onClick={handleDecrease}
					disabled={isPending}
					className="group flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#ed4264] to-[#ff6b9d] text-2xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-[#47141e] hover:to-[#ed4264] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				>
					<span className="transition-transform duration-300 group-hover:scale-125">-</span>
				</button>
				<div className="flex min-w-[4rem] items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-3 shadow-inner">
					<span className="text-2xl font-bold text-[#47141e]">
						{isPending ? <ClipLoader size={24} color="#ed4264" /> : cartItem.quantity}
					</span>
				</div>
				<button
					onClick={handleIncrease}
					disabled={isPending}
					className="group flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#ed4264] to-[#ff6b9d] text-2xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-[#47141e] hover:to-[#ed4264] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				>
					<span className="transition-transform duration-300 group-hover:scale-125">+</span>
				</button>
			</div>
		);
	}

	return (
		<button
			type="submit"
			aria-disabled={isButtonDisabled}
			aria-busy={isPending}
			onClick={handleAddToCart}
			className="group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ed4264]/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
		>
			{/* Shimmer effect */}
			<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
			
			{/* Button content */}
			<span className="relative z-10 flex items-center justify-center gap-2">
				{isPending ? (
					<>
						<ClipLoader size={20} color="#ffffff" />
						<span>Processing...</span>
					</>
				) : (
					<>
						<svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<span>Add to Cart</span>
					</>
				)}
			</span>
		</button>
	);
}
