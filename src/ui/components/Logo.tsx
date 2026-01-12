"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

// import Logo1 from "@/img/logo.png"; // from src/img folder
import Logo2 from "@/img/log.png"; // from src/img folder

const companyName = "MeatnDoor";

// const logoImage = "/img/logo.png"; // from public/img folder
const logoImage1 = "/img/log.png"; // from public/img folder

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			// <h1 className="flex items-center font-bold" aria-label="homepage">
			// 	{companyName}
			// </h1>
			<div className="flex items-center font-bold" aria-label="homepage">
				{/* {companyName} */}
				<Image alt={companyName} src={logoImage1} width={200} height={50} />
			</div>
		);
	}
	return (
		<div className="flex items-center font-bold">
			<LinkWithChannel aria-label="homepage" href="/">
				{/* {companyName} */}
				<Image alt={companyName} src={Logo2} width={200} height={50} />
			</LinkWithChannel>
		</div>
	);
};
