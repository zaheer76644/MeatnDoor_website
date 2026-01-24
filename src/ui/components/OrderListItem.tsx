"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { GeneratePDFInvoice } from "./GeneratePDFInvoice";
import { formatDate, formatMoney, getHrefForVariant } from "@/lib/utils";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { type OrderLineFragment } from "@/checkout/graphql";
import { getSummaryLineProps } from "@/checkout/sections/Summary/utils";
// import { PaymentStatus } from "@/ui/components/PaymentStatus";

type Props = {
	order: OrderDetailsFragment;
};
const steps = ["Ordered", "Processing", "Delivered"];

// Helper to get the current step index based on order.status
// const getCurrentIndex = (status) => {
// 	switch (status) {
// 		case "UNCONFIRMED":
// 			return 0;
// 		case "UNFULFILLED":
// 			return 1;
// 		case "FULFILLED":
// 			return 2;
// 		case "CANCELED":
// 			return -1; // special case
// 		default:
// 			return 0;
// 	}
// };

// const OrderStatusTimeline = ({ status }) => {
// 	const currentIndex = getCurrentIndex(status);
// 	const stageColors = ["#8c223c", "#f3ac63", "#4CAF50"]; // Ordered, Processing, Delivered

// 	return (
// 		<div className="mt-4 flex w-full items-center justify-between">
// 			{steps.map((step, index) => {
// 				const isActive = index <= currentIndex;
// 				const circleColor = isActive ? stageColors[index] : "#BDBDBD";
// 				const textColor = isActive ? stageColors[index] : "#777";
// 				const lineColor = index < currentIndex ? stageColors[index] : "#BDBDBD";

// 				return (
// 					<React.Fragment key={step}>
// 						<div className="flex flex-1 flex-col items-center">
// 							{/* Circle */}
// 							<div
// 								className="flex items-center justify-center rounded-full font-semibold text-white"
// 								style={{
// 									width: 28,
// 									height: 28,
// 									backgroundColor: circleColor,
// 									zIndex: 10,
// 								}}
// 							>
// 								{index + 1}
// 							</div>

// 							{/* Line */}
// 							{index < steps.length - 1 && (
// 								<div className="mt-2 h-1 w-full" style={{ backgroundColor: lineColor }} />
// 							)}

// 							{/* Label */}
// 							<span className="mt-2 text-center text-sm font-medium" style={{ color: textColor }}>
// 								{step}
// 							</span>
// 						</div>
// 					</React.Fragment>
// 				);
// 			})}
// 		</div>
// 	);
// };

