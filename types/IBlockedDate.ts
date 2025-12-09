export interface IBlockedDate {
	uid: string;
	listing_id: string;
	listing_type: "apartment" | "attraction";
	blocked_date: string;
	reason?: string;
	created_at: string;
}
