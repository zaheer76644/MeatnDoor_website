import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";

export function Header({ channel }: { channel: string }) {
	return (
		<header
			// bg-neutral-100/50
			className="sticky top-0 z-20 bg-[#47141e]   backdrop-blur-md"
		>
			<div className="mx-auto container px-4 sm:px-0">
				<div className="flex h-16 justify-between gap-4 md:gap-8">
					<Logo />
					<Nav channel={channel} />
				</div>
			</div>
		</header>
	);
}
