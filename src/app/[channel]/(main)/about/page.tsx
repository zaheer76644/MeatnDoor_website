// // app/about/page.tsx or pages/about.tsx
// import Image from "next/image";

// export default function AboutPage() {
// 	return (
// 		<div className="mx-auto max-w-4xl bg-white px-4 py-8 leading-relaxed text-gray-800">
// 			{/* ABOUT US */}
// 			<p>
// 				We are a modern meat delivery platform built on generations of trust and expertise, combining
// 				traditional knowledge with cutting-edge technology. Founded by <strong>Imran Qureshi</strong>, a
// 				4th-generation meat dealer and wholesaler, Indian government-certified agent with 20 years of
// 				experience from Deonar, Govandi, our mission is to deliver hygienic, high-quality fresh meat right to
// 				your doorstep.
// 				<br />
// 				<br />
// 				We source meat only from trusted suppliers, maintain strict hygiene standards, and use sealed
// 				packaging to ensure freshness. With a fast, reliable delivery system and a user-friendly app designed
// 				by experts in AI, app development, marketing, and finance, we offer a seamless and consistent
// 				experience. Whether you&apos;re a busy household or a meat lover, we bring clean, affordable, and
// 				premium meat to your home—delivered with care every single time.
// 			</p>

// 			{/* WHAT SETS US APART */}
// 			<h2 className="mt-10 text-2xl font-bold text-[#47141e]">What Sets Us Apart</h2>

// 			<h3 className="mt-6 text-xl font-semibold text-[#47141e]">✔️ Generations of Trust</h3>
// 			<p>
// 				Led by Imran Qureshi, a 4th-generation meat dealer and wholesaler, Indian government-certified agent
// 				with 20 years of experience. We source from trusted suppliers, prioritize hygiene, and ensure each cut
// 				meets our strict quality standards.
// 			</p>

// 			<h3 className="mt-6 text-xl font-semibold text-[#47141e]">🚀 Fast, Convenient Delivery</h3>
// 			<p>
// 				Our tech-first service, built under the stewardship of Sayyed Ziauddin (CTO, AI/ML specialist with 10+
// 				years of experience), ensures an intuitive app and seamless ordering. From placing your order to
// 				delivery, efficiency is our promise—often within hours.
// 			</p>

// 			<h3 className="mt-6 text-xl font-semibold text-[#47141e]">💡 Strategic Excellence</h3>
// 			<p>
// 				With Irfan Qureshi steering marketing and growth strategy, we blend academic rigor with real-world
// 				insight. Expect thoughtful planning, brand consistency, and customer-focused campaigns.
// 			</p>

// 			<h3 className="mt-6 text-xl font-semibold text-[#47141e]">📊 Financial Integrity & Growth</h3>
// 			<p>
// 				Sufiyan Mukhtar Khan, our CFO, brings precision and transparency to every financial decision. From
// 				managing budgets to setting scalable processes, he ensures we stay efficient and reliable.
// 			</p>

// 			{/* COMMITMENT */}
// 			<h2 className="mt-10 text-2xl font-bold text-[#47141e]">Our Commitment to You</h2>
// 			<ul className="mt-4 list-none space-y-2">
// 				<li>
// 					<strong>Premium Quality:</strong> Hormone-free, antibiotic-free meat handled under strict hygiene
// 					protocols.
// 				</li>
// 				<li>
// 					<strong>Cold-Chain Assurance:</strong> Freshness maintained via cold storage, sealed packaging, and
// 					trained delivery partners.
// 				</li>
// 				<li>
// 					<strong>Transparent Sourcing:</strong> Honest pricing and traceable supply chain for buying
// 					confidence.
// 				</li>
// 				<li>
// 					<strong>Customer-Centric:</strong> Responsive service, real-time order tracking, flexible payment
// 					modes.
// 				</li>
// 			</ul>

// 			{/* WHY CHOOSE US */}
// 			<h2 className="mt-10 text-2xl font-bold text-[#47141e]">Why Choose Us?</h2>
// 			<p className="mt-3">
// 				India’s online meat market is rapidly growing—yet well over 99% of meat sales still happen through
// 				unregulated channels, often compromising on hygiene and consistency. Modern consumers demand the
// 				convenience of doorstep delivery, without sacrificing freshness or safety.
// 			</p>
// 			<p className="mt-3">We fill that gap with:</p>

// 			<ul className="ml-6 mt-2 list-disc space-y-1">
// 				<li>Expert sourcing and processing</li>
// 				<li>A tech-powered ordering experience</li>
// 				<li>Fast, reliable delivery</li>
// 				<li>Friendly and transparent service</li>
// 			</ul>

