import { GoogleGenAI } from "@google/genai";
import type { JournalGenerationInput, DateRange } from "@/lib/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export type Mode = "summary" | "day-by-day";
export type DateMode = "exact" | "month";

function monthLabel(yyyyMm?: string) {
	if (!yyyyMm) return "";
	const [y, m] = yyyyMm.split("-").map(Number);
	if (!y || !m) return yyyyMm;
	return new Date(y, m - 1, 1).toLocaleString("en-US", {
		month: "long",
		year: "numeric",
	});
}

function buildPrompt(input: JournalGenerationInput) {
	const { mode, dateRange, tripType, companions, photoData, notes } = input;

	const contextLines = [
		tripType.length
			? `Trip type (user-selected): ${tripType.join(", ")}`
			: null,
		companions.length
			? `Companions (user-selected): ${companions.join(", ")}`
			: null,
		dateRange.start || dateRange.end
			? `User-entered dates (${dateRange.mode}): ${
					dateRange.start || "(none)"
			  }${dateRange.end ? " to " + dateRange.end : ""}`
			: null,
		notes ? `User notes: ${notes}` : null,
	]
		.filter(Boolean)
		.join("\n");

	const photosBlock = photoData.length
		? photoData
				.map((p, i) => {
					const d = p.date ? `Date: ${p.date}` : "Date: (unknown)";
					const l = p.location ? ` | Location: ${p.location}` : "";
					const n = p.userNote ? `\nUserNote: ${p.userNote}` : "";
					return `- Photo ${i + 1}: ${d}${l}${n}`;
				})
				.join("\n")
		: "(no photos provided)";

	// Output spec: facts > prose. If day-by-day, cluster by date if possible; else group by location/topic.
	const outputSpec =
		mode === "day-by-day"
			? `OUTPUT FORMAT (STRICT):
			- Title line: "Trip Journal"
			- Then for each day or cluster:
			- "Day X" (or "Cluster X") with optional date if known.
			- Bullet lists only:
				• Places/landmarks visited (from photos/notes only)
				• Activities done
				• Food & drink items (names of dishes/venues if present in notes/metadata)
				• Transport (only if explicitly present)
			- If dates are missing, order photos logically but DO NOT fabricate dates or sequence beyond what is implied.
			- Keep to facts. No imaginative storytelling.`
			: `OUTPUT FORMAT (STRICT):
			- Title line: "Trip Summary"
			- Sections as bullet lists:
			• Itinerary overview (cities/landmarks)
			• Activities
			• Food & drink
			• Highlights (facts only)
			- Keep it concise and factual. No flowery prose.`;

	const rules = `RULES (CRITICAL):
			- Derive all details ONLY from:
			• photoData (date/location/userNote fields)
			• explicit user inputs above
			- DO NOT invent venues, dates, or sequences.
			- If a detail is uncertain or absent, omit it.
			- Prefer lists over paragraphs. No filler adjectives.
			- If multiple photos share the same date/location, group them.`;

	return [
		`You are an AI assistant generating a TRAVEL JOURNAL from user photos.`,
		`Primary goal: extract FACTS (places, activities, food) from provided inputs.`,
		``,
		`USER CONTEXT:\n${contextLines || "(no extra context)"}`,
		``,
		`PHOTO DATA (source of truth):\n${photosBlock}`,
		``,
		outputSpec,
		``,
		rules,
	].join("\n");
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
