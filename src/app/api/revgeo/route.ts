import { NextResponse } from "next/server";

function pickName(data: any) {
	const nd = data?.namedetails || {};
	const addr = data?.address || {};
	const poiName = nd.name || data.name;

	// named place that isn't just a road segment
	if (poiName && poiName !== addr.road) return poiName;

	// geographic fallback — specific before broad, avoid county/state
	return (
		addr.neighbourhood ||
		addr.suburb ||
		addr.quarter ||
		addr.village ||
		addr.town ||
		addr.city ||
		addr.county
	);
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");
	if (!lat || !lng) {
		return NextResponse.json(
			{ error: "lat and lng are required" },
			{ status: 400 }
		);
	}

	const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
		lat
	)}&lon=${encodeURIComponent(
		lng
	)}&zoom=14&addressdetails=1&namedetails=1`;

	const res = await fetch(url, {
		headers: {
			"User-Agent":
				"journey-writer (dev) - https://github.com/loklokyuen/journey-writer",
			"Accept-Language": "en",
		},
		cache: "no-store",
	});

	if (!res.ok) {
		return NextResponse.json(
			{ error: `revgeo failed: ${res.status}` },
			{ status: 502 }
		);
	}

	const data = await res.json();
	const addr = data?.address || {};
	const displayName: string | undefined = data?.display_name;
	const name = pickName(data);
	const country: string | undefined = addr?.country;
	const countryCode: string | undefined = addr?.country_code
		? String(addr.country_code).toUpperCase()
		: undefined;

	return NextResponse.json({
		name,
		country,
		countryCode,
		displayName,
	});
}
