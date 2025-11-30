// hooks/useReviews.ts
import { useState, useEffect, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Review type
export interface ReviewType {
  id: string;
  avatar: string;
  postedBy: string;
  apartmentName: string;
  reviewTitle: string;
  reviewText: string;
  rating: number;
  date: string;
  created_at?: string;
}

interface UseReviewsReturn {
  reviews: ReviewType[];
  loading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
}

export const useReviews = (): UseReviewsReturn => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from Supabase
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<ReviewType>("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setReviews(data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, fetchReviews };
};
