export function dayKey(iso?: string) {
	if (!iso) return "unknown";
	const date = new Date(iso);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function groupPhotosByDay<T extends { takenAt?: string }>(photos: T[]) {
	const map = new Map<string, T[]>();
	for (const photo of photos) {
		const key = dayKey(photo.takenAt);
		if (key == "unknown") continue;
		if (!map.has(key)) {
			map.set(key, []);
		}
		map.get(key)?.push(photo);
	}
	return Array.from(map.entries())
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([key, items]) => ({ key, items }));
}
