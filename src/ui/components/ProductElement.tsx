"use client";

import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	const handleAddToCart = () => {
		console.log(" add to cart clicked");
	};
	return (
		<li data-testid="ProductElement" className="rounded border-2 border-[#47141e]  ">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={150}
							height={150}
							sizes={"150px"}
							priority={priority}
						/>
					)}
				</div>
			</LinkWithChannel>
			<div className="mt-2 flex h-20 justify-between border-t-2 border-[#ed4264] px-4 py-2">
				<div className="w-[60%]">
					<h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name}</h3>
					<p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
						{product.category?.name}
					</p>
				</div>
				<div className="w-[40%] text-right">
					<p className="mt-1 text-sm font-medium text-neutral-900" data-testid="ProductElement_PriceRange">
						{formatMoneyRange({
							start: product?.pricing?.priceRange?.start?.gross,
							stop: product?.pricing?.priceRange?.stop?.gross,
						})}
					</p>
					<button onClick={handleAddToCart}>add to cart</button>
				</div>
			</div>
			{/* </div> */}
			{/* </LinkWithChannel> */}
		</li>
	);
}
