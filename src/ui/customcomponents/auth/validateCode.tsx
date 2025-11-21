// "use server";
// import { cookies } from "next/headers";

// export async function setTokenCookie(data: object) {
// 	cookies().set(process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_access_token", data?.access_token, {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		sameSite: "strict",
// 		path: "/",
// 	});
// 	cookies().set(
// 		process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token",
// 		data?.refresh_token,
// 		{
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === "production",
// 			sameSite: "strict",
// 			path: "/",
// 		},
// 	);
// 	cookies().set(process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_auth_state", "signedIn", {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		sameSite: "strict",
// 		path: "/",
// 	});

// 	return true;
// }

"use server";

import { cookies } from "next/headers";

export async function setTokenCookie(data: { access_token: string; refresh_token: string }) {
	const cookieStore = await cookies();

	const baseKey = process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "";

	cookieStore.set(`${baseKey}+saleor_auth_access_token`, data.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	cookieStore.set(`${baseKey}+saleor_auth_module_refresh_token`, data.refresh_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	cookieStore.set(`${baseKey}+saleor_auth_module_auth_state`, "signedIn", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});

	return true;
}
