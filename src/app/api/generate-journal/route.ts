import { NextResponse } from "next/server";
import {
	generateJournalEntry,
	type JournalGenerationInput,
} from "@/lib/gemini";

export async function POST(req: Request) {
	const body = (await req.json()) as JournalGenerationInput;

	if (!body?.mode || !body?.dateRange) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}

	const entry = await generateJournalEntry(body);
	return NextResponse.json({ entry });
}
