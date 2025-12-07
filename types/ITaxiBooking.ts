export const taxiPrices = {
	standard_sedan: 100,
	premium_sedan: 150,
	suv: 200,
	mini_bus: 250,
};

export interface ITaxiBooking {
	uid: string;
	pickup: string;
	destination: string;
	flight_no: string;
	airline: string;
	arrival_date: string;
	arrival_time: string;
	booking_type: "pickup" | "dropoff";
	first_name: string;
	last_name: string;
	phone: string;
	alternate_phone?: string | null;
	email: string;
	luggage_quantity: string;
	instruction: string;
	car_type: "standard_sedan" | "premium_sedan" | "suv" | "mini_bus";
	status: "pending" | "completed" | "cancelled";
	created_at?: string; // timestamptz from DB
	price: number;
}
