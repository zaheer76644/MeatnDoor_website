"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function PromoOfferModal() {
	const [isOpen, setIsOpen] = useState(true);
	const [visible, setVisible] = useState(false);

	const close = useCallback(() => {
		setVisible(false);
		window.setTimeout(() => setIsOpen(false), 200);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		const frame = requestAnimationFrame(() => setVisible(true));
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, close]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
				visible ? "bg-black/65 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
			}`}
			role="dialog"
			aria-modal="true"
			aria-label="Promotional offer"
			onClick={close}
			data-testid="promo-offer-backdrop"
		>
			<div
				className={`relative w-full max-w-[420px] overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(71,20,30,0.35)] transition-all duration-300 ${
					visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
				}`}
				onClick={(event) => event.stopPropagation()}
			>
				<button
					type="button"
					onClick={close}
					aria-label="Close offer"
					className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-xl font-light leading-none text-white transition hover:bg-black/55"
				>
					×
				</button>
				<Image
					src="/promotional-image.png"
					alt="Promotional offer"
					width={850}
					height={865}
					priority
					className="block h-auto w-full"
				/>
			</div>
		</div>
	);
}
