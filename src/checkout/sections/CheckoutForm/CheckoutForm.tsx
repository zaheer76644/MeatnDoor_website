/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { Suspense, useState } from "react";
// import DeliverySlotPicker from "../../../ui/customcomponents/DeliverySlotPicker";
// import { useCheckout } from "@/checkout/hooks/useCheckout";
// import { Contact } from "@/checkout/sections/Contact";
// import { DeliveryMethods } from "@/checkout/sections/DeliveryMethods";
// import { ContactSkeleton } from "@/checkout/sections/Contact/ContactSkeleton";
// import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
// import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
// import { getQueryParams } from "@/checkout/lib/utils/url";
// import { CollapseSection } from "@/checkout/sections/CheckoutForm/CollapseSection";
// import { Divider } from "@/checkout/components";
// import { UserShippingAddressSection } from "@/checkout/sections/UserShippingAddressSection";
// import { GuestShippingAddressSection } from "@/checkout/sections/GuestShippingAddressSection";
// import { UserBillingAddressSection } from "@/checkout/sections/UserBillingAddressSection";
// import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
// import { GuestBillingAddressSection } from "@/checkout/sections/GuestBillingAddressSection";
// import { useUser } from "@/checkout/hooks/useUser";

// export const CheckoutForm = () => {
// 	const { user } = useUser();
// 	const { checkout } = useCheckout();
// 	const { passwordResetToken } = getQueryParams();

// 	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);

// 	return (
// 		<div className="flex flex-col items-end">
// 			<div className="flex w-full flex-col rounded">
// 				{/* changes for meatndoor ermvoed sign in from check out page  */}
// 				{/* <Suspense fallback={<ContactSkeleton />}>
// 					<Contact setShowOnlyContact={setShowOnlyContact} />
// 					</Suspense> */}
// 				{/* <h1>Choose Delivery Option</h1> */}
// 				<DeliverySlotPicker />
// 				<>
// 					{checkout?.isShippingRequired && (
// 						<Suspense fallback={<AddressSectionSkeleton />}>
// 							<CollapseSection collapse={showOnlyContact}>
// 								<Divider />
// 								<div className="py-4" data-testid="shippingAddressSection">
// 									{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
// 								</div>
// 								{user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
// 							</CollapseSection>
// 						</Suspense>
// 					)}
// 					<Suspense fallback={<DeliveryMethodsSkeleton />}>
// 						<DeliveryMethods collapsed={showOnlyContact} />
// 					</Suspense>
// 					{/* <Suspense fallback={<PaymentSectionSkeleton />}>
// 						<CollapseSection collapse={showOnlyContact}>
// 							<PaymentSection />
// 						</CollapseSection>
// 					</Suspense> */}
// 					<div>
// 						<Divider />
// 						<h1>Payment Method </h1>
// 					</div>
// 				</>
// 			</div>
// 		</div>
// 	);
// };

// main
// import { Suspense, useState } from "react";
// import { useCheckout } from "@/checkout/hooks/useCheckout";
// import { Contact } from "@/checkout/sections/Contact";
// import { DeliveryMethods } from "@/checkout/sections/DeliveryMethods";
// import { ContactSkeleton } from "@/checkout/sections/Contact/ContactSkeleton";
// import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
// import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
// import { getQueryParams } from "@/checkout/lib/utils/url";
// import { CollapseSection } from "@/checkout/sections/CheckoutForm/CollapseSection";
// import { Divider } from "@/checkout/components";
// import { UserShippingAddressSection } from "@/checkout/sections/UserShippingAddressSection";
// import { GuestShippingAddressSection } from "@/checkout/sections/GuestShippingAddressSection";
// import { UserBillingAddressSection } from "@/checkout/sections/UserBillingAddressSection";
// import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
// import { GuestBillingAddressSection } from "@/checkout/sections/GuestBillingAddressSection";
// import { useUser } from "@/checkout/hooks/useUser";

// export const CheckoutForm = () => {
// 	const { user } = useUser();
// 	const { checkout } = useCheckout();
// 	const { passwordResetToken } = getQueryParams();

// 	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);

