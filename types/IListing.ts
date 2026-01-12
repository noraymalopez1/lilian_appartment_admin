export interface IListing {
	uid: string;
	title?: string;
	category?: string;
	tags?: string;
	description?: string;
	price?: { adult: number; child: number };
	fees?: { perPerson: number; perBooking: number };
	whole_apartment_price?: number;
	images?: string[];
	zipcode?: string;
	city?: string;
	location?: string;
	latitude?: number;
	longitude?: number;
	guest_capacity?: number;
	bathrooms_count?: number;
	bedrooms_count?: number;
	living_area?: number;
	is_parking_available?: boolean;
	distance?: number;
	accessibility_points?: string[];
	rules?: string[];
	status?: "open" | "closed";
	features?: string[];
	created_at?: string;
	updated_at?: string;
}
