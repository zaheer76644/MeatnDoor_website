"use client";

import { useRouter, usePathname } from "next/navigation";
import { SearchIcon, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const SearchBar = ({ channel }: { channel: string }) => {
	const router = useRouter();
	const pathname = usePathname();
	const [searchValue, setSearchValue] = useState("");
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Track previous pathname to detect navigation away from search page
	const prevPathnameRef = useRef<string>(pathname);
	
	// Clear search bar when navigating away from search page (but not while typing)
	useEffect(() => {
		const isOnSearchPage = pathname.includes("/search");
		const wasOnSearchPage = prevPathnameRef.current.includes("/search");
		
		// Only clear if we're navigating AWAY from search page (not when arriving at search page)
		if (wasOnSearchPage && !isOnSearchPage) {
			// User navigated away from search page, clear the search bar
			setSearchValue("");
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		}
		
		// Update the previous pathname
		prevPathnameRef.current = pathname;
	}, [pathname]);

	useEffect(() => {
		// Clear previous timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Only search if there's a value and it's at least 2 characters
		if (searchValue.trim().length >= 2) {
			timeoutRef.current = setTimeout(() => {
				router.push(
					`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(searchValue.trim())}`
				);
			}, 500); // Wait 500ms after user stops typing
		}

		// Cleanup function
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [searchValue, channel, router]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchValue.trim().length > 0) {
			router.push(
				`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(searchValue.trim())}`
			);
		}
	};

	const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSearchValue("");
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="group relative my-2 flex w-full items-center justify-items-center text-sm lg:w-80"
		>
			<label className="w-full">
				<span className="sr-only">search for products</span>
				<input
					type="text"
					name="search"
					value={searchValue}
					onChange={handleChange}
					placeholder="Search for products..."
					autoComplete="on"
					className="h-10 w-full rounded-md border border-[#ed4264] bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-[#ed4264] focus:ring-[#ed4264]"
				/>
			</label>
			<div className="absolute inset-y-0 right-0">
				{searchValue.trim().length > 0 ? (
					<button
						type="button"
						onClick={handleClear}
						className="inline-flex aspect-square w-10 items-center justify-center text-[#ed4264] hover:text-neutral-700 focus:text-neutral-700 transition-colors"
					>
						<span className="sr-only">clear search</span>
						<X aria-hidden className="h-5 w-5 text-[#ed4264]" />
					</button>
				) : (
					<div
						className="inline-flex aspect-square w-10 items-center justify-center text-[#ed4264] hover:text-neutral-700 focus:text-neutral-700 transition-colors"
					>
						<SearchIcon aria-hidden className="h-5 w-5 text-[#ed4264]" />
					</div>
				)}
			</div>
		</form>
	);
};
