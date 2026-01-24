import edjsHTML from "editorjs-html";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import xss from "xss";
import { type WithContext, type Product } from "schema-dts";
import Image from "next/image";
import { AddButton } from "./AddButton";
import { VariantSelector } from "@/ui/components/VariantSelector";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { executeGraphQL } from "@/lib/graphql";
import { formatMoney, formatMoneyRange } from "@/lib/utils";
import { ProductDetailsDocument, ProductListDocument, ProductListPaginatedDocument, type VariantDetailsFragment } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";
import { AvailabilityMessage } from "@/ui/components/AvailabilityMessage";
import { ProductList } from "@/ui/components/ProductList";

export async function generateMetadata(
	props: {
		params: Promise<{ slug: string; channel: string }>;
		searchParams: Promise<{ variant?: string }>;
	},
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const productNameAndVariant = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${product.name} | ${product.seoTitle || (await parent).title?.absolute}`,
		description: product.seoDescription || productNameAndVariant,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
		openGraph: product.thumbnail
			? {
					images: [
						{
							url: product.thumbnail.url,
							alt: product.name,
						},
					],
				}
			: null,
	};
}

export async function generateStaticParams({ params }: { params: { channel: string } }) {
	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 60,
		variables: { first: 20, channel: params.channel },
		withAuth: false,
	});

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

const parser = edjsHTML();

export default async function Page(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const firstImage = product.thumbnail;
	const description = product?.description ? parser.parse(JSON.parse(product?.description)) : null;

	const variants = product.variants as VariantDetailsFragment[] | undefined;
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID) ;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout = await Checkout.find(checkoutId);
	const isAvailable = variants?.some((variant) => variant.quantityAvailable) ?? false;

	// Get saving amount and discounted price from selected variant
	const savingAmount = selectedVariant?.attributes?.find(
		(attr) => attr?.attribute?.name === "Saving Amount"
	)?.values?.[0]?.name;

	const discountedPrice = selectedVariant?.pricing?.price?.gross
		? {
				amount: selectedVariant.pricing.price.gross.amount,
				currency: selectedVariant.pricing.price.gross.currency,
			}
		: null;

	// Extract product details - try variant first, then product attributes, then first variant as fallback
	const netWeight = selectedVariant?.attributes?.find(
		(attr) => attr?.attribute?.slug === "net-weight"
	)?.values?.[0]?.name 
		|| product?.attributes?.find(
			(attr) => attr?.attribute?.slug === "net-weight"
		)?.values?.[0]?.name
		|| variants?.[0]?.attributes?.find(
			(attr) => attr?.attribute?.slug === "net-weight"
		)?.values?.[0]?.name;

	const servesFor = product?.attributes?.find(
		(attr) => attr?.attribute?.slug === "serves-for"
	)?.values?.[0]?.name
		|| selectedVariant?.attributes?.find(
			(attr) => attr?.attribute?.slug === "serves-for"
		)?.values?.[0]?.name
		|| variants?.[0]?.attributes?.find(
			(attr) => attr?.attribute?.slug === "serves-for"
		)?.values?.[0]?.name;

	const numberOfPieces = product?.attributes?.find(
		(attr) => attr?.attribute?.slug === "number-of-pieces"
	)?.values?.[0]?.name
		|| selectedVariant?.attributes?.find(
			(attr) => attr?.attribute?.slug === "number-of-pieces"
		)?.values?.[0]?.name
		|| variants?.[0]?.attributes?.find(
			(attr) => attr?.attribute?.slug === "number-of-pieces"
		)?.values?.[0]?.name;

	// Calculate discount percentage
	const discountPercent = savingAmount && discountedPrice
		? (((parseFloat(savingAmount) - discountedPrice.amount) / parseFloat(savingAmount)) * 100).toFixed(0)
		: null;

	// Always show price, even for out-of-stock products
	const price = discountedPrice
		? formatMoney(discountedPrice.amount, discountedPrice.currency)
		: product?.pricing?.priceRange?.start?.gross && product?.pricing?.priceRange?.stop?.gross
			? formatMoneyRange({
					start: product.pricing.priceRange.start.gross,
					stop: product.pricing.priceRange.stop.gross,
				})
			: "";

	// Fetch similar products from the same category (excluding current product)
	const similarProducts = product?.category?.id
		? await executeGraphQL(ProductListPaginatedDocument, {
				variables: {
					first: 8,
					channel: params.channel,
					filter: {
						categories: [product.category.id],
					},
				},
				revalidate: 60,
			})
		: null;

	// Filter out current product and get cart items for similar products
	const filteredSimilarProducts = similarProducts?.products?.edges
		?.map((e) => e.node)
		.filter((p) => p.id !== product.id)
		.slice(0, 4) || [];

	const similarProductsCartItems =
		checkout?.lines.reduce(
			(acc, line) => {
				if (line.variant?.id) {
					acc[line.variant.id] = {
						lineId: line.id,
						quantity: line.quantity,
					};
				}
				return acc;
			},
			{} as Record<string, { lineId: string; quantity: number }>,
		) || {};

	const productJsonLd: WithContext<Product> = {
		"@context": "https://schema.org",
		"@type": "Product",
		image: product.thumbnail?.url,
		...(selectedVariant
			? {
					name: `${product.name} - ${selectedVariant.name}`,
					description: product.seoDescription || `${product.name} - ${selectedVariant.name}`,
					offers: {
						"@type": "Offer",
						availability: selectedVariant.quantityAvailable
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: selectedVariant.pricing?.price?.gross.currency,
						price: selectedVariant.pricing?.price?.gross.amount,
					},
				}
			: {
					name: product.name,

					description: product.seoDescription || product.name,
					offers: {
						"@type": "AggregateOffer",
						availability: product.variants?.some((variant) => variant.quantityAvailable)
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: product.pricing?.priceRange?.start?.gross.currency,
						lowPrice: product.pricing?.priceRange?.start?.gross.amount,
						highPrice: product.pricing?.priceRange?.stop?.gross.amount,
					},
				}),
	};

	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd),
				}}
			/>
			<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
				{/* Product Image Section */}
				<div className="relative">
					<div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8 shadow-2xl transition-all duration-500 hover:shadow-[0_25px_60px_rgba(237,66,100,0.25)]">
						{/* Discount Badge */}
						{discountPercent && (
							<div className="absolute left-4 top-4 z-10 flex">
								<Image
									src="/special-offer.png"
									alt="discount"
									width={70}
									height={70}
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
										fontSize: 11,
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
						)}
						
						{/* Best Seller Badge */}
						{product?.collections?.[0] && (
							<div className="absolute right-4 top-4 z-10">
								<Image
									src="/best-seller-icon.png"
									alt="best seller"
									width={70}
									height={70}
									className="drop-shadow-lg"
								/>
							</div>
						)}
						
						{/* Decorative gradient orbs */}
						<div className="absolute -right-20 -top-20 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-[#ed4264]/20 to-[#ff6b9d]/20 blur-3xl transition-opacity duration-1000 group-hover:opacity-80"></div>
						<div className="absolute -bottom-20 -left-20 h-80 w-80 animate-pulse rounded-full bg-gradient-to-tr from-[#47141e]/15 to-[#ed4264]/15 blur-3xl transition-opacity duration-1000 group-hover:opacity-80" style={{ animationDelay: '1s' }}></div>
						
						{firstImage && (
							<div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
								<ProductImageWrapper
									priority={true}
									alt={firstImage.alt ?? ""}
									width={1024}
									height={1024} 
									src={firstImage.url}
								/>
							</div>
						)}
						
						{/* Shine effect overlay */}
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-1000 group-hover:opacity-100"></div>
						
						{/* Corner accent */}
						<div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-br from-[#ed4264]/10 to-transparent"></div>
					</div>
				</div>

				{/* Product Info Section */}
				<div className="flex flex-col justify-center">
					<div className="space-y-6">
						{/* Product Name */}
						<div>
							<h1 className="mb-3 text-4xl font-extrabold leading-tight text-[#47141e] transition-colors sm:text-5xl lg:text-6xl">
								{product?.name}
							</h1>
							{/* <div className="h-1.5 w-32 rounded-full bg-gradient-to-r from-[#ed4264] via-[#ff6b9d] to-[#ed4264] shadow-lg"></div> */}
						</div>

						{/* Product Details: Net, Serves, Pieces */}
						{(netWeight || servesFor || numberOfPieces) && (
							<div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-md">
								<div className="space-y-2 text-sm">
									{netWeight && (
										<div className="flex items-center gap-2">
											<span className="font-semibold text-[#47141e]">Net:</span>
											<span className="text-neutral-700">{netWeight}</span>
										</div>
									)}
									{servesFor && (
										<div className="flex items-center gap-2">
											<span className="font-semibold text-[#47141e]">Serves:</span>
											<span className="text-neutral-700">{servesFor}</span>
										</div>
									)}
									{numberOfPieces && (
										<div className="flex items-center gap-2">
											<span className="font-semibold text-[#47141e]">{numberOfPieces}</span>
											<span className="text-neutral-700">pieces</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Price Section */}
						<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ed4264]/10 via-[#ff6b9d]/10 to-[#ed4264]/10 p-6 backdrop-blur-sm shadow-lg">
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
							<div className="relative">
								<p className="text-xs font-semibold uppercase tracking-wider text-[#47141e]/70">Price</p>
								{savingAmount && discountedPrice ? (
									<div className="mt-2 space-y-1">
										<div className="flex items-baseline gap-3">
											<span className="text-4xl font-bold text-[#ed4264] drop-shadow-sm sm:text-5xl" data-testid="ProductElement_Price">
												{formatMoney(discountedPrice.amount, discountedPrice.currency)}
											</span>
											<span className="text-lg font-medium text-neutral-400 line-through sm:text-xl">
												{formatMoney(parseFloat(savingAmount), discountedPrice.currency)}
											</span>
										</div>
										<p className="text-xs font-semibold text-green-600">Special Price for you</p>
									</div>
								) : (
									<p className="mt-2 text-4xl font-bold text-[#ed4264] drop-shadow-sm sm:text-5xl" data-testid="ProductElement_Price">
										{price}
									</p>
								)}
							</div>
						</div>

						{/* Variant Selector */}
						{variants && (
								<VariantSelector
									selectedVariant={selectedVariant}
									variants={variants}
									product={{ slug: product.slug }}
									channel={params.channel}
								/>
						)}

						{/* Availability Message */}
						<AvailabilityMessage isAvailable={isAvailable} />

						{/* Add to Cart Section */}
						<div className="rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white p-6 shadow-lg transition-shadow hover:shadow-xl">
						<AddButton
							disabled={!selectedVariantID || !selectedVariant?.quantityAvailable}
							channel={params.channel}
							variantId={selectedVariantID}
							cartItem={
								checkout?.lines.find((line) => line.variant?.id === selectedVariantID)
									? {
											lineId: checkout.lines.find((line) => line.variant?.id === selectedVariantID)!.id,
											quantity: checkout.lines.find((line) => line.variant?.id === selectedVariantID)!
												.quantity,
										}
									: undefined
							}
							quantityAvailable={selectedVariant?.quantityAvailable ?? 0}
							maxBuyLimit={
								(() => {
									const maxBuyLimitAttr = selectedVariant?.attributes?.find(
										(attr) => attr?.attribute?.slug === "max-buy-limit" || attr?.attribute?.name === "Max Buy Limit"
									);
									const maxBuyLimitValue = maxBuyLimitAttr?.values?.[0]?.name;
									if (!maxBuyLimitValue) return undefined;
									const parsed = parseInt(maxBuyLimitValue, 10);
									return isNaN(parsed) ? undefined : parsed;
								})()
							}
						/>
						</div>

						{/* Description Section */}
						{description && (
							<div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
								<h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#47141e]">
									<span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#ed4264] to-[#ff6b9d]"></span>
									Product Details
								</h2>
								<div className="prose prose-sm max-w-none space-y-4 text-neutral-600 prose-headings:text-[#47141e] prose-a:text-[#ed4264] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#47141e] prose-ul:list-disc prose-ol:list-decimal">
									{description.map((content, index) => (
										<div key={index} dangerouslySetInnerHTML={{ __html: xss(content) }} />
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Similar Products Section */}
			{filteredSimilarProducts.length > 0 && (
				<div className="mt-16 border-t border-neutral-200 pt-12">
					<div className="mb-8 text-center">
						<h2 className="mb-2 text-3xl font-bold text-[#47141e]">Similar Products</h2>
						<div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#ed4264] via-[#ff6b9d] to-[#ed4264]"></div>
						<p className="mt-4 text-neutral-600">You might also like these products from the same category</p>
					</div>
					<ProductList products={filteredSimilarProducts} cartItems={similarProductsCartItems} />
				</div>
			)}
		</section>
	);
}
