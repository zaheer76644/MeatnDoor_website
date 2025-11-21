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
// "use client";
// import { useEffect, useState } from "react";

// export function CustomSlider() {
// 	const [showContent, setShowContent] = useState(false);

// 	useEffect(() => {
// 		const timer = setTimeout(() => {
// 			setShowContent(true);
// 		}, 2000); // curtain open hone ke baad content dikhana
// 		return () => clearTimeout(timer);
// 	}, []);

// 	return (
// 		<section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
// 			{/* Curtains */}
// 			<div className="animate-openLeft absolute left-0 top-0 h-full w-1/2 border-r-2 border-black bg-gradient-to-r from-red-950 to-red-800"></div>
// 			<div className="animate-openRight absolute right-0 top-0 h-full w-1/2 border-l-2 border-black bg-gradient-to-l from-red-950 to-red-800"></div>

// 			{/* Hero Content */}
// 			<div
// 				className={`relative z-10 text-center transition-opacity duration-1000 ${
// 					showContent ? "opacity-100" : "opacity-0"
// 				}`}
// 			>
// 				<h1 className="mb-4 text-5xl font-extrabold text-white drop-shadow-lg md:text-6xl">
// 					Welcome to CineWorld
// 				</h1>
// 				<p className="mb-6 text-lg text-gray-200 md:text-xl">Experience the Magic of Movies</p>
// 				<button className="rounded-full bg-red-700 px-6 py-3 text-lg text-white transition-all hover:bg-red-800">
// 					Get Started
// 				</button>
// 			</div>
// 		</section>
// 	);
// }
