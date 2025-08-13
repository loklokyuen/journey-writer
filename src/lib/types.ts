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

export type PhotoItem = {
	id: string;
	file: File;
	previewUrl: string;
	takenAt?: string;
	lat?: number;
	lng?: number;
	place?: {
		name?: string;
		country?: string;
		countryCode?: string;
		displayName?: string;
	};
};

export interface JournalGenerationInput {
	mode: Mode;
	dateRange: DateRange;
	tripType: string[];
	companions: string[];
	photoData: PhotoData[];
	notes?: string;
}

export type TripItemKind =
	| "place"
	| "meal"
	| "activity"
	| "transport"
	| "other";

export type TripItem = {
	id: string;
	clusterId: string;
	kind: TripItemKind;
	date?: string;
	time?: string;
	title: string;
	description?: string;
	location?: {
		name?: string;
		country?: string;
		countryCode?: string;
		displayName?: string;
	};
	photos?: PhotoItem[];
};
