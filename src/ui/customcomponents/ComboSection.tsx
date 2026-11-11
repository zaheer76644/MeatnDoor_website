"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { addComboToCart } from "@/app/actions";
import { formatMoney } from "@/lib/utils";

export interface ComboProductItem {
	id: string;
	quantity: number;
	variant: {
		id: string;
		name: string;
		product: {
			id: string;
			name: string;
			slug: string;
			thumbnail: { url: string; alt: string | null } | null;
		};
	};
}

export interface ComboProduct {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	image: { url: string; alt: string | null } | null;
	imageAlt: string | null;
	isAvailableForPurchase: boolean;
	pricing: {
		price: { amount: number; currency: string };
		undiscountedPrice: { amount: number };
		savings: { amount: number };
	} | null;
	items: ComboProductItem[];
}

export function ComboSection({ combos }: { combos: ComboProduct[] }) {
	const { channel } = useParams<{ channel?: string }>();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [pendingComboId, setPendingComboId] = useState<string | null>(null);
	const [selectedCombo, setSelectedCombo] = useState<ComboProduct | null>(null);

	useEffect(() => {
		if (!selectedCombo) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedCombo(null);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [selectedCombo]);

	if (!combos.length) {
		return null;
	}

	const handleAddCombo = (combo: ComboProduct) => {
		setPendingComboId(combo.id);
		startTransition(async () => {
			try {
				await addComboToCart(combo.id, channel ?? "in");
				toast.success(`${combo.name} added to cart`);
				router.refresh();
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Could not add this combo to your cart.");
			} finally {
				setPendingComboId(null);
			}
		});
	};

	return (
		<section className="container mx-auto my-10 w-full px-5 md:px-0">
			<div className="mb-6 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-2xl font-bold text-[#47141e]">Combo Offers</h2>
					<p className="mt-1 text-sm text-neutral-600">Buy together and save more on every combo.</p>
				</div>
			</div>

			<ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
				{combos.map((combo) => {
					const price = combo.pricing?.price;
					const undiscountedPrice = combo.pricing?.undiscountedPrice;
					const savings = combo.pricing?.savings?.amount ?? 0;
					const isThisPending = isPending && pendingComboId === combo.id;
					const isAvailable = combo.isAvailableForPurchase && !!price;

					return (
						<li
							key={combo.id}
							className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
						>
							<button
								type="button"
								onClick={() => setSelectedCombo(combo)}
								aria-label={`View details for ${combo.name}`}
								className="relative block h-40 w-full overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 sm:h-48"
							>
								{combo.image?.url ? (
									<Image
										src={combo.image.url}
										alt={combo.image.alt || combo.imageAlt || combo.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
										className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#ed4264]/30">
										{combo.name.slice(0, 2).toUpperCase()}
									</div>
								)}

								<span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-black/55 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-transform duration-300 group-hover:translate-y-0">
									View details
								</span>

								<span className="pointer-events-none absolute left-2 top-2 rounded-full bg-[#47141e] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow">
									Combo
								</span>

								{savings > 0 && (
									<span className="pointer-events-none absolute right-2 top-2 rounded-full bg-green-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
										Save {formatMoney(savings, price?.currency ?? "INR")}
									</span>
								)}
							</button>

							<div className="flex flex-1 flex-col p-4">
								<h3 className="line-clamp-2 min-h-[2.5rem] text-base font-bold text-neutral-900 transition-colors group-hover:text-[#ed4264]">
									{combo.name}
								</h3>

								<ul className="mt-3 space-y-1.5">
									{combo.items.map((item) => (
										<li
											key={item.id}
											className="flex items-start gap-2 text-xs text-neutral-600"
										>
											<svg
												className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											<span className="line-clamp-1">
												{item.variant.product.name}
												{item.quantity > 1 ? ` × ${item.quantity}` : ""}
												{item.variant.name ? ` · ${item.variant.name}` : ""}
											</span>
										</li>
									))}
								</ul>

								<div className="mt-auto flex items-end justify-between gap-3 pt-4">
									<div>
										{price ? (
											<>
												<div className="flex items-baseline gap-2">
													<span className="text-xl font-bold text-[#ed4264]">
														{formatMoney(price.amount, price.currency)}
													</span>
													{undiscountedPrice &&
														undiscountedPrice.amount > price.amount && (
															<span className="text-sm font-medium text-neutral-400 line-through">
																{formatMoney(
																	undiscountedPrice.amount,
																	price.currency,
																)}
															</span>
														)}
												</div>
												<p className="text-[11px] font-semibold text-green-600">
													Combo price for you
												</p>
											</>
										) : (
											<p className="text-sm font-semibold text-neutral-500">
												Price unavailable
											</p>
										)}
									</div>

									{isAvailable ? (
										<button
											type="button"
											onClick={() => handleAddCombo(combo)}
											disabled={isThisPending}
											className="group/btn flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
										>
											{isThisPending ? (
												<ClipLoader size={14} color="#ffffff" />
											) : (
												<>
													<svg
														className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
														/>
													</svg>
													<span>Add</span>
												</>
											)}
										</button>
									) : (
										<span className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-[#ed4264]">
											Unavailable
										</span>
									)}
								</div>
							</div>
						</li>
					);
				})}
			</ul>

			{selectedCombo && (
				<div
					className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
					role="presentation"
					onClick={() => setSelectedCombo(null)}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="combo-detail-title"
						className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
						onClick={(event) => event.stopPropagation()}
					>
						<button
							type="button"
							onClick={() => setSelectedCombo(null)}
							aria-label="Close combo details"
							className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md transition hover:bg-white"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						<div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 sm:h-64">
							{selectedCombo.image?.url ? (
								<Image
									src={selectedCombo.image.url}
									alt={selectedCombo.image.alt || selectedCombo.imageAlt || selectedCombo.name}
									fill
									sizes="(max-width: 640px) 100vw, 512px"
									className="object-contain p-4"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-5xl font-bold text-[#ed4264]/25">
									{selectedCombo.name.slice(0, 2).toUpperCase()}
								</div>
							)}
						</div>

						<div className="p-5 sm:p-6">
							<h3 id="combo-detail-title" className="pr-10 text-xl font-bold text-[#47141e]">
								{selectedCombo.name}
							</h3>

							{selectedCombo.description && (
								<p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
									{selectedCombo.description}
								</p>
							)}

							<h4 className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
								What&apos;s inside
							</h4>
							<ul className="mt-2 space-y-1.5">
								{selectedCombo.items.map((item) => (
									<li key={item.id} className="flex items-start gap-2 text-sm text-neutral-700">
										<svg
											className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2.5}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>
											{item.variant.product.name}
											{item.quantity > 1 ? ` × ${item.quantity}` : ""}
											{item.variant.name ? ` · ${item.variant.name}` : ""}
										</span>
									</li>
								))}
							</ul>

							<div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
								<div>
									{selectedCombo.pricing?.price ? (
										<>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold text-[#ed4264]">
													{formatMoney(
														selectedCombo.pricing.price.amount,
														selectedCombo.pricing.price.currency,
													)}
												</span>
												{selectedCombo.pricing.undiscountedPrice.amount >
													selectedCombo.pricing.price.amount && (
														<span className="text-sm font-medium text-neutral-400 line-through">
															{formatMoney(
																selectedCombo.pricing.undiscountedPrice.amount,
																selectedCombo.pricing.price.currency,
															)}
														</span>
													)}
											</div>
											<p className="text-[11px] font-semibold text-green-600">
												You save{" "}
												{formatMoney(
													selectedCombo.pricing.savings.amount,
													selectedCombo.pricing.price.currency,
												)}
											</p>
										</>
									) : (
										<p className="text-sm font-semibold text-neutral-500">Price unavailable</p>
									)}
								</div>

								{selectedCombo.isAvailableForPurchase && selectedCombo.pricing?.price ? (
									<button
										type="button"
										onClick={() => handleAddCombo(selectedCombo)}
										disabled={isPending && pendingComboId === selectedCombo.id}
										className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
									>
										{isPending && pendingComboId === selectedCombo.id ? (
											<ClipLoader size={14} color="#ffffff" />
										) : (
											<span>Add to cart</span>
										)}
									</button>
								) : (
									<span className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-[#ed4264]">
										Unavailable
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
