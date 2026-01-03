"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { FaShoppingCart } from "react-icons/fa";

import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { addToCart, updateCartItem } from "@/app/actions";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

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
		startTransition(async () => {
			await updateCartItem(cartItem.lineId, product.variants![0].id, cartItem.quantity + 1, params.channel);
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

	// console.log("Product prop:", product); // ✅ logs on every render

	return (
		<li data-testid="ProductElement" className="bg-white shadow-2xl" style={{borderRadius:16}}>
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div className="h-[260px]" style={{background:'#F6F6F6', borderTopLeftRadius:16,borderTopRightRadius:16, filter: product?.variants?.[0]?.quantityAvailable === 0 ? 'grayscale(100%)' : 'null'}}>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={80}
							height={80}
							priority={priority}
						/>
					)}
				</div>
			</LinkWithChannel>
			<div className="h-38 px-4 py-2">
				<div className="items-center justify-center ">
					{/* <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-neutral-900"> */}
					<h3 className="mt-1 whitespace-normal break-words text-sm font-semibold text-neutral-900">
						{product.name}
					</h3>
					<div className="mt-1">
						<p className="text-sm">
							Net:{" "}
							{
								product?.variants?.[0]?.attributes?.find((a) => a.attribute?.slug === "net-weight")
									?.values?.[0]?.name
							}
						</p>
						<p className="text-sm">
							Serves:
							{product?.attributes?.find((a) => a.attribute?.slug === "serves-for")?.values?.[0]?.name}
						</p>
						{/* <p className="text-sm">
							{product?.attributes?.find((a) => a.attribute?.slug === "number-of-pieces")?.values?.[0]?.name}{" "}
							pieces
						</p> */}
						{product?.attributes?.find((a) => a.attribute?.slug === "number-of-pieces")?.values?.[0]
							?.name && (
							<>
								<p className="text-sm">
									{
										product.attributes.find((a) => a.attribute?.slug === "number-of-pieces")?.values?.[0]
											?.name
									}{" "}
									pieces
								</p>
							</>
						)}

						<p className="mt-1 hidden text-sm text-neutral-500" data-testid="ProductElement_Category">
							{product.category?.name}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<p
						className="mr-1 mt-1 text-l font-bold text-neutral-900"
						data-testid="ProductElement_PriceRange"
					>
						{formatMoneyRange({
							start: product?.pricing?.priceRange?.start?.gross,
							stop: product?.pricing?.priceRange?.stop?.gross,
						})}
					</p>
					{product?.variants?.[0]?.quantityAvailable === 0 ?
					<p className="text-sm font-bold" style={{color:'#ed2464'}}>No Stock Available</p>
					:
					<div className="center mt-2 flex justify-end pb-2">
						{cartItem ? (
							<div className="flex items-center gap-2 rounded-md bg-[#ed4264]">
								<button
									onClick={handleDecrease}
									disabled={isPending}
									className="flex h-8 w-8 items-center justify-center text-white hover:bg-[#47141e] disabled:opacity-50"
								>
									-
								</button>
								<span className="w-4 text-center text-sm font-medium text-white">
									{isPending ? <ClipLoader size={12} /> : cartItem.quantity}
								</span>
								<button
									onClick={handleIncrease}
									disabled={isPending}
									className="flex h-8 w-8 items-center justify-center text-white  hover:bg-[#47141e] disabled:opacity-50"
								>
									+
								</button>
							</div>
						) : (
							// per product add to cart button
							<button
								onClick={handleAddToCart}
								disabled={isPending}
								className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
							>
								{isPending ? (
									<ClipLoader size={12} />
								) : (
									<div className="flex items-center justify-between rounded-md border border-[#ed2464] px-4 py-1 hover:bg-[#ffdfe9]">
										<FaShoppingCart size={14} color="#ed2464" />
										<span className="ml-1 text-[#ed4264]">ADD</span>
									</div>
								)}
							</button>
						)}
					</div>}
				</div>
			</div>
			{/* </div> */}
			{/* </LinkWithChannel> */}
		</li>
	);
}
