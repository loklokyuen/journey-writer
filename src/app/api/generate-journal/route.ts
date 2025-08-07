import { NextResponse } from "next/server";
import { generateJournalEntry } from "@/lib/gemini";

export async function POST(req: Request) {
	const { location, date, notes } = await req.json();
	const entry = await generateJournalEntry({ location, date, notes });
	return NextResponse.json({ entry });
}
