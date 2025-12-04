// hooks/useReviews.ts
import { useState, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IReview } from "@/types/IReview";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export interface ReviewsFilter {
	rating?: number | "all";
}

export interface ReviewsSort {
	field: "created_at" | "rating";
	order: "asc" | "desc";
}

interface UseReviewsReturn {
	reviews: IReview[];
	loading: boolean;
	error: string | null;
	totalCount: number;
	fetchReviews: (
		page: number,
		limit: number,
		filters?: ReviewsFilter,
		sortBy?: ReviewsSort
	) => Promise<void>;
	deleteReview: (id: string) => Promise<void>;
}

export const useReviews = (): UseReviewsReturn => {
	const [reviews, setReviews] = useState<IReview[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState<number>(0);

	// Fetch reviews with pagination, filtering, and sorting
	const fetchReviews = useCallback(
		async (
			page: number,
			limit: number,
			filters?: ReviewsFilter,
			sortBy?: ReviewsSort
		) => {
			setLoading(true);
			setError(null);

			try {
				let query = supabase
					.from("reviews")
					.select("*", { count: "exact" });

				// Pagination
				const from = (page - 1) * limit;
				const to = from + limit - 1;
				query = query.range(from, to);

				// Filtering by rating
				if (filters?.rating && filters.rating !== "all") {
					query = query.eq("rating", filters.rating);
				}

				// Sorting
				if (sortBy) {
					query = query.order(sortBy.field, {
						ascending: sortBy.order === "asc",
					});
				} else {
					// Default sort by most recent
					query = query.order("created_at", { ascending: false });
				}

				const { data, error, count } = await query;

				if (error) throw error;

				setReviews((data as IReview[]) || []);
				setTotalCount(count || 0);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Delete a review
	const deleteReview = useCallback(async (id: string) => {
		setLoading(true);
		try {
			const { error } = await supabase
				.from("reviews")
				.delete()
				.eq("uid", id);

			if (error) throw error;
			setReviews((prev) => prev.filter((r) => r.uid !== id));
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		reviews,
		loading,
		error,
		totalCount,
		fetchReviews,
		deleteReview,
	};
};
