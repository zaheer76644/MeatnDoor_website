// import Link from "next/link";
// import Image from "next/image";
// import { LinkWithChannel } from "../atoms/LinkWithChannel";
// import { ChannelSelect } from "./ChannelSelect";
// import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
// import { executeGraphQL } from "@/lib/graphql";

// export async function Footer({ channel }: { channel: string }) {
// 	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
// 		variables: { slug: "footer", channel },
// 		revalidate: 60 * 60 * 24,
// 	});
// 	const channels = process.env.SALEOR_APP_TOKEN
// 		? await executeGraphQL(ChannelsListDocument, {
// 				withAuth: false, // disable cookie-based auth for this call
// 				headers: {
// 					// and use app token instead
// 					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
// 				},
// 			})
// 		: null;
// 	const currentYear = new Date().getFullYear();

// 	return (
// 		<footer className="border-neutral-300 bg-neutral-50">
// 			<div className="mx-auto max-w-7xl px-4 lg:px-8">
// 				<div className="grid grid-cols-3 gap-8 py-16">
// 					{footerLinks.menu?.items?.map((item) => {
// 						return (
// 							<div key={item.id}>
// 								<h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
// 								<ul className="mt-4 space-y-4 [&>li]:text-neutral-500">
// 									{item.children?.map((child) => {
// 										if (child.category) {
// 											return (
// 												<li key={child.id} className="text-sm">
// 													<LinkWithChannel href={`/categories/${child.category.slug}`}>
// 														{child.category.name}
// 													</LinkWithChannel>
// 												</li>
// 											);
// 										}
// 										if (child.collection) {
// 											return (
// 												<li key={child.id} className="text-sm">
// 													<LinkWithChannel href={`/collections/${child.collection.slug}`}>
// 														{child.collection.name}
// 													</LinkWithChannel>
// 												</li>
// 											);
// 										}
// 										if (child.page) {
// 											return (
// 												<li key={child.id} className="text-sm">
// 													<LinkWithChannel href={`/pages/${child.page.slug}`}>
// 														{child.page.title}
// 													</LinkWithChannel>
// 												</li>
// 											);
// 										}
// 										if (child.url) {
// 											return (
// 												<li key={child.id} className="text-sm">
// 													<LinkWithChannel href={child.url}>{child.name}</LinkWithChannel>
// 												</li>
// 											);
// 										}
// 										return null;
// 									})}
// 								</ul>
// 							</div>
// 						);
// 					})}
// 				</div>

// 				{channels?.channels && (
// 					<div className="mb-4 text-neutral-500">
// 						<label>
// 							<span className="text-sm">Change currency:</span> <ChannelSelect channels={channels.channels} />
// 						</label>
// 					</div>
// 				)}

// 				<div className="flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row">
// 					<p className="text-sm text-[#47141e]">Copyright &copy; {currentYear} MeatnDoor, Inc.</p>
// 					<p className="flex gap-1 text-sm text-[#47141e]">
// 						Powered by{" "}
// 						<Link target={"_blank"} href={"https://github.com/aahad12"}>
// 							Abdul Aahad
// 						</Link>{" "}
// 						<Link
// 							href={"https://github.com/aahad12"}
// 							target={"_blank"}
// 							className={"text-[#ed4264] opacity-30"}
// 						>
// 							<Image alt="Saleor github repository" height={20} width={20} src={"/github-mark.svg"} />
// 						</Link>
// 					</p>
// 				</div>
// 			</div>
// 		</footer>
// 	);
// }

import Image from "next/image";
import Link from "next/link";
import {
	IoLogoFacebook,
	IoLogoTwitter,
	IoLogoInstagram,
	IoLogoLinkedin,
	IoLogoYoutube,
	IoLogoPinterest,
} from "react-icons/io5";
import { NavLink } from "./nav/components/NavLink";

