import Image from "next/image";

export default function Loading() {
	return (
		<div className="flex h-[80vh] w-full items-center justify-center bg-white">
			<div className="relative animate-pulse">
				<Image
					src="/images/loader.png"
					alt="Loading..."
					width={100}
					height={100}
					className="object-contain"
					priority
				/>
			</div>
		</div>
	);
}
