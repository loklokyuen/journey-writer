import { NextResponse } from "next/server";
import { generateJournalEntry } from "@/lib/gemini";
import type { JournalGenerationInput } from "@/lib/types";

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as JournalGenerationInput;
		const entry = await generateJournalEntry(body);
		return NextResponse.json({ entry });
	} catch (e: any) {
		return NextResponse.json(
			{ error: e?.message ?? "Server error" },
			{ status: 500 }
		);
	}
}
