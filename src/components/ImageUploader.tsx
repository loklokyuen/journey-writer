"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { PhotoItem } from "@/lib/types";
import * as exifr from "exifr";

const revgeoCache = new Map<string, Promise<any>>();

function roundCoord(n: number) {
	return Math.round(n * 10000) / 10000;
}
async function reverseGeocode(lat: number, lng: number) {
	const key = `${roundCoord(lat)},${roundCoord(lng)}`;
	if (!revgeoCache.has(key)) {
		const p = fetch(`/api/revgeo?lat=${lat}&lng=${lng}`)
			.then((r) => r.json())
			.catch(() => null);
		revgeoCache.set(key, p);
	}
	return revgeoCache.get(key)!;
}

let heic2anyPromise: Promise<any> | null = null;
const loadHeic2Any = () => {
	if (!heic2anyPromise) heic2anyPromise = import("heic2any");
	return heic2anyPromise;
};

function isHeic(file: File) {
	const name = file.name?.toLowerCase() || "";
	return (
		file.type === "image/heic" ||
		file.type === "image/heif" ||
		name.endsWith(".heic") ||
		name.endsWith(".heif")
	);
}

async function makePreviewUrl(file: File): Promise<string> {
	if (!isHeic(file)) {
		return URL.createObjectURL(file);
	}
	try {
		const heic2any = (await loadHeic2Any()).default;
		const jpegBlob = (await heic2any({
			blob: file,
			toType: "image/jpeg",
			quality: 0.9,
		})) as Blob;
		return URL.createObjectURL(jpegBlob);
	} catch (e) {
		console.warn("HEIC conversion failed, falling back to no preview.", e);
		return "";
	}
}

export default function ImageUploader({
	photos,
	onChange,
}: {
	photos: PhotoItem[];
	onChange: (next: PhotoItem[]) => void;
}) {
	const [reading, setReading] = useState(false);
	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setReading(true);

			const newItems: PhotoItem[] = [];
			for (const file of acceptedFiles) {
				const previewUrl = await makePreviewUrl(file);
				newItems.push({
					id: crypto.randomUUID(),
					file,
					previewUrl,
				});
			}
			const next = [...photos, ...newItems];
			onChange(next);
			try {
				const updated = await Promise.all(
					newItems.map(async (item) => {
						try {
							// Date/time
							const parsed = await exifr.parse(item.file, ["DateTimeOriginal"]);
							const date =
								parsed?.DateTimeOriginal instanceof Date
									? parsed.DateTimeOriginal.toISOString()
									: undefined;

							// GPS (decimal lat/lng)
							const gps = await exifr.gps(item.file); // { latitude, longitude } or null
							const lat =
								typeof gps?.latitude === "number" ? gps.latitude : undefined;
							const lng =
								typeof gps?.longitude === "number" ? gps.longitude : undefined;

							let place;
							if (typeof lat === "number" && typeof lng === "number") {
								const res = await reverseGeocode(lat, lng);
								if (res && !res.error) {
									place = {
										name: res.name,
										country: res.country,
										countryCode: res.countryCode,
										displayName: res.displayName,
									};
								}
							}

							return { ...item, takenAt: date, lat, lng, place };
						} catch {
							return item;
						}
					})
				);

				const merged = next.map((p) => {
					const upd = updated.find((u) => u.id === p.id);
					return upd ?? p;
				});
				onChange(merged);
			} finally {
				setReading(false);
			}
		},
		[photos, onChange]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [] },
		multiple: true,
	});

	return (
		<div className="border-2 border-dashed border-crater-brown-700 p-6 rounded-lg text-center bg-white">
			<div
				{...getRootProps()}
				className="cursor-pointer py-6 px-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
				<input {...getInputProps()} />
				{!reading ? (
					isDragActive ? (
						<p>Drop the photos here...</p>
					) : (
						<p>Drag & drop some photos here, or click to select files</p>
					)
				) : (
					<div className="mt-2 text-sm opacity-70">Reading photo metadata…</div>
				)}
			</div>

			{photos.length > 0 && (
				<div className="mt-4 grid grid-cols-3 gap-2 text-left">
					{photos.map((p) => (
						<div key={p.id} className="rounded shadow-sm overflow-hidden">
							{p.previewUrl ? (
								<img
									src={p.previewUrl}
									alt=""
									className="w-full h-auto block"
								/>
							) : (
								<div className="w-full h-28 grid place-items-center bg-gray-100 text-xs">
									No preview available
								</div>
							)}
							<div className="p-2 text-xs bg-gray-50 border-t">
								{p.takenAt ? (
									<div>
										🕒{" "}
										{new Date(p.takenAt).toLocaleString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: false, // remove if you prefer AM/PM
										})}
									</div>
								) : (
									<div className="opacity-70">🕒 Time unknown</div>
								)}
								{p.place?.name || p.place?.country ? (
									<div>
										📍 {p.place?.name ? `${p.place.name}, ` : ""}
										{p.place?.country || ""}
									</div>
								) : typeof p.lat === "number" && typeof p.lng === "number" ? (
									<div>
										📍 {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
									</div>
								) : (
									<div className="opacity-70">📍 No location</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
