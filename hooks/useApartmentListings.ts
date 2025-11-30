// hooks/useApartmentListings.ts
import { useState, useEffect, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Define TypeScript type for apartment listing
export interface ApartmentListingType {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  distance: string;
  priceFrom: string;
  priceNight: string;
  created_at?: string;
}

interface UseApartmentListingsReturn {
  listings: ApartmentListingType[];
  loading: boolean;
  error: string | null;
  fetchListings: () => Promise<void>;
  addListing: (
    listing: Omit<ApartmentListingType, "id" | "created_at">
  ) => Promise<void>;
  updateListing: (
    id: string,
    listing: Partial<ApartmentListingType>
  ) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
}

export const useApartmentListings = (): UseApartmentListingsReturn => {
  const [listings, setListings] = useState<ApartmentListingType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<ApartmentListingType>("apartments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setListings(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  // Add new listing
  const addListing = useCallback(
    async (listing: Omit<ApartmentListingType, "id" | "created_at">) => {
      setLoading(true);
      const { data, error } = await supabase
        .from<ApartmentListingType>("apartments")
        .insert([listing])
        .select();
      if (error) {
        setError(error.message);
      } else if (data) {
        setListings((prev) => [data[0], ...prev]);
        setError(null);
      }
      setLoading(false);
    },
    []
  );

  // Update listing
  const updateListing = useCallback(
    async (id: string, listing: Partial<ApartmentListingType>) => {
      setLoading(true);
      const { data, error } = await supabase
        .from<ApartmentListingType>("apartments")
        .update(listing)
        .eq("id", id)
        .select();
      if (error) {
        setError(error.message);
      } else if (data) {
        setListings((prev) => prev.map((l) => (l.id === id ? data[0] : l)));
        setError(null);
      }
      setLoading(false);
    },
    []
  );

  // Delete listing
  const deleteListing = useCallback(async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("apartments").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setListings((prev) => prev.filter((l) => l.id !== id));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    fetchListings,
    addListing,
    updateListing,
    deleteListing,
  };
};