// 			{/* TEAM SECTION */}
// 			<div className="py-10">
// 				<h2 className="mb-8 mt-10 text-center text-3xl font-bold text-[#47141e]">Our Team</h2>

// 				<div className="flex flex-wrap justify-center gap-10">
// 					{/* Team Member */}
// 					<TeamCard
// 						name="Imran Qureshi"
// 						role="Founder & Director"
// 						image="/imran.jpeg"
// 						description="20+ years experience · 4th-generation meat seller & wholesaler · Government-certified agent"
// 						link="https://www.linkedin.com/in/imran-qureshi-9723b4377"
// 					/>

// 					<TeamCard
// 						name="Sayyed Ziauddin"
// 						role="Chief Technology Officer"
// 						image="/ziauddin.jpeg"
// 						description="10+ years in AI/ML · E-commerce platforms expert"
// 						link="https://www.linkedin.com/in/sayyed-ziauddin-24aab67a"
// 					/>

// 					<TeamCard
// 						name="Irfan Qureshi"
// 						role="Marketing & Strategy Advisor"
// 						image="/irfan.jpeg"
// 						description="MBA in Marketing · Pharmaceutical analysis expert"
// 						link="https://linkedin.com/in/irfan-ismail-qureshi"
// 					/>

// 					<TeamCard
// 						name="Sufiyan Mukhtar Khan"
// 						role="Chief Financial Officer"
// 						image="/sufiyan.jpeg"
// 						description="Finance & accounts specialist · Operational clarity · Profitability management"
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// /* Reusable Team Card Component */
// type TeamCardProps = {
// 	name: string;
// 	role: string;
// 	image: string;
// 	description: string;
// 	link?: string;
// };

// function TeamCard({ name, role, image, description, link }: TeamCardProps) {
// 	return (
// 		<div className="max-w-xs text-center">
// 			<div className="mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-[#47141e]">
// 				<Image src={image} alt={name} width={150} height={150} className="object-cover" />
// 			</div>

// 			<h3 className="text-xl font-bold text-[#47141e]">{name}</h3>
// 			<p className="mb-2 font-semibold">{role}</p>
// 			<p className="text-sm">{description}</p>

// 			{link && (
// 				<a href={link} target="_blank" className="mt-2 block text-sm text-[#47141e] underline">
// 					LinkedIn Profile
// 				</a>
// 			)}
// 		</div>
// 	);
// }
// app/about/page.tsx

import Image from "next/image";

