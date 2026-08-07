"use client";

import type { ReactElement } from "react";

const sections = [
	{
		question: "1. Acceptance of Terms",
		answer: `By accessing or using the Meatndoor mobile application (the "App") or website Meatndoor.com (the "Website"), you agree to be bound by these Terms and Conditions (the "Terms"). If you do not agree to these Terms, you may not access or use our platform.\n\nThese Terms apply to all users, including customers and any authorised representatives, and form a binding agreement between you and Meatndoor Fresh Foods.`,
	},
	{
		question: "2. Use of Platform",
		answer: `You agree to use the App and Website only for lawful purposes and in a manner consistent with these Terms. You must not:\n\n• Use the platform to place fraudulent or unlawful orders.\n• Misuse, disrupt, or interfere with the App or Website.\n• Provide inaccurate or false information during account registration or checkout.\n• Attempt to access any restricted areas of the platform without authorisation.`,
	},
	{
		question: "3. Eligibility",
		answer: `To place an order, you must be at least 18 years of age and legally capable of entering into binding contracts. By placing an order, you represent that you meet these requirements.`,
	},
	{
		question: "4. Orders & Pricing",
		answer: `All orders are subject to availability. We use reasonable efforts to ensure the accuracy of product descriptions and pricing, but we accept failures.\n• Prices shown are inclusive of applicable taxes unless stated otherwise.\n• Any additional charges such as delivery fees will be clearly shown before you confirm your order.\n• We reserve the right to refuse or cancel any order at our discretion.\n• Payment must be made in full at the time of placing an order.`,
	},
	{
		question: "5. Payment & Payments",
		answer: `Payments are processed securely through third-party payment gateways. By providing payment details, you authorise the transaction. We do not store complete payment card details on our servers. You are responsible for ensuring that the payment method used is valid and authorised for the transaction.`,
	},
	{
		question: "6. Delivery",
		answer: `• We will use reasonable efforts to deliver orders within the estimated delivery time.\n• Delivery times may vary based on your location, traffic, and weather conditions.\n• You must ensure that the delivery address and contact details you provide are accurate.\n• Where fresh meat products are concerned, please ensure the delivery is received promptly to maintain quality.`,
	},
	{
		question: "7. Cancellations & Refunds",
		answer: `Order cancellation and refund requests are handled in accordance with our Cancellation and Refund Policy, which forms part of these Terms. Please refer to that policy for details on eligibility and the refund process.`,
	},
	{
		question: "8. Intellectual Property",
		answer: `All content on the App and Website, including text, logos, images, graphics, and software, is the property of Meatndoor Fresh Foods or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our prior written consent.`,
	},
	{
		question: "9. Limitation of Liability",
		answer: `To the maximum extent permitted by applicable law, Meatndoor Fresh Foods shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the App, Website, or any orders placed through them.`,
	},
	{
		question: "10. Privacy",
		answer: `Your use of the App and Website is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information. Please review our Privacy Policy to understand our practices.`,
	},
	{
		question: "11. Changes to These Terms",
		answer: `We may update these Terms from time to time. Any changes will be effective when we post the revised Terms on the Website or App. Your continued use of the platform after such changes constitutes your acceptance of the updated Terms.`,
	},
	{
		question: "12. Governing Law",
		answer: `These Terms and any disputes arising out of or in connection with them shall be governed by and construed in accordance with the laws of India, subject to the exclusive jurisdiction of the courts located in India.`,
	},
	{
		question: "13. Contact Us",
		answer: `If you have any questions about these Terms, please contact us at:\n\nEmail: support@meatndoor.com\nWebsite: www.meatndoor.com\nCustomer Support Hours: 9 AM – 6 PM (IST), Monday to Saturday`,
		hasLinks: true,
	},
];

function formatText(text: string) {
	const lines = text.split("\n");
	const result: (ReactElement | string)[] = [];
	let bulletItems: string[] = [];
	let listKey = 0;

	const flushBulletList = () => {
		if (bulletItems.length > 0) {
			result.push(
				<ul key={`list-${listKey++}`} className="ml-4 mb-2 list-disc space-y-1">
					{bulletItems.map((item, idx) => (
						<li key={idx}>{item}</li>
					))}
				</ul>,
			);
			bulletItems = [];
		}
	};

	lines.forEach((line, index) => {
		const trimmedLine = line.trim();

		if (trimmedLine.startsWith("•")) {
			bulletItems.push(trimmedLine.substring(1).trim());
		} else {
			flushBulletList();
			if (trimmedLine.includes("@")) {
				const parts = trimmedLine.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
				result.push(
					<p key={index} className="mb-2">
						{parts.map((part, i) =>
							part.includes("@") ? (
								<a
									key={i}
									href={`mailto:${part}`}
									className="text-[#ed4264] underline hover:text-[#ff6b9d]"
								>
									{part}
								</a>
							) : (
								part
							),
						)}
					</p>,
				);
			} else if (trimmedLine) {
				result.push(
					<p key={index} className="mb-2">
						{trimmedLine}
					</p>,
				);
			} else if (index > 0 && lines[index - 1].trim()) {
				result.push(<br key={index} />);
			}
		}
	});

	flushBulletList();
	return result;
}

export default function TermsAndConditionsPage() {
	return (
		<div className="w-full bg-gradient-to-b from-gray-50 to-white">
			{/* HERO SECTION */}
			<section className="relative overflow-hidden border-b border-[rgba(140,34,60,0.1)] bg-gradient-to-br from-[#47141e] via-[#5a1a2a] to-[#47141e] pb-12 pt-16 text-center">
				{/* Decorative Background Elements */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(237,66,100,0.3),transparent_50%)]"></div>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,107,157,0.2),transparent_50%)]"></div>
				</div>
				<div className="container relative z-10 mx-auto px-4">
					<h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">Terms & Conditions</h1>
					<p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl">
						Please read these terms carefully before using Meatndoor.
					</p>
				</div>
			</section>

			{/* MAIN CONTENT */}
			<div className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
				<div className="space-y-4">
					{sections.map((section, index) => (
						<div
							key={index}
							className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
						>
							<h2 className="mb-3 text-xl font-bold text-[#47141e] md:text-2xl">
								{section.question}
							</h2>
							<div className="prose prose-sm max-w-none text-gray-700">
								{formatText(section.answer)}
							</div>
						</div>
					))}
				</div>

				{/* Last Updated */}
				<div className="mt-12 rounded-xl bg-gradient-to-br from-[#47141e] to-[#5a1a2a] p-6 text-center text-white shadow-lg">
					<p className="text-sm opacity-90">
						Last Updated:{" "}
						{new Date().toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>
			</div>
		</div>
	);
}