// /* eslint-disable @typescript-eslint/no-unsafe-call */
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createSaleorAuthClient } from "@saleor/auth-sdk";
// import { apiConfig } from "@/config/SaleorApi";

// export function MobileLoginForm() {
// 	const router = useRouter();
// 	const [phone, setPhone] = useState("");
// 	const [otp, setOtp] = useState("");
// 	const [otpSent, setOtpSent] = useState(false);

// 	const generateOtp = async () => {
// 		if (!phone || phone.length !== 10) {
// 			alert("Please enter a valid 10-digit phone number");
// 			return;
// 		}
// 		try {
// 			const response = await fetch(apiConfig.SEND_OTP_ENDPOINT, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ phone }),
// 			});
// 			const data = await response.json();
// 			console.log("OTP Response:", data);
// 			if (response.ok) setOtpSent(true);
// 			else alert(data.message || "Failed to send OTP");
// 		} catch (error) {
// 			console.error("Error sending OTP:", error);
// 		}
// 	};

// 	const verifyOtp = async () => {
// 		if (!otp || otp.length !== 6) {
// 			alert("Enter 6-digit OTP");
// 			return;
// 		}
// 		try {
// 			const response = await fetch(apiConfig.VERIFY_OTP_ENDPOINT, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ phone, code: otp }),
// 			});
// 			const data = await response.json();
// 			console.log("Verify Response:", data);

// 			if (response.ok && data.access_token) {
// 				localStorage.setItem("access_token", data.access_token);
// 				localStorage.setItem("refresh_token", data.refresh_token);

// 				// ✅ inject token into Saleor session
// 				// ✅ Inject tokens into Saleor Auth Client
// 				await saleorAuthClient.accessTokenStorage.setAccessToken(data.access_token);
// 				await saleorAuthClient.refreshTokenStorage.setRefreshToken(data.refresh_token);

// 				console.log("✅ Tokens saved!");
// 				console.log("Access:", await saleorAuthClient.accessTokenStorage.getAccessToken());
// 				console.log("Refresh:", await saleorAuthClient.refreshTokenStorage.getRefreshToken());

// 				console.log("✅ Saleor session initialized");
// 				alert("✅ Login successful!");
// 				router.push("/");
// 			} else {
// 				alert(data.error || "❌ Invalid OTP. Please try again.");
// 			}
// 		} catch (error) {
// 			console.error("Error verifying OTP:", error);
// 		}
// 	};

// 	// useEffect(() => {
// 	// 	const token = localStorage.getItem("access_token");
// 	// 	if (token) router.push("/dashboard");
// 	// }, [router]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (!otpSent) await generateOtp();
// 		else await verifyOtp();
// 	};

// 	const saleorAuthClient = createSaleorAuthClient({
// 		saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL || "",
// 		// saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL!,
// 	});
// 	// console.log("Access:", saleorAuthClient.accessTokenStorage.getAccessToken());
// 	// console.log("Refresh:", saleorAuthClient.refreshTokenStorage.getRefreshToken());

// 	// console.log("saleorAuthClient:", saleorAuthClient);
// 	// console.log("Methods available:", Object.keys(saleorAuthClient));
// 	// console.log("Auth object methods:", Object.keys(saleorAuthClient.auth || {}));
// 	// console.log("accessTokenStorage:", saleorAuthClient.accessTokenStorage);
// 	// console.log("accessTokenStorage keys:", Object.keys(saleorAuthClient.accessTokenStorage || {}));
// 	// console.log("refreshTokenStorage keys:", Object.keys(saleorAuthClient.refreshTokenStorage || {}));

// 	return (
// 		<div className="mx-auto mt-16 w-full max-w-lg">
// 			<form onSubmit={handleSubmit}>
// 				<h2 className="mb-4 text-center text-2xl font-semibold">Login with OTP</h2>
// 				{!otpSent ? (
// 					<div className="mb-4">
// 						<label htmlFor="phone" className="mb-1 block text-sm font-medium">
// 							Phone number
// 						</label>
// 						<input
// 							type="tel"
// 							id="phone"
// 							value={phone}
// 							onChange={(e) => setPhone(e.target.value)}
// 							placeholder="Enter your mobile number"
// 							className="w-full rounded border bg-neutral-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-700"
// 							required
// 						/>
// 						<button
// 							type="submit"
// 							className="mt-4 w-full rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
// 						>
// 							Generate OTP
// 						</button>
// 					</div>
// 				) : (
// 					<div className="mb-4">
// 						<label htmlFor="otp" className="mb-1 block text-sm font-medium">
// 							Enter OTP
// 						</label>
// 						<input
// 							type="text"
// 							id="otp"
// 							value={otp}
// 							onChange={(e) => setOtp(e.target.value)}
// 							placeholder="Enter OTP"
// 							className="w-full rounded border bg-neutral-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-700"
// 							required
// 						/>
// 						<button
// 							type="submit"
// 							className="mt-4 w-full rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
// 						>
// 							Verify OTP
// 						</button>

