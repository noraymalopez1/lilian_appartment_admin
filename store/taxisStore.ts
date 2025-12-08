import { create } from "zustand";
import { ITaxi } from "@/types/ITaxi";

interface TaxisState {
	taxis: ITaxi[];
	loading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
}

interface TaxisActions {
	setTaxis: (taxis: ITaxi[]) => void;
	addTaxi: (taxi: ITaxi) => void;
	updateTaxi: (uid: string, taxi: Partial<ITaxi>) => void;
	deleteTaxi: (uid: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setPagination: (
		currentPage: number,
		totalPages: number,
		totalCount: number
	) => void;
	setPageSize: (pageSize: number) => void;
	reset: () => void;
}

type TaxisStore = TaxisState & TaxisActions;

const initialState: TaxisState = {
	taxis: [],
	loading: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	pageSize: 10,
	totalCount: 0,
};

export const useTaxisStore = create<TaxisStore>((set) => ({
	...initialState,

	setTaxis: (taxis) => set({ taxis }),

	addTaxi: (taxi) =>
		set((state) => ({
			taxis: [taxi, ...state.taxis],
			totalCount: state.totalCount + 1,
		})),

	updateTaxi: (uid, updatedTaxi) =>
		set((state) => ({
			taxis: state.taxis.map((taxi) =>
				taxi.uid === uid ? { ...taxi, ...updatedTaxi } : taxi
			),
		})),

	deleteTaxi: (uid) =>
		set((state) => ({
			taxis: state.taxis.filter((taxi) => taxi.uid !== uid),
			totalCount: state.totalCount - 1,
		})),

	setLoading: (loading) => set({ loading }),

	setError: (error) => set({ error }),

	setPagination: (currentPage, totalPages, totalCount) =>
		set({ currentPage, totalPages, totalCount }),

	setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

	reset: () => set(initialState),
}));
