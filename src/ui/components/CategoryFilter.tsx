"use client";

import { useState, useTransition, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type CategoriesQuery } from "@/gql/graphql";

type CategoryNode = NonNullable<
	NonNullable<NonNullable<CategoriesQuery["categories"]>["edges"][number]>["node"]
>;

export const CategoryFilter = ({ categories }: { categories: CategoryNode[] }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
	const [isFilterExpanded, setIsFilterExpanded] = useState(true);
	const [isPending, startTransition] = useTransition();
	const [optimisticSelected, setOptimisticSelected] = useState<Set<string>>(new Set());

	const selectedCategories = searchParams.getAll("categories");
	const effectiveSelected = optimisticSelected.size > 0 
		? Array.from(optimisticSelected)
		: selectedCategories;

	// Sync optimistic state with actual searchParams when they change
	useEffect(() => {
		if (optimisticSelected.size > 0) {
			const currentSelected = new Set(selectedCategories);
			const optimisticArray = Array.from(optimisticSelected);
			
			// If searchParams match optimistic state, clear optimistic state
			if (optimisticArray.length === currentSelected.size && 
				optimisticArray.every(id => currentSelected.has(id))) {
				setOptimisticSelected(new Set());
			}
		}
	}, [searchParams, optimisticSelected, selectedCategories]);

	const toggleCategory = (categoryId: string) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(categoryId)) {
				newSet.delete(categoryId);
			} else {
				newSet.add(categoryId);
			}
			return newSet;
		});
	};

	const handleCategoryChange = (categoryId: string, checked: boolean) => {
		// Find the category to check if it has children
		const category = categories.find((cat) => cat.id === categoryId);
		const childCategoryIds = category?.children?.edges?.map((edge) => edge.node.id) || [];

		// Check if this is a child category (find parent)
		const parentCategory = categories.find((cat) => 
			cat.children?.edges?.some((edge) => edge.node.id === categoryId)
		);
		const parentChildIds = parentCategory?.children?.edges?.map((edge) => edge.node.id) || [];

		// Optimistic update - immediately update UI
		setOptimisticSelected((prev) => {
			const newSet = new Set(prev.size > 0 ? prev : selectedCategories);
			if (checked) {
				newSet.add(categoryId);
				// Add all child category IDs (if this is a main category)
				childCategoryIds.forEach((childId) => newSet.add(childId));
			} else {
				newSet.delete(categoryId);
				// Remove all child category IDs (if this is a main category)
				childCategoryIds.forEach((childId) => newSet.delete(childId));
				
				// If this is a child category and all siblings are unchecked, uncheck parent
				if (parentCategory && parentChildIds.length > 0) {
					const allSiblingsUnchecked = parentChildIds.every((siblingId) => 
						siblingId === categoryId || !newSet.has(siblingId)
					);
					if (allSiblingsUnchecked) {
						newSet.delete(parentCategory.id);
					}
				}
			}
			return newSet;
		});

		// Start transition for navigation
		startTransition(() => {
			const newParams = new URLSearchParams(searchParams.toString());
			const currentSelected = newParams.getAll("categories");

			if (checked) {
				// Add main category
				newParams.append("categories", categoryId);
				// Add all child category IDs (if this is a main category)
				childCategoryIds.forEach((childId) => {
					newParams.append("categories", childId);
				});
			} else {
				// Remove main category and all its children (if this is a main category)
				newParams.delete("categories");
				const remainingIds = currentSelected.filter(
					(id) => id !== categoryId && !childCategoryIds.includes(id)
				);
				
				// If this is a child category, check if all siblings are unchecked
				if (parentCategory && parentChildIds.length > 0) {
					const allSiblingsUnchecked = parentChildIds.every((siblingId) => 
						siblingId === categoryId || !currentSelected.includes(siblingId)
					);
					
					// If all siblings are unchecked, also remove parent
					if (allSiblingsUnchecked) {
						const finalIds = remainingIds.filter((id) => id !== parentCategory.id);
						finalIds.forEach((id) => newParams.append("categories", id));
					} else {
						remainingIds.forEach((id) => newParams.append("categories", id));
					}
				} else {
					remainingIds.forEach((id) => newParams.append("categories", id));
				}
			}

			// Reset pagination when filtering
			newParams.delete("cursor");

			// Use replace instead of push for better performance (no history entry)
			router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
		});
	};

	return (
		<div className="w-full flex-shrink-0 md:w-64 md:pr-8">
			<div className="sticky top-8 w-full rounded-xl border border-gray-200 bg-white shadow-lg md:bg-gradient-to-br md:from-white md:to-gray-50 md:p-6 overflow-hidden">
				<button
					type="button"
					onClick={() => setIsFilterExpanded(!isFilterExpanded)}
					className="w-full flex items-center justify-between p-4 transition-colors hover:bg-gray-50 md:p-0 md:mb-6 md:hover:bg-transparent md:pointer-events-none"
					aria-expanded={isFilterExpanded}
					aria-label={isFilterExpanded ? "Collapse categories filter" : "Expand categories filter"}
				>
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ed4264] to-[#47141e] shadow-sm md:h-10 md:w-10">
							<svg className="h-4 w-4 text-white md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
						</div>
						<h3 className="text-lg font-bold text-[#47141e] md:text-xl">Categories</h3>
					</div>
					<svg
						className={`h-5 w-5 text-gray-600 transition-transform duration-200 md:hidden ${isFilterExpanded ? "rotate-180" : ""}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				<div 
					className={`transition-all duration-300 overflow-hidden ${
						isFilterExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 md:max-h-[2000px] md:opacity-100"
					}`}
				>
					<div className="px-4 pb-4 md:px-0 md:pb-0">
						<ul className="space-y-2 md:space-y-3">
							{categories.map((category) => {
						const hasChildren = category.children && category.children.edges.length > 0;
						const isExpanded = expandedCategories.has(category.id);
						
						return (
							<li key={category.id} className="group w-full">
								<div className="flex w-full items-center rounded-lg px-2 py-2 transition-colors hover:bg-gray-100 md:px-3">
									<input
										type="checkbox"
										id={category.id}
										checked={effectiveSelected.includes(category.id)}
										onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
										disabled={isPending}
										className="h-5 w-5 flex-shrink-0 cursor-pointer rounded border-gray-300 text-[#ed4264] transition-all focus:ring-2 focus:ring-[#ed4264] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait"
									/>
									<label 
										htmlFor={category.id} 
										className="ml-3 flex-1 min-w-0 cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-[#47141e]"
									>
										{category.name}
									</label>
									{hasChildren && (
										<button
											type="button"
											onClick={() => toggleCategory(category.id)}
											className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#47141e]"
											aria-expanded={isExpanded}
											aria-label={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
										>
											<svg
												className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
											</svg>
										</button>
									)}
								</div>
								{hasChildren && category.children && category.children.edges && (
									<ul 
										className={`ml-3 mt-2 w-full space-y-1.5 border-l-2 border-gray-200 pl-3 transition-all duration-200 overflow-hidden md:ml-4 md:space-y-2 md:pl-4 ${
											isExpanded ? "block max-h-[1000px] opacity-100" : "hidden max-h-0 opacity-0"
										}`}
									>
										{category.children.edges.map((childEdge) => (
											<li key={childEdge.node.id} className="w-full">
												<div className="flex w-full items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 md:px-3">
													<input
														type="checkbox"
														id={childEdge.node.id}
														checked={effectiveSelected.includes(childEdge.node.id)}
														onChange={(e) => handleCategoryChange(childEdge.node.id, e.target.checked)}
														disabled={isPending}
														className="h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 text-[#ed4264] transition-all focus:ring-2 focus:ring-[#ed4264] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-wait"
													/>
													<label 
														htmlFor={childEdge.node.id} 
														className="ml-2.5 min-w-0 flex-1 cursor-pointer text-xs text-gray-600 transition-colors hover:text-[#47141e]"
													>
														{childEdge.node.name}
													</label>
												</div>
											</li>
										))}
									</ul>
								)}
							</li>
							);
						})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
