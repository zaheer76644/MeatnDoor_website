import clsx from "clsx";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

export async function Pagination({
	pageInfo,
}: {
	pageInfo: {
		basePathname: string;
		hasNextPage: boolean;
		hasPreviousPage?: boolean;
		readonly nextUrlSearchParams?: URLSearchParams;
		readonly previousUrlSearchParams?: URLSearchParams;
	};
}) {
	const previousHref = pageInfo.hasPreviousPage
		? `${pageInfo.basePathname}${pageInfo.previousUrlSearchParams?.toString() ? `?${pageInfo.previousUrlSearchParams.toString()}` : ""}`
		: "#";
	const nextHref = pageInfo.hasNextPage
		? `${pageInfo.basePathname}?${pageInfo.nextUrlSearchParams?.toString()}`
		: "#";

	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<LinkWithChannel
				href={previousHref}
				className={clsx("px-4 py-2 text-sm font-medium transition-all duration-300", {
					"rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] text-white shadow-md hover:shadow-lg hover:shadow-[#ed4264]/50 hover:scale-105": pageInfo.hasPreviousPage,
					"cursor-not-allowed rounded-lg border border-gray-300 text-gray-400 bg-gray-100": !pageInfo.hasPreviousPage,
					"pointer-events-none": !pageInfo.hasPreviousPage,
				})}
				aria-disabled={!pageInfo.hasPreviousPage}
			>
				Previous page
			</LinkWithChannel>
			<LinkWithChannel
				href={nextHref}
				className={clsx("px-4 py-2 text-sm font-medium transition-all duration-300", {
					"rounded-lg bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] text-white shadow-md hover:shadow-lg hover:shadow-[#ed4264]/50 hover:scale-105": pageInfo.hasNextPage,
					"cursor-not-allowed rounded-lg border border-gray-300 text-gray-400 bg-gray-100": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Next page
			</LinkWithChannel>
		</nav>
	);
}

