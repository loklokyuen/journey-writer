"use client";

import { Mode } from "@/lib/types";

interface ModeToggleProps {
	mode: Mode;
	setMode: (mode: Mode) => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
	return (
		<div>
			<label className="font-semibold">Journal Mode:</label>
			<div className="flex mt-1 rounded-lg overflow-hidden border w-fit border-lavender-900">
				{[
					{ value: "summary", label: "Summary" },
					{ value: "day-by-day", label: "Day-by-day" },
				].map((opt) => (
					<button
						key={opt.value}
						onClick={(e) => {
							e.preventDefault();
							setMode(opt.value as Mode);
						}}
						className={`px-4 py-2 font-medium ${
							mode === opt.value
								? "bg-lavender-500 text-white"
								: "bg-white text-lavender-800 hover:bg-gray-50"
						}`}>
						{opt.label}
					</button>
				))}
			</div>
		</div>
	);
}
