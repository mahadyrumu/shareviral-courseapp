import { create } from 'zustand';

interface CourseFilterState {
  searchTerm: string;
  filterEnrolled: boolean | null;
  filterPremium: boolean | null;
  sortBy: 'rating' | 'price' | 'duration' | null;
  setSearchTerm: (term: string) => void;
  setFilterEnrolled: (value: boolean | null) => void;
  setFilterPremium: (value: boolean | null) => void;
  setSortBy: (value: 'rating' | 'price' | 'duration' | null) => void;
  resetFilters: () => void;
}

export const useCourseFilterStore = create<CourseFilterState>((set) => ({
  searchTerm: '',
  filterEnrolled: null,
  filterPremium: null,
  sortBy: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterEnrolled: (value) => set({ filterEnrolled: value }),
  setFilterPremium: (value) => set({ filterPremium: value }),
  setSortBy: (value) => set({ sortBy: value }),
  resetFilters: () => set({
    searchTerm: '',
    filterEnrolled: null,
    filterPremium: null,
    sortBy: null
  }),
}));