// 						<p className="mt-2 text-sm text-gray-500">
// 							Didn’t receive OTP?{" "}
// 							<span onClick={generateOtp} className="cursor-pointer text-blue-600">
// 								Resend
// 							</span>
// 						</p>
// 					</div>
// 				)}
// 			</form>
// 		</div>
// 	);
// }

"use client";
import { setTokenCookie } from "./validateCode";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { apiConfig } from "@/config/SaleorApi";
import { ClipLoader } from "react-spinners";

export function MobileLoginForm() {
	const router = useRouter();
	const pathname = usePathname()
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);
	const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
	const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
	// 🔹 Saleor Auth Client setup
	const saleorAuthClient = createSaleorAuthClient({
		saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL || "",
	});

	// 🔹 Send OTP
	const generateOtp = async () => {
		if (!phone || phone.length !== 10) {
			alert("Please enter a valid 10-digit phone number");
			return;
		}
		setIsGeneratingOtp(true);
		try {
			const response = await fetch(apiConfig.SEND_OTP_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone }),
			});
			const data = await response.json();
			console.log("OTP Response:", data);
			// if (response.ok) setOtpSent(true);
			// else alert(data.message || "Failed to send OTP");
			if (response.ok) {
				if (data.new_otp) {
					setOtpSent(true);
					alert("OTP sent successfully!");
				} else {
					// cooldown case
					setOtpSent(true);
					alert(data.message || "Please wait before requesting a new OTP.");
				}
			} else {
				alert(data.message || "Failed to send OTP");
			}
		} catch (error) {
			console.error("Error sending OTP:", error);
			alert("Failed to send OTP. Please try again.");
		} finally {
			setIsGeneratingOtp(false);
		}
	};

	// 🔹 Helper to save tokens (handles all SDK method variations)
	const saveTokensToSaleorClient = async (access_token, refresh_token) => {
		try {
			const aStore = saleorAuthClient.accessTokenStorage;
			const rStore = saleorAuthClient.refreshTokenStorage;

			if (typeof aStore?.setAccessToken === "function" && typeof rStore?.setRefreshToken === "function") {
				await aStore.setAccessToken(access_token);
				await rStore.setRefreshToken(refresh_token);
				return;
			}

			if (typeof aStore?.setItem === "function" && typeof rStore?.setItem === "function") {
				await aStore.setItem(access_token);
				await rStore.setItem(refresh_token);
				return;
			}

			if (typeof aStore?.set === "function" && typeof rStore?.set === "function") {
				await aStore.set("access_token", access_token);
				await rStore.set("refresh_token", refresh_token);
				return;
			}

			// fallback
			localStorage.setItem("access_token", access_token);
			localStorage.setItem("refresh_token", refresh_token);
		} catch (err) {
			console.error("⚠️ Failed to save into Saleor client storage:", err);
			localStorage.setItem("access_token", access_token);
			localStorage.setItem("refresh_token", refresh_token);
		}
	};

	// 🔹 Verify OTP
	const verifyOtp = async () => {
		if (!otp || otp.length !== 6) {
			alert("Enter 6-digit OTP");
			return;
		}
		setIsVerifyingOtp(true);
		try {
			const response = await fetch(apiConfig.VERIFY_OTP_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone, code: otp }),
			});
			const data = await response.json();

			// if (response.ok && data.access_token && data.refresh_token) {
			// 	// Always store in localStorage first
			// 	localStorage.setItem("access_token", data.access_token);
			// 	localStorage.setItem("refresh_token", data.refresh_token);

			// 	// Then try Saleor client
			// 	await saveTokensToSaleorClient(data.access_token, data.refresh_token);

			// 	// Debug check
			// 	console.log("✅ Tokens saved successfully");
			// 	console.log("Access token:", data.access_token);
			// 	console.log("Refresh token:", data.refresh_token);

			// 	alert("✅ Login successful!");
			// 	router.push("/");
			// } else {
			// 	alert(data.error || "❌ Invalid OTP. Please try again.");
			// }
			if (data.access_token) {
				await setTokenCookie(data);
				// window.opener.location.href = '/in/orders/';
				localStorage.setItem(
					process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_auth_state",
					"signedIn",
				);
				localStorage.setItem(
					process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token",
					data?.refresh_token,
				);
				
				let userInfo = null;
				const userInfoQuery = `
					query {
						me {
							id
							email
							firstName
							lastName
						}
					}`;
				try {
					const userInfoResponse = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${data?.access_token}`,
						},
						body: JSON.stringify({ query: userInfoQuery }),
					});

					const userInfoData = await userInfoResponse.json();
					userInfo = userInfoData?.data?.me;
				} catch (err) {
					console.error("Failed to fetch user info", err);
				}

				// 🔹 Store login source data in user metadata
				if (userInfo?.id) {
					try {
						const mutation = `
							mutation UpdateUserMetadata($id: ID!, $key: String!, $value: String!) {
								updateMetadata(
									id: $id
									input: [
										{
											key: $key
											value: $value
										}
									]
								) {
									item {
										... on User {
											id
											email
											firstName
											lastName
											metadata {
												key
												value
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

						const graphqlUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL || apiConfig.GRAPHQL_ENDPOINT;
						const response = await saleorAuthClient.fetchWithAuth(
							graphqlUrl,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									query: mutation,
									variables: {
										id: userInfo.id,
										key: "last_login_source",
										value: "Website",
									},
								}),
							},
						);

						const result = await response.json();
						if (result.errors) {
							console.error("Error updating user metadata:", result.errors);
						} else {
							console.log("✅ Login source data stored successfully");
						}
					} catch (error) {
						console.error("Error storing login source data:", error);
					}
				}

				// window.opener.location.reload();
				// window.close();
				alert("✅ Login successful!");
				router.push(pathname.includes("/cart") ? "/in/cart" : "/in");
			}
		} catch (error) {
			console.error("Error verifying OTP:", error);
		} finally {
			setIsVerifyingOtp(false);
		}
	};

	// 🔹 Form submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!otpSent) await generateOtp();
		else await verifyOtp();
	};

	return (
		<div className="mx-auto mt-8 w-full max-w-lg px-4 md:mt-16">
			<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Header */}
					<div className="text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ed4264] to-[#ff6b9d] shadow-md">
							<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-[#47141e] md:text-3xl">Login with OTP</h2>
						<p className="mt-2 text-sm text-gray-600">Enter your phone number to receive a verification code</p>
					</div>
					{!otpSent ? (
						<div className="space-y-4">
							{/* Phone Input */}
							<div>
								<label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
									Phone number
								</label>
								<div className="flex overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm transition-all duration-200 focus-within:border-[#ed4264] focus-within:ring-2 focus-within:ring-[#ed4264]/20">
									<span className="inline-flex items-center border-r border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 px-4 text-sm font-semibold text-gray-700">
										+91
									</span>
									<input
										type="tel"
										id="phone"
										value={phone}
										onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
										placeholder="Enter your mobile number"
										className="w-full border-0 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
										required
										maxLength={10}
										style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
										onFocus={(e) => e.target.style.outline = 'none'}
									/>
								</div>
							</div>

							{/* Generate OTP Button */}
							<button
								type="submit"
								disabled={isGeneratingOtp}
								className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-6 py-3.5 text-center text-lg font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#ed4264]/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
							>
								{/* Shimmer effect */}
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
								{/* Button content */}
								<span className="relative z-10 flex items-center justify-center gap-2">
									{isGeneratingOtp ? (
										<ClipLoader size={20} color="#ffffff" />
									) : (
										<>
											<svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
											</svg>
											<span>Generate OTP</span>
										</>
									)}
								</span>
							</button>
						</div>
					) : (
						<div className="space-y-4">
							{/* OTP Input */}
							<div>
								<label htmlFor="otp" className="mb-2 block text-sm font-semibold text-gray-700">
									Enter OTP
								</label>
								<input
									type="text"
									id="otp"
									value={otp}
									onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
									placeholder="Enter 6-digit OTP"
									className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-center text-2xl font-bold tracking-widest text-gray-900 shadow-sm transition-all duration-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
									required
									maxLength={6}
									style={{ border: '2px solid #e5e7eb', outline: 'none', boxShadow: 'none' }}
									onFocus={(e) => {
										e.target.style.outline = 'none';
										e.target.style.borderColor = '#e5e7eb';
									}}
								/>
							</div>

							{/* Verify OTP Button */}
							<button
								type="submit"
								disabled={isVerifyingOtp}
								className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#ed4264] to-[#ff6b9d] px-6 py-3.5 text-center text-lg font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#ed4264]/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
							>
								{/* Shimmer effect */}
								<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
								{/* Button content */}
								<span className="relative z-10 flex items-center justify-center gap-2">
									{isVerifyingOtp ? (
										<ClipLoader size={20} color="#ffffff" />
									) : (
										<>
											<svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span>Verify OTP</span>
										</>
									)}
								</span>
							</button>

						{/* <p className="mt-2 text-sm text-gray-500">
							Didn’t receive OTP?{" "}
							<span onClick={generateOtp} className="cursor-pointer text-blue-600">
								Resend
							</span>
						</p> */}
						<p className="mt-2 text-sm text-gray-500">
							{`Didn’t receive OTP?`}{" "}
								<button
									type="button"
									onClick={() => {
										setOtpSent(false); // go back to phone input
										setOtp(""); // clear previous OTP
									}}
									className="font-semibold text-[#ed4264] transition-colors hover:text-[#47141e] hover:underline"
								>
									Verify Number Again
								</button>
							</p>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}

// | Export Type | Example Export                           | Example Import                                       | Can Rename? |
// | ----------- | ---------------------------------------- | ---------------------------------------------------- | ----------- |
// | **Default** | `export default function LoginForm() {}` | `import LoginForm from "@/components/LoginForm"`     | ✅ Yes       |
// | **Named**   | `export function LoginForm() {}`         | `import { LoginForm } from "@/components/LoginForm"` | ❌ No        |
