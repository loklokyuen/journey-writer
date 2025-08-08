"use client";

import type { IconType } from "react-icons";

type Item = {
	value: string;
	label: string;
	Icon: IconType;
	pastel:
		| "blue"
		| "amber"
		| "pink"
		| "emerald"
		| "purple"
		| "rose"
		| "sky"
		| "teal"
		| "yellow";
};

const pastelClasses: Record<
	Item["pastel"],
	{ base: string; hover: string; text: string; border: string; ring: string }
> = {
	blue: {
		base: "bg-blue-100",
		hover: "hover:bg-blue-50",
		text: "text-blue-900",
		border: "border-blue-200",
		ring: "ring-blue-300",
	},
	amber: {
		base: "bg-amber-100",
		hover: "hover:bg-amber-50",
		text: "text-amber-900",
		border: "border-amber-200",
		ring: "ring-amber-300",
	},
	pink: {
		base: "bg-pink-100",
		hover: "hover:bg-pink-50",
		text: "text-pink-900",
		border: "border-pink-200",
		ring: "ring-pink-300",
	},
	emerald: {
		base: "bg-emerald-100",
		hover: "hover:bg-emerald-50",
		text: "text-emerald-900",
		border: "border-emerald-200",
		ring: "ring-emerald-300",
	},
	purple: {
		base: "bg-purple-100",
		hover: "hover:bg-purple-50",
		text: "text-purple-900",
		border: "border-purple-200",
		ring: "ring-purple-300",
	},
	rose: {
		base: "bg-rose-100",
		hover: "hover:bg-rose-50",
		text: "text-rose-900",
		border: "border-rose-200",
		ring: "ring-rose-300",
	},
	sky: {
		base: "bg-sky-100",
		hover: "hover:bg-sky-50",
		text: "text-sky-900",
		border: "border-sky-200",
		ring: "ring-sky-300",
	},
	teal: {
		base: "bg-teal-100",
		hover: "hover:bg-teal-50",
		text: "text-teal-900",
		border: "border-teal-200",
		ring: "ring-teal-300",
	},
	yellow: {
		base: "bg-yellow-100",
		hover: "hover:bg-yellow-50",
		text: "text-yellow-900",
		border: "border-yellow-200",
		ring: "ring-yellow-300",
	},
};

export default function ChipMultiSelect({
	label,
	options,
	selected,
	setSelected,
}: {
	label: string;
	options: ReadonlyArray<Item>;
	selected: string[];
	setSelected: (values: string[]) => void;
}) {
	const toggle = (value: string) => {
		setSelected(
			selected.includes(value)
				? selected.filter((v) => v !== value)
				: [...selected, value]
		);
	};

	return (
		<div>
			<label className="font-semibold">{label}:</label>
			<div className="flex flex-wrap gap-2 mt-1">
				{options.map(({ value, label, Icon, pastel }) => {
					const active = selected.includes(value);
					const pastelClass = pastelClasses[pastel];

					return (
						<button
							key={value}
							type="button"
							onClick={(e) => {
								e.preventDefault();
								toggle(value);
							}}
							className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition
                ${
									active
										? `${pastelClass.base} ${pastelClass.text} ${pastelClass.border} ring-1 ${pastelClass.ring}`
										: `bg-gray-100 text-gray-800 border-gray-300 ${pastelClass.hover}`
								}`}
							aria-pressed={active}>
							<Icon className="w-4 h-4" />
							<span className="text-sm font-medium">{label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
