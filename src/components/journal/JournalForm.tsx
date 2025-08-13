"use client";

import ModeToggle from "@/components/journal/ModeToggle";
import ChipMultiSelect from "@/components/journal/ChipMultiSelect";
import { useState } from "react";
import { TRIP_TYPES, COMPANIONS } from "@/lib/constants";
import type {
	Mode,
	DateRange,
	PhotoItem,
	JournalGenerationInput,
} from "@/lib/types";
import DateRangePicker from "@/components/journal/DateRangePicker";

export default function JournalForm() {
	const [mode, setMode] = useState<Mode>("summary");
	const [dateRange, setDateRange] = useState<DateRange>({
		mode: "exact",
		start: "",
		end: "",
	});
	const [tripType, setTripType] = useState<string[]>([]);
	const [companions, setCompanions] = useState<string[]>([]);
	const [notes, setNotes] = useState("");
	const [photos, setPhotos] = useState<PhotoItem[]>([]);
	const [entry, setEntry] = useState("");
	const [loading, setLoading] = useState(false);

	const handleGenerate = async () => {
		setLoading(true);
		setEntry("");
		if (dateRange.start && dateRange.end) {
			const a = new Date(dateRange.start);
			const b = new Date(dateRange.end);
			if (a > b) {
				setEntry("❌ End date must be after start date.");
				return;
			}
		}
		try {
			const payload: JournalGenerationInput = {
				mode,
				dateRange,
				tripType,
				companions,
				photoData: photos.map(() => ({})),
				notes,
			};

			const res = await fetch("/api/generate-journal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				const msg = errData?.error || `Error ${res.status}`;
				setEntry(`❌ ${msg}`);
				return;
			}

			const data = await res.json();
			setEntry(data.entry ?? "");
		} catch (err: any) {
			setEntry(`❌ ${err.message || "Unexpected error"}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="p-6 max-w-xl mx-auto my-4 space-y-4 bg-chardon-50 rounded-2xl font-body">
			<ModeToggle mode={mode} setMode={setMode} />

			<DateRangePicker value={dateRange} onChange={setDateRange} />

			<ChipMultiSelect
				label="Trip Type"
				options={TRIP_TYPES}
				selected={tripType}
				setSelected={setTripType}
			/>

			<ChipMultiSelect
				label="Companions"
				options={COMPANIONS}
				selected={companions}
				setSelected={setCompanions}
			/>

			<div>
				<label className="font-semibold">General Trip Notes:</label>
				<textarea
					className="w-full border border-crater-brown-700 p-2 rounded"
					rows={4}
					placeholder="Your notes..."
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
				/>
			</div>
			<div className="flex justify-center">
				<button
					onClick={handleGenerate}
					className="bg-cerise-red-500 text-white px-4 py-2 rounded hover:bg-cerise-red-600 transition-colors font-semibold"
					disabled={loading}>
					{loading ? "Generating..." : "Generate Journal"}
				</button>
			</div>

			{entry && (
				<div className="bg-gray-50 p-4 mt-4 rounded whitespace-pre-line text-lg">
					{entry}
				</div>
			)}
		</main>
	);
}
