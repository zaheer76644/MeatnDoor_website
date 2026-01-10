// import { useEffect, useState } from "react";
import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";

export const ProductList = ({
	products,
	cartItems = {},
}: {
	products: readonly ProductListItemFragment[];
	cartItems?: Record<string, { lineId: string; quantity: number }>;
}) => {

// 	const isOutOfStock = (item: any) =>
//   item?.variants?.every(
//     (variant: any) => variant?.quantityAvailable === 0
//   );

// const getSortIndex = (item: any) =>
//   item?.attributes
//     ?.find((attr: any) => attr.attribute?.name === "Sort index")
//     ?.values?.[0]?.name;
//     const filteredProducts = [...products]
//     .filter((item) => item.category?.name)
//     .sort((a, b) => {
//       const aOut = isOutOfStock(a);
//       const bOut = isOutOfStock(b);

//       // 🔴 Out-of-stock to bottom
//       if (aOut && !bOut) return 1;
//       if (!aOut && bOut) return -1;

//       const aVal = Number(getSortIndex(a)) || 0;
//       const bVal = Number(getSortIndex(b)) || 0;

//       if (!aVal && !bVal) return 0;
//       if (!aVal) return 1;
//       if (!bVal) return -1;

//       return aVal - bVal;
//     });
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-4"
		>
			{[...products]
				.sort((a, b) => {
					const qtyA = a.variants?.[0]?.quantityAvailable ?? 0;
					const qtyB = b.variants?.[0]?.quantityAvailable ?? 0;
					if (qtyA > 0 && qtyB <= 0) return -1;
					if (qtyA <= 0 && qtyB > 0) return 1;
					return 0;
				})
				.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					priority={index < 2}
					loading={index < 3 ? "eager" : "lazy"}
					cartItem={
						product.variants?.[0]?.id ? cartItems[product.variants[0].id] : undefined
					}
				/>
			))}
		</ul>
	);
};

// "use client";
// import { useState, useMemo } from "react";
// import { ProductElement } from "./ProductElement";
// import { type ProductListItemFragment } from "@/gql/graphql";

// export const ProductList = ({ products }: { products: readonly ProductListItemFragment[] }) => {
// 	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
// 	const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
// 	const [selectedMake, setSelectedMake] = useState<string | null>(null);
// 	const [searchQuery, setSearchQuery] = useState<string>("");

// 	// Define categories with their colors
// 	const categoryColors: Record<string, string> = {
// 		Component: "bg-[#3352a2]", // Blue
// 		Hardware: "bg-[#e15241]", // Red
// 		AutomationProducts: "bg-[#4caf50]", // Green
// 		smps: "bg-[#ff9800]", // Orange
// 		circuits: "bg-[#9c27b0]", // Purple
// 		frames: "bg-[#9c27b0]", // Purple
// 		extras: "bg-[#9c27b0]", // Purple
// 	};

// 	const productTypeColors: Record<string, string> = {
// 		Capacitor: "bg-[#2196f3]", // Light Blue
// 		Relay: "bg-[#ff5722]", // Deep Orange
// 		Transistors: "bg-[#8bc34a]", // Light Green
// 		SPMS: "bg-[#9c27b0]", // Purple
// 		PLC: "bg-[#e15241]", // Red
// 		// Add more product types as needed
// 	};

// 	const makeColors: Record<string, string> = {
// 		Omron: "bg-[#e15241]", // Deep Purple
// 		Siemens: "bg-[#e15241]", // Teal
// 		// Add more makes as needed
// 	};

// 	// Extract categories that exist in the product data
// 	const availableCategories = useMemo(() => {
// 		const categorySet = new Set<string>();
// 		products.forEach((product) => {
// 			if (product.category?.name) {
// 				categorySet.add(product.category.name);
// 			}
// 		});
// 		const categories = Array.from(categorySet);
// 		console.log("Available categories:", categories);
// 		return Array.from(categorySet);
// 	}, [products]);

// 	const availableProductTypes = useMemo(() => {
// 		const productTypeSet = new Set<string>();
// 		products.forEach((product) => {
// 			if (product?.productType?.name) {
// 				productTypeSet.add(product.productType.name);
// 			}
// 		});
// 		return Array.from(productTypeSet);
// 	}, [products]);

// 	// Extract available makes from product attributes
// 	const availableMakes = useMemo(() => {
// 		const makeSet = new Set<string>();
// 		products.forEach((product) => {
// 			if (product.attributes) {
// 				const makeAttribute = product.attributes.find((attr) => attr.attribute?.name === "Make");

// 				if (makeAttribute && makeAttribute.values && makeAttribute.values.length > 0) {
// 					// Assuming the value has a name property
// 					makeAttribute.values.forEach((value) => {
// 						if (value.name) {
// 							makeSet.add(value.name);
// 						}
// 					});
// 				}
// 			}
// 		});
// 		return Array.from(makeSet);
// 	}, [products]);

