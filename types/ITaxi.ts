export interface ITaxi {
	uid: string;
	name: string;
	luggage_quantity: number;
	carry_on_luggage: number;
	passenger_seats: number;
	car_type: "standard_sedan" | "premium_sedan" | "suv" | "mini_bus";
	status: "active" | "closed";
	created_at: string;
	price: number;
	image?: string;
}
