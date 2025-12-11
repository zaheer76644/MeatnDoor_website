"use client";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { formatDate, formatMoney, getHrefForVariant } from "@/lib/utils";
import { type OrderDetailsFragment } from "@/gql/graphql";
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

const getCurrentIndex = (status: any) => {
	switch (status) {
		case "UNCONFIRMED":
			return 0;
		case "UNFULFILLED":
			return 1;
		case "FULFILLED":
			return 2;
		case "CANCELED":
			return -1; // special case
		default:
			return 0;
	}
};
type OrderStatusTimelineProps = {
	status: string; // or specific union below
};

const OrderStatusTimeline = ({ status }: OrderStatusTimelineProps) => {
	const currentIndex = getCurrentIndex(status); // 0 = Ordered, 1 = Processing, 2 = Delivered
	const stageColors = ["#8c223c", "#f3ac63", "#4CAF50"];

	return (
		<div className="mt-6 flex w-full items-center ">
			{steps.map((step, index) => {
				const isActive = index <= currentIndex;
				const circleColor = isActive ? stageColors[index] : "#BDBDBD";
				const textColor = isActive ? stageColors[index] : "#777";

				// NEW: line follows the circle's active status
				const lineColor = isActive && index < steps.length - 1 ? stageColors[index] : "#BDBDBD";

				return (
					<div key={step} className="items-left flex flex-1 flex-col ">
						{/* Circle + Right Line */}
						<div className="ml-9 flex w-full items-center">
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
						<div className="mt-2 text-sm font-medium" style={{ color: textColor }}>
							{step}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const OrderListItem = ({ order }: Props) => {
	// console.log(order);
	const cancelOrder = () => {
		alert("please download our app to cancel your order");
	};

	return (
		<li className="bg-white">
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
			<div className="flex flex-col md:flex-row md:items-start md:gap-8">
				{/* Order number */}
				<div className="flex flex-col md:flex-[0.5]">
					<dt className="font-medium text-neutral-900">Order number</dt>
					<dd className="text-neutral-600">{order.number}</dd>
				</div>

				{/* Date placed */}
				<div className="flex flex-col md:flex-[0.5]">
					<dt className="font-medium text-neutral-900">Order placed at</dt>
					<dd className="text-neutral-600">
						<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
					</dd>
				</div>

				{/* Coupon Applied (optional) */}
				{order?.voucherCode && (
					<div className="flex flex-col md:flex-[0.5]">
						<dt className="font-medium text-neutral-900">Coupon Applied</dt>
						<dd className="text-green-500">{order.voucherCode}</dd>
					</div>
				)}

				{/* Status */}
				<div className="flex flex-col md:flex-[1]">
					<dt className="text-center font-medium text-neutral-900">Status</dt>
					<dd className="text-center">
						<OrderStatusTimeline status={order.status} />
					</dd>
				</div>

				{/* Buttons */}
				<div className="flex flex-col md:flex-[0.5]">
					<dt className="font-medium text-neutral-900">Delivery at:</dt>
					<dt className="font-medium text-neutral-900">
						{order?.metadata?.find((a) => a.key === "Delivery_Date")?.value}
					</dt>
					<dt className="font-medium text-neutral-900">Between:</dt>
					<dt className="font-medium text-neutral-900">
						{order?.metadata?.find((a) => a.key === "Delivery_Time")?.value}
					</dt>
				</div>

				<div className="flex flex-col md:flex-[0.5]">
					<button onClick={cancelOrder} className="rounded border bg-white px-4 py-2">
						cancel
					</button>
				</div>
			</div>

			{order.lines.length > 0 && (
				<>
					<div className="md:border-x md:px-6">
						<table className="w-full text-sm text-neutral-500">
							<thead className="sr-only">
								<tr>
									<td>product</td>
									<td className="max-md:hidden">quantity and unit price</td>
									<td>price</td>
								</tr>
							</thead>
							<tbody className="md:divide-y">
								{order.lines.map((item) => {
									if (!item.variant) {
										return null;
									}

									const product = item.variant.product;

									return (
										<tr key={product.id}>
											<td className="py-6 pr-6 md:w-[60%] lg:w-[70%]">
												<div className="flex flex-row items-center">
													{product.thumbnail && (
														<div className="mr-3 aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 md:mr-6 md:h-24 md:w-24">
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
															className="font-medium text-neutral-900"
														>
															{product.name}
														</LinkWithChannel>
														{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
															<p className="mt-1">Variant: {item.variant.name}</p>
														)}
													</div>
												</div>
											</td>
											<td className="py-6 pr-6 max-md:hidden">
												{item.quantity} ×{" "}
												{item.variant.pricing?.price &&
													formatMoney(
														item.variant.pricing.price.gross.amount,
														item.variant.pricing.price.gross.currency,
													)}
											</td>
											<td className="py-6 text-end">
												<div className="flex flex-col gap-1 text-neutral-900">
													{item.variant.pricing?.price &&
														formatMoney(
															item.variant.pricing.price.gross.amount * item.quantity,
															item.variant.pricing.price.gross.currency,
														)}
													{item.quantity > 1 && (
														<span className="text-xs md:hidden">
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
					{/* <div className="flex w-full flex-col items-center py-4">
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
					</div> */}

					<div className="flex justify-between">
						{order.shippingAddress && (
							<div className="border-t px-6 py-4 text-sm">
								<h3 className="font-medium text-neutral-900">Delivery Address</h3>

								<p className="mt-1 text-neutral-600">
									{order.shippingAddress.streetAddress1}
									<br />
									{order.shippingAddress.streetAddress2 && (
										<>
											{order.shippingAddress.streetAddress2}
											<br />
										</>
									)}
									{order.shippingAddress.city} - {order.shippingAddress.postalCode}
									<br />
									{order.shippingAddress.country.country}
									<br />
									Phone: {order.shippingAddress.phone}
								</p>
							</div>
						)}
						<div>
							<h3 className="font-medium text-neutral-900">Bill Details</h3>
							<div>
								<p>
									items total:
									{formatMoney(
										order.lines.reduce((sum, item) => {
											if (!item.variant?.pricing?.price) return sum;
											return sum + item.variant.pricing.price.gross.amount * item.quantity;
										}, 0),
										order.lines[0]?.variant?.pricing?.price?.gross.currency || "INR",
									)}
								</p>
								<p>
									Delivery Charge:{" "}
									{order.shippingPrice.gross.amount === 0 ? "free" : order.shippingPrice.gross.amount}{" "}
								</p>
								<p>Handling fee: </p>
								<p>
									Discount applied:
									{order?.discount?.amount || 0}
								</p>
								<p>Instant discount: 0</p>
								<p>MeatnDoor cash: 0</p>
							</div>
						</div>
					</div>
					<dl className="flex justify-between border-y py-6 text-sm font-medium text-neutral-900 md:border md:px-6">
						<dt>Total amount including delivery</dt>
						<dd>{formatMoney(order.total.gross.amount, order.total.gross.currency)}</dd>
					</dl>
				</>
			)}
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