// const getCurrentIndex = (status: any) => {
// 	switch (status) {
// 		case "UNCONFIRMED":
// 			return 0;
// 		case "UNFULFILLED":
// 			return 1;
// 		case "FULFILLED":
// 			return 2;
// 		case "CANCELED":
// 			return -1; // special case
// 		default:
// 			return 0;
// 	}
// };
const getCurrentIndex = (status: string, deliveryDate?: string, deliveryTime?: string) => {
	// Cancelled
	if (status === "CANCELED") return -1;

	// Delivered ONLY when BE updates
	if (status === "FULFILLED") return 2;

	// Fallback
	if (!deliveryDate || !deliveryTime) {
		return status === "UNFULFILLED" ? 1 : 0;
	}

	/**
	 * deliveryDate example: "2025-12-15"
	 * deliveryTime example: "4:30 PM - 6:30 PM"
	 */

	const timePart = deliveryTime.split("-")[0].trim(); // Handles: "4:30 PM", "04:30PM", "4:30PM", "10:30", etc.

	// Extract AM/PM modifier (handles all formats: with/without space, with/without leading zero, 24-hour format)
	let modifier = "";
	let timeStr = timePart;
	
	// Check if timePart ends with AM or PM (case-insensitive, handles both "4:30PM" and "4:30 PM")
	if (timePart.toUpperCase().endsWith("PM")) {
		modifier = "PM";
		timeStr = timePart.slice(0, -2).trim(); // Remove "PM" from end: "4:30PM" → "4:30"
	} else if (timePart.toUpperCase().endsWith("AM")) {
		modifier = "AM";
		timeStr = timePart.slice(0, -2).trim(); // Remove "AM" from end: "4:30AM" → "4:30"
	} else {
		// Fallback: Try splitting by space (for formats like "4:30 PM")
		const parts = timePart.split(" ");
		if (parts.length > 1) {
			timeStr = parts[0];
			modifier = parts[1].toUpperCase();
		}
		// If no modifier found, assume 24-hour format (e.g., "10:30" = 10:30, "22:30" = 22:30)
	}
	
	const [hoursStr, minutesStr] = timeStr.split(":");
	let hours = parseInt(hoursStr, 10);
	const minutes = parseInt(minutesStr, 10);

	// Convert 12-hour format to 24-hour format (only if modifier exists)
	if (modifier === "PM" && hours < 12) hours += 12;
	if (modifier === "AM" && hours === 12) hours = 0;
	// If no modifier, hours are already in 24-hour format (0-23)
	const [year, month, day] = deliveryDate.split("-").map(Number);

	// Create a Date object in IST
	// IST = UTC + 5:30
	const deliveryDateTimeIST = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30));
	// Current IST time
	const nowIST = new Date();
	const processingTimeIST = new Date(deliveryDateTimeIST.getTime() - 2 * 60 * 60 * 1000);
	if (nowIST >= processingTimeIST) {
		return 1; // Processing
	}

	return 0; // Ordered
};

type OrderStatusTimelineProps = {
	status: string;
	deliveryDate?: string;
	deliveryTime?: string;
};