export default function AboutPage() {
	return (
		<div className="w-full">
			{/* HERO SECTION */}
			<section className="border-b border-[rgba(140,34,60,0.1)] bg-[#47141e] pb-6 pt-[50px] text-center">
				<div className="container mx-auto px-4">
					<h1 className="mb-4 text-4xl font-bold text-white">About Us</h1>
				</div>
			</section>

			{/* MAIN CONTENT */}
			<div className="mx-auto max-w-[800px] bg-white px-4 py-8 font-sans leading-relaxed text-[#333]">
				<p>
					We are a modern meat delivery platform built on generations of trust and expertise, combining
					traditional knowledge with cutting-edge technology. Founded by Imran Qureshi, a 4th-generation meat
					dealer and wholesaler indian government-certified agent 20 years of experience from Deonar, Govandi,
					our mission is to deliver hygienic, high-quality fresh meat right to your doorstep. We source meat
					only from trusted suppliers, maintain strict hygiene standards, and use sealed packaging to ensure
					freshness. With a fast, reliable delivery system and a user-friendly app designed by experts in AI,
					app development, marketing, and finance, we offer a seamless and consistent experience. Whether
					you&apos;re a busy household or a meat lover, we bring clean, affordable, and premium meat to your
					home—delivered with care every single time.
				</p>

				{/* WHAT SETS US APART */}
				<h2 className="mt-10 text-2xl font-semibold text-[#47141e]">What Sets Us Apart</h2>

				<h3 className="mt-6 text-xl font-semibold text-[#47141e]">✔️ Generations of Trust</h3>
				<p>
					Led by Imran Qureshi, a 4th-generation meat dealer and wholesaler indian government-certified agent
					20 years of experience directly to your doorstep. We source from trusted suppliers, prioritize
					hygiene, and ensure each cut meets our strict quality standards.
				</p>

				<h3 className="mt-6 text-xl font-semibold text-[#47141e]">🚀 Fast, Convenient Delivery</h3>
				<p>
					Our tech-first service, built under the stewardship of Sayyed Ziauddin (CTO, AI/ML specialist with
					over a decade of experience), ensures an intuitive app and seamless ordering. From placing your
					order to delivery, efficiency is our promise—often within hours.
				</p>

				<h3 className="mt-6 text-xl font-semibold text-[#47141e]">💡 Strategic Excellence</h3>
				<p>
					With Irfan Qureshi steering marketing and growth strategy, we blend academic rigor (dual
					master&apos;s degrees in Marketing and Pharmaceutical Analysis) with real-world insight. Expect
					thoughtful planning, brand consistency, and customer-focused campaigns.
				</p>

				<h3 className="mt-6 text-xl font-semibold text-[#47141e]">📊 Financial Integrity & Growth</h3>
				<p>
					Sufiyan Mukhtar Khan, our CFO, brings precision and transparency to every financial decision. From
					managing budgets to setting up scalable processes, he ensures we stay efficient and reliable.
				</p>

				{/* OUR COMMITMENT */}
				<h2 className="mt-10 text-2xl font-semibold text-[#47141e]">Our Commitment to You</h2>
				<ul className="mt-3 list-none space-y-2 pl-0">
					<li>
						<strong>Premium Quality:</strong> Hormone-free, antibiotic-free meat cuts handled under strict
						hygiene protocols.
					</li>
					<li>
						<strong>Cold-Chain Assurance:</strong> Freshness maintained via cold storage, sealed packaging,
						and trained delivery partners.
					</li>
					<li>
						<strong>Transparent Sourcing:</strong> Honest pricing and traceable supply chain for buying
						confidence.
					</li>
					<li>
						<strong>Customer-Centric:</strong> Responsive service, real-time order tracking, and flexible
						payment modes (UPI, card, COD).
					</li>
				</ul>

				{/* WHY CHOOSE US */}
				<h2 className="mt-10 text-2xl font-semibold text-[#47141e]">Why Choose Us?</h2>
				<p className="mt-3">
					India&apos;s online meat market is rapidly growing—yet well over 99% of meat sales still happen
					through unregulated channels, often compromising on hygiene and consistency. Modern consumers demand
					the convenience of doorstep delivery, without sacrificing freshness or safety.
				</p>

				<p className="mt-4">We fill that gap with:</p>
				<ul className="mt-2 list-disc space-y-1 pl-6">
					<li>Expert sourcing and processing</li>
					<li>A tech-powered ordering experience</li>
					<li>Fast, reliable delivery</li>
					<li>Friendly and transparent service</li>
				</ul>

				{/* TEAM SECTION */}
				<div className="mt-12">
					<h2 className="text-center text-3xl font-bold text-[#47141e]">Our Team</h2>

					<div className="mt-10 flex flex-wrap justify-center gap-10">
						{/* Member Card Component (reusable) */}
						{[
							{
								name: "Imran Qureshi",
								role: "Founder & Director",
								img: "/imran.jpeg",
								desc: "20+ years experience • 4th-generation meat seller • Government-certified agent",
								link: "https://www.linkedin.com/in/imran-qureshi-9723b4377",
							},
							{
								name: "Sayyed Ziauddin",
								role: "Chief Technology Officer",
								img: "/ziauddin.jpeg",
								desc: "10+ years in AI/ML • E-commerce platforms expert",
								link: "https://www.linkedin.com/in/sayyed-ziauddin-24aab67a",
							},
							{
								name: "Irfan Qureshi",
								role: "Marketing & Strategy Advisor",
								img: "/irfan.jpeg",
								desc: "MBA in Marketing • Pharmaceutical analysis expert",
								link: "https://linkedin.com/in/irfan-ismail-qureshi",
							},
							{
								name: "Sufiyan Mukhtar Khan",
								role: "Chief Financial Officer",
								img: "/sufiyan.jpeg",
								desc: "Finance & accounts specialist • Operational clarity • Profitability management",
								link: "",
							},
						].map((member, i) => (
							<div key={i} className="max-w-[350px] text-center">
								<div className="mx-auto mb-4 h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-[#47141e]">
									<Image
										src={member.img}
										alt={member.name}
										width={150}
										height={150}
										className="h-full w-full object-cover"
									/>
								</div>
								<h3 className="text-xl font-semibold text-[#47141e]">{member.name}</h3>
								<p className="mt-1 font-bold">{member.role}</p>
								<p className="mt-2 whitespace-pre-line text-sm">
									{member.desc}
									{member.link && <br />}
									{member.link && (
										<a href={member.link} target="_blank" className="text-[#47141e] underline">
											LinkedIn Profile
										</a>
									)}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
