// hooks/useBookings.ts
import { useState, useEffect, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Booking type
export interface BookingType {
  id: string;
  apartmentName: string;
  address: string;
  phone: string;
  gps: string;
  checkInDate: string;
  checkInMonth: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutMonth: string;
  checkOutTime: string;
  rooms: string;
  nights: string;
  status?: string; // optional: Pending/Unpaid etc
  created_at?: string;
}

interface UseBookingsReturn {
  bookings: BookingType[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  addBooking: (
    booking: Omit<BookingType, "id" | "created_at">
  ) => Promise<void>;
  updateBooking: (id: string, booking: Partial<BookingType>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<BookingType>("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setBookings(data || []);
    setLoading(false);
  }, []);

  // Add a booking
  const addBooking = useCallback(
    async (booking: Omit<BookingType, "id" | "created_at">) => {
      setLoading(true);
      const { data, error } = await supabase
        .from<BookingType>("bookings")
        .insert([booking])
        .select();

      if (error) setError(error.message);
      else if (data) setBookings((prev) => [data[0], ...prev]);
      setLoading(false);
    },
    []
  );

  // Update a booking
  const updateBooking = useCallback(
    async (id: string, booking: Partial<BookingType>) => {
      setLoading(true);
      const { data, error } = await supabase
        .from<BookingType>("bookings")
        .update(booking)
        .eq("id", id)
        .select();

      if (error) setError(error.message);
      else if (data)
        setBookings((prev) => prev.map((b) => (b.id === id ? data[0] : b)));
      setLoading(false);
    },
    []
  );

  // Delete a booking
  const deleteBooking = useCallback(async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) setError(error.message);
    else setBookings((prev) => prev.filter((b) => b.id !== id));
    setLoading(false);
  }, []);

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    addBooking,
    updateBooking,
    deleteBooking,
  };
};