const OrderStatusTimeline = ({ status, deliveryDate, deliveryTime }: OrderStatusTimelineProps) => {
	// const currentIndex = getCurrentIndex(status); // 0 = Ordered, 1 = Processing, 2 = Delivered
	const currentIndex = getCurrentIndex(status, deliveryDate, deliveryTime);
	const stageColors = ["#8c223c", "#f3ac63", "#4CAF50"];

	return (
		<div className="mt-2 flex w-full items-center ">
			{steps.map((step, index) => {
				const isActive = index <= currentIndex;
				const circleColor = isActive ? stageColors[index] : "#BDBDBD";
				const textColor = isActive ? stageColors[index] : "#777";

				// NEW: line follows the circle's active status
				const lineColor = isActive && index < steps.length - 1 ? stageColors[index] : "#BDBDBD";

				return (
					<div key={step} className="items-left flex flex-1 flex-col ">
						{/* Circle + Right Line */}
						<div className="md:ml-9 flex w-full items-center">
							{/* Circle */}
							<div
								className="z-10 flex items-center justify-center rounded-full text-center font-semibold text-white"
								style={{
									width: 28,
									height: 28,
									backgroundColor: circleColor,
								}}
							>
								{index + 1}
							</div>

							{/* Line to NEXT circle */}
							{index < steps.length - 1 && (
								<div className="h-1 flex-1" style={{ backgroundColor: lineColor }} />
							)}
						</div>

						{/* Label below circle */}
						<div className="mt-2 text-sm font-medium md:ml-6" style={{ color: textColor}}>
							{step}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const OrderListItem = ({ order }: Props) => {
	
	const [isOpen, setIsOpen] = useState(false);
	const [handlingFeeAmount, setHandlingFeeAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [totalSavings, setTotalSavings] = useState<{ amount: number; currency: string } | null>(null);
	const [_shippingPriceAmount, setShippingPriceAmount] = useState<{ amount: number; currency: string } | null>(null);
	const [_maxShippingPriceAmount, setMaxShippingPriceAmount] = useState<{ amount: number; currency: string } | null>(null);
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (order?.shippingMethods && Array.isArray(order.shippingMethods) && order.shippingMethods.length > 0) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const minShippingPrice = (order.shippingMethods as Array<{ price: { amount: number; currency: string } }>).reduce((min, method) => {
				const methodAmount = method.price?.amount ?? 0;
				const minAmount = min.price?.amount ?? 0;
				return methodAmount < minAmount ? method : min;
			});
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			if (minShippingPrice?.price) {
				setShippingPriceAmount(minShippingPrice.price as { amount: number; currency: string });
			}
			
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const maxShippingPrice = (order.shippingMethods as Array<{ price: { amount: number; currency: string } }>).reduce((min, method) => {
				const methodAmount = method.price?.amount ?? 0;
				const minAmount = min.price?.amount ?? 0;
				return methodAmount > minAmount ? method : min;
			});
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			if (maxShippingPrice?.price) {
				setMaxShippingPriceAmount(maxShippingPrice.price as { amount: number; currency: string });
			}
		}
	}, [order?.shippingMethods]);

	// Extract and store handling fee amount from order lines
	useEffect(() => {
		const handlingFeeLine = order.lines.find((line) => {
			const { productName } = getSummaryLineProps(line as OrderLineFragment);
			return productName?.toLowerCase() === "handling fee";
		});

		if (handlingFeeLine && "totalPrice" in handlingFeeLine && handlingFeeLine.totalPrice) {
			setHandlingFeeAmount(handlingFeeLine.totalPrice.gross);
		} else {
			setHandlingFeeAmount(null);
		}
	}, [order.lines]);

	// Calculate total savings from all lines
	useEffect(() => {
		let savings = 0;
		let currency = "";

		const filteredLines = order.lines.filter((line) => {
			const { productName } = getSummaryLineProps(line as OrderLineFragment);
			return productName?.toLowerCase() !== "handling fee" && productName?.toLowerCase() !== "delivery fee";
		});
		filteredLines.forEach((line) => {
			if (line.variant && line.unitPrice) {
				let lineSavings = 0;
				let foundSaving = false;

				// Method 1: Try to find "Saving Amount" attribute
				if (line.variant.attributes) {
					for (const attr of line.variant.attributes) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
						const attributeName = (attr.attribute as { name?: string })?.name;
						if (attributeName === "Saving Amount" || attributeName === "saving-amount") {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
							const savingValue = (attr.values as Array<{ translation?: { name?: string }; name?: string }>)?.[0];
							if (savingValue) {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
								const savingAmountStr = savingValue.translation?.name || savingValue.name;
								if (savingAmountStr) {
									const originalPrice = parseFloat(savingAmountStr);
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
									const discountedPrice = parseFloat(String(line.unitPrice.gross.amount || 0));
									lineSavings = (originalPrice - discountedPrice) * line.quantity;
									foundSaving = true;
									break;
								}
							}
						}
					}
				}

				// Method 2: Fallback to undiscountedUnitPrice vs unitPrice
				if (!foundSaving && line.undiscountedUnitPrice) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					const originalPrice = parseFloat(String(line.undiscountedUnitPrice.gross?.amount || 0));
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					const discountedPrice = parseFloat(String(line.unitPrice.gross.amount || 0));
					
					// Only calculate savings if there's a difference
					if (originalPrice > discountedPrice) {
						lineSavings = (originalPrice - discountedPrice) * line.quantity;
					}
				}
				
				if (lineSavings > 0) {
					savings += lineSavings;
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
					if (!currency && line.unitPrice.gross.currency) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
						currency = line.unitPrice.gross.currency ;
					}
				}
				if (_shippingPriceAmount?.amount === 0 &&  _maxShippingPriceAmount?.amount && _maxShippingPriceAmount.amount > 0) {
					savings += _maxShippingPriceAmount?.amount ?? 0;
					if (!currency && _shippingPriceAmount?.currency) {
						currency = _shippingPriceAmount?.currency;
					}
				}
			}
		});

		if (savings > 0 && currency) {
			setTotalSavings({ amount: savings, currency });
		} else {
			setTotalSavings(null);
		}
	}, [order.lines, _shippingPriceAmount, _maxShippingPriceAmount]);
	// console.log(order);
	const cancelOrder = () => {
		alert("please download our app to cancel your order");
	};

	const toggleAccordion = () => {
		setIsOpen(!isOpen);
	};
	const filteredLines = order.lines.filter((line) => {
		const { productName } = getSummaryLineProps(line as OrderLineFragment);
		return productName?.toLowerCase() !== "handling fee" && productName?.toLowerCase() !== "delivery fee";
	});
	return (
		<li className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
			{/* <div className="flex flex-col gap-2 border bg-neutral-200/20 px-6 py-4 md:grid md:grid-cols-4 md:gap-8">
				<dl className="flex flex-col divide-y divide-neutral-200 text-sm md:col-span-3 md:grid md:grid-cols-4 md:gap-6 md:divide-none lg:col-span-2">
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">Order number</dt>
						<dd className="text-neutral-600">{order.number}</dd>
					</div>
					<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">Date placed</dt>
						<dd className="text-neutral-600">
							<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
						</dd>
					</div>
					{/* <div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">Payment status</dt>
						<dd>
							<PaymentStatus status={order.paymentStatus} />
						</dd>
					</div>  
					{order?.voucherCode && (
						<div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
							<dt className="font-medium text-neutral-900">Coupon Applied</dt>
							<dd>
								<h1 className=" text-green-500 "> {order.voucherCode} </h1>
							</dd>
						</div>
					)}
					{/* <div className="flex flex-row items-center justify-between py-4 md:flex-col md:items-start md:gap-y-1">
						<dt className="font-medium text-neutral-900">status</dt>
						<dd>
							<h1> {order.status} </h1>
						</dd>
					</div>  
					<div className="flex w-full flex-col items-center py-4">
						<dt className="mb-4 text-center font-medium text-neutral-900">Status</dt>

						<div className="flex w-full items-center">
							{["Ordered", "Processing", "Delivered"].map((step, index, arr) => {
								let isActive = false;

								if (order.status === "UNCONFIRMED") isActive = index === 0;
								else if (order.status === "UNFULFILLED") isActive = index <= 1;
								else if (order.status === "FULFILLED") isActive = true;
								else if (order.status === "CANCELED") isActive = false;

								const colors = ["#8c223c", "#f3ac63", "#4CAF50"];
								const circleColor = isActive ? colors[index] : "#BDBDBD";
								const textColor = isActive ? colors[index] : "#777";

								return (
									<div key={step} className="flex flex-1 items-center">
										{/* Circle  
										<div
											className="z-10 flex items-center justify-center rounded-full font-semibold text-white"
											style={{
												width: 28,
												height: 28,
												backgroundColor: circleColor,
											}}
										>
											{index + 1}
										</div>

										{/* Line  
										{index < arr.length - 1 && (
											<div
												className="mx-2 h-[2px] flex-1"
												style={{
													backgroundColor:
														index <
														(order.status === "UNCONFIRMED" ? 0 : order.status === "UNFULFILLED" ? 1 : 2)
															? colors[index]
															: "#BDBDBD",
												}}
											/>
										)}

										{/* Label  
										<span
											className="absolute mt-8 w-20 text-center text-sm font-medium"
											style={{ color: textColor }}
										>
											{step}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</dl>
				{/* TODO: Reveal after implementing the order details page.  
				{/* <div className="flex flex-col md:col-span-1 md:flex-row md:items-center lg:col-span-2">
					<LinkWithChannel
						href="#"
						className="flex items-center justify-center rounded border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 focus:bg-neutral-50 md:ml-auto"
					>
						View Order
					</LinkWithChannel>
				</div>  
			</div> */}
			{/* Accordion Header */}
			<button
				type="button"
				onClick={toggleAccordion}
				className="w-full px-6 py-4 text-left transition-colors hover:bg-neutral-50"
			>
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-8 md:justify-between">
						{/* Order number */}
						<div className="flex flex-col">
							<dt className="text-xs font-medium text-neutral-500">Order number</dt>
							<dd className="mt-1 text-sm font-semibold text-neutral-900">{order.number}</dd>
						</div>

						{/* Date placed */}
						<div className="flex flex-col">
							<dt className="text-xs font-medium text-neutral-500">Order placed</dt>
							<dd className="mt-1 text-sm text-neutral-600">
								<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
							</dd>
						</div>

						{/* Delivery Date */}
						<div className="flex flex-col">
							<dt className="text-xs font-medium text-neutral-500">Delivery Date</dt>
							<dd className="mt-1 text-sm text-neutral-900">
								{order?.metadata?.find((a) => a.key === "Delivery_Date")?.value || "N/A"}
							</dd>
						</div>

						{/* Delivery Time */}
						<div className="flex flex-col">
							<dt className="text-xs font-medium text-neutral-500">Delivery Time</dt>
							<dd className="mt-1 text-sm text-neutral-900">
								{order?.metadata?.find((a) => a.key === "Delivery_Time")?.value || "N/A"}
							</dd>
						</div>

						{/* Order Type */}
						<div className="flex flex-col">
							<dt className="text-xs font-medium text-neutral-500">Payment Method</dt>
							<dd className="mt-1 text-sm text-neutral-900">
								{(() => {
									const deliveryMethod = order?.metadata?.find((a) => a.key === "paymentMode")?.value;
									if (deliveryMethod === 'cash_on_delivery') {
										return "Cash on Delivery";
									}
									if (deliveryMethod) {
										return "Online Payment";
									}
									return "N/A";
								})()}
							</dd>
						</div>

						{/* Total amount */}
						<div className="flex flex-col">
							<dt className="text-xs font-medium text-neutral-500">Total amount</dt>
							<dd className="mt-1 text-sm font-semibold text-[#ed4264]">
								{formatMoney(order.total.gross.amount, order.total.gross.currency)}
							</dd>
						</div>
					</div>

					{/* Chevron Icon */}
					<div className="flex items-center justify-end">
						<ChevronDown color="#ed4264"
							className={`h-5 w-5 text-neutral-500 transition-transform duration-200 ${
								isOpen ? "rotate-180" : ""
							}`}
						/>
					</div>
				</div>
			</button>

			{/* Accordion Content */}
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="border-t border-neutral-200 px-6 py-6">
					<div className="space-y-6">
						{/* Order Details Row */}
						<div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center gap-10">
								{/* Coupon Applied */}
							{order?.voucherCode && (
								<div className="flex flex-col">
									<dt className="mb-2 text-xs font-medium text-neutral-500">Coupon Applied</dt>
									<dd className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-green-400 bg-green-50 px-3 py-1.5">
										<span className="text-sm font-bold text-green-700">{order.voucherCode}</span>
										<svg
											className="h-4 w-4 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</dd>
								</div>
							)}

								{/* Status Timeline */}
								<div className="flex flex-1 flex-col">
									<dt className="mb-2 text-xs font-medium text-neutral-500">Status</dt>
									<dd>
										<OrderStatusTimeline
											status={order.status}
											deliveryDate={order?.metadata?.find((a) => a.key === "Delivery_Date")?.value}
											deliveryTime={order?.metadata?.find((a) => a.key === "Delivery_Time")?.value}
										/>
									</dd>
								</div>
							</div>

							{/* Cancel Button - Aligned to end */}
							{String(order.status) === "UNCONFIRMED" && <div className="flex flex-col justify-end md:ml-auto">
								<button
									onClick={cancelOrder}
									className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
								>
									Cancel Order
								</button>
							</div>}
							{String(order.status) === "CANCELED" && 
							<div className="flex flex-col justify-end md:ml-auto">
								<p className="text-sm text-[#ed4264]">Already canceled</p>
							</div>}
						</div>

						{/* Products List */}
						{order.lines.length > 0 ? (
							<div>
								<h3 className="mb-4 text-sm font-semibold text-neutral-900">Order Items</h3>
								<div className="rounded-lg border border-neutral-200">
									<table className="w-full text-sm">
										<thead className="sr-only">
											<tr>
												<td>product</td>
												<td className="max-md:hidden">quantity and unit price</td>
												<td>price</td>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{filteredLines.map((item) => {
												if (!item.variant) {
													return null;
												}

												const product = item.variant.product;

												return (
													<tr key={product.id} className="hover:bg-neutral-50">
														<td className="p-4 md:w-[60%] lg:w-[70%]">
															<div className="flex flex-row items-center">
																{product.thumbnail && (
																	<div className="mr-3 aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 md:mr-6 md:h-20 md:w-20">
																		<Image
																			src={product.thumbnail.url}
																			alt={product.thumbnail.alt ?? ""}
																			width={200}
																			height={200}
																			className="h-full w-full object-contain object-center"
																		/>
																	</div>
																)}
																<div>
																	<LinkWithChannel
																		href={getHrefForVariant({
																			productSlug: product.slug,
																			variantId: item.variant.id,
																		})}
																		className="font-medium text-neutral-900 hover:text-[#ed4264]"
																	>
																		{product.name}
																	</LinkWithChannel>
																	{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
																		<p className="mt-1 text-xs text-neutral-500">Variant: {item.variant.name}</p>
																	)}
																</div>
															</div>
														</td>
														<td className="py-4 pr-6 text-neutral-600 max-md:hidden">
															{item.quantity} ×{" "}
															{item.variant.pricing?.price &&
																formatMoney(
																	item.variant.pricing.price.gross.amount,
																	item.variant.pricing.price.gross.currency,
																)}
														</td>
														<td className="p-4 text-end">
															<div className="flex flex-col gap-1">
																<span className="font-semibold text-neutral-900">
																	{item.variant.pricing?.price &&
																		formatMoney(
																			item.variant.pricing.price.gross.amount * item.quantity,
																			item.variant.pricing.price.gross.currency,
																		)}
																</span>
																{item.quantity > 1 && (
																	<span className="text-xs text-neutral-500 md:hidden">
																		{item.quantity} ×{" "}
																		{item.variant.pricing?.price &&
																			formatMoney(
																				item.variant.pricing.price.gross.amount,
																				item.variant.pricing.price.gross.currency,
																			)}
																	</span>
																)}
															</div>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						) : (
							<div className="py-4 text-center text-sm text-neutral-500">No items in this order</div>
						)}
						{/* Address and Billing Details */}
						<div className="grid grid-cols-1 gap-6 border-t border-neutral-200 pt-6 md:grid-cols-2">
							{/* Delivery Address */}
							{order.shippingAddress && (
								<div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
									<h3 className="mb-3 text-sm font-semibold text-neutral-900">Delivery Address</h3>
									<p className="text-sm text-neutral-600">
										{order.shippingAddress.streetAddress1}
										{order.shippingAddress.streetAddress2 && (
											<>
												<br />
												{order.shippingAddress.streetAddress2}
											</>
										)}
										<br />
										{order.shippingAddress.city} - {order.shippingAddress.postalCode}
										<br />
										{order.shippingAddress.country.country}
										<br />
										<span className="font-medium">Phone:</span> {order.shippingAddress.phone}
									</p>
								</div>
							)}

							{/* Bill Details */}
							<div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
								<h3 className="mb-3 text-sm font-semibold text-neutral-900">Bill Details</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-neutral-600">Items total:</span>
										<span className="font-medium text-neutral-900">
											{formatMoney(
												order.lines.reduce((sum, item) => {
													if (!item.variant?.pricing?.price) return sum;
													return sum + item.variant.pricing.price.gross.amount * item.quantity;
												}, 0) - (handlingFeeAmount?.amount || 0),
												order.lines[0]?.variant?.pricing?.price?.gross.currency || "INR",
											)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">Delivery Charge:</span>
										<span className="font-medium text-neutral-900">
											{order.shippingPrice.gross.amount === 0
												? "Free"
												: formatMoney(order.shippingPrice.gross.amount, order.shippingPrice.gross.currency)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">Handling fee:</span>
										<span className="font-medium text-neutral-900">
											{handlingFeeAmount
												? formatMoney(handlingFeeAmount.amount, handlingFeeAmount.currency)
												: formatMoney(0, order.total.gross.currency)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">Discount applied:</span>
										<span className="font-medium text-green-600">
											{order?.discount?.amount
												? formatMoney(order.discount.amount, order.discount.currency)
												: formatMoney(0, order.total.gross.currency)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">Instant discount:</span>
										<span className="font-medium text-neutral-900">
											{formatMoney(0, order.total.gross.currency)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-600">MeatnDoor cash:</span>
										<span className="font-medium text-neutral-900">
											{formatMoney(0, order.total.gross.currency)}
										</span>
									</div>
									<div className="border-t border-neutral-300 pt-2">
										<div className="flex justify-between">
											<span className="font-semibold text-neutral-900">Total amount:</span>
											<span className="text-lg font-bold text-[#ed4264]">
												{formatMoney(order.total.gross.amount, order.total.gross.currency)}
											</span>
										</div>
									</div>
									{totalSavings && totalSavings.amount > 0 && (
										<div className="mt-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3">
											<div className="flex flex-row items-center justify-between">
												<div className="flex items-center gap-2">
													<p className="font-semibold text-green-700">You saved</p>
												</div>
												<span className="text-green-600 font-bold text-lg">
													{formatMoney(totalSavings.amount, totalSavings.currency)}
												</span>
											</div>
										</div>
									)}
								</div>
							</div>
							<div></div>
									{String(order.status) === "FULFILLED" && (
										<GeneratePDFInvoice
											order={order}
											deliveryDate={order.metadata?.find((m) => m.key === "Delivery_Date")?.value}
											deliveryTime={order.metadata?.find((m) => m.key === "Delivery_Time")?.value}
											handlingFee={handlingFeeAmount?.amount || 0}
										/>
									)}
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};

// needed to test for processing bf 2 hours
// const OrderStatusTimeline = ({ status, createdAt }: OrderStatusTimelineProps) => {
// 	const currentIndex = getCurrentIndex(status, createdAt);
// 	const stageColors = ["#8c223c", "#f3ac63", "#4CAF50"];

// 	return (
// 		<div className="mt-6 flex w-full items-center">
// 			{steps.map((step, index) => {
// 				const isActive = index <= currentIndex;
// 				const circleColor = isActive ? stageColors[index] : "#BDBDBD";
// 				const textColor = isActive ? stageColors[index] : "#777";
// 				const lineColor = isActive && index < steps.length - 1 ? stageColors[index] : "#BDBDBD";

// 				return (
// 					<div key={step} className="items-left flex flex-1 flex-col">
// 						<div className="ml-9 flex w-full items-center">
// 							<div
// 								className="z-10 flex items-center justify-center rounded-full text-center font-semibold text-white"
// 								style={{
// 									width: 28,
// 									height: 28,
// 									backgroundColor: circleColor,
// 								}}
// 							>
// 								{index + 1}
// 							</div>

// 							{index < steps.length - 1 && (
// 								<div className="h-1 flex-1" style={{ backgroundColor: lineColor }} />
// 							)}
// 						</div>

// 						<div className="mt-2 text-sm font-medium" style={{ color: textColor }}>
// 							{step}
// 						</div>
// 					</div>
// 				);
// 			})}
// 		</div>
// 	);
// };
