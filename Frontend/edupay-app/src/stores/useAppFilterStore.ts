import { create } from "zustand";

interface AppFilterState {
  branchId: string;
  schoolYearId: string;

  setBranchId: (id: string) => void;
  setSchoolYearId: (id: string) => void;

  setFilters: (branchId: string, schoolYearId: string) => void;
}

export const useAppFilterStore = create<AppFilterState>((set) => ({
  branchId: "",
  schoolYearId: "",

  setBranchId: (id) => set({ branchId: id }),
  setSchoolYearId: (id) => set({ schoolYearId: id }),

  setFilters: (branchId, schoolYearId) =>
    set({
      branchId,
      schoolYearId,
    }),
}));