/* eslint-disable import/no-default-export */
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/ui/components/ProductList";
import { type ProductListItemFragment } from "@/gql/graphql";

export default function CustomCarousel({ products }: { products: ProductListItemFragment[] }) {
	// const carouselRef = useRef<HTMLUListElement>(null); // for list element
	const carouselRef = useRef<HTMLDivElement>(null);
	const displayedProducts = products.slice(0, 10);

	// Scroll left
	const prevSlide = () => {
		if (carouselRef.current) {
			carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
		}
	};

	// Scroll right
	const nextSlide = () => {
		if (carouselRef.current) {
			carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
		}
	};

	return (
		<div className="w-full p-16 shadow-xl">
			{/* Heading */}
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Trending Products</h2>
				<Link href="/in/products">
					<button className="rounded-l border-2 border-pink-400 p-2 px-4 hover:bg-red-300 hover:text-white">
						View All
					</button>
				</Link>
			</div>

			{/* Carousel */}
			<div className="relative mt-6 flex items-center">
				{/* Left Arrow */}
				<button onClick={prevSlide} className="absolute left-0 z-10 rounded-full bg-white p-2 shadow-md">
					<ChevronLeft className="text-pink-400" size={24} />
				</button>

				{/* ProductList inside Carousel
				<div className="scrollbar-hide flex w-full overflow-x-auto">
					<ProductList products={products} ref={carouselRef} />
				</div> */}
				{/* Scrollable Wrapper */}
				<div ref={carouselRef} className="scrollbar-hide w-full overflow-x-auto whitespace-nowrap">
					<ProductList
						// className="!flex !flex-nowrap !gap-6 [&>li]:min-w-[150px]"
						// products={products} to show all products
						products={displayedProducts} // to Show only first 10 products
						// showCategory={false}
					/>
				</div>

				{/* Right Arrow */}
				<button onClick={nextSlide} className="absolute right-0 z-10 rounded-full bg-white p-2 shadow-md">
					<ChevronRight className="text-pink-400" size={24} />
				</button>
			</div>
		</div>
	);
}
