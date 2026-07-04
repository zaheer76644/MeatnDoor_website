import { NextResponse } from "next/server";

const CUSTOMER_ORDER_COUNT_QUERY = `
	query CustomerOrderCount($filter: OrderFilterInput!, $channel: String!) {
		orders(first: 1, channel: $channel, filter: $filter) {
			totalCount
		}
	}
`;

type RequestBody = {
	email?: string;
	user_id?: string;
};

export async function POST(request: Request) {
	const token = process.env.SALEOR_APP_TOKEN;
	const apiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

	if (!token || !apiUrl) {
		return NextResponse.json({ error: "Server not configured" }, { status: 503 });
	}

	let body: RequestBody;
	try {
		body = (await request.json()) as RequestBody;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const email = body.email?.trim();
	const userId = body.user_id?.trim();

	if (!email && !userId) {
		return NextResponse.json({ error: "email or user_id is required" }, { status: 400 });
	}

	const filter = userId ? { customer: userId } : { search: email };

	const response = await fetch(apiUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			query: CUSTOMER_ORDER_COUNT_QUERY,
			variables: { filter, channel: "in" },
		}),
	});

	if (!response.ok) {
		return NextResponse.json({ error: "Saleor API request failed" }, { status: 502 });
	}

	const json = (await response.json()) as {
		data?: { orders?: { totalCount?: number } };
		errors?: { message: string }[];
	};

	const count = json.data?.orders?.totalCount;

	if (count == null) {
		return NextResponse.json(
			{ error: "Could not fetch order count", details: json.errors },
			{ status: 502 },
		);
	}

	return NextResponse.json({ count, total_count: count });
}
