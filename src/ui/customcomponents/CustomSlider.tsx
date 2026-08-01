import Image from "next/image";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

const display = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
});

const body = Source_Sans_3({
	subsets: ["latin"],
	display: "swap",
});

const GOLD = "#d4af37";
const RED = "#e21e36";

const features = [
	{
		lines: ["100% Quality", "Assured"],
		icon: (
			<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 3.2l6.5 2.6v5.1c0 4.2-2.7 7.4-6.5 8.7-3.8-1.3-6.5-4.5-6.5-8.7V5.8L12 3.2z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M9.1 11.8l2 2 3.9-4.1" />
			</svg>
		),
	},
	{
		lines: ["Carefully", "Packed"],
		icon: (
			<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 3.5c2.6 3.2 5.8 5.2 5.8 9a5.8 5.8 0 11-11.6 0c0-3.8 3.2-5.8 5.8-9z"
				/>
			</svg>
		),
	},
	{
		lines: ["On-Time", "Delivery"],
		icon: (
			<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 8h10v8H3V8zm10 2h3.5L20 13v3h-7v-6z"
				/>
				<path strokeLinecap="round" strokeLinejoin="round" d="M6.5 18.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
			</svg>
		),
	},
] as const;

function ProductTag({
	label,
	className,
	lineTo = "right",
}: {
	label: string;
	className?: string;
	lineTo?: "left" | "right";
}) {
	return (
		<div className={`absolute z-[5] flex items-center ${className ?? ""}`}>
			{lineTo === "left" && (
				<span className="mr-1 flex items-center">
					<span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
					<span className="h-px w-7 bg-[#d4af37]/80 sm:w-9" />
				</span>
			)}
			<span className="rounded-[3px] border border-[#d4af37]/65 bg-[#12080a]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-[2px] md:text-[10px]">
				{label}
			</span>
			{lineTo === "right" && (
				<span className="ml-1 flex items-center">
					<span className="h-px w-7 bg-[#d4af37]/80 sm:w-9" />
					<span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
				</span>
			)}
		</div>
	);
}

