import { type FC, type MouseEvent } from "react";
import {
	type CheapProduct,
	getCheapProductSavingAmount,
	getCheapProductWeight,
} from "@/checkout/sections/Summary/couponUtils";
import { useCheapProductToggle } from "@/checkout/sections/Summary/useCheapProductToggle";

interface CheapProductsRailProps {
	products: CheapProduct[];
	thumbnails: Record<string, string>;
}

export const CheapProductsRail: FC<CheapProductsRailProps> = ({ products, thumbnails }) => {
	const { increment, decrement, getQuantity, loadingVariantId } = useCheapProductToggle();

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="my-4">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-[#ed4264]" />
					<p className="text-sm font-bold text-[#47141e]">Deal starting at ₹1</p>
				</div>
				<p className="text-[11px] font-medium text-gray-500">Tap to add</p>
			</div>

			<div className="-mx-1 flex gap-3 overflow-x-auto pb-1">
				{products.map((product) => {
					const variant = product.variants?.[0];
					if (!variant) {
						return null;
					}

					const quantity = getQuantity(variant.id);
					const inCart = quantity > 0;
					const isLoading = loadingVariantId === variant.id;
					const price = variant.discountedPrice ?? variant.price;
					const savingAmount = getCheapProductSavingAmount(product);
					const hasSaving = savingAmount != null && savingAmount > price;
					const offPercent = hasSaving
						? Math.round(((savingAmount - price) / savingAmount) * 100)
						: 0;
					const weightOrQty = getCheapProductWeight(product);
					const thumbnailUrl = thumbnails[product.id];

					const stopAnd = (handler: () => void) => (event: MouseEvent) => {
						event.stopPropagation();
						handler();
					};

					return (
						<div
							key={product.id}
							className={`w-36 shrink-0 rounded-xl border p-2 text-left transition hover:shadow-md ${
								inCart
									? "border-green-300 bg-green-50"
									: "border-gray-200 bg-white hover:border-[#ed4264]/30"
							} ${isLoading ? "opacity-70" : ""}`}
						>
							<div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#faf3f4]">
								{thumbnailUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={thumbnailUrl}
										alt={product.name}
										className="h-[85%] w-[85%] object-contain"
										loading="lazy"
									/>
								) : (
									<svg
										className="h-8 w-8 text-gray-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										/>
									</svg>
								)}

								{inCart ? (
									<div className="absolute bottom-1 right-1 flex items-center overflow-hidden rounded-lg bg-[#ed4264] text-white shadow-sm">
										<button
											type="button"
											aria-label="Decrease quantity"
											disabled={isLoading}
											onClick={stopAnd(() => void decrement(product))}
											className="flex h-7 w-7 items-center justify-center text-sm font-bold disabled:opacity-50"
										>
											−
										</button>
										<span className="min-w-[1.25rem] text-center text-xs font-bold">
											{isLoading ? (
												<span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
											) : (
												quantity
											)}
										</span>
										<button
											type="button"
											aria-label="Increase quantity"
											disabled={isLoading}
											onClick={stopAnd(() => void increment(product))}
											className="flex h-7 w-7 items-center justify-center text-sm font-bold disabled:opacity-50"
										>
											+
										</button>
									</div>
								) : (
									<button
										type="button"
										aria-label={`Add ${product.name}`}
										disabled={isLoading}
										onClick={() => void increment(product)}
										className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-tl-xl border border-[#ed4264] bg-white text-[#ed4264] disabled:opacity-50"
									>
										{isLoading ? (
											<span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
										) : (
											<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M12 4v16m8-8H4"
												/>
											</svg>
										)}
									</button>
								)}
							</div>

							<p className="truncate text-xs font-semibold text-[#47141e]">{product.name}</p>
							{weightOrQty && (
								<p className="truncate text-[11px] text-gray-500">Net: {weightOrQty}</p>
							)}
							<div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
								<p className="text-sm font-bold text-[#ed4264]">₹{price}</p>
								{hasSaving && (
									<p className="text-[11px] font-medium text-gray-400 line-through">₹{savingAmount}</p>
								)}
								{offPercent > 0 && (
									<span className="text-[10px] font-semibold text-green-600">{offPercent}% OFF</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
