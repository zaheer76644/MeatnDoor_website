// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// // Import images from the src folder
// import img1 from "@/img/img1.jpg";
// import img2 from "@/img/img2.jpg";
// // import img3 from "@/img/img1.jpg";
// // import img4 from "@/img/img2.jpg";

// const images = [img1, img2, img1, img2, img1];

// export const CustomSlider = () => {
// 	const [current, setCurrent] = useState(0);

// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			setCurrent((prev) => (prev + 1) % images.length);
// 		}, 3000); // Auto slide every 3 seconds
// 		return () => clearInterval(interval);
// 	}, []);

// 	return (
// 		<div id="custom-carousel" className="relative mb-20 w-full">
// 			{/* Carousel wrapper */}
// 			<div className="relative block h-[32rem] overflow-hidden md:h-[500px]">
// 				{images.map((img, index) => (
// 					<div
// 						key={index}
// 						className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
// 							index === current ? "opacity-100" : "opacity-0"
// 						}`}
// 					>
// 						<Image
// 							fill
// 							src={img}
// 							// width={400}
// 							// height={200}
// 							className="h-auto w-full object-cover"
// 							alt={`Slide ${index + 1}`}
// 							priority={index === 0}
// 						/>
// 					</div>
// 				))}
// 			</div>

// 			{/* Slider indicators */}
// 			<div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
// 				{images.map((_, index) => (
// 					<button
// 						key={index}
// 						type="button"
// 						className={`h-3 w-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"}`}
// 						onClick={() => setCurrent(index)}
// 					></button>
// 				))}
// 			</div>
// 		</div>
// 	);
// };
// components/Hero.tsx
import Image from "next/image";