export function CustomSlider() {
	return (
		<section
			id="home"
			className={`${body.className} relative isolate h-[calc(100svh-4rem)] w-full overflow-hidden bg-black text-white`}
		>
			{/* Mobile banner */}
			<Image
				src="/banner_mobile.png"
				alt="Fresh mutton, chicken and fish"
				fill
				priority
				className="object-cover object-bottom md:hidden"
				sizes="100vw"
			/>

			{/* Desktop banner */}
			<Image
				src="/banner_image_with_meat.png"
				alt="Fresh mutton, chicken and fish"
				fill
				priority
				className="hidden object-none object-top md:block"
				sizes="100vw"
			/>

			<div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full bg-gradient-to-b from-black/70 via-black/40 to-transparent md:w-[55%] md:bg-gradient-to-r md:from-black md:via-black/55 md:to-transparent" />

			<div className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
				<ProductTag label="Mutton" className="right-[30%] top-[33%]" lineTo="right" />
				<ProductTag label="Chicken" className="bottom-[28%] left-[35%]" lineTo="right" />
				<ProductTag label="Fish" className="bottom-[10%] right-[5%]" lineTo="left" />
			</div>

			{/* Text block — matches mockup; mobile sized to avoid overlap */}
			<div className="relative z-[3] flex h-full w-full items-start overflow-y-auto pt-5 sm:pt-8 md:items-center md:overflow-visible md:pt-0">
				<div className="w-full max-w-[1400px] px-4 sm:px-8 lg:px-14 xl:px-20">
					<div className="flex w-full max-w-none flex-col items-start text-left md:max-w-[420px]">
						{/* Eyebrow */}
						<div className="mb-3 flex w-full max-w-[320px] items-center gap-2 sm:mb-5 sm:max-w-none sm:gap-3">
							<span className="h-px w-5 shrink-0 bg-[#d4af37]/90 sm:w-9" />
							<span
								className="inline-flex min-w-0 items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] sm:gap-2 sm:text-[10px] sm:tracking-[0.22em]"
								style={{ color: GOLD }}
							>
								<svg className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-2.8 7.8-7 9-4.2-1.2-7-4.5-7-9V6l7-3z" />
									<path strokeLinecap="round" strokeLinejoin="round" d="M9.2 12l2 2 4-4.2" />
								</svg>
								<span className="whitespace-nowrap">Quality at your doorstep</span>
							</span>
							<span className="h-px w-5 shrink-0 bg-[#d4af37]/90 sm:w-9" />
						</div>

						{/* Headline — roomy line-height so serif glyphs don’t collide */}
						<h1
							className={`${display.className} mb-3 text-[1.9rem] font-bold leading-[1.2] tracking-[-0.01em] text-white sm:mb-5 sm:text-[clamp(2.4rem,5.5vw,3.75rem)] sm:leading-[1.12]`}
						>
							Premium Meat,
							<br />
							<span style={{ color: RED }}>Delivered</span>
							<br />
							with Care.
						</h1>

						{/* Red divider */}
						<div className="mb-3 flex items-center sm:mb-4">
							<span className="h-px w-12 sm:w-16" style={{ backgroundColor: RED }} />
							<span
								className="ml-[-1px] inline-block h-1.5 w-1.5 rotate-45"
								style={{ backgroundColor: RED }}
								aria-hidden
							/>
						</div>

						{/* Subhead */}
						<p className="mb-5 max-w-[280px] text-[12px] leading-[1.5] text-white/90 sm:mb-8 sm:max-w-[320px] sm:text-[14px] sm:leading-[1.55]">
							Handpicked quality. Carefully packed.
							<br />
							Delivered fresh to your doorstep.
						</p>

						{/* Feature icons — fixed 3-col grid, no wrap/overlap */}
						<div className="mb-5 grid w-full max-w-[340px] grid-cols-3 sm:mb-8 sm:max-w-[380px]">
							{features.map((feature, index) => (
								<div
									key={feature.lines.join(" ")}
									className={`flex flex-col items-center px-1 text-center ${
										index > 0 ? "border-l" : ""
									}`}
									style={index > 0 ? { borderColor: `${RED}99` } : undefined}
								>
									<div
										className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border sm:h-[52px] sm:w-[52px]"
										style={{ borderColor: GOLD, color: GOLD }}
									>
										{feature.icon}
									</div>
									<p className="text-[9px] font-medium leading-snug text-white/90 sm:text-[11px]">
										{feature.lines.map((line) => (
											<span key={line} className="block">
												{line}
											</span>
										))}
									</p>
								</div>
							))}
						</div>

						{/* Store buttons */}
						<div className="flex flex-nowrap gap-2 sm:gap-3">
							<a
								href="https://apps.apple.com/in/app/meatndoor/id6755533727"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-white/80 bg-black px-2 py-1.5 transition hover:border-white hover:bg-black/80 sm:flex-none sm:gap-2 sm:px-3 sm:py-2"
							>
								<svg className="h-5 w-5 shrink-0 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
									<path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
								</svg>
								<span className="min-w-0 text-left leading-tight">
									<span className="block text-[7px] uppercase tracking-wide text-white/70 sm:text-[9px]">Download on the</span>
									<span className="block text-[11px] font-semibold sm:text-[15px]">App Store</span>
								</span>
							</a>

							<a
								href="https://play.google.com/store/apps/details?id=com.themanagemate.meatndoor&hl=en_IN"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-white/80 bg-black px-2 py-1.5 transition hover:border-white hover:bg-black/80 sm:flex-none sm:gap-2 sm:px-3 sm:py-2"
							>
								<svg className="h-5 w-5 shrink-0 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
									<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
								</svg>
								<span className="min-w-0 text-left leading-tight">
									<span className="block text-[7px] uppercase tracking-wide text-white/70 sm:text-[9px]">Get it on</span>
									<span className="block text-[11px] font-semibold sm:text-[15px]">Google Play</span>
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
