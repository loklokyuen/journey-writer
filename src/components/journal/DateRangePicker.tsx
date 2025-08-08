"use client";

import type { DateRange } from "@/lib/types";

export default function DateRangePicker({
	value,
	onChange,
}: {
	value: DateRange;
	onChange: (v: DateRange) => void;
}) {
	const isExact = value.mode === "exact";

	return (
		<div>
			<label className="block font-semibold mb-1">Travel Dates</label>

			{isExact ? (
				<div className="flex gap-4">
					<div className="flex-1">
						<span className="text-xs text-gray-600">Start</span>
						<input
							type="date"
							className="w-full border p-2 rounded"
							value={value.start}
							onChange={(e) => onChange({ ...value, start: e.target.value })}
						/>
					</div>
					<div className="flex-1">
						<span className="text-xs text-gray-600">End</span>
						<input
							type="date"
							className="w-full border p-2 rounded"
							value={value.end || ""}
							onChange={(e) => onChange({ ...value, end: e.target.value })}
						/>
					</div>
				</div>
			) : (
				<div className="flex gap-4">
					<div className="flex-1">
						<span className="text-xs text-gray-600">Start</span>
						<input
							type="month"
							className="w-full border p-2 rounded"
							value={value.start}
							onChange={(e) => onChange({ ...value, start: e.target.value })}
						/>
					</div>
					<div className="flex-1">
						<span className="text-xs text-gray-600">End (optional)</span>
						<input
							type="month"
							className="w-full border p-2 rounded"
							value={value.end || ""}
							onChange={(e) => onChange({ ...value, end: e.target.value })}
						/>
					</div>
				</div>
			)}
			<div className="flex items-center gap-2 mt-2">
				<input
					id="exactDates"
					type="checkbox"
					className="h-4 w-4"
					checked={isExact}
					onChange={(e) =>
						onChange({
							mode: e.target.checked ? "exact" : "month",
							start: "",
							end: "",
						})
					}
				/>
				<label htmlFor="exactDates" className="text-sm">
					Exact dates
				</label>
			</div>
		</div>
	);
}
