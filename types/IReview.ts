export interface IReview {
	uid: string;
	listing_id: string;
	title: string;
	description: string;
	booking_id: string;
	rating: number;
	name: string;
	created_at: string; // ISO string
}
