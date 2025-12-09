import { useState, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { IBlockedDate } from "@/types/IBlockedDate";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface UseBlockedDatesReturn {
	blockedDates: IBlockedDate[];
	loading: boolean;
	error: string | null;
	fetchBlockedDates: (listingId: string) => Promise<void>;
	blockDate: (
		listingId: string,
		listingType: "apartment" | "attraction",
		date: string,
		reason?: string
	) => Promise<IBlockedDate | null>;
	unblockDate: (uid: string) => Promise<void>;
}

export const useBlockedDates = (): UseBlockedDatesReturn => {
	const [blockedDates, setBlockedDates] = useState<IBlockedDate[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBlockedDates = useCallback(async (listingId: string) => {
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase
				.from("blocked_dates")
				.select("*")
				.eq("listing_id", listingId)
				.order("blocked_date", { ascending: true });

			if (error) throw error;
			setBlockedDates((data as IBlockedDate[]) || []);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Unknown error";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	const blockDate = useCallback(
		async (
			listingId: string,
			listingType: "apartment" | "attraction",
			date: string,
			reason?: string
		): Promise<IBlockedDate | null> => {
			setLoading(true);
			setError(null);

			try {
				const uid = crypto.randomUUID();
				const { data, error } = await supabase
					.from("blocked_dates")
					.insert([
						{
							uid,
							listing_id: listingId,
							listing_type: listingType,
							blocked_date: date,
							reason: reason || null,
						},
					])
					.select()
					.single();

				if (error) throw error;
				if (data) {
					const newBlockedDate = data as IBlockedDate;
					setBlockedDates((prev) => [...prev, newBlockedDate]);
					return newBlockedDate;
				}
				return null;
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : "Unknown error";
				setError(message);
				return null;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const unblockDate = useCallback(async (uid: string) => {
		setLoading(true);
		setError(null);

		try {
			const { error } = await supabase
				.from("blocked_dates")
				.delete()
				.eq("uid", uid);

			if (error) throw error;
			setBlockedDates((prev) => prev.filter((bd) => bd.uid !== uid));
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Unknown error";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		blockedDates,
		loading,
		error,
		fetchBlockedDates,
		blockDate,
		unblockDate,
	};
};
