"use client";

import { useTransition } from "react";
import { ClipLoader } from "react-spinners";
import { updateCartItem } from "@/app/actions";

type Props = {
	lineId: string;
	quantity: number;
	channel: string;
	variantId: string;
};

export const QuantityControls = ({ lineId, quantity, channel, variantId }: Props) => {
	const [isPending, startTransition] = useTransition();

	const handleDecrease = () => {
		if (isPending) return;
		startTransition(() => updateCartItem(lineId, variantId, quantity - 1, channel));
	};

	const handleIncrease = () => {
		if (isPending) return;
		startTransition(() => updateCartItem(lineId, variantId, quantity + 1, channel));
	};

	return (
		<div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] p-1 shadow-md">
			<button
				type="button"
				onClick={handleDecrease}
				disabled={isPending}
				className="flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-[#47141e]/20 disabled:cursor-not-allowed disabled:opacity-50"
			>
				-
			</button>
			<span className="min-w-[2rem] text-center text-sm font-bold text-white">
				{isPending ? <ClipLoader size={12} color="#ffffff" /> : quantity}
			</span>
			<button
				type="button"
				onClick={handleIncrease}
				disabled={isPending}
				className="flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-[#47141e]/20 disabled:cursor-not-allowed disabled:opacity-50"
			>
				+
			</button>
		</div>
	);
};
