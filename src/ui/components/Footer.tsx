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

export function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-[#47141e]">
			{/* Footer Top */}
			<div className="py-16">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap">
						{/* Left Section */}
						<div className="w-full pr-12 md:w-4/12">
							<div>
								<Link href="/">
									<Image src="/log.png" alt="Logo" width={400} height={60} />
								</Link>

								<p className="mt-4 text-neutral-200">
									Making the world a better place through constructing elegant hierarchies.
								</p>

								{/* Social Icons */}
								<ul className="mt-4 flex space-x-4 text-neutral-200">
									<li>
										<Link href="/coming-soon">
											<IoLogoFacebook className="text-2xl transition hover:text-red-600" />
										</Link>
									</li>
									<li>
										<Link href="/coming-soon">
											<IoLogoTwitter className="text-2xl transition hover:text-red-600" />
										</Link>
									</li>
									<li>
										<Link href="/coming-soon">
											<IoLogoInstagram className="text-2xl transition hover:text-red-600" />
										</Link>
									</li>
									<li>
										<Link href="/coming-soon">
											<IoLogoLinkedin className="text-2xl transition hover:text-red-600" />
										</Link>
									</li>
									<li>
										<Link href="/coming-soon">
											<IoLogoYoutube className="text-2xl transition hover:text-red-600" />
										</Link>
									</li>
									<li>
										<Link href="/coming-soon">
											<IoLogoPinterest className="text-2xl transition hover:text-red-600" />
										</Link>
									</li>
								</ul>

								<p className="mt-4 text-sm text-white">© 2025 MEATnDOOR Fresh Foods. All rights reserved.</p>
							</div>
						</div>

						{/* Right Section */}
						<div className="mt-12 w-full md:mt-24 md:w-8/12">
							<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
								{/* Solutions */}
								<div>
									<h3 className="mb-4 text-lg font-semibold text-white">Solutions</h3>
									<ul className="space-y-2 text-neutral-200">
										{["Marketing", "Analytics", "Commerce", "Insights", "Promotion"].map((item) => (
											<li key={item}>
												<Link href="/coming-soon">{item}</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Support */}
								<div>
									<h3 className="mb-4 text-lg font-semibold text-white">Support</h3>
									<ul className="space-y-2 text-neutral-200">
										{["Pricing", "Documentation", "Guides", "API Status", "Live Support"].map((item) => (
											<li key={item}>
												<Link href="/coming-soon">{item}</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Company */}
								<div>
									<h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
									<ul className="space-y-2 text-neutral-200">
										<li>
											<Link href="/About-Us">About Us</Link>
										</li>
										<li>
											<Link href="/coming-soon">Our Blog</Link>
										</li>
										<li>
											<Link href="/coming-soon">Jobs</Link>
										</li>
										<li>
											<Link href="/coming-soon">Press</Link>
										</li>
										<li>
											<Link href="https://meatndoor.com/contact-us.html">Contact Us</Link>
										</li>
									</ul>
								</div>

								{/* Legal */}
								<div>
									<h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
									<ul className="space-y-2 text-neutral-200">
										<li>
											<Link href="https://meatndoor.com/terms-and-conditions.html">Terms & Conditions</Link>
										</li>
										<li>
											<Link href="https://meatndoor.com/privacy-policy.html">Privacy Policy</Link>
										</li>
										<li>
											<Link href="/coming-soon">Catering Services</Link>
										</li>
										<li>
											<Link href="/coming-soon">Customer Relations</Link>
										</li>
										<li>
											<Link href="/coming-soon">Innovation</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
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
