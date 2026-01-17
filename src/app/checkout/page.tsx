import Link from "next/link";
import { invariant } from "ts-invariant";
import { RootWrapper } from "./pageWrapper";
import { ensureHandlingFee } from "@/lib/handlingFee";

export const metadata = {
	title: "Checkout · MeatnDoor",
};

export default async function CheckoutPage(props: {
	searchParams: Promise<{ checkout?: string; order?: string }>;
}) {
	const searchParams = await props.searchParams;
	invariant(process.env.NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	if (!searchParams.checkout && !searchParams.order) {
		return null;
	}

	if (searchParams.checkout) {
		await ensureHandlingFee(searchParams.checkout);
	}

	return (
		<div className="min-h-dvh bg-white">
			<div className="flex items-center bg-[#47141e] py-4 pl-16 font-bold">
				<Link aria-label="homepage" className="text-white" href="/">
					<img src="/img/log.png" alt="MeatnDoor Logo" width="180" height="80" />
					{/* MeatnDoor */}
				</Link>
			</div>
			<section className="mx-auto flex min-h-dvh max-w-7xl flex-col p-8">
				{/* <div className="flex items-center bg-black font-bold">
					<Link aria-label="homepage" className="text-white" href="/">
						MeatnDoor
					</Link>
				</div> */}
				<h1 className="mt-8 text-3xl font-bold text-[#47141e]">Checkout</h1>

				<section className="mb-12 mt-6 flex-1">
					<RootWrapper saleorApiUrl={process.env.NEXT_PUBLIC_SALEOR_API_URL} />
				</section>
			</section>
		</div>
	);
}
