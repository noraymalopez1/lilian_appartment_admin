// hooks/useBookings.ts
import { useState, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IBooking } from "@/types/IBooking";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export interface BookingsFilter {
	listing_type?: string;
	status?: "active" | "expired" | "all";
}

export interface BookingsSort {
	field: "created_at" | "total_price";
	order: "asc" | "desc";
}

interface UseBookingsReturn {
	bookings: IBooking[];
	listingBookings: IBooking[];
	loading: boolean;
	error: string | null;
	totalCount: number;
	fetchBookings: (
		page: number,
		limit: number,
		filters?: BookingsFilter,
		sortBy?: BookingsSort
	) => Promise<void>;
	fetchBookingsByListing: (listingId: string) => Promise<void>;
	addBooking: (
		booking: Omit<IBooking, "uid" | "created_at">
	) => Promise<void>;
	updateBooking: (id: string, booking: Partial<IBooking>) => Promise<void>;
	deleteBooking: (id: string) => Promise<void>;
}

export const useBookings = (): UseBookingsReturn => {
	const [bookings, setBookings] = useState<IBooking[]>([]);
	const [listingBookings, setListingBookings] = useState<IBooking[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState<number>(0);

	// Fetch bookings with pagination, filtering, and sorting
	const fetchBookings = useCallback(
		async (
			page: number,
			limit: number,
			filters?: BookingsFilter,
			sortBy?: BookingsSort
		) => {
			setLoading(true);
			setError(null);

			try {
				let query = supabase
					.from("bookings")
					.select("*", { count: "exact" });

				// Pagination
				const from = (page - 1) * limit;
				const to = from + limit - 1;
				query = query.range(from, to);

				// Filtering
				if (filters?.listing_type) {
					query = query.eq("listing_type", filters.listing_type);
				}

				if (filters?.status) {
					const now = new Date().toISOString();
					if (filters.status === "active") {
						query = query.gt("check_out", now);
					} else if (filters.status === "expired") {
						query = query.lte("check_out", now);
					}
				}

				// Sorting
				if (sortBy) {
					query = query.order(sortBy.field, {
						ascending: sortBy.order === "asc",
					});
				} else {
					// Default sort
					query = query.order("created_at", { ascending: false });
				}

				const { data, error, count } = await query;

				if (error) throw error;

				setBookings((data as IBooking[]) || []);
				setTotalCount(count || 0);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Add a booking
	const addBooking = useCallback(
		async (booking: Omit<IBooking, "uid" | "created_at">) => {
			setLoading(true);
			try {
				const { data, error } = await supabase
					.from("bookings")
					.insert([booking])
					.select();

				if (error) throw error;
				if (data) setBookings((prev) => [data[0] as IBooking, ...prev]);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Update a booking
	const updateBooking = useCallback(
		async (id: string, booking: Partial<IBooking>) => {
			setLoading(true);
			try {
				const { data, error } = await supabase
					.from("bookings")
					.update(booking)
					.eq("uid", id)
					.select();

				if (error) throw error;
				if (data)
					setBookings((prev) =>
						prev.map((b) =>
							b.uid === id ? (data[0] as IBooking) : b
						)
					);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Delete a booking
	const deleteBooking = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const { error } = await supabase
				.from("bookings")
				.delete()
				.eq("uid", id);

			if (error) throw error;
			setBookings((prev) => prev.filter((b) => b.uid !== id));
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchBookingsByListing = useCallback(async (listingId: string) => {
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase
				.from("bookings")
				.select("*")
				.eq("listing_id", listingId)
				.order("check_in", { ascending: true });

			if (error) throw error;
			setListingBookings((data as IBooking[]) || []);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Unknown error";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		bookings,
		listingBookings,
		loading,
		error,
		totalCount,
		fetchBookings,
		fetchBookingsByListing,
		addBooking,
		updateBooking,
		deleteBooking,
	};
};
