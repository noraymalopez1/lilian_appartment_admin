// hooks/useAttractions.ts
import { useState, useEffect, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// TypeScript type for attraction listing
export interface AttractionType {
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

interface UseAttractionsReturn {
  attractions: AttractionType[];
  loading: boolean;
  error: string | null;
  fetchAttractions: () => Promise<void>;
  addAttraction: (
    attraction: Omit<AttractionType, "id" | "created_at">
  ) => Promise<void>;
  updateAttraction: (
    id: string,
    attraction: Partial<AttractionType>
  ) => Promise<void>;
  deleteAttraction: (id: string) => Promise<void>;
}

export const useAttractions = (): UseAttractionsReturn => {
  const [attractions, setAttractions] = useState<AttractionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attractions from Supabase
  const fetchAttractions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<AttractionType>("attractions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAttractions(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  // Add new attraction
  const addAttraction = useCallback(
    async (attraction: Omit<AttractionType, "id" | "created_at">) => {
      setLoading(true);
      const { data, error } = await supabase
        .from<AttractionType>("attractions")
        .insert([attraction])
        .select();

      if (error) {
        setError(error.message);
      } else if (data) {
        setAttractions((prev) => [data[0], ...prev]);
        setError(null);
      }
      setLoading(false);
    },
    []
  );

  // Update attraction
  const updateAttraction = useCallback(
    async (id: string, attraction: Partial<AttractionType>) => {
      setLoading(true);
      const { data, error } = await supabase
        .from<AttractionType>("attractions")
        .update(attraction)
        .eq("id", id)
        .select();

      if (error) {
        setError(error.message);
      } else if (data) {
        setAttractions((prev) => prev.map((a) => (a.id === id ? data[0] : a)));
        setError(null);
      }
      setLoading(false);
    },
    []
  );

  // Delete attraction
  const deleteAttraction = useCallback(async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("attractions").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setAttractions((prev) => prev.filter((a) => a.id !== id));
      setError(null);
    }
    setLoading(false);
  }, []);

  // Fetch attractions on mount
  useEffect(() => {
    fetchAttractions();
  }, [fetchAttractions]);

  return {
    attractions,
    loading,
    error,
    fetchAttractions,
    addAttraction,
    updateAttraction,
    deleteAttraction,
  };
};
