import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { ITaxiBooking } from "@/types/ITaxiBooking";

export interface TaxiBookingsFilter {
	status?: "pending" | "completed" | "cancelled" | "all";
	car_type?: "standard_sedan" | "premium_sedan" | "suv" | "mini_bus";
	booking_type?: "pickup" | "dropoff";
}

export interface TaxiBookingsSort {
	field: "created_at" | "arrival_date" | "price";
	order: "asc" | "desc";
}

interface UseTaxiBookingsReturn {
	taxiBookings: ITaxiBooking[];
	loading: boolean;
	error: string | null;
	totalCount: number;
	fetchTaxiBookings: (
		page: number,
		limit: number,
		filters?: TaxiBookingsFilter,
		sortBy?: TaxiBookingsSort
	) => Promise<void>;
	updateTaxiBookingStatus: (
		id: string,
		status: ITaxiBooking["status"]
	) => Promise<void>;
	deleteTaxiBooking: (id: string) => Promise<void>;
}

export const useTaxiBookings = (): UseTaxiBookingsReturn => {
	const supabase = createClient();
	const [taxiBookings, setTaxiBookings] = useState<ITaxiBooking[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState<number>(0);

	const fetchTaxiBookings = useCallback(
		async (
			page: number,
			limit: number,
			filters?: TaxiBookingsFilter,
			sortBy?: TaxiBookingsSort
		) => {
			setLoading(true);
			setError(null);

			try {
				let query = supabase
					.from("taxi_bookings")
					.select("*", { count: "exact" });

				const from = (page - 1) * limit;
				const to = from + limit - 1;
				query = query.range(from, to);

				if (filters?.status && filters.status !== "all") {
					query = query.eq("status", filters.status);
				}

				if (filters?.car_type) {
					query = query.eq("car_type", filters.car_type);
				}

				if (filters?.booking_type) {
					query = query.eq("booking_type", filters.booking_type);
				}

				if (sortBy) {
					query = query.order(sortBy.field, {
						ascending: sortBy.order === "asc",
					});
				} else {
					query = query.order("created_at", { ascending: false });
				}

				const { data, error, count } = await query;

				if (error) throw error;

				setTaxiBookings((data as ITaxiBooking[]) || []);
				setTotalCount(count || 0);
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to fetch taxi bookings";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[supabase]
	);

	const updateTaxiBookingStatus = useCallback(
		async (id: string, status: ITaxiBooking["status"]) => {
			setLoading(true);
			try {
				const { data, error } = await supabase
					.from("taxi_bookings")
					.update({ status })
					.eq("uid", id)
					.select();

				if (error) throw error;
				if (data)
					setTaxiBookings((prev) =>
						prev.map((b) =>
							b.uid === id ? (data[0] as ITaxiBooking) : b
						)
					);
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update taxi booking status";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[supabase]
	);

	const deleteTaxiBooking = useCallback(
		async (id: string) => {
			setLoading(true);
			try {
				const { error } = await supabase
					.from("taxi_bookings")
					.delete()
					.eq("uid", id);

				if (error) throw error;
				setTaxiBookings((prev) => prev.filter((b) => b.uid !== id));
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to delete taxi booking";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[supabase]
	);

	return {
		taxiBookings,
		loading,
		error,
		totalCount,
		fetchTaxiBookings,
		updateTaxiBookingStatus,
		deleteTaxiBooking,
	};
};
