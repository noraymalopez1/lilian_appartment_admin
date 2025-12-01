import { create } from "zustand";
import { IListing } from "@/types/IListing";

interface ListingsState {
	listings: IListing[];
	loading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
}

interface ListingsActions {
	setListings: (listings: IListing[]) => void;
	addListing: (listing: IListing) => void;
	updateListing: (uid: string, listing: Partial<IListing>) => void;
	deleteListing: (uid: string) => void;
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

type ListingsStore = ListingsState & ListingsActions;

const initialState: ListingsState = {
	listings: [],
	loading: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	pageSize: 10,
	totalCount: 0,
};

export const useListingsStore = create<ListingsStore>((set) => ({
	...initialState,

	setListings: (listings) => set({ listings }),

	addListing: (listing) =>
		set((state) => ({
			listings: [listing, ...state.listings],
			totalCount: state.totalCount + 1,
		})),

	updateListing: (uid, updatedListing) =>
		set((state) => ({
			listings: state.listings.map((listing) =>
				listing.uid === uid
					? { ...listing, ...updatedListing }
					: listing
			),
		})),

	deleteListing: (uid) =>
		set((state) => ({
			listings: state.listings.filter((listing) => listing.uid !== uid),
			totalCount: state.totalCount - 1,
		})),

	setLoading: (loading) => set({ loading }),

	setError: (error) => set({ error }),

	setPagination: (currentPage, totalPages, totalCount) =>
		set({ currentPage, totalPages, totalCount }),

	setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

	reset: () => set(initialState),
}));
