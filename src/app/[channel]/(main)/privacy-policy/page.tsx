"use client";

const sections = [
	{
		question: "Welcome to Meatndoor!",
		answer: `At Meatndoor, accessible via our mobile applications and our Website: www.Meatndoor.com your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you use our platform.\n\nBy using Meatndoor's mobile apps or website, you agree to the collection and use of information in accordance with this Privacy Policy.`,
		hasLinks: true,
	},
	{
		question: "1. Information We Collect",
		answer: `a. Personal Information\n• Full name\n• Mobile number\n• Email address\n• Delivery address\n• Payment information (processed securely through third-party providers)\n\nb. Device & Usage Information\n• IP address\n• Mobile device type and OS\n• App usage logs and browsing behavior\n• Crash reports and diagnostics\n\nc. Location Data\n• With your permission, we may collect and use precise location data to improve order delivery and app experience.`,
	},
	{
		question: "2. How We Use Your Information",
		answer: `• To process and fulfill your orders\n• To personalize your experience\n• To provide customer support\n• To send you order updates and offers\n• To improve our app and services\n• To detect and prevent fraud or misuse`,
	},
	{
		question: "3. Sharing Your Information",
		answer: `• Third-party logistics providers\n• Payment gateways\n• Analytics and marketing tools\n• Government authorities if required\n\nWe do not sell your personal data to third parties.`,
	},
	{
		question: "4. Data Security",
		answer:
			"We use commercially reasonable physical, electronic, and administrative safeguards to protect your personal information. However, no method of transmission or storage is 100% secure.",
	},
	{
		question: "5. Deactivating Your Account",
		answer:
			"You can request to deactivate or permanently delete your Meatndoor account at any time. Upon verification, your account and all associated personal data will be securely removed from our systems, except where retention is required by law.\n\nTo request deactivation, Please request account deactivation using the following link https://meatndoor.com/deactivate",
		hasLinks: true,
	},
	{
		question: "6. Contact Us",
		answer:
			"For questions about this Privacy Policy or your personal data, contact us at:\n\n📧 Email: support@meatndoor.com\n🌐 Website: www.meatndoor.com",
		hasLinks: true,
	},
];

function formatText(text: string) {
	// Split by newlines and format
	const lines = text.split("\n");
	return lines.map((line, index) => {
		// Check if line is a bullet point
		if (line.trim().startsWith("•")) {
			return (
				<li key={index} className="ml-4 list-disc">
					{line.trim().substring(1).trim()}
				</li>
			);
		}
		// Check if line is a numbered item (a., b., c., etc.)
		if (/^[a-z]\.\s/.test(line.trim())) {
			return (
				<div key={index} className="mb-2">
					<span className="font-semibold">{line.trim().substring(0, 2)}</span>
					<span>{line.trim().substring(2)}</span>
				</div>
			);
		}
		// Check for URLs
		if (line.includes("http")) {
			const parts = line.split(/(https?:\/\/[^\s]+)/);
			return (
				<p key={index} className="mb-2">
					{parts.map((part, i) =>
						part.match(/^https?:\/\//) ? (
							<a
								key={i}
								href={part}
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
		if (line.includes("@")) {
			const parts = line.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
			return (
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
		// Regular paragraph
		if (line.trim()) {
			return (
				<p key={index} className="mb-2">
					{line}
				</p>
			);
		}
		return <br key={index} />;
	});
}

export default function PrivacyPolicyPage() {
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
					<h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">Privacy Policy</h1>
					<p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl">
						Your privacy is important to us. Learn how we collect, use, and protect your information.
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
