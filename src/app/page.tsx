"use client";

import { useState } from "react";

export default function HomePage() {
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");
	const [notes, setNotes] = useState("");
	const [entry, setEntry] = useState("");
	const [loading, setLoading] = useState(false);

	const handleGenerate = async () => {
		setLoading(true);
		const res = await fetch("/api/generate-journal", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ location, date, notes }),
		});
		const data = await res.json();
		setEntry(data.entry);
		setLoading(false);
	};

	return (
		<main className="p-6 max-w-xl mx-auto my-4 space-y-2 bg-chardon-50 rounded-2xl">
			<h1 className="text-2xl font-bold mb-4 text-crater-brown-700">
				Journey Writer 🧳
			</h1>
			<input
				type="text"
				className="w-full p-2 border rounded"
				placeholder="Location"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
			/>
			<input
				type="date"
				className="w-full p-2 border rounded"
				value={date}
				onChange={(e) => setDate(e.target.value)}
			/>
			<textarea
				className="w-full p-2 border rounded"
				rows={4}
				placeholder="Your notes..."
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
			/>

			<button
				onClick={handleGenerate}
				className="bg-lavender-500 text-white px-4 py-2 rounded hover:bg-lavender-600 transition-colors font-semibold"
				disabled={loading}>
				{loading ? "Generating..." : "Generate Journal Entry"}
			</button>

			{entry && (
				<div className="bg-gray-50 p-4 mt-4 rounded whitespace-pre-line text-lg">
					{entry}
				</div>
			)}
		</main>
	);
}