// 	// Get make value from a product
// 	const getProductMake = (product: ProductListItemFragment): string | null => {
// 		if (product.attributes) {
// 			const makeAttribute = product.attributes.find((attr) => attr.attribute?.name === "Make");

// 			if (makeAttribute && makeAttribute.values && makeAttribute.values.length > 0) {
// 				return makeAttribute.values[0].name || null;
// 			}
// 		}
// 		return null;
// 	};

// 	// Filter products based on selected filters
// 	const filteredProducts = useMemo(() => {
// 		return products.filter((product) => {
// 			// Search filter
// 			const searchLower = searchQuery.toLowerCase();
// 			const productName = product.name?.toLowerCase() || "";
// 			const categoryName = product.category?.name?.toLowerCase() || "";
// 			const productTypeName = product.productType?.name?.toLowerCase() || "";
// 			const makeName = getProductMake(product)?.toLowerCase() || "";

// 			const matchesSearch =
// 				searchQuery === "" ||
// 				productName.includes(searchLower) ||
// 				categoryName.includes(searchLower) ||
// 				productTypeName.includes(searchLower) ||
// 				makeName.includes(searchLower);

// 			// Dropdown filters
// 			const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
// 			const matchesProductType = !selectedProductType || product.productType?.name === selectedProductType;

// 			// Check if product matches selected make
// 			let matchesMake = !selectedMake;
// 			if (selectedMake && product.attributes) {
// 				const makeAttribute = product.attributes.find((attr) => attr.attribute?.name === "Make");

// 				if (makeAttribute && makeAttribute.values) {
// 					matchesMake = makeAttribute.values.some((value) => value.name === selectedMake);
// 				}
// 			}

// 			return matchesSearch && matchesCategory && matchesProductType && matchesMake;
// 		});
// 	}, [products, searchQuery, selectedCategory, selectedProductType, selectedMake]);

// 	// Handle search input change
// 	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setSearchQuery(e.target.value);
// 	};

// 	// Handle category change
// 	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		const value = e.target.value;
// 		setSelectedCategory(value === "all" ? null : value);
// 	};

// 	// Handle product type change
// 	const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		const value = e.target.value;
// 		setSelectedProductType(value === "all" ? null : value);
// 	};

// 	// Handle make change
// 	const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// 		const value = e.target.value;
// 		setSelectedMake(value === "all" ? null : value);
// 	};

// 	// Clear all filters
// 	const clearAllFilters = () => {
// 		setSearchQuery("");
// 		setSelectedCategory(null);
// 		setSelectedProductType(null);
// 		setSelectedMake(null);
// 	};

// 	console.log(products, "all product");

// 	return (
// 		<div>
// 			{/* Search Bar */}
// 			<div className="mb-6">
// 				<div className="relative">
// 					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
// 						<svg
// 							className="h-5 w-5 text-gray-400"
// 							fill="none"
// 							stroke="currentColor"
// 							viewBox="0 0 24 24"
// 							xmlns="http://www.w3.org/2000/svg"
// 						>
// 							<path
// 								strokeLinecap="round"
// 								strokeLinejoin="round"
// 								strokeWidth="2"
// 								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// 							></path>
// 						</svg>
// 					</div>
// 					<input
// 						type="text"
// 						value={searchQuery}
// 						onChange={handleSearchChange}
// 						placeholder="Search by Product Name, Category, product type, or make..."
// 						className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-[#3352a2] focus:outline-none focus:ring-1 focus:ring-[#3352a2]"
// 					/>
// 					{searchQuery && (
// 						<button
// 							onClick={() => setSearchQuery("")}
// 							className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
// 						>
// 							<svg
// 								className="h-5 w-5"
// 								fill="none"
// 								stroke="currentColor"
// 								viewBox="0 0 24 24"
// 								xmlns="http://www.w3.org/2000/svg"
// 							>
// 								<path
// 									strokeLinecap="round"
// 									strokeLinejoin="round"
// 									strokeWidth="2"
// 									d="M6 18L18 6M6 6l12 12"
// 								></path>
// 							</svg>
// 						</button>
// 					)}
// 				</div>
// 			</div>
// 			{/* Filters Section */}
// 			<div className="mb-8 flex flex-wrap gap-6">
// 				{/* Category Dropdown Filter */}
// 				<div className="flex items-center gap-3">
// 					<label htmlFor="category-filter" className="text-lg font-semibold">
// 						Filter by Category:
// 					</label>
// 					<div className="relative">
// 						<select
// 							id="category-filter"
// 							value={selectedCategory || "all"}
// 							onChange={handleCategoryChange}
// 							className="appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-sm focus:border-[#3352a2] focus:outline-none focus:ring-1 focus:ring-[#3352a2]"
// 						>
// 							<option value="all">All Products</option>
// 							{availableCategories.map((category) => (
// 								<option key={category} value={category}>
// 									{category}
// 								</option>
// 							))}
// 						</select>
// 					</div>
// 					{selectedCategory && (
// 						<div
// 							className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white ${
// 								categoryColors[selectedCategory] || "bg-gray-500"
// 							}`}
// 						>
// 							{selectedCategory}
// 						</div>
// 					)}
// 				</div>