export function CustomSlider() {
	return (
		<section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#47141e] via-[#5a1a2a] to-[#47141e] py-16 md:py-24">
			{/* Mesh Gradient Background - Enhanced */}
			<div className="absolute inset-0 opacity-40">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(237,66,100,0.5),transparent_45%)]"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,107,157,0.4),transparent_45%)]"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,20,30,0.6),transparent_60%)]"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(237,66,100,0.3),transparent_40%)]"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,107,157,0.3),transparent_40%)]"></div>
			</div>

			{/* Animated Grid Pattern */}
			<div className="absolute inset-0 opacity-[0.04]">
				<div className="absolute inset-0" style={{
					backgroundImage: `
						linear-gradient(rgba(237, 66, 100, 0.1) 1px, transparent 1px),
						linear-gradient(90deg, rgba(237, 66, 100, 0.1) 1px, transparent 1px)
					`,
					backgroundSize: '60px 60px'
				}}></div>
			</div>

			{/* Animated Background Pattern - Dots */}
			<div className="absolute inset-0 opacity-[0.05]">
				<div className="absolute inset-0" style={{
					backgroundImage: `radial-gradient(circle at 2px 2px, rgba(237, 66, 100, 0.8) 1px, transparent 0)`,
					backgroundSize: '50px 50px'
				}}></div>
			</div>

			{/* Animated Gradient Orbs - Multiple Layers */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Large orbs */}
				<div className="absolute -top-32 -right-32 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-[#ed4264] to-[#ff6b9d] opacity-18 blur-3xl"></div>
				<div className="absolute -bottom-32 -left-32 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-tr from-[#ed4264] to-[#ff6b9d] opacity-18 blur-3xl" style={{ animationDelay: '1.5s' }}></div>
				
				{/* Medium orbs */}
				<div className="absolute top-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] opacity-12 blur-3xl" style={{ animationDelay: '0.5s' }}></div>
				<div className="absolute bottom-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-[#ed4264] to-[#ff6b9d] opacity-12 blur-3xl" style={{ animationDelay: '2.5s' }}></div>
				
				{/* Small accent orbs */}
				<div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] opacity-10 blur-3xl" style={{ animationDelay: '1s' }}></div>
				<div className="absolute top-1/3 left-2/3 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ed4264] opacity-8 blur-3xl" style={{ animationDelay: '2s' }}></div>
			</div>

			{/* Wave Effects */}
			<div className="absolute inset-0 overflow-hidden opacity-10">
				<svg className="absolute bottom-0 left-0 w-full animate-pulse" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path
						d="M0,60 C300,20 600,100 900,40 C1050,20 1150,60 1200,50 L1200,120 L0,120 Z"
						fill="url(#waveGradient)"
					/>
					<defs>
						<linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#ed4264" stopOpacity="0.4" />
							<stop offset="50%" stopColor="#ff6b9d" stopOpacity="0.4" />
							<stop offset="100%" stopColor="#ed4264" stopOpacity="0.4" />
						</linearGradient>
					</defs>
				</svg>
			</div>

			{/* Geometric Shapes - Enhanced */}
			<div className="absolute inset-0 overflow-hidden opacity-8">
				{/* Rotated squares */}
				<div className="absolute top-20 left-10 h-32 w-32 rotate-45 border-2 border-[#ed4264] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
				<div className="absolute bottom-20 right-10 h-24 w-24 rotate-12 border-2 border-[#ff6b9d] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
				<div className="absolute top-1/2 right-20 h-16 w-16 -rotate-45 border-2 border-white/30 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
				<div className="absolute top-1/3 left-1/4 h-20 w-20 rotate-90 border-2 border-[#ed4264]/50"></div>
				{/* Circles */}
				<div className="absolute bottom-1/3 right-1/4 h-28 w-28 rounded-full border-2 border-[#ff6b9d]/50"></div>
				<div className="absolute top-2/3 left-1/3 h-16 w-16 rounded-full border-2 border-white/20"></div>
			</div>

			{/* Light Rays Effect */}
			<div className="absolute inset-0 overflow-hidden opacity-15">
				<div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-[#ed4264] to-transparent rotate-12"></div>
				<div className="absolute top-0 right-1/3 h-full w-px bg-gradient-to-b from-transparent via-[#ff6b9d] to-transparent -rotate-12"></div>
				<div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
			</div>

			{/* Shimmer Effect - Multiple */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -left-1/2 top-0 h-full w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
				<div className="absolute -left-1/3 top-0 h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-[#ed4264]/25 to-transparent" style={{ animationDelay: '1.5s' }}></div>
				<div className="absolute -left-1/4 top-0 h-full w-1/4 animate-shimmer bg-gradient-to-r from-transparent via-[#ff6b9d]/20 to-transparent" style={{ animationDelay: '3s' }}></div>
			</div>

			{/* Floating Particles Effect - Enhanced */}
			<div className="absolute inset-0 overflow-hidden">
				{Array?.from({ length: 12 }).map((_, i) => (
					<div
						key={i}
						className="absolute rounded-full bg-[#ed4264] opacity-25 animate-pulse"
						style={{
							left: `${10 + (i * 7.5)}%`,
							top: `${5 + (i % 4) * 25}%`,
							width: `${4 + (i % 3) * 2}px`,
							height: `${4 + (i % 3) * 2}px`,
							animationDelay: `${i * 0.3}s`,
							animationDuration: `${2.5 + (i % 4) * 0.5}s`,
						}}
					></div>
				))}
				{/* Larger floating elements */}
				{Array?.from({ length: 4 }).map((_, i) => (
					<div
						key={`large-${i}`}
						className="absolute rounded-full bg-gradient-to-br from-[#ed4264] to-[#ff6b9d] opacity-15 animate-pulse blur-sm"
						style={{
							left: `${15 + i * 25}%`,
							top: `${20 + (i % 2) * 50}%`,
							width: `${12 + i * 4}px`,
							height: `${12 + i * 4}px`,
							animationDelay: `${i * 1.2}s`,
							animationDuration: `${4 + i * 0.5}s`,
						}}
					></div>
				))}
			</div>

			{/* Animated Lines */}
			<div className="absolute inset-0 overflow-hidden opacity-5">
				<div className="absolute top-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#ed4264] to-transparent"></div>
				<div className="absolute bottom-1/4 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#ff6b9d] to-transparent"></div>
			</div>

			<div className="container relative mx-auto px-4">
				<div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
					{/* Left Content */}
					<div className="z-10 text-center md:text-left">
						<h1 className="mb-6 text-4xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
							Get Fresh Meat Delivered to Your{" "}
							<span className="bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] bg-clip-text text-transparent">
								Doorstep
							</span>
						</h1>
						<p className="mb-8 text-lg leading-relaxed text-gray-100 md:text-xl">
							Order high-quality fresh meat in just a few clicks. Convenient, fast, and reliable delivery with{" "}
							<span className="font-semibold text-white">meatndoor.com</span>.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
							{/* App Store Button */}
							<a
								href="https://apps.apple.com/in/app/meatndoor/id6755533727"
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#47141e] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#ed4264] hover:text-white hover:shadow-xl"
							>
								<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
								</svg>
								<span>App Store</span>
							</a>

							{/* Google Play Button */}
							<a
								href="https://play.google.com/store/apps/details?id=com.themanagemate.meatndoor&hl=en_IN"
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent px-6 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#47141e] hover:shadow-xl"
							>
								<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
								</svg>
								<span>Google Play</span>
							</a>
						</div>
					</div>

					{/* Right Image */}
					<div className="relative z-10 flex justify-center">
						<div className="relative">
							{/* Glow effect behind image */}
							<div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] opacity-20 blur-3xl"></div>
							<Image
								src="/banner_image.png"
								width={500}
								height={500}
								alt="MEATnDOOR - Quality at Doorstep"
								className="drop-shadow-2xl transition-transform duration-300 hover:scale-105"
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

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
