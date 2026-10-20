import { PromoOfferModalDialog } from "./PromoOfferModalDialog";
import { BestSellerCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function PromoOfferModal() {
	try {
		const { collection } = await executeGraphQL(BestSellerCollectionDocument, {
			revalidate: 60,
			withAuth: false,
		});
		const image = collection?.backgroundImage;

		if (!image?.url) {
			return null;
		}

		return (
			<PromoOfferModalDialog
				imageUrl={image.url}
				imageAlt={image.alt || collection?.name || "Promotional offer"}
			/>
		);
	} catch (error) {
		console.error("Failed to load the Best Seller collection image", error);
		return null;
	}
}
