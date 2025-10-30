import React from "react";
import CustomCarousel from "../customcomponents/CustomCarousel";
import { CustomSlider } from "../customcomponents/CustomSlider";
import { type ProductListItemFragment } from "@/gql/graphql";

// eslint-disable-next-line import/no-default-export
export default function CustomPage({ products }: { products: ProductListItemFragment[] }) {
	return (
		<div>
			<CustomSlider />
			<CustomCarousel products={products} />
		</div>
	);
}
