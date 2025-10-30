"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

// Import images from the src folder
import img1 from "@/img/img1.jpg";
import img2 from "@/img/img2.jpg";
// import img3 from "@/img/img1.jpg";
// import img4 from "@/img/img2.jpg";

const images = [img1, img2, img1, img2, img1];

export const CustomSlider = () => {
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % images.length);
		}, 3000); // Auto slide every 3 seconds
		return () => clearInterval(interval);
	}, []);

	return (
		<div id="custom-carousel" className="relative mb-20 w-full">
			{/* Carousel wrapper */}
			<div className="relative block h-[32rem] overflow-hidden md:h-[500px]">
				{images.map((img, index) => (
					<div
						key={index}
						className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
							index === current ? "opacity-100" : "opacity-0"
						}`}
					>
						<Image
							fill
							src={img}
							// width={400}
							// height={200}
							className="h-auto w-full object-cover"
							alt={`Slide ${index + 1}`}
							priority={index === 0}
						/>
					</div>
				))}
			</div>

			{/* Slider indicators */}
			<div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
				{images.map((_, index) => (
					<button
						key={index}
						type="button"
						className={`h-3 w-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"}`}
						onClick={() => setCurrent(index)}
					></button>
				))}
			</div>
		</div>
	);
};
