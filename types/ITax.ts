export interface ITax {
	uid: string;
	name: string;
	rate: number;
	type: "percentage" | "fixed";
	per_head: boolean;
	applicability: "attraction" | "apartment" | "airport_taxi" | "all";
	created_at?: string;
	updated_at?: string;
}