// 	return (
// 		<div className="flex flex-col items-end">
// 			<div className="flex w-full flex-col rounded">
// 				<Suspense fallback={<ContactSkeleton />}>
// 					<Contact setShowOnlyContact={setShowOnlyContact} />
// 				</Suspense>
// 				<>
// 					{checkout?.isShippingRequired && (
// 						<Suspense fallback={<AddressSectionSkeleton />}>
// 							<CollapseSection collapse={showOnlyContact}>
// 								<Divider />
// 								<div className="py-4" data-testid="shippingAddressSection">
// 									{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
// 								</div>
// 								{user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
// 							</CollapseSection>
// 						</Suspense>
// 					)}
// 					<Suspense fallback={<DeliveryMethodsSkeleton />}>
// 						<DeliveryMethods collapsed={showOnlyContact} />
// 					</Suspense>
// 					<Suspense fallback={<PaymentSectionSkeleton />}>
// 						<CollapseSection collapse={showOnlyContact}>
// 							<PaymentSection />
// 						</CollapseSection>
// 					</Suspense>
// 				</>
// 			</div>
// 		</div>
// 	);
// };

import { Suspense, useState } from "react";
import DeliverySlotPicker from "../../../ui/customcomponents/DeliverySlotPicker";
import { Summary, SummarySkeleton } from "../Summary";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { Contact } from "@/checkout/sections/Contact";
import { DeliveryMethods } from "@/checkout/sections/DeliveryMethods";
import { ContactSkeleton } from "@/checkout/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { AddressSectionSkeleton } from "@/checkout/components/AddressSectionSkeleton";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { CollapseSection } from "@/checkout/sections/CheckoutForm/CollapseSection";
import { Divider } from "@/checkout/components";
import { UserShippingAddressSection } from "@/checkout/sections/UserShippingAddressSection";
import { GuestShippingAddressSection } from "@/checkout/sections/GuestShippingAddressSection";
import { UserBillingAddressSection } from "@/checkout/sections/UserBillingAddressSection";
// import { PaymentSection, PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection";
import { GuestBillingAddressSection } from "@/checkout/sections/GuestBillingAddressSection";
import { useUser } from "@/checkout/hooks/useUser";
import { GRAPHQL_ENDPOINT, apiConfig } from "@/config/SaleorApi"; // 👈 tumhare config se endpoint le rahe hain
import { loadRazorpay } from "@/lib/loadRazorpay";
export const CheckoutForm = () => {
	const { user } = useUser();
	const { checkout } = useCheckout();
	const [loadingOnline, setLoadingOnline] = useState(false);
	const { passwordResetToken } = getQueryParams();

	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);
	const [loading, setLoading] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState(null);

	// ✅ Complete order using fetch()
	// const handlePlaceOrder = async () => {
	// 	try {
	// 		if (!checkout?.id) {
	// 			alert("Checkout ID missing — cannot complete order.");
	// 			return;
	// 		}

	// 		setLoading(true);

	// 		const query = `
	// 			mutation {
	// 				checkoutComplete(id: "${checkout.id}") {
	// 					order {
	// 						id
	// 						number
	// 						status
	// 						total {
	// 							gross {
	// 								amount
	// 								currency
	// 							}
	// 						}
	// 					}
	// 					errors {
	// 						field
	// 						message
	// 					}
	// 				}
	// 			}
	// 		`;

	// 		const response = await fetch(GRAPHQL_ENDPOINT, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				// Optional: Authorization header agar token chahiye
	// 				Authorization: user?.token ? `JWT ${user.token}` : "",
	// 			},
	// 			body: JSON.stringify({ query }),
	// 		});

	// 		const data = await response.json();
	// 		const result = data?.data?.checkoutComplete;

	// 		if (result?.errors?.length) {
	// 			alert("❌ " + result.errors[0].message);
	// 		} else if (result?.order) {
	// 			alert(`✅ Order placed successfully! Order #${result.order.number}`);
	// 			console.log("Order Details:", result.order);
	// 			// Redirect optional:
	// 			// window.location.href = `/order-confirmation/${result.order.id}`;
	// 		} else {
	// 			alert("Something went wrong!");
	// 		}
	// 	} catch (err) {
	// 		console.error("Error completing order:", err);
	// 		alert("⚠️ Failed to place order. Please try again.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	interface Checkout {
		id: string;
	}

	interface User {
		__typename?: "User";
		id: string;
		email: string;

		// Add token if your auth system adds it
		token?: string;
	}
	interface Money {
		amount: number;
		currency: string;
	}

	interface Order {
		id: string;
		number: string;
		status: string;
		total: {
			gross: Money;
		};
	}
	interface CheckoutCompleteResponse {
		data?: {
			checkoutComplete?: {
				order?: Order | null;
				errors?: { field: string | null; message: string }[];
			};
		};
	}
	const completeCheckoutSaleor = async (user: User | null | undefined) => {
		const query = `
		  mutation {
			checkoutComplete(id: "${checkout?.id}") {
			  order {
				id
				number
				status
			  }
			  errors { message }
			}
		  }
		`;

		const res = await fetch(GRAPHQL_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: user?.token ? `JWT ${user.token}` : "",
			},
			body: JSON.stringify({ query }),
		});

		const data = (await res.json()) as CheckoutCompleteResponse;
		const result = data?.data?.checkoutComplete;

		// if (result?.errors?.length) {
		// 	alert("❌ " + result.errors[0].message);
		// 	return null;
		// }
		if (result?.errors && result.errors.length > 0) {
			// alert("❌ " + result.errors[0].message); // this says checkout email must be set
			alert("❌ Please login First");
			return;
		}

		return result?.order;
	};
	// without metadata place order
	// const handlePlaceOrder = async (
	// 	checkout: Checkout | null,
	// 	user: User | null | undefined,
	// 	setLoading: (loading: boolean) => void,
	// 	GRAPHQL_ENDPOINT: string,
	// ) => {
	// 	try {
	// 		if (!checkout?.id) {
	// 			alert("Checkout ID missing — cannot complete order.");
	// 			return;
	// 		}
	// 		if (!selectedSlot) {
	// 			alert("Please select a delivery slot before placing order.");
	// 			return;
	// 		}
	// 		if (!user) {
	// 			alert("❌ Please login first");
	// 			return;
	// 		}

	// 		setLoading(true);

	// 		const query = `
	// 			mutation {
	// 				checkoutComplete(id: "${checkout.id}") {
	// 					order {
	// 						id
	// 						number
	// 						status
	// 						total {
	// 							gross {
	// 								amount
	// 								currency
	// 							}
	// 						}
	// 					}
	// 					errors {
	// 						field
	// 						message
	// 					}
	// 				}
	// 			}
	// 		`;

	// 		const response = await fetch(GRAPHQL_ENDPOINT, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: user?.token ? `JWT ${user.token}` : "",
	// 			},
	// 			body: JSON.stringify({ query }),
	// 		});

	// 		const data = (await response.json()) as CheckoutCompleteResponse;

	// 		const result = data?.data?.checkoutComplete;

	// 		if (result?.errors && result.errors.length > 0) {
	// 			// alert("❌ " + result.errors[0].message); // this says checkout email must be set
	// 			alert("❌ Please login First");
	// 			return;
	// 		}

	// 		if (result?.order) {
	// 			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	// 			alert(`✅ Order placed successfully! Order #${result.order.number}`);
	// 			console.log("Order Details:", result.order);
	// 			document.cookie = "checkoutId-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	// 			window.location.href = "/in/orders";
	// 			return;
	// 		}
	// 		alert("Something went wrong!");
	// 	} catch (err) {
	// 		console.error("Error completing order:", err);
	// 		alert("⚠️ Failed to place order. Please try again.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	const handlePlaceOrder = async (
		checkout: Checkout | null,
		user: User | null | undefined,
		setLoading: (loading: boolean) => void,
		GRAPHQL_ENDPOINT: string,
		selectedSlot: {
			date: any;
			day: string;
			slot: string;
		} | null,
	) => {
		try {
			if (!checkout?.id) {
				alert("Checkout ID missing — cannot complete order.");
				return;
			}
			if (!selectedSlot) {
				alert("Please select a delivery slot before placing order.");
				return;
			}
			if (!user) {
				alert("❌ Please login first");
				return;
			}

			setLoading(true);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const isoString: string = selectedSlot.date.toISOString();
			const parts: string[] = isoString.split("T");
			const deliveryDate: string = parts[0];

			// { key: "delivery_slot_day", value: "${selectedSlot.day}" },
			const metaQuery = `
	mutation {
		updateMetadata(
			id: "${checkout.id}",
			input: [
				{ key: "Delivery_Date", value: "${deliveryDate}" },
				{ key: "Delivery_Time", value: "${selectedSlot.slot}" },
				{ key: "paymentMode", value: "cash_on_delivery" }
				{ key: "ordered_platform", value: "Website" }
				]
				) {
					errors { field message }
					}
					}
					`;

			await fetch(GRAPHQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: user?.token ? `JWT ${user.token}` : "",
				},
				body: JSON.stringify({ query: metaQuery }),
			});

			// -------------------------
			// 2️⃣ Complete checkout
			// -------------------------
			const completeQuery = `
				mutation {
					checkoutComplete(id: "${checkout.id}") {
						order {
							id
							number
							status
							total {
								gross {
									amount
									currency
								}
							}
						}
						errors {
							field
							message
						}
					}
				}
			`;

			const response = await fetch(GRAPHQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: user?.token ? `JWT ${user.token}` : "",
				},
				body: JSON.stringify({ query: completeQuery }),
			});

			const data = (await response.json()) as CheckoutCompleteResponse;

			const result = data?.data?.checkoutComplete;

			if (result?.errors?.length) {
				alert("❌ " + result.errors[0].message);
				return;
			}

			// SUCCESS
			if (result?.order) {
				alert(`✅ Order placed for ${selectedSlot.day} (${selectedSlot.slot}) using COD`);
				document.cookie = "checkoutId-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
				window.location.href = "/in/orders";
				return;
			}

			alert("Something went wrong!");
		} catch (err) {
			console.error("Error completing order:", err);
			alert("⚠️ Failed to place order. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	interface RazorpayGatewayResponse {
		id: string;
	}
	interface RazorpayOptions {
		key: string;
		order_id: string;
		currency: string;
		name: string;
		image?: string;
		handler: () => void | Promise<void>;
		theme?: {
			color: string;
		};
	}

	interface RazorpayInstance {
		open: () => void;
	}

	const handlePayOnline = async (
		checkout: Checkout | null,
		user: User | null | undefined,
		GRAPHQL_ENDPOINT: string,
		selectedSlot: {
			date: any;
			day: string;
			slot: string;
		} | null,
	) => {
		if (!checkout?.id) return alert("Checkout missing");
		if (!selectedSlot) {
			alert("Please select a delivery slot before placing order.");
			return;
		}
		if (!user) {
			alert("❌ Please login first");
			return;
		}
		setLoadingOnline(true);

		try {
			// ------------------------------------
			// 1️⃣ SAVE DELIVERY METADATA HERE
			// ------------------------------------
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const isoString: string = selectedSlot.date.toISOString();
			const parts: string[] = isoString.split("T");
			const deliveryDate: string = parts[0];

			const metaQuery = `
			mutation {
				updateMetadata(
					id: "${checkout.id}",
					input: [
						{ key: "Delivery_Date", value: "${deliveryDate}" },
						{ key: "Delivery_Time", value: "${selectedSlot.slot}" },
						{ key: "paymentMode", value: "Online_Payment" }
						{ key: "ordered_platform", value: "Website" }
					]
				) {
					errors { field message }
				}
			}
		`;

			await fetch(GRAPHQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: user?.token ? `JWT ${user.token}` : "",
				},
				body: JSON.stringify({ query: metaQuery }),
			});
			// 1️⃣ Get Razorpay Order ID from Saleor Payment Gateway
			const response = await fetch(`${apiConfig.RAZORPAY_GATEWAY_ENDPOINT}?checkout_id=${checkout.id}`, {
				method: "POST",
			});

			const data = (await response.json()) as RazorpayGatewayResponse;
			const razorpayOrderId = data.id;

			if (!razorpayOrderId) {
				alert("Failed to create Razorpay order");
				return;
			}

			// 2️⃣ Load Razorpay script
			await loadRazorpay();

			// 3️⃣ Razorpay Checkout options
			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_PUBLIC_KEY!,
				order_id: razorpayOrderId,
				currency: "INR",
				name: "MEATnDOOR",
				image: "/logo.png",
				handler: async () => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const order = await completeCheckoutSaleor(user);
					if (order) {
						alert(`🟢 Payment Success! Order #${order.number}`);
					}
				},
				theme: { color: "#F37254" },
			};

			if (typeof window !== "undefined" && "Razorpay" in window) {
				const rzp = new (
					window as unknown as {
						Razorpay: { new (options: RazorpayOptions): RazorpayInstance };
					}
				).Razorpay(options);

				rzp.open();
			} else {
				alert("Razorpay SDK not loaded yet.");
			}
		} catch (err) {
			console.error("Razorpay error:", err);
			alert("Payment failed");
		}

		setLoadingOnline(false);
	};

	const onPlaceOrder = async () => {
		await handlePlaceOrder(checkout, user, setLoading, GRAPHQL_ENDPOINT, selectedSlot);
	};
	// const totalPriceValue = Math.round((checkout?.subtotalPrice?.gross.amount || 0) - (checkout?.discount?.amount || 0))
	// const handlePlaceOrder = async () => {
	// 	try {
	// 		if (!checkout?.id) {
	// 			alert("Checkout ID missing — cannot complete order.");
	// 			return;
	// 		}

	// 		if (!selectedSlot) {
	// 			alert("Please select a delivery slot before placing order.");
	// 			return;
	// 		}

	// 		setLoading(true);

	// 		// 🧠 Step 1: Save delivery slot in checkout metadata
	// 		const metaQuery = `
	// 			mutation {
	// 				updateMetadata(
	// 					id: "${checkout.id}",
	// 					input: [
	// 						{ key: "delivery_slot_day", value: "${selectedSlot.day}" },
	// 						{ key: "delivery_slot_time", value: "${selectedSlot.slot}" }
	// 					]
	// 				) {
	// 					errors { field message }
	// 				}
	// 			}
	// 		`;

	// 		await fetch(GRAPHQL_ENDPOINT, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: user?.token ? `JWT ${user.token}` : "",
	// 			},
	// 			body: JSON.stringify({ query: metaQuery }),
	// 		});

	// 		// 🧠 Step 2: Complete checkout
	// 		const completeQuery = `
	// 			mutation {
	// 				checkoutComplete(id: "${checkout.id}") {
	// 					order {
	// 						id
	// 						number
	// 						status
	// 					}
	// 					errors {
	// 						field
	// 						message
	// 					}
	// 				}
	// 			}
	// 		`;

	// 		const response = await fetch(GRAPHQL_ENDPOINT, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: user?.token ? `JWT ${user.token}` : "",
	// 			},
	// 			body: JSON.stringify({ query: completeQuery }),
	// 		});

	// 		const data = await response.json();
	// 		const result = data?.data?.checkoutComplete;

	// 		if (result?.errors?.length) {
	// 			alert("❌ " + result.errors[0].message);
	// 		} else if (result?.order) {
	// 			alert(`✅ Order placed for ${selectedSlot.day} (${selectedSlot.slot})!`);
	// 		} else {
	// 			alert("Something went wrong!");
	// 		}
	// 	} catch (err) {
	// 		console.error("Error completing order:", err);
	// 		alert("⚠️ Failed to place order.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	return (
		<div className="">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
				{/* Delivery Slot Picker */}
				<div>
				<div className="hidden">
					<Suspense fallback={<ContactSkeleton />}>
						<Contact setShowOnlyContact={setShowOnlyContact} />
					</Suspense>
				</div>
				<DeliverySlotPicker selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />

					{checkout?.isShippingRequired && (
						<Suspense fallback={<AddressSectionSkeleton />}>
							<CollapseSection collapse={showOnlyContact}>
								<Divider />
								<div className="py-4" data-testid="shippingAddressSection">
									{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
								</div>
								{user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
							</CollapseSection>
						</Suspense>
					)}
					{/* delivery method delivery fee slot in not shown  */}
					<div className="hidden">
						<Suspense fallback={<DeliveryMethodsSkeleton />}>
							<DeliveryMethods collapsed={showOnlyContact} />
						</Suspense>
					</div>
					</div>
					<Suspense fallback={<SummarySkeleton />}>
												<Summary {...checkout} />
											</Suspense>

						</div>
						<div className="flex justify-end">
							<div className="w-full md:w-[49%] mt-5">
								<Divider />
								<h1 className="mb-4 text-lg font-semibold text-[#47141e] mt-3">Payment Method</h1>
								<div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
									{/* ✅ Cash on Delivery Button */}
									
									{/* {totalPriceValue <= 1000 && */}
									<button
										type="button"
										onClick={onPlaceOrder}
										disabled={loading}
										className="group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-8 py-4 text-center text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ed4264]/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
									>
										{/* Shimmer effect */}
										<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
										{/* Button content */}
										<span className="relative z-10 flex items-center justify-center gap-2">
											{loading ? "Placing Order..." : "Cash on Delivery"}
										</span>
									</button>
									{/* } */}
									{/* Pay Online Button */}
									<button
										type="button"
										onClick={() => handlePayOnline(checkout, user, GRAPHQL_ENDPOINT, selectedSlot)}
										disabled={loadingOnline}
										className="group relative h-14 w-full overflow-hidden rounded-xl border-2 border-[#ed4264] bg-transparent px-8 py-4 text-center text-lg font-bold text-[#ed4264] shadow-md transition-all duration-300 hover:scale-105 hover:border-transparent hover:bg-gradient-to-r hover:from-[#ed4264] hover:to-[#ff6b9d] hover:text-white hover:shadow-xl hover:shadow-[#ed4264]/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
									>
										{/* Shimmer effect */}
										<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
										{/* Button content */}
										<span className="relative z-10 flex items-center justify-center gap-2">
											{loadingOnline ? "Placing Order..." : "Pay Online"}
										</span>
									</button>
								</div>
								{/* {loading ? "Placing Order..." : "Place Order"}
									Place Order
								</Button> */}
							</div>
					</div>
					</div>
	);
};
