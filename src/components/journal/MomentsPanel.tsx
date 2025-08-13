"use client";

import { useMemo } from "react";
import { groupPhotosByDay } from "@/lib/grouping";
import type { PhotoItem, TripItem, TripItemKind } from "@/lib/types";

function formatDay(key: string) {
	if (key === "unknown") return "Unknown date";
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function TripItemRow({
	item,
	onChange,
	onDelete,
}: {
	item: TripItem;
	onChange: (next: TripItem) => void;
	onDelete: () => void;
}) {
	return (
		<div className="flex flex-col gap-2 border rounded-lg p-3 bg-white">
			<div className="flex items-center gap-2">
				<label className="text-sm w-16">Title</label>
				<input
					className="flex-1 border rounded px-2 py-1"
					value={item.title}
					onChange={(e) => onChange({ ...item, title: e.target.value })}
					placeholder="e.g., Louvre Museum"
				/>
			</div>
			<div className="flex items-center gap-2">
				<label className="text-sm w-16">Type</label>
				<select
					className="border rounded px-2 py-1"
					value={item.kind}
					onChange={(e) =>
						onChange({ ...item, kind: e.target.value as TripItemKind })
					}>
					<option value="place">place</option>
					<option value="activity">activity</option>
					<option value="meal">meal</option>
					<option value="transport">transport</option>
					<option value="other">other</option>
				</select>
				<button
					type="button"
					className="ml-auto text-red-600 text-sm hover:underline"
					onClick={onDelete}>
					Delete
				</button>
			</div>
		</div>
	);
}

export default function MomentsPanel({
	photos,
	items,
	onChange,
}: {
	photos: PhotoItem[];
	items: TripItem[];
	onChange: (next: TripItem[]) => void;
}) {
	const groups = useMemo(() => groupPhotosByDay(photos), [photos]);

	function addItemForDay(dayKey: string) {
		const titleFromPlace =
			photos.find((p) => p.takenAt && dayKey === (p.takenAt ? dayKey : ""))
				?.place?.name ??
			photos.find(
				(p) => dayKey === (p.takenAt ? /* placeholder */ "" : "unknown")
			)?.place?.name ??
			"Untitled";
		const newItem: TripItem = {
			id: crypto.randomUUID(),
			clusterId: dayKey,
			kind: "place",
			title: titleFromPlace,
		};
		onChange([...items, newItem]);
	}

	function updateItem(id: string, next: TripItem) {
		onChange(items.map((it) => (it.id === id ? next : it)));
	}

	function deleteItem(id: string) {
		onChange(items.filter((it) => it.id !== id));
	}

	// items grouped by day for rendering
	const itemsByDay = new Map<string, TripItem[]>();
	for (const it of items) {
		if (!itemsByDay.has(it.clusterId)) itemsByDay.set(it.clusterId, []);
		itemsByDay.get(it.clusterId)!.push(it);
	}

	return (
		<section className="space-y-3">
			<h2 className="text-lg font-semibold text-crater-brown-700">Moments</h2>

			{groups.map(({ key }) => {
				const pretty = formatDay(key);
				const list = itemsByDay.get(key) ?? [];
				return (
					<details
						key={key}
						open
						className="bg-chardon-50 border rounded-xl p-3">
						<summary className="cursor-pointer select-none flex items-center justify-between">
							<span className="font-medium">{pretty}</span>
							<span className="text-sm opacity-70">
								{list.length} item{list.length === 1 ? "" : "s"}
							</span>
						</summary>

						<div className="mt-3 space-y-3">
							{list.map((it) => (
								<TripItemRow
									key={it.id}
									item={it}
									onChange={(next) => updateItem(it.id, next)}
									onDelete={() => deleteItem(it.id)}
								/>
							))}

							<button
								type="button"
								onClick={() => addItemForDay(key)}
								className="text-sm px-3 py-2 border rounded-lg bg-white hover:bg-gray-50">
								+ Add item
							</button>
						</div>
					</details>
				);
			})}
		</section>
	);
}
