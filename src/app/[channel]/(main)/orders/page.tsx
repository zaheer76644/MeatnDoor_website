import { PackageX } from "lucide-react";
import { CurrentUserOrderListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
// import { LoginForm } from "@/ui/components/LoginForm";
import { OrderListItem } from "@/ui/components/OrderListItem";
import { MobileLoginForm } from "@/ui/customcomponents/auth/MobileLoginForm";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export default async function OrderPage() {
	const { me: user } = await executeGraphQL(CurrentUserOrderListDocument, {
		cache: "no-cache",
	});
	// this is /orders page

	if (!user) {
		// return <LoginForm />;
		return <MobileLoginForm />;
	}

	const orders = user.orders?.edges || [];

	return (
		<div className="mx-auto max-w-7xl p-8">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900">
				{user.firstName ? user.firstName : user.email}&rsquo;s orders
			</h1>

			{orders.length === 0 ? (
				<div className="mt-8 flex flex-col items-center justify-center py-16 px-4">
					<div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#ed4264]/10 to-[#47141e]/10">
						<PackageX className="h-12 w-12 text-[#ed4264]" strokeWidth={1.5} />
					</div>
					<h2 className="mb-3 text-2xl font-bold text-[#47141e]">No orders yet</h2>
					<p className="mb-6 max-w-md text-center text-gray-600">
						You haven&apos;t placed any orders yet. Start shopping to see your order history here.
					</p>
					<LinkWithChannel
						href="/products"
						className="inline-block rounded-md border border-transparent bg-[#ed4264] px-6 py-3 text-center font-medium text-white transition-colors hover:bg-[#47141e]"
					>
						Browse Products
					</LinkWithChannel>
				</div>
			) : (
				<ul className="mt-8 space-y-6">
					{orders.map(({ node: order }) => {
						return <OrderListItem order={order} key={order.id} />;
					})}
				</ul>
			)}
		</div>
	);
}
