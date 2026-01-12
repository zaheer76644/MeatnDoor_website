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
						<div className="lg:col-span-4">
							<div className="mb-6">
								<Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
									<Image src="/img/log.png" alt="MEATnDOOR Logo" width={200} height={60} />
								</Link>
							</div>

							<p className="mb-6 text-base leading-relaxed text-gray-200 md:text-lg">
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
						<div className="lg:col-span-8">
							<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
								{/* Solutions */}
								<div>
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
								</div>

								{/* Support */}
								<div>
									<h3 className="mb-4 text-lg font-bold text-white">Support</h3>
									<ul className="space-y-2.5">
										{["Pricing", "Documentation", "Guides", "API Status", "Live Support"].map((item) => (
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
								</div>

								{/* Company */}
								<div>
									<h3 className="mb-4 text-lg font-bold text-white">Company</h3>
									<ul className="space-y-2.5">
										<li>
											<Link
												href="/About-Us"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												About Us
											</Link>
										</li>
										<li>
											<Link
												href="/coming-soon"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Our Blog
											</Link>
										</li>
										<li>
											<Link
												href="/coming-soon"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Jobs
											</Link>
										</li>
										<li>
											<Link
												href="/coming-soon"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Press
											</Link>
										</li>
										<li>
											<Link
												href="https://meatndoor.com/contact-us.html"
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Contact Us
											</Link>
										</li>
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
										<li>
											<Link
												href="/coming-soon"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Catering Services
											</Link>
										</li>
										<li>
											<Link
												href="/coming-soon"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Customer Relations
											</Link>
										</li>
										<li>
											<Link
												href="/coming-soon"
												className="text-sm text-gray-300 transition-all duration-200 hover:translate-x-1 hover:text-[#ed4264] hover:underline"
											>
												Innovation
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
