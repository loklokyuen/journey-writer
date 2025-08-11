"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { PhotoItem } from "@/lib/types";

export default function ImageUploader({
	photos,
	onChange,
}: {
	photos: PhotoItem[];
	onChange: (next: PhotoItem[]) => void;
}) {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const newItems: PhotoItem[] = acceptedFiles.map((file) => ({
				id: crypto.randomUUID(),
				file,
				previewUrl: URL.createObjectURL(file),
			}));
			onChange([...photos, ...newItems]);
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
				{isDragActive ? (
					<p>Drop the photos here...</p>
				) : (
					<p>Drag & drop some photos here, or click to select files</p>
				)}
			</div>

			{photos.length > 0 && (
				<div className="mt-4 grid grid-cols-3 gap-2">
					{photos.map((p) => (
						<img
							key={p.id}
							src={p.previewUrl}
							alt="Preview"
							className="w-full h-auto rounded shadow-sm"
						/>
					))}
				</div>
			)}
		</div>
	);
}
