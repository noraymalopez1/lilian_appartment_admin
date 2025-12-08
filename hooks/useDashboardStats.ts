import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { IBooking } from "@/types/IBooking";

interface DashboardStats {
	totalBookings: number;
	totalTaxiBookings: number;
	totalListings: number;
	totalTaxis: number;
	pendingBookings: number;
	pendingTaxiBookings: number;
}

interface MonthlyBookingData {
	month: string;
	count: number;
}

interface UseDashboardStatsReturn {
	stats: DashboardStats;
	monthlyData: MonthlyBookingData[];
	recentBookings: IBooking[];
	loading: boolean;
	error: string | null;
	fetchStats: () => Promise<void>;
	fetchMonthlyData: (type: "yearly" | "monthly") => Promise<void>;
	fetchRecentBookings: (
		limit?: number,
		listingType?: string
	) => Promise<void>;
}

const initialStats: DashboardStats = {
	totalBookings: 0,
	totalTaxiBookings: 0,
	totalListings: 0,
	totalTaxis: 0,
	pendingBookings: 0,
	pendingTaxiBookings: 0,
};

export const useDashboardStats = (): UseDashboardStatsReturn => {
	const supabase = createClient();
	const [stats, setStats] = useState<DashboardStats>(initialStats);
	const [monthlyData, setMonthlyData] = useState<MonthlyBookingData[]>([]);
	const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const [
				bookingsResult,
				taxiBookingsResult,
				listingsResult,
				taxisResult,
				pendingBookingsResult,
				pendingTaxiBookingsResult,
			] = await Promise.all([
				supabase
					.from("bookings")
					.select("*", { count: "exact", head: true }),
				supabase
					.from("taxi_bookings")
					.select("*", { count: "exact", head: true }),
				supabase
					.from("listings")
					.select("*", { count: "exact", head: true }),
				supabase
					.from("taxis")
					.select("*", { count: "exact", head: true }),
				supabase
					.from("bookings")
					.select("*", { count: "exact", head: true })
					.eq("status", "pending"),
				supabase
					.from("taxi_bookings")
					.select("*", { count: "exact", head: true })
					.eq("status", "pending"),
			]);

			setStats({
				totalBookings: bookingsResult.count || 0,
				totalTaxiBookings: taxiBookingsResult.count || 0,
				totalListings: listingsResult.count || 0,
				totalTaxis: taxisResult.count || 0,
				pendingBookings: pendingBookingsResult.count || 0,
				pendingTaxiBookings: pendingTaxiBookingsResult.count || 0,
			});
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to fetch dashboard stats";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [supabase]);

	const fetchMonthlyData = useCallback(
		async (type: "yearly" | "monthly") => {
			try {
				const currentYear = new Date().getFullYear();
				const currentMonth = new Date().getMonth();

				if (type === "yearly") {
					const months = [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec",
					];

					const { data: bookingsData } = await supabase
						.from("bookings")
						.select("created_at")
						.gte("created_at", `${currentYear}-01-01`)
						.lte("created_at", `${currentYear}-12-31`);

					const { data: taxiBookingsData } = await supabase
						.from("taxi_bookings")
						.select("created_at")
						.gte("created_at", `${currentYear}-01-01`)
						.lte("created_at", `${currentYear}-12-31`);

					const monthCounts = months.map((month, index) => {
						const bookingCount = (bookingsData || []).filter(
							(b) => {
								const date = new Date(b.created_at);
								return date.getMonth() === index;
							}
						).length;

						const taxiCount = (taxiBookingsData || []).filter(
							(b) => {
								const date = new Date(b.created_at);
								return date.getMonth() === index;
							}
						).length;

						return {
							month,
							count: bookingCount + taxiCount,
						};
					});

					setMonthlyData(monthCounts);
				} else {
					// Monthly view - show days of current month
					const daysInMonth = new Date(
						currentYear,
						currentMonth + 1,
						0
					).getDate();
					const startDate = new Date(
						currentYear,
						currentMonth,
						1
					).toISOString();
					const endDate = new Date(
						currentYear,
						currentMonth + 1,
						0
					).toISOString();

					const { data: bookingsData } = await supabase
						.from("bookings")
						.select("created_at")
						.gte("created_at", startDate)
						.lte("created_at", endDate);

					const { data: taxiBookingsData } = await supabase
						.from("taxi_bookings")
						.select("created_at")
						.gte("created_at", startDate)
						.lte("created_at", endDate);

					const dayCounts: MonthlyBookingData[] = [];
					for (let day = 1; day <= daysInMonth; day += 3) {
						const dayLabel = `${day}`;
						const bookingCount = (bookingsData || []).filter(
							(b) => {
								const date = new Date(b.created_at);
								return (
									date.getDate() >= day &&
									date.getDate() < day + 3
								);
							}
						).length;

						const taxiCount = (taxiBookingsData || []).filter(
							(b) => {
								const date = new Date(b.created_at);
								return (
									date.getDate() >= day &&
									date.getDate() < day + 3
								);
							}
						).length;

						dayCounts.push({
							month: dayLabel,
							count: bookingCount + taxiCount,
						});
					}

					setMonthlyData(dayCounts);
				}
			} catch (err: unknown) {
				console.error("Error fetching monthly data:", err);
			}
		},
		[supabase]
	);

	const fetchRecentBookings = useCallback(
		async (limit: number = 10, listingType?: string) => {
			try {
				let query = supabase
					.from("bookings")
					.select("*")
					.order("created_at", { ascending: false })
					.limit(limit);

				if (listingType && listingType !== "all") {
					query = query.eq("listing_type", listingType);
				}

				const { data, error } = await query;

				if (error) throw error;

				setRecentBookings((data as IBooking[]) || []);
			} catch (err: unknown) {
				console.error("Error fetching recent bookings:", err);
			}
		},
		[supabase]
	);

	return {
		stats,
		monthlyData,
		recentBookings,
		loading,
		error,
		fetchStats,
		fetchMonthlyData,
		fetchRecentBookings,
	};
};
