"use client";

import { useCallback, useEffect, useState } from "react";

const WHATSAPP_URL = "https://wa.me/919152941410?text=Hi+Saving";

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
			aria-labelledby="promo-offer-title"
			onClick={close}
			data-testid="promo-offer-backdrop"
		>
			<div
				className={`relative w-full max-w-[420px] overflow-hidden rounded-3xl bg-[#fff8f9] text-center shadow-[0_24px_80px_rgba(71,20,30,0.35)] transition-all duration-300 ${
					visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
				}`}
				onClick={(event) => event.stopPropagation()}
			>
				{/* Top brand panel */}
				<div className="relative overflow-hidden bg-gradient-to-br from-[#47141e] via-[#6b2234] to-[#ed4264] px-6 pb-10 pt-8 text-white">
					{/* Decorative shapes */}
					<div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
					<div className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-[#ed4264]/30" />
					<div className="pointer-events-none absolute right-8 top-16 h-16 w-16 rotate-12 rounded-2xl bg-white/10" />

					<button
						type="button"
						onClick={close}
						aria-label="Close offer"
						className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl font-light leading-none text-white transition hover:bg-white/25"
					>
						×
					</button>

					<div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
						<svg
							className="h-8 w-8 text-amber-200"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.75}
								d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
							/>
						</svg>
					</div>

					<p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
						Limited time offer
					</p>
					<h2
						id="promo-offer-title"
						className="relative mx-auto mt-3 max-w-[16ch] text-3xl font-extrabold leading-tight tracking-tight"
					>
						Unlock your special discount
					</h2>
					<p className="relative mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/80">
						Message us on WhatsApp with <span className="font-semibold text-white">Hi Saving</span> and
						grab your exclusive deal.
					</p>
				</div>

				{/* Bottom action panel */}
				<div className="relative -mt-5 px-6 pb-7 pt-1">
					<div className="rounded-2xl border border-[rgba(71,20,30,0.08)] bg-white px-5 py-5 shadow-sm">
						<div className="mb-4 flex items-center justify-center gap-2 text-xs font-medium text-[#8a6b73]">
						</div>

						<a
							href={WHATSAPP_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] transition hover:bg-[#1ebe5a] hover:shadow-[0_12px_28px_rgba(37,211,102,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
						>
							<span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
							<svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
							</svg>
							<span className="relative">Claim on WhatsApp</span>
						</a>

						<button
							type="button"
							onClick={close}
							className="mt-3 w-full py-2 text-sm font-medium text-[#8a6b73] transition hover:text-[#47141e]"
						>
							Maybe later
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
