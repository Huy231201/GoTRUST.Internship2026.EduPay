

import { create } from "zustand";

interface ClassFilterState {
  gradeId?: string;

  setGradeId: (id?: string) => void;
}

export const useClassFilterStore = create<ClassFilterState>((set) => ({
  gradeId: undefined,

  setGradeId: (id) => set({ gradeId: id }),
}));