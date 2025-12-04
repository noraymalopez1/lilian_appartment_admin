export interface IBooking {
	uid: string;
	listing_id: string;
	listing_type: string; // apartment or attraction or taxi
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	check_in: string; // ISO string
	check_out: string; // ISO string
	guests: number;
	status: string;
	total_price: number;
	nights: number;
	taxes: number;
	created_at: string;
}
