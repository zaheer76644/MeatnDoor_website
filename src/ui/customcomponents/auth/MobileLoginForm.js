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
import { useRouter } from "next/navigation";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { apiConfig } from "@/config/SaleorApi";

export function MobileLoginForm() {
	const router = useRouter();
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [otpSent, setOtpSent] = useState(false);

	// 🔹 Saleor Auth Client setup
	const saleorAuthClient = createSaleorAuthClient({
		saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL || "",
	});

	// 🔹 Send OTP
	const generateOtp = async () => {
		// if (!phone || phone.length !== 10) {
		// 	alert("Please enter a valid 10-digit phone number");
		// 	return;
		// }
		try {
			const response = await fetch(apiConfig.SEND_OTP_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone }),
			});
			const data = await response.json();
			console.log("OTP Response:", data);
			if (response.ok) setOtpSent(true);
			else alert(data.message || "Failed to send OTP");
		} catch (error) {
			console.error("Error sending OTP:", error);
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
		try {
			const response = await fetch(apiConfig.VERIFY_OTP_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone, code: otp }),
			});
			const data = await response.json();
			console.log("Verify Response:", data);

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
				// window.opener.location.reload();
				// window.close();
			}
		} catch (error) {
			console.error("Error verifying OTP:", error);
		}
	};

	// 🔹 Form submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!otpSent) await generateOtp();
		else await verifyOtp();
	};

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form onSubmit={handleSubmit}>
				<h2 className="mb-4 text-center text-2xl font-semibold">Login with OTP</h2>
				{!otpSent ? (
					<div className="mb-4">
						<label htmlFor="phone" className="mb-1 block text-sm font-medium">
							Phone number
						</label>
						<input
							type="tel"
							id="phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="Enter your mobile number"
							className="w-full rounded border bg-neutral-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-700"
							required
						/>
						<button
							type="submit"
							className="mt-4 w-full rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
						>
							Generate OTP
						</button>
					</div>
				) : (
					<div className="mb-4">
						<label htmlFor="otp" className="mb-1 block text-sm font-medium">
							Enter OTP
						</label>
						<input
							type="text"
							id="otp"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="Enter OTP"
							className="w-full rounded border bg-neutral-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-700"
							required
						/>
						<button
							type="submit"
							className="mt-4 w-full rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
						>
							Verify OTP
						</button>

						<p className="mt-2 text-sm text-gray-500">
							Didn’t receive OTP?{" "}
							<span onClick={generateOtp} className="cursor-pointer text-blue-600">
								Resend
							</span>
						</p>
					</div>
				)}
			</form>
		</div>
	);
}

// | Export Type | Example Export                           | Example Import                                       | Can Rename? |
// | ----------- | ---------------------------------------- | ---------------------------------------------------- | ----------- |
// | **Default** | `export default function LoginForm() {}` | `import LoginForm from "@/components/LoginForm"`     | ✅ Yes       |
// | **Named**   | `export function LoginForm() {}`         | `import { LoginForm } from "@/components/LoginForm"` | ❌ No        |
