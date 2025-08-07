// src/lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateJournalEntry({
	location,
	date,
	notes,
}: {
	location: string;
	date: string;
	notes: string;
}): Promise<string> {
	const prompt = `
Write a 1–2 paragraph travel journal entry using the following details:

Location: ${location}
Date: ${date}
User notes: ${notes}

Write in a warm, reflective tone. Focus on atmosphere, sights, emotions, and experience.
`;

	const result = await ai.models.generateContent({
		model: "gemini-2.0-flash-001",
		contents: [{ role: "user", parts: [{ text: prompt }] }],
	});

	return result.text ?? "No journal entry generated.";
}
