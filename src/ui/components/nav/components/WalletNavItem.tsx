import { Wallet } from "lucide-react";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export async function WalletNavItem() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	if (!user) return null;

	return (
		<LinkWithChannel
			href="/wallet"
			className="relative flex items-center text-white hover:text-[#ed4264]"
			aria-label="Wallet"
			title="Wallet"
		>
			<Wallet className="h-6 w-6 shrink-0" aria-hidden="true" />
			<span className="sr-only">Wallet</span>
		</LinkWithChannel>
	);
}
