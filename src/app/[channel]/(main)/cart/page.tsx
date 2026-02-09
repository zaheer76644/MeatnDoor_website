import Image from "next/image";
import { CheckoutLink } from "./CheckoutLink";
import { DeleteLineButton } from "./DeleteLineButton";
import { QuantityControls } from "./QuantityControls";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { CurrentUserOrderListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { MobileLoginForm } from "@/ui/customcomponents/auth/MobileLoginForm";

export const metadata = {
	title: "Shopping Cart · MeatnDoor",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const { me: user } = await executeGraphQL(CurrentUserOrderListDocument, {
		cache: "no-cache",
	});
	// this is /cart page
	if (!user) {
		// return <LoginForm />;
		return <MobileLoginForm />; // no login then we go to login form
	}
	const params = await props.params;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);

	const checkout = await Checkout.find(checkoutId);

	const visibleLines = checkout?.lines.filter(
		(line) => line.variant?.product?.name !== "Handling Fee",
	);
		if (!checkout || !visibleLines || visibleLines.length < 1) {
		return (
			<section className="mx-auto max-w-7xl p-8">
				<div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
					{/* Empty Cart Icon */}
					<div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg md:h-40 md:w-40">
						<svg className="h-16 w-16 text-gray-400 md:h-20 md:w-20" fill="none" stroke="#ed4264" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
					
					{/* Title */}
					<h1 className="mb-4 text-3xl font-bold text-[#47141e] md:text-4xl">
						Your Shopping Cart is empty
					</h1>
					
					{/* Description */}
					<p className="mb-10 max-w-md text-base text-neutral-600 md:text-lg">
						{`Looks like you haven't added any items to the cart yet. Start shopping to fill it up!`}
					</p>
					
					{/* CTA Button */}
					<LinkWithChannel
						href="/products"
						className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-8 py-4 text-center text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ed4264]/50 sm:px-16"
					>
						{/* Shimmer effect */}
						<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
						{/* Button content */}
						<span className="relative z-10 flex items-center justify-center gap-2">
							<svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							<span>Explore products</span>
						</span>
					</LinkWithChannel>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-7xl p-4 md:p-8">
			<h1 className="mb-8 text-3xl font-bold text-[#47141e] md:text-4xl">Your Shopping Cart</h1>
			<form className="mt-8">
				<div className="space-y-4">
					{checkout.lines
						.filter((item) => item.variant?.product?.name !== "Handling Fee")
						.map((item) => (
							<div
								key={item.id}
								data-testid="CartProductList"
								className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6"
							>
								{/* Product Image */}
								<div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm sm:h-32 sm:w-32">
									{item.variant?.product?.thumbnail?.url && (
										<Image
											src={item.variant.product.thumbnail.url}
											alt={item.variant.product.thumbnail.alt ?? ""}
											width={200}
											height={200}
											className="h-full w-full object-contain object-center transition-transform duration-200 group-hover:scale-105"
										/>
									)}
								</div>
								
								{/* Product Details */}
								<div className="flex flex-1 flex-col justify-between gap-4">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
										<div className="flex-1">
											<LinkWithChannel
												href={getHrefForVariant({
													productSlug: item.variant.product.slug,
													variantId: item.variant.id,
												})}
												className="hover:text-[#ed4264] transition-colors"
											>
												<h2 className="text-lg font-semibold text-gray-900">{item.variant?.product?.name}</h2>
											</LinkWithChannel>
											{item.variant?.product?.category?.name && (
												<p className="mt-1 text-sm text-gray-500">{item.variant.product.category.name}</p>
											)}
											{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
												<p className="mt-1 text-xs text-gray-400">Variant: {item.variant.name}</p>
											)}
										</div>
										<div className="text-right">
											{(() => {
												/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
												const savingAmount = (item.variant as any)?.attributes?.find(
													(attr: any) => attr?.attribute?.name === "Saving Amount",
												)?.values?.[0]?.name;
												console.log('savingAmount', savingAmount)
												const originalPrice = parseFloat(String(savingAmount));
												const regularPriceAmount = item.undiscountedUnitPrice.amount
												const regularPrice = item.undiscountedUnitPrice
													? formatMoney(
															item.undiscountedUnitPrice.amount * item.quantity,
															item.undiscountedUnitPrice.currency,
														)
													: formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency);
													let discountPercent = "";
													if (savingAmount && originalPrice) {
														discountPercent = (
															((originalPrice - regularPriceAmount) / originalPrice) * 100
														).toFixed(0);
													}
													if (savingAmount) {
														/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
														return (
															<>
															<p className="text-lg font-bold text-[#47141e]">{regularPrice}</p>
															<p className="text-sm text-[#707070] line-through decoration-1">
																{formatMoney(originalPrice * item.quantity, item.totalPrice.gross.currency)}
															</p>
															<p className="text-sm text-[#ed4264] font-bold mt-2">
																({discountPercent}% off)
															</p>
														</>
													);
												}

												return <p className="text-lg font-bold text-[#47141e]">{regularPrice}</p>;
											})()}
										</div>
									</div>
									
									{/* Controls */}
									<div className="flex items-center justify-between gap-4">
										<QuantityControls
											lineId={item.id}
											quantity={item.quantity}
											channel={params.channel}
											variantId={item.variant.id}
										/>
										<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
									</div>
								</div>
							</div>
						))}
				</div>

				{/* Summary Section */}
				<div className="mt-8 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg md:mt-12">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex-1">
							<p className="text-xl font-bold text-gray-900">Your Total</p>
							<p className="mt-1 text-sm text-gray-500">Shipping will be calculated in the next step</p>
							
							{/* Free Delivery Badge */}
							<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 shadow-md">
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
									<svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
									</svg>
								</div>
								<span className="text-sm font-bold text-white">Free Delivery on order above ₹499</span>
							</div>
						</div>
						<div className="text-2xl font-bold text-[#ed4264]">
							{formatMoney(
								visibleLines.reduce((acc, line) => {
									if (line.undiscountedUnitPrice) {
										// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
										return acc + ((line.undiscountedUnitPrice.amount ) * line.quantity);
									}
									return acc + line.totalPrice.gross.amount;
								}, 0),
								checkout.totalPrice.gross.currency,
							)}
						</div>
					</div>
				</div>
				
				{/* Checkout Button */}
				<div className="mt-8 text-center">
					<CheckoutLink
						checkoutId={checkoutId}
						disabled={!checkout.lines.length}
						className="w-full sm:w-auto sm:min-w-[200px]"
					/>
				</div>
			</form>
		</section>
	);
}
