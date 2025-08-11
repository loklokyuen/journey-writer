export type Mode = "summary" | "day-by-day";

export type DateMode = "exact" | "month";

export interface DateRange {
	mode: DateMode;
	start: string;
	end?: string;
}

export interface PhotoData {
	id?: string;
	url?: string;
	date?: string;
	location?: string;
	userNote?: string;
}

export interface PhotoItem {
	id: string;
	file: File;
	previewUrl: string;
	userNote?: string;
}

export interface JournalGenerationInput {
	mode: Mode;
	dateRange: DateRange;
	tripType: string[];
	companions: string[];
	photoData: PhotoData[];
	notes?: string;
}
