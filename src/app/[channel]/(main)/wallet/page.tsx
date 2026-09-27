import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { WalletPageClient } from "@/ui/components/wallet/WalletPageClient";

export const metadata = {
	title: "Wallet | MeatnDoor",
	description: "MeatnDoor Cash wallet balance and transactions",
};

export default async function WalletPage() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	const userName =
		[user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
		user?.email?.split("@")[0] ||
		null;

	return <WalletPageClient isLoggedIn={!!user} userName={userName} />;
}
