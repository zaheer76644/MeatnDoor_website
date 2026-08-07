"use client";

import type { ReactElement } from "react";

const sections = [
	{
		question: "Cancellation and Refund Policy",
		answer: `This Cancellation and Refund Policy outlines the terms under which you may cancel an order and request a refund through the Meatndoor mobile app or website Meatndoor.com.`,
		hasLinks: true,
	},
	{
		question: "1. Order Cancellation",
		answer: `• You may cancel an order within 5 minutes of placing it, provided the order has not already been processed or dispatched.\n\n• Once the order has moved to the "Processing" or "Out for Delivery" stage, it cannot be canceled.\n\n• Cancellation requests must be made through the app under the "My Orders" section or by contacting support@meatndoor.com.`,
		hasLinks: true,
	},
	{
		question: "2. Refund Eligibility",
		answer: `Refunds are only issued under the following conditions:\n\n• The item received was damaged, spoiled, or of poor quality (photo evidence may be required).\n• The item delivered was incorrect or missing.\n• The order was canceled within the allowable time window.`,
	},
	{
		question: "3. Non-Refundable Items",
		answer: `Due to the perishable nature of fresh meat products, we do not offer refunds for the following:\n\n• Change of mind after the order is processed or delivered.\n• Delayed delivery due to factors outside our control (traffic, weather, etc.).\n• Incorrect delivery address provided by the user.`,
	},
	{
		question: "4. Refund Process",
		answer: `Once your refund request is approved:\n\n• Refunds will be processed within 5-7 business days.\n• Refunds will be issued to the original payment method used at checkout.\n• You will receive a confirmation email once the refund has been initiated.`,
	},
	{
		question: "5. Contact Us",
		answer: `If you have questions about your order or our refund process, please contact our support team at:\n\nEmail: support@meatndoor.com\nCustomer Support Hours: 9 AM – 6 PM (IST), Monday to Saturday\n\n© 2025 Meatndoor Fresh Foods. All rights reserved.`,
		hasLinks: true,
	},
];

function formatText(text: string) {
	// Split by newlines and format
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
				</ul>
			);
			bulletItems = [];
		}
	};

	lines.forEach((line, index) => {
		const trimmedLine = line.trim();
		
		// Check if line is a bullet point
		if (trimmedLine.startsWith("•")) {
			bulletItems.push(trimmedLine.substring(1).trim());
		} else {
			// Flush any pending bullet list
			flushBulletList();
			
			// Check for URLs
			if (trimmedLine.includes("meatndoor.com") || trimmedLine.includes("Meatndoor.com")) {
				const parts = trimmedLine.split(/(meatndoor\.com|Meatndoor\.com)/i);
				result.push(
					<p key={index} className="mb-2">
						{parts.map((part, i) =>
							/meatndoor\.com/i.test(part) ? (
								<a
									key={i}
									href="https://meatndoor.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#ed4264] underline hover:text-[#ff6b9d]"
								>
									{part}
								</a>
							) : (
								part
							),
						)}
					</p>
				);
			}
			// Check for email
			else if (trimmedLine.includes("@")) {
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
					</p>
				);
			}
			// Check for copyright symbol
			else if (trimmedLine.includes("©")) {
				result.push(
					<p key={index} className="mt-4 text-sm italic text-gray-600">
						{trimmedLine}
					</p>
				);
			}
			// Regular paragraph
			else if (trimmedLine) {
				result.push(
					<p key={index} className="mb-2">
						{trimmedLine}
					</p>
				);
			} else if (index > 0 && lines[index - 1].trim()) {
				// Only add break if previous line had content
				result.push(<br key={index} />);
			}
		}
	});

	// Flush any remaining bullet list
	flushBulletList();

	return result;
}

export default function CancellationRefundPage() {
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
					<h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">Cancellation & Refund Policy</h1>
					<p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl">
						Learn about our cancellation and refund terms for your orders.
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
							<div className="border-t border-gray-200 pt-4">
								<div className="prose prose-sm max-w-none text-gray-700">
									{formatText(section.answer)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Last Updated */}
				<div className="mt-12 rounded-xl bg-gradient-to-br from-[#47141e] to-[#5a1a2a] p-6 text-center text-white shadow-lg">
					<p className="text-sm opacity-90">
						Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
					</p>
				</div>
			</div>
		</div>
	);
}
