import { type FC } from "react";
import {
	type CheapProduct,
	getCheapProductWeight,
} from "@/checkout/sections/Summary/couponUtils";
import { useCheapProductToggle } from "@/checkout/sections/Summary/useCheapProductToggle";

interface CheapProductsRailProps {
	products: CheapProduct[];
	thumbnails: Record<string, string>;
}

export const CheapProductsRail: FC<CheapProductsRailProps> = ({ products, thumbnails }) => {
	const { toggleProduct, loadingVariantId, isInCart } = useCheapProductToggle();

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="my-4">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-[#ed4264]" />
					<p className="text-sm font-bold text-[#47141e]">Add-ons under budget</p>
				</div>
				<p className="text-[11px] font-medium text-gray-500">Tap to add</p>
			</div>

			<div className="-mx-1 flex gap-3 overflow-x-auto pb-1">
				{products.map((product) => {
					const variant = product.variants?.[0];
					if (!variant) {
						return null;
					}

					const inCart = isInCart(variant.id);
					const isLoading = loadingVariantId === variant.id;
					const price = variant.discountedPrice ?? variant.price;
					const weightOrQty = getCheapProductWeight(product);
					const thumbnailUrl = thumbnails[product.id];

					return (
						<button
							key={product.id}
							type="button"
							onClick={() => void toggleProduct(product)}
							disabled={isLoading}
							className={`w-36 shrink-0 rounded-xl border p-2 text-left transition hover:shadow-md disabled:opacity-70 ${
								inCart
									? "border-green-300 bg-green-50"
									: "border-gray-200 bg-white hover:border-[#ed4264]/30"
							}`}
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

								<span
									className={`absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-tl-xl border bg-white ${
										inCart ? "border-green-500 text-green-600" : "border-[#ed4264] text-[#ed4264]"
									}`}
								>
									{isLoading ? (
										<span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
									) : inCart ? (
										<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
										</svg>
									) : (
										<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
										</svg>
									)}
								</span>
							</div>

							<p className="truncate text-xs font-semibold text-[#47141e]">{product.name}</p>
							{weightOrQty && (
								<p className="truncate text-[11px] text-gray-500">Net: {weightOrQty}</p>
							)}
							<p className="mt-1 text-sm font-bold text-[#ed4264]">₹{price}</p>
						</button>
					);
				})}
			</div>
		</div>
	);
};
