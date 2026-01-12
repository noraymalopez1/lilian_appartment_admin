"use client";

import { createClient } from "@/lib/supabase";
import { ITax } from "@/types/ITax";
import { useState } from "react";

export const useTaxes = () => {
	const [taxes, setTaxes] = useState<ITax[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchTaxes = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const { data, error: fetchError } = await supabase
				.from("taxes")
				.select("*")
				.order("created_at", { ascending: false });

			if (fetchError) throw fetchError;

			setTaxes(data || []);
			return data || [];
		} catch (err: any) {
			setError(err.message || "Failed to fetch taxes");
			console.error("Error fetching taxes:", err);
			return [];
		} finally {
			setIsLoading(false);
		}
	};

	const addTax = async (
		taxData: Omit<ITax, "uid" | "created_at" | "updated_at">
	) => {
		setIsLoading(true);
		setError(null);

		try {
			const newTax = {
				uid: crypto.randomUUID(),
				...taxData,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			const { error: insertError } = await supabase
				.from("taxes")
				.insert(newTax);

			if (insertError) throw insertError;

			await fetchTaxes();
			return { success: true };
		} catch (err: any) {
			setError(err.message || "Failed to add tax");
			console.error("Error adding tax:", err);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	};

	const updateTax = async (
		uid: string,
		taxData: Partial<Omit<ITax, "uid" | "created_at">>
	) => {
		setIsLoading(true);
		setError(null);

		try {
			const { error: updateError } = await supabase
				.from("taxes")
				.update({ ...taxData, updated_at: new Date().toISOString() })
				.eq("uid", uid);

			if (updateError) throw updateError;

			await fetchTaxes();
			return { success: true };
		} catch (err: any) {
			setError(err.message || "Failed to update tax");
			console.error("Error updating tax:", err);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	};

	const deleteTax = async (uid: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const { error: deleteError } = await supabase
				.from("taxes")
				.delete()
				.eq("uid", uid);

			if (deleteError) throw deleteError;

			await fetchTaxes();
			return { success: true };
		} catch (err: any) {
			setError(err.message || "Failed to delete tax");
			console.error("Error deleting tax:", err);
			return { success: false, error: err.message };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		taxes,
		isLoading,
		error,
		fetchTaxes,
		addTax,
		updateTax,
		deleteTax,
	};
};
