

import { create } from "zustand";
import {
  getGrades,
  createGrade,
  deleteGrade,
  updateGrade
} from "@/lib/api/grade";
import type { CreateGradePayload, Grade, UpdateGradePayload } from "@/lib/api/grade";
import { useAppFilterStore } from "@/stores/useAppFilterStore";

interface GradeState {
  grades: Grade[];
  loading: boolean;
  error: string | null;

  search: string;
  status: boolean | undefined;

  setSearch: (search: string) => void;
  setStatus: (status: boolean | undefined) => void;

  fetchGrades: () => Promise<void>;

  createGrade: (payload: CreateGradePayload) => Promise<void>;
  deleteGrade: (id: string) => Promise<void>;
  updateGrade: (id: string, payload: UpdateGradePayload) => Promise<void>;
}

export const useGradeStore = create<GradeState>((set, get) => ({
  grades: [],
  loading: false,
  error: null,

  search: "",
  status: undefined,

  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),

  fetchGrades: async () => {
    try {
      set({ loading: true, error: null });

      const { search, status } = get();
      const { branchId, schoolYearId } = useAppFilterStore.getState();

      
      if (!branchId || !schoolYearId) {
        set({ grades: [], loading: false });
        return;
      }

      const data = await getGrades({
        branchId,
        schoolYearId,
        search,
        status,
      });

      set({
        grades: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Fetch grades failed",
      });
    }
  },

  createGrade: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await createGrade(payload);
      const newGrade = res.data;

      set({
        grades: [...get().grades, newGrade],
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Create grade failed",
      });
      throw err;
    }
  },

  deleteGrade: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteGrade(id);

      set({
        grades: get().grades.filter((g) => g.id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Delete grade failed",
      });
      throw err;
    }
  },

  updateGrade: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const res = await updateGrade(id, payload);
      const updated = res.data;

      set({
        grades: get().grades.map((g) =>
          g.id === id ? { ...g, ...updated } : g
        ),
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Update grade failed",
      });
      throw err;
    }
  },
}));