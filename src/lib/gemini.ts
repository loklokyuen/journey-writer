import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export type Mode = "summary" | "day-by-day";
export type DateMode = "exact" | "month";

export interface DateRange {
	mode: DateMode;
	start: string;
	end?: string;
}

export interface PhotoData {
	date?: string;
	location?: string;
	userNote?: string;
}

export interface JournalGenerationInput {
	mode: Mode;
	dateRange: DateRange;
	tripType: string[];
	companions: string[];
	photoData: PhotoData[];
}

function monthLabel(yyyyMm?: string) {
	if (!yyyyMm) return "";
	const [y, m] = yyyyMm.split("-").map(Number);
	if (!y || !m) return yyyyMm;
	return new Date(y, m - 1, 1).toLocaleString("en-US", {
		month: "long",
		year: "numeric",
	});
}

function dateRangeLabel(dr: DateRange) {
	if (dr.mode === "exact") {
		const end = dr.end ? ` to ${dr.end}` : "";
		return `${dr.start}${end}`.trim();
	}
	const start = monthLabel(dr.start);
	const end = dr.end ? ` to ${monthLabel(dr.end)}` : "";
	return `${start}${end}`.trim();
}

// ---- Prompt builder ----
function buildPrompt(input: JournalGenerationInput) {
	const { mode, dateRange, tripType, companions, photoData } = input;

	const header = `You are an AI travel journal assistant. Generate a ${
		mode === "summary" ? "concise trip summary" : "detailed day-by-day journal"
	} strictly from the provided information.

		Rules:
		- Do NOT invent locations, activities, restaurants, or companions.
		- If information is missing, acknowledge it or omit it gracefully.
		- Keep tone warm, descriptive, and specific.
		- Prefer concrete details from notes/EXIF over generic filler.
		- Keep each paragraph tight (3–5 sentences).`;

	const context = `Trip context:
		- Trip type: ${tripType.length ? tripType.join(", ") : "(unspecified)"}
		- Companions: ${companions.length ? companions.join(", ") : "(unspecified)"}
		- Dates: ${dateRangeLabel(dateRange)}`;

	const details =
		mode === "day-by-day"
			? `Daily details (source of truth):
${photoData
	.map((p, i) => {
		const date = p.date ? `Date: ${p.date}` : "Date: (unknown)";
		const loc = p.location ? ` | Location: ${p.location}` : "";
		const note = p.userNote ? `\nNotes: ${p.userNote}` : "";
		return `- Entry ${i + 1}: ${date}${loc}${note}`;
	})
	.join("\n")}`
			: `Trip notes (source of truth):
${photoData
	.map((p, i) => `- Note ${i + 1}: ${p.userNote ?? "(none)"}`)
	.join("\n")}`;

	const outputSpec =
		mode === "day-by-day"
			? `Output format:
				- One section per day (or logical cluster), with a short heading like "Day 1 — City" if info allows.
				- Under each, write 1–2 short paragraphs.
				- If exact dates are not provided (month mode), infer only the order, not specific dates.`
			: `Output format:
				- 2–3 short paragraphs summarizing the trip across the date range.
				- Mention companions and trip type only if provided.`;

	const antiHallucination = `Important:
				- Only use details present above.
				- If unsure, write neutrally without fabricating specifics.`;

	return `${header}\n\n${context}\n\n${details}\n\n${outputSpec}\n\n${antiHallucination}`;
}

export async function generateJournalEntry(
	input: JournalGenerationInput
): Promise<string> {
	const prompt = buildPrompt(input);

	const result = await ai.models.generateContent({
		model: "gemini-2.0-flash-001",
		contents: [{ role: "user", parts: [{ text: prompt }] }],
	});

	return result.text ?? "No journal entry generated.";
}
