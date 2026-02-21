import { useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { useTaxisStore } from "@/store/taxisStore";
import { ITaxi } from "@/types/ITaxi";

interface FetchTaxisOptions {
	status?: "active" | "closed";
	car_type?: ITaxi["car_type"];
	page?: number;
	pageSize?: number;
}

export const useTaxis = () => {
	const supabase = createClient();
	const {
		taxis,
		loading,
		error,
		currentPage,
		totalPages,
		pageSize,
		totalCount,
		setTaxis,
		addTaxi: addTaxiToStore,
		updateTaxi: updateTaxiInStore,
		deleteTaxi: deleteTaxiFromStore,
		setLoading,
		setError,
		setPagination,
	} = useTaxisStore();

	const fetchTaxis = useCallback(
		async (options: FetchTaxisOptions = {}) => {
			try {
				setLoading(true);
				setError(null);

				const {
					status,
					car_type,
					page = 1,
					pageSize: customPageSize = pageSize,
				} = options;

				let query = supabase
					.from("taxis")
					.select("*", { count: "exact" });

				if (status) {
					query = query.eq("status", status);
				}

				if (car_type) {
					query = query.eq("car_type", car_type);
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
					totalCount / customPageSize,
				);

				setTaxis(data as ITaxi[]);
				setPagination(page, calculatedTotalPages, totalCount);
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to fetch taxis";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[supabase, pageSize, setTaxis, setLoading, setError, setPagination],
	);

	const addTaxi = useCallback(
		async (taxi: Omit<ITaxi, "uid" | "created_at">) => {
			try {
				setLoading(true);
				setError(null);

				const newTaxi = {
					uid: crypto.randomUUID(),
					...taxi,
					created_at: new Date().toISOString(),
				};

				const { data, error: insertError } = await supabase
					.from("taxis")
					.insert([newTaxi])
					.select()
					.single();

				if (insertError) {
					setError(insertError.message);
					throw new Error(insertError.message);
				}

				addTaxiToStore(data as ITaxi);
				return data as ITaxi;
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to add taxi";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[supabase, setLoading, setError, addTaxiToStore],
	);

	const updateTaxi = useCallback(
		async (uid: string, updates: Partial<ITaxi>) => {
			try {
				setLoading(true);
				setError(null);

				const { data, error: updateError } = await supabase
					.from("taxis")
					.update(updates)
					.eq("uid", uid)
					.select()
					.single();

				if (updateError) {
					setError(updateError.message);
					throw new Error(updateError.message);
				}

				updateTaxiInStore(uid, data as Partial<ITaxi>);
				return data as ITaxi;
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update taxi";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[supabase, setLoading, setError, updateTaxiInStore],
	);

	const deleteTaxi = useCallback(
		async (uid: string) => {
			try {
				setLoading(true);
				setError(null);

				const { error: deleteError } = await supabase
					.from("taxis")
					.delete()
					.eq("uid", uid);

				if (deleteError) {
					setError(deleteError.message);
					throw new Error(deleteError.message);
				}

				deleteTaxiFromStore(uid);
			} catch (err: unknown) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to delete taxi";
				setError(errorMessage);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[supabase, setLoading, setError, deleteTaxiFromStore],
	);

	const uploadTaxiImage = useCallback(
		async (file: File): Promise<string> => {
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
			const filePath = `taxis/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("lillians")
				.upload(filePath, file);

			if (uploadError) {
				throw new Error(
					`Failed to upload image: ${uploadError.message}`,
				);
			}

			const { data: urlData } = supabase.storage
				.from("lillians")
				.getPublicUrl(filePath);

			return urlData.publicUrl;
		},
		[supabase],
	);

	return {
		taxis,
		loading,
		error,
		currentPage,
		totalPages,
		pageSize,
		totalCount,
		fetchTaxis,
		addTaxi,
		updateTaxi,
		deleteTaxi,
		uploadTaxiImage,
	};
};
