import { useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useListingsStore } from "@/store/listingsStore";
import { IListing } from "@/types/IListing";

interface FetchListingsOptions {
	category?: "apartment" | "attraction";
	page?: number;
	pageSize?: number;
}

export const useListings = () => {
	const supabase = createClient();
	const {
		listings,
		loading,
		error,
		currentPage,
		totalPages,
		pageSize,
		totalCount,
		setListings,
		addListing: addListingToStore,
		updateListing: updateListingInStore,
		deleteListing: deleteListingFromStore,
		setLoading,
		setError,
		setPagination,
	} = useListingsStore();

	const fetchListings = useCallback(
		async (options: FetchListingsOptions = {}) => {
			try {
				setLoading(true);
				setError(null);

				const {
					category,
					page = 1,
					pageSize: customPageSize = pageSize,
				} = options;

				let query = supabase
					.from("listings")
					.select("*", { count: "exact" });

				if (category) {
					query = query.eq("category", category);
				}

				const from = (page - 1) * customPageSize;
				const to = from + customPageSize - 1;

				const {
					data,
					error: fetchError,
					count,
				} = await query
					.range(from, to)
					.order("created_at", { ascending: false });

				if (fetchError) {
					setError(fetchError.message);
					return;
				}

				const totalCount = count || 0;
				const calculatedTotalPages = Math.ceil(
					totalCount / customPageSize
				);

				setListings(data as IListing[]);
				setPagination(page, calculatedTotalPages, totalCount);
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to fetch listings";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[supabase, pageSize, setListings, setLoading, setError, setPagination]
	);

	const addListing = useCallback(
		async (
			listing: Omit<IListing, "uid" | "created_at" | "updated_at">
		) => {
			try {
				setLoading(true);
				setError(null);

				const newListing = {
					uid: crypto.randomUUID(),
					...listing,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				};

				const { data, error: insertError } = await supabase
					.from("listings")
					.insert([newListing])
					.select()
					.single();

				if (insertError) {
					setError(insertError.message);
					throw new Error(insertError.message);
				}

				addListingToStore(data as IListing);
				return data as IListing;
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to add listing";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[supabase, setLoading, setError, addListingToStore]
	);

	const updateListing = useCallback(
		async (uid: string, updates: Partial<IListing>) => {
			try {
				setLoading(true);
				setError(null);

				const updatedData = {
					...updates,
					updated_at: new Date().toISOString(),
				};

				const { data, error: updateError } = await supabase
					.from("listings")
					.update(updatedData)
					.eq("uid", uid)
					.select()
					.single();

				if (updateError) {
					setError(updateError.message);
					throw new Error(updateError.message);
				}

				updateListingInStore(uid, data as Partial<IListing>);
				return data as IListing;
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update listing";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[supabase, setLoading, setError, updateListingInStore]
	);

	const deleteListing = useCallback(
		async (uid: string) => {
			try {
				setLoading(true);
				setError(null);

				const { error: deleteError } = await supabase
					.from("listings")
					.delete()
					.eq("uid", uid);

				if (deleteError) {
					setError(deleteError.message);
					throw new Error(deleteError.message);
				}

				deleteListingFromStore(uid);
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to delete listing";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[supabase, setLoading, setError, deleteListingFromStore]
	);

	return {
		listings,
		loading,
		error,
		currentPage,
		totalPages,
		pageSize,
		totalCount,
		fetchListings,
		addListing,
		updateListing,
		deleteListing,
	};
};