// type FooterProps = {
// 	channel: string;
// };

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative overflow-hidden border-t border-[#47141e]/30 bg-gradient-to-br from-[#47141e] via-[#5a1a2a] to-[#47141e]">
			{/* Decorative Background Elements */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(237,66,100,0.3),transparent_50%)]"></div>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,107,157,0.2),transparent_50%)]"></div>
			</div>

			{/* Animated Grid Pattern */}
			<div className="absolute inset-0 opacity-[0.03]">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `
							linear-gradient(rgba(237, 66, 100, 0.1) 1px, transparent 1px),
							linear-gradient(90deg, rgba(237, 66, 100, 0.1) 1px, transparent 1px)
						`,
						backgroundSize: "40px 40px",
					}}
				></div>
			</div>

			{/* Footer Content */}
			<div className="relative z-10 py-12 md:py-16">
				<div className="container mx-auto px-4 sm:px-0">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						{/* Left Section - Brand */}
						<div className="lg:col-span-6">
							<div className="mb-6">
								<Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
									<Image src="/img/log.png" alt="MEATnDOOR Logo" width={200} height={60} />
								</Link>
							</div>

							<p className="mb-6 text-base leading-relaxed text-gray-200 md:text-lg w-full md:w-1/2">
								Quality fresh meat delivered right to your doorstep. Experience convenience, freshness, and excellence with{" "}
								<span className="font-semibold text-white">MEATnDOOR</span>.
							</p>

							{/* Social Icons - Enhanced */}
							<div className="mb-6">
								<p className="mb-3 text-sm font-semibold text-white">Follow Us</p>
								<ul className="flex flex-wrap gap-3">
									{[
										{ Icon: IoLogoFacebook, href: "https://www.facebook.com/people/MeatnDoor/61581651580735/#", label: "Facebook" },
										{ Icon: IoLogoTwitter, href: "/coming-soon", label: "Twitter" },
										{ Icon: IoLogoInstagram, href: "https://www.instagram.com/meatndoor/", label: "Instagram" },
										{ Icon: IoLogoLinkedin, href: "/coming-soon", label: "LinkedIn" },
										{ Icon: IoLogoYoutube, href: "/coming-soon", label: "YouTube" },
										{ Icon: IoLogoPinterest, href: "/coming-soon", label: "Pinterest" },
									].map(({ Icon, href, label }) => (
										<li key={label}>
											<Link
												href={href}
												aria-label={label}
												target="_blank"
												className="group flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-[#ed4264] hover:to-[#ff6b9d] hover:shadow-lg hover:shadow-[#ed4264]/50"
											>
												<Icon className="text-xl text-white transition-transform duration-300 group-hover:scale-110" />
											</Link>
										</li>
									))}
								</ul>
							</div>

							<p className="text-sm text-gray-300">
								© {currentYear} <span className="font-semibold text-white">MEATnDOOR</span> Fresh Foods. All rights reserved.
							</p>
						</div>

						{/* Right Section - Links */}
						<div className="lg:col-span-6">
							<div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:justify-items-end">
								{/* Solutions */}
								{/* <div>
									<h3 className="mb-4 text-lg font-bold text-white">Solutions</h3>
									<ul className="space-y-2.5">
										{["Marketing", "Analytics", "Commerce", "Insights", "Promotion"].map((item) => (
											<li key={item}>
												<Link
													href="/coming-soon"
													className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
												>
													{item}
												</Link>
											</li>
										))}
									</ul>
								</div> */}

								{/* Download Our App */}
								<div>
									<h3 className="mb-4 text-lg font-bold text-white">Download Our App</h3>
									<div className="flex flex-col gap-3">
										{/* App Store Button */}
										<a
											href="https://apps.apple.com/in/app/meatndoor/id6755533727"
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-[#47141e] shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#ed4264] hover:text-white hover:shadow-lg"
										>
											<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
											</svg>
											<span className="text-sm">App Store</span>
										</a>

										{/* Google Play Button */}
										<a
											href="https://play.google.com/store/apps/details?id=com.themanagemate.meatndoor&hl=en_IN"
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-4 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#47141e] hover:shadow-lg"
										>
											<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
											</svg>
											<span className="text-sm">Google Play</span>
										</a>
									</div>
								</div>

								{/* Company */}
								<div>
									<h3 className="mb-4 text-lg font-bold text-white">Company</h3>
									<ul className="space-y-2.5">
										<div>
										<NavLink href="/about">About</NavLink>
										</div>
										<NavLink href="/contact">Contact Us</NavLink>
											{/* <Link
												href="/about"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												About Us
											</Link> */}
											{/* <Link
												href="https://meatndoor.com/contact-us.html"
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Contact Us
											</Link> */}
									</ul>
								</div>

								{/* Legal */}
								<div>
									<h3 className="mb-4 text-lg font-bold text-white">Legal</h3>
									<ul className="space-y-2.5">
										<li>
											<Link
												href="https://meatndoor.com/terms-and-conditions.html"
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Terms & Conditions
											</Link>
										</li>
										<li>
											<Link
												href="https://meatndoor.com/privacy-policy.html"
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Privacy Policy
											</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Border */}
					{/* <div className="mt-12 border-t border-white/10 pt-8">
						<div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
							<p className="text-sm text-gray-300">
								Made with <span className="text-[#ed4264]">❤️</span> for fresh food lovers
							</p>
							<p className="text-sm text-gray-300">
								<span className="hidden sm:inline">Quality at Doorstep</span>
								<span className="sm:hidden">MEATnDOOR</span>
							</p>
						</div>
					</div> */}
				</div>
			</div>
		</footer>
	);
}

// import Link from "next/link";
// import Image from "next/image";
// import {
// 	IoLogoFacebook,
// 	IoLogoTwitter,
// 	IoLogoInstagram,
// 	IoLogoLinkedin,
// 	IoLogoYoutube,
// 	IoLogoPinterest,
// } from "react-icons/io5";
// import { LinkWithChannel } from "../atoms/LinkWithChannel";
// import { ChannelSelect } from "./ChannelSelect";
// import { ChannelsListDocument, MenuGetBySlugDocument } from "@/gql/graphql";
// import { executeGraphQL } from "@/lib/graphql";

