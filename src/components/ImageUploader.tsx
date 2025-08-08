"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader() {
	const [previews, setPreviews] = useState<string[]>([]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
		setPreviews(urls);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [],
		},
		multiple: true,
	});

	return (
		<div className="border-2 border-dashed p-6 rounded-md text-center bg-white">
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

			{previews.length > 0 && (
				<div className="mt-4 grid grid-cols-3 gap-2">
					{previews.map((url, i) => (
						<img
							key={i}
							src={url}
							alt={`Preview ${i}`}
							className="w-full h-auto rounded shadow-sm"
						/>
					))}
				</div>
			)}
		</div>
	);
}
