import { type ReactNode } from "react";
import { getSummaryLineProps } from "./utils";
import { type CheckoutLineFragment, type OrderLineFragment } from "@/checkout/graphql";
import { PhotoIcon } from "@/checkout/ui-kit/icons";

export type SummaryLine = CheckoutLineFragment | OrderLineFragment;

interface SummaryItemProps {
	line: SummaryLine;
	children: ReactNode;
}

export const SummaryItem = ({ line, children }: SummaryItemProps) => {
	// console.log("ORDER LINE DATA --->", line);

	const { productName, productImage, variantName } = getSummaryLineProps(line);

	// const attributesText = useSummaryLineLineAttributesText(line);

	return (
		<li key={line.id} className="flex border-b py-4 last:border-none" data-testid="SummaryItem">
			<div className="aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-neutral-50 md:h-24 md:w-24 md:bg-white">
				{productImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={productImage.url}
						alt={productImage.alt ?? ""}
						className="h-full w-full object-contain object-center"
						loading="lazy"
					/>
				) : (
					<PhotoIcon />
				)}
			</div>
			<div className="relative flex flex-1 flex-col justify-between pl-4">
				<div className="flex justify-between justify-items-start gap-4">
					<div className="flex flex-col gap-y-1">
						<p className="font-bold text-[#47141e]">{productName}</p>
						<p className="text-xs text-neutral-500">{variantName}</p>
					</div>
					{children}
				</div>
			</div>
		</li>
	);
};