// // React Icons

// export async function Footer({ channel }: { channel: string }) {
// 	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
// 		variables: { slug: "footer", channel },
// 		revalidate: 60 * 60 * 24,
// 	});

// 	const channels = process.env.SALEOR_APP_TOKEN
// 		? await executeGraphQL(ChannelsListDocument, {
// 				withAuth: false,
// 				headers: {
// 					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
// 				},
// 			})
// 		: null;

// 	const currentYear = new Date().getFullYear();

// 	return (
// 		<footer className="footer border-t border-neutral-300 bg-[#47141e]">
// 			<div className="container mx-auto px-4 py-16 lg:px-8">
// 				{/* TOP SECTION */}
// 				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
// 					{/* LEFT SECTION */}
// 					<div className="lg:col-span-4">
// 						<div className="mb-6">
// 							<Link href="/">
// 								<Image src="/log.png" width={150} height={60} alt="Logo" />
// 							</Link>
// 						</div>

// 						<p className="mb-4 text-white">Quality Meat at your Doorstep </p>

// 						{/* SOCIAL ICONS (React Icons) */}
// 						<ul className="mb-4 flex space-x-4 text-white">
// 							<li>
// 								<Link href="/coming-soon">
// 									<IoLogoFacebook className="text-2xl transition hover:text-red-600" />
// 								</Link>
// 							</li>
// 							<li>
// 								<Link href="/coming-soon">
// 									<IoLogoTwitter className="text-2xl transition hover:text-red-600" />
// 								</Link>
// 							</li>
// 							<li>
// 								<Link href="/coming-soon">
// 									<IoLogoInstagram className="text-2xl transition hover:text-red-600" />
// 								</Link>
// 							</li>
// 							<li>
// 								<Link href="/coming-soon">
// 									<IoLogoLinkedin className="text-2xl transition hover:text-red-600" />
// 								</Link>
// 							</li>
// 							<li>
// 								<Link href="/coming-soon">
// 									<IoLogoYoutube className="text-2xl transition hover:text-red-600" />
// 								</Link>
// 							</li>
// 							<li>
// 								<Link href="/coming-soon">
// 									<IoLogoPinterest className="text-2xl transition hover:text-red-600" />
// 								</Link>
// 							</li>
// 						</ul>

// 						<p className="text-sm text-white">© {currentYear} MEATnDOOR Fresh Foods. All rights reserved.</p>
// 					</div>

// 					{/* RIGHT SECTION (Dynamic from Saleor) */}
// 					<div className="mt-8 lg:col-span-8 lg:mt-20">
// 						<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
// 							{footerLinks.menu?.items?.map((section) => (
// 								<div key={section.id}>
// 									<h3 className="mb-4 text-lg font-semibold text-neutral-900">{section.name}</h3>

// 									<ul className="space-y-2 text-white">
// 										{section.children?.map((child) => {
// 											if (child.category)
// 												return (
// 													<li key={child.id}>
// 														<LinkWithChannel href={`/categories/${child.category.slug}`}>
// 															{child.category.name}
// 														</LinkWithChannel>
// 													</li>
// 												);

// 											if (child.collection)
// 												return (
// 													<li key={child.id}>
// 														<LinkWithChannel href={`/collections/${child.collection.slug}`}>
// 															{child.collection.name}
// 														</LinkWithChannel>
// 													</li>
// 												);

// 											if (child.page)
// 												return (
// 													<li key={child.id}>
// 														<LinkWithChannel href={`/pages/${child.page.slug}`}>
// 															{child.page.title}
// 														</LinkWithChannel>
// 													</li>
// 												);

// 											if (child.url)
// 												return (
// 													<li key={child.id}>
// 														<LinkWithChannel href={child.url}>{child.name}</LinkWithChannel>
// 													</li>
// 												);

// 											return null;
// 										})}
// 									</ul>
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				</div>

// 				{/* CURRENCY SELECT */}
// 				{channels?.channels && (
// 					<div className="mb-6 mt-10 text-white">
// 						<label className="text-sm">
// 							Change currency: <ChannelSelect channels={channels.channels} />
// 						</label>
// 					</div>
// 				)}

// 				{/* BOTTOM COPYRIGHT */}
// 				<div className="mt-6 flex flex-col justify-between border-t border-neutral-200 pt-6 sm:flex-row">
// 					<p className="text-sm text-white">Copyright © {currentYear} MeatnDoor, Inc.</p>

// 					<p className="flex gap-1 text-sm text-white">
// 						Powered by{" "}
// 						<Link target="_blank" href="https://github.com/aahad12">
// 							Abdul Aahad
// 						</Link>
// 						<Link href="https://github.com/aahad12" target="_blank">
// 							<Image src="/github-mark.svg" alt="github" width={20} height={20} />
// 						</Link>
// 					</p>
// 				</div>
// 			</div>
// 		</footer>
// 	);
// }
