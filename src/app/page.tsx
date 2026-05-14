"use client";
import ImageUploader from "@/components/ImageUploader";
import JournalForm from "@/components/journal/JournalForm";
import MomentsPanel from "@/components/journal/MomentsPanel";
import { PhotoItem, TripItem } from "@/lib/types";
import { dayKey } from "@/lib/grouping";
import { useEffect, useState } from "react";

function generateMomentsFromPhotos(photos: PhotoItem[]): TripItem[] {
	const seen = new Map<string, Set<string>>();
	const items: TripItem[] = [];
	for (const p of photos) {
		const cluster = dayKey(p.takenAt);
		if (cluster === "unknown" || !p.place?.name) continue;
		if (!seen.has(cluster)) seen.set(cluster, new Set());
		if (seen.get(cluster)!.has(p.place.name)) continue;
		seen.get(cluster)!.add(p.place.name);
		items.push({
			id: crypto.randomUUID(),
			clusterId: cluster,
			kind: "place",
			title: p.place.name,
			location: p.place,
		});
	}
	return items;
}

export default function HomePage() {
	const [photos, setPhotos] = useState<PhotoItem[]>([]);
	const [moments, setMoments] = useState<TripItem[]>([]);
	const [loading, setLoading] = useState(false);

	function handleUpload(newPhotos: PhotoItem[]) {
		setLoading(true);
		setPhotos(newPhotos);
	}

	useEffect(() => {
		if (photos.length === 0) return;
		const auto = generateMomentsFromPhotos(photos);
		setMoments(auto);
		setLoading(false);
	}, [photos]);

	return (
		<main className="p-6 max-w-xl mx-auto my-4 space-y-4 bg-chardon-50 rounded-2xl font-body">
			<h1 className="text-2xl font-heading font-bold mb-4 text-crater-brown-700 text-center">
				Journey Writer 🧳
			</h1>

			{photos.length === 0 ? (
				<ImageUploader photos={photos} onChange={handleUpload} />
			) : (
				<>
					<MomentsPanel
						photos={photos}
						items={moments}
						onChange={(next) => {
							setMoments(next);
						}}
					/>

					<JournalForm photos={photos} moments={moments} />
				</>
			)}
		</main>
	);
}
