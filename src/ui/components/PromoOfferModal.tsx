"use client";

import { useCallback, useEffect, useState } from "react";

const WHATSAPP_URL = "https://wa.me/919152941410?text=Hi+Saving";

export function PromoOfferModal() {
	const [isOpen, setIsOpen] = useState(true);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
		};
	}, [isOpen, close]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="promo-offer-title"
			onClick={close}
			data-testid="promo-offer-backdrop"
		>
			<div
				className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-center shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<button
					type="button"
					onClick={close}
					aria-label="Close offer"
					className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-lg font-bold leading-none text-neutral-700 transition hover:bg-black/20"
				>
					×
				</button>

				<div className="bg-[#47141e] px-6 py-8 text-white">
					<p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
						Special Offer
					</p>
					<h2 id="promo-offer-title" className="mt-2 text-2xl font-bold leading-snug">
						Claim your special discount today!
					</h2>
				</div>

				<div className="px-6 py-6">
					<p className="text-base text-neutral-700">
						Say Hi Saving, on our Whatsapp.
					</p>
					<a
						href={WHATSAPP_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#1da851] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
					>
						Claim
					</a>
				</div>
			</div>
		</div>
	);
}
