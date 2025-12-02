"use client";

export default function ContactPage() {
	return (
		<main>
			{/* Hero Section */}
			<section className="mb-12 border-b border-[#8c223c]/10 bg-[#47141e] pb-12 pt-[50px] text-center">
				<div className="mx-auto max-w-3xl px-4">
					<h1 className="mb-5 text-4xl font-bold text-white">Get in Touch</h1>
					<p className="text-lg text-white opacity-90">
						We’d love to hear from you! Whether you have a question about your order, feedback about our app,
						or need help with our services — we’re here to help.
					</p>
				</div>
			</section>

			{/* Contact Content */}
			<section className="py-10">
				<div className="mx-auto max-w-6xl px-4">
					{/* Cards Grid */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{/* Email */}
						<div className="rounded-lg border-t-4 border-[#8c223c] bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
							<div className="mb-4 text-4xl text-[#8c223c]">📧</div>
							<h3 className="mb-3 text-xl font-semibold text-[#8c223c]">Email Us</h3>
							<p className="mb-4 text-gray-500">For general support or inquiries:</p>
							<a
								href="mailto:support@meatndoor.com"
								className="inline-block font-medium text-[#8c223c] transition hover:translate-x-1 hover:text-[#6a1a2d]"
							>
								support@meatndoor.com →
							</a>
						</div>

						{/* Call */}
						<div className="rounded-lg border-t-4 border-[#8c223c] bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
							<div className="mb-4 text-4xl text-[#8c223c]">📞</div>
							<h3 className="mb-3 text-xl font-semibold text-[#8c223c]">Call Us</h3>
							<p className="mb-4 text-gray-500">Monday to Saturday, 9 AM to 6 PM:</p>
							<a
								href="tel:+919152941410"
								className="inline-block font-medium text-[#8c223c] transition hover:translate-x-1 hover:text-[#6a1a2d]"
							>
								+91 91529 41410 →
							</a>
						</div>

						{/* WhatsApp */}
						<div className="rounded-lg border-t-4 border-[#8c223c] bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
							<div className="mb-4 text-4xl text-[#8c223c]">💬</div>
							<h3 className="mb-3 text-xl font-semibold text-[#8c223c]">WhatsApp</h3>
							<p className="mb-4 text-gray-500">For quick assistance and chat support</p>
							<a
								href="https://wa.me/919152941410"
								target="_blank"
								className="inline-block font-medium text-[#8c223c] transition hover:translate-x-1 hover:text-[#6a1a2d]"
							>
								Chat with us →
							</a>
						</div>

						{/* Website */}
						<div className="rounded-lg border-t-4 border-[#8c223c] bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
							<div className="mb-4 text-4xl text-[#8c223c]">🌐</div>
							<h3 className="mb-3 text-xl font-semibold text-[#8c223c]">Visit Us</h3>
							<p className="mb-4 text-gray-500">Explore our website for more information</p>
							<a
								href="https://meatndoor.com"
								target="_blank"
								className="inline-block font-medium text-[#8c223c] transition hover:translate-x-1 hover:text-[#6a1a2d]"
							>
								meatndoor.com →
							</a>
						</div>

						{/* Location */}
						<div className="rounded-lg border-t-4 border-[#8c223c] bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
							<div className="mb-4 text-4xl text-[#8c223c]">📍</div>
							<h3 className="mb-3 text-xl font-semibold text-[#8c223c]">Our Location</h3>
							<p className="mb-4 text-gray-500">
								301, A-WING, TARUN BHARAT BUILDING, GOLIBAR ROAD, 7TH ROAD SANTACRUZ EAST, MUMBAI - 400055
							</p>
							<a
								href="https://maps.google.com"
								target="_blank"
								className="inline-block font-medium text-[#8c223c] transition hover:translate-x-1 hover:text-[#6a1a2d]"
							>
								Get directions →
							</a>
						</div>
					</div>

					{/* Bottom Text */}
					<div className="mt-10 text-center">
						<p className="text-gray-500">
							We typically respond to inquiries within 24 hours on business days.
						</p>
						<p>
							Thank you for choosing <strong className="text-[#8c223c]">MEATnDOOR</strong>!
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