// 				{/* Product Type Filter */}
// 				{/* <div className="flex items-center gap-3">
// 					<label htmlFor="product-type-filter" className="text-lg font-semibold">
// 						Filter by Product Type:
// 					</label>
// 					<div className="relative">
// 						<select
// 							id="product-type-filter"
// 							value={selectedProductType || "all"}
// 							onChange={handleProductTypeChange}
// 							className="appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-sm focus:border-[#3352a2] focus:outline-none focus:ring-1 focus:ring-[#3352a2]"
// 						>
// 							<option value="all">All Types</option>
// 							{availableProductTypes.map((type) => (
// 								<option key={type} value={type}>
// 									{type}
// 								</option>
// 							))}
// 						</select>
// 					</div>
// 					{selectedProductType && (
// 						<div
// 							className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white ${
// 								productTypeColors[selectedProductType] || "bg-gray-500"
// 							}`}
// 						>
// 							{selectedProductType}
// 						</div>
// 					)}
// 				</div> */}

// 				{/* Make Filter */}
// 				{/* <div className="flex items-center gap-3">
// 					<label htmlFor="make-filter" className="text-lg font-semibold">
// 						Filter by Make:
// 					</label>
// 					<div className="relative">
// 						<select
// 							id="make-filter"
// 							value={selectedMake || "all"}
// 							onChange={handleMakeChange}
// 							className="appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-sm focus:border-[#3352a2] focus:outline-none focus:ring-1 focus:ring-[#3352a2]"
// 						>
// 							<option value="all">All Makes</option>
// 							{availableMakes.map((make) => (
// 								<option key={make} value={make}>
// 									{make}
// 								</option>
// 							))}
// 						</select>
// 					</div>
// 					{selectedMake && (
// 						<div
// 							className={`ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white ${
// 								makeColors[selectedMake] || "bg-red-500"
// 							}`}
// 						>
// 							{selectedMake}
// 						</div>
// 					)}
// 				</div> */}
// 			</div>
// 			{/* Active Filters Summary */}
// 			{(searchQuery || selectedCategory || selectedProductType || selectedMake) && (
// 				<div className="mb-6 flex flex-wrap items-center gap-2 rounded-md bg-gray-50 p-3">
// 					<span className="font-medium text-gray-700">Active filters:</span>

// 					{searchQuery && (
// 						<span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
// 							Search: {searchQuery}
// 							<button onClick={() => setSearchQuery("")} className="ml-1 text-blue-600 hover:text-blue-800">
// 								&times;
// 							</button>
// 						</span>
// 					)}

// 					{selectedCategory && (
// 						<span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
// 							Category: {selectedCategory}
// 							<button
// 								onClick={() => setSelectedCategory(null)}
// 								className="ml-1 text-blue-600 hover:text-blue-800"
// 							>
// 								&times;
// 							</button>
// 						</span>
// 					)}

// 					{selectedProductType && (
// 						<span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
// 							Type: {selectedProductType}
// 							<button
// 								onClick={() => setSelectedProductType(null)}
// 								className="ml-1 text-blue-600 hover:text-blue-800"
// 							>
// 								&times;
// 							</button>
// 						</span>
// 					)}

// 					{selectedMake && (
// 						<span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
// 							Make: {selectedMake}
// 							<button
// 								onClick={() => setSelectedMake(null)}
// 								className="ml-1 text-blue-600 hover:text-blue-800"
// 							>
// 								&times;
// 							</button>
// 						</span>
// 					)}

// 					<button
// 						onClick={clearAllFilters}
// 						className="ml-auto text-sm font-medium text-[#3352a2] hover:underline"
// 					>
// 						Clear all filters
// 					</button>
// 				</div>
// 			)}

// 			{/* Product List */}
// 			{filteredProducts.length > 0 ? (
// 				<ul
// 					role="list"
// 					data-testid="ProductList"
// 					className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
// 				>
// 					{filteredProducts.map((product, index) => (
// 						<ProductElement
// 							key={product.id}
// 							product={product}
// 							priority={index < 2}
// 							loading={index < 3 ? "eager" : "lazy"}
// 						/>
// 					))}
// 				</ul>
// 			) : (
// 				<div className="mt-8 rounded-lg bg-gray-50 py-12 text-center">
// 					<p className="text-gray-500">
// 						No products found
// 						{selectedCategory && ` in the ${selectedCategory} category`}
// 						{selectedProductType && ` with type ${selectedProductType}`}
// 						{selectedMake && ` from ${selectedMake}`}.
// 					</p>
// 					<button
// 						className="mt-4 text-[#3352a2] underline"
// 						onClick={() => {
// 							setSelectedCategory(null);
// 							setSelectedProductType(null);
// 							setSelectedMake(null);
// 						}}
// 					>
// 						View all products
// 					</button>
// 				</div>
// 			)}
// 		</div>
// 	);
// };
