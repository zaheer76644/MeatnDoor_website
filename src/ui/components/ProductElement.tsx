"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { addToCart, updateCartItem } from "@/app/actions";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";

type ProductVariant = NonNullable<ProductListItemFragment["variants"]>[number];

export function ProductElement({
	product,
	loading,
	priority,
	cartItem,
}: { product: ProductListItemFragment } & {
	loading: "eager" | "lazy";
	priority?: boolean;
	cartItem?: { lineId: string; quantity: number };
}) {
	const params = useParams<{ channel: string }>();
	const [isPending, startTransition] = useTransition();
	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!product.variants?.[0]?.id) return;
		// const variant = product.variants?.[0];
		startTransition(async () => {
			try {
				await addToCart(product.variants![0].id, params.channel);
			} catch (error) {
				alert("item not available");
			}
		});
	};
	const handleIncrease = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!cartItem || !product.variants?.[0]?.id) return;
		
		const variant = product.variants[0];
		const quantityAvailable = variant?.quantityAvailable ?? 0;
		
		// Get max-buy-limit from variant attributes
		const maxBuyLimitAttr = variant?.attributes?.find(
			(attr) => attr?.attribute?.slug === "max-buy-limit" || attr?.attribute?.name === "Max Buy Limit"
		);
		const maxBuyLimit = maxBuyLimitAttr?.values?.[0]?.name 
			? parseInt(maxBuyLimitAttr.values[0].name, 10) 
			: null;
		
		// Calculate maximum allowed quantity (minimum of quantityAvailable and maxBuyLimit)
		const maxAllowedQuantity = maxBuyLimit !== null 
			? Math.min(quantityAvailable, maxBuyLimit) 
			: quantityAvailable;
		
		const newQuantity = cartItem.quantity + 1;
		
		if (newQuantity > maxAllowedQuantity) {
			if (maxBuyLimit !== null && maxBuyLimit < quantityAvailable) {
				toast.warning(`Maximum purchase limit is ${maxBuyLimit} items`);
			} else {
				toast.warning(`We only have ${quantityAvailable} quantity at the moment`);
			}
			return;
		}
		
		startTransition(async () => {
			await updateCartItem(cartItem.lineId, product.variants![0].id, newQuantity, params.channel);
		});
	};

	const handleDecrease = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!cartItem || !product.variants?.[0]?.id) return;
		startTransition(async () => {
			await updateCartItem(cartItem.lineId, product.variants![0].id, cartItem.quantity - 1, params.channel);
		});
	};

	return (
		<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
		<li
			data-testid="ProductElement"
			className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
		>
			{/* Discount Badge */}
			{product?.variants?.map((variant: ProductVariant, i: number) => {
				const saving = variant?.attributes?.find(
					(attr) => attr?.attribute?.name === "Saving Amount"
				)?.values?.[0]?.name;

				if (!saving) return null;

				const originalPrice = parseFloat(String(saving));
				const discountedPrice = parseFloat(
					String(variant.pricing?.price?.gross?.amount || "0")
				);
				const discountPercent = (
					((originalPrice - discountedPrice) / originalPrice) * 100
				).toFixed(0);

				return (
					<div
						key={i}
						className="absolute left-2 top-2 z-10 flex"
					>
						<Image
							src="/special-offer.png"
							alt="discount"
							width={60}
							height={60}
							className="drop-shadow-[0_12px_25px_rgba(0,0,0,0.35)]"
							style={{ position: "relative", zIndex: 1 }}
						/>
						<div
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								color: "white",
								fontWeight: "bold",
								fontSize: 10,
								textAlign: "center",
								lineHeight: 1.2,
								letterSpacing: "0.5px",
								fontFamily: "sans-serif",
								zIndex: 2,
								pointerEvents: "none",
							}}
						>
							{discountPercent}%<br />Off
						</div>
					</div>
				);
			})}
			{/* Best Seller Badge */}
			{product?.collections?.[0] && (
				<div className="absolute right-2 top-2 z-10">
					<Image
						src="/best-seller-icon.png"
						alt="best seller"
						width={60}
						height={60}
						className="drop-shadow-lg"
					/>
				</div>
			)}
			{/* <LinkWithChannel href={`/products/${product.slug}`} key={product.id}> */}
				<div
					className={`relative h-[260px] overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 transition-transform duration-300 group-hover:scale-105 ${
						product?.variants?.[0]?.quantityAvailable === 0 ? "grayscale" : ""
					}`}
				>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={1440}
							height={1440}
							priority={priority}
							style={{ height: '260px' }}
						/>
					)}
					{/* Overlay on hover */}
					<div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5"></div>
				</div>
			{/* </LinkWithChannel> */}
			<div className="p-4">
				<div className="space-y-2">
					{/* Product Name */}
					<h3 className="line-clamp-2 min-h-[2.5rem] text-base font-bold text-neutral-900 transition-colors group-hover:text-[#ed4264]">
						{product.name}
					</h3>
					
					{/* Product Details */}
					<div className="space-y-1 text-xs text-neutral-600">
						{product?.variants?.[0]?.attributes?.find((a) => a.attribute?.slug === "net-weight")
							?.values?.[0]?.name && (
							<div className="flex items-center gap-1">
								<span className="font-medium">Net:</span>
								<span>
									{
										product?.variants?.[0]?.attributes?.find(
											(a) => a.attribute?.slug === "net-weight"
										)?.values?.[0]?.name
									}
								</span>
							</div>
						)}
						<div className="flex items-center gap-5">
						{product?.attributes?.find((a) => a.attribute?.slug === "serves-for")?.values?.[0]
							?.name && (
							<div className="flex items-center gap-1">
								<span className="font-medium">Serves:</span>
								<span>
									{
										product?.attributes?.find((a) => a.attribute?.slug === "serves-for")
											?.values?.[0]?.name
									}
								</span>
							</div>
						)}
						{product?.attributes?.find((a) => a.attribute?.slug === "number-of-pieces")?.values?.[0]
							?.name && (
							<div className="flex items-center gap-1">
								<span className="font-medium">
									{
										product.attributes.find((a) => a.attribute?.slug === "number-of-pieces")?.values?.[0]
											?.name
									}
								</span>
								<span>pieces</span>
							</div>
						)}
						</div>
					</div>
				</div>
				<div className={`mt-4 flex items-end justify-between ${product?.variants?.[0]?.quantityAvailable === 0 ? 'mt-6' : ''}`}>
					{/* Price Section */}
					<div className="flex-1">
						{product?.variants?.map((variant: ProductVariant, i: number) => {
							const saving = variant?.attributes?.find(
								(attr) => attr?.attribute?.name === "Saving Amount"
							)?.values?.[0]?.name;

							const discountedPrice = parseFloat(
								String(variant?.pricing?.price?.gross?.amount || "0")
							);

							return saving ? (
								<div key={i} className="space-y-1">
									<div className="flex items-baseline gap-2">
										<span className="text-2xl font-bold text-[#ed4264]">₹{discountedPrice}</span>
										<span className="text-sm font-medium text-neutral-400 line-through">₹{saving}</span>
									</div>
									<p className="text-xs font-semibold text-green-600">Special Price for you</p>
								</div>
							) : (
								<div key={i} className="space-y-1">
									<p
										className="text-2xl font-bold text-[#ed4264]"
										data-testid="ProductElement_PriceRange"
									>
										₹{discountedPrice}
									</p>
								</div>
							);
						})}
					</div>
					{/* Action Section */}
					{product?.variants?.[0]?.quantityAvailable === 0 ? (
						<div className="rounded-lg bg-red-50 px-3 py-2">
							<p className="text-xs font-bold text-[#ed4264]">Out of Stock</p>
						</div>
					) : (
						<div className="flex items-center">
							{cartItem ? (
								<div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] p-1 shadow-md">
									<button
										onClick={handleDecrease}
										disabled={isPending}
										className="flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-[#47141e]/20 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<svg className="h-4 w-4" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
										</svg>
									</button>
									<span className="min-w-[2rem] text-center text-sm font-bold text-white">
										{isPending ? <ClipLoader size={12} color="#ffffff" /> : cartItem.quantity}
									</span>
									<button
										onClick={handleIncrease}
										disabled={isPending}
										className="flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-[#47141e]/20 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<svg className="h-4 w-4" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
										</svg>
									</button>
								</div>
							) : (
								<button
									onClick={handleAddToCart}
									disabled={isPending}
									className="group/btn flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-4 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isPending ? (
										<ClipLoader size={14} color="#ffffff" />
									) : (
										<>
											<svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
											</svg>
											<span>Add</span>
										</>
									)}
								</button>
							)}
						</div>
					)}
				</div>
			</div>
			{/* </div> */}
			{/* </LinkWithChannel> */}
		</li>
		</LinkWithChannel>
	);
}
