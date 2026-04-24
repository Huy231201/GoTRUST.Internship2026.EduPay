import { create } from "zustand";
import {
  getClasses,
  bulkCreateClasses,
  deleteClass,
  importClasses
} from "@/lib/api/class";
import type { ClassItem, BulkCreateClassesPayload } from "@/lib/api/class";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { useClassFilterStore } from "@/stores/useClassFilterStore";

interface ClassState {
  classes: ClassItem[];
  loading: boolean;
  error: string | null;

  search: string;

  setSearch: (search: string) => void;

  fetchClasses: () => Promise<void>;

  createBulkClasses: (payload: BulkCreateClassesPayload) => Promise<ClassItem[]>;
  deleteClassById: (id: string) => Promise<void>;
  importClassesFromFile: (file: File) => Promise<any>;
}

export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  loading: false,
  error: null,

  search: "",

  setSearch: (search) => set({ search }),

  fetchClasses: async () => {
    try {
      set({ loading: true, error: null });

      const { search } = get();
      const global = useAppFilterStore.getState();
      const classFilter = useClassFilterStore.getState();

      const branchId = global.branchId;
      const schoolYearId = global.schoolYearId;
      const gradeId = classFilter.gradeId;

      // ❗ reset nếu thiếu filter
      if (!branchId || !schoolYearId) {
        set({ classes: [], loading: false });
        return;
      }

      const data = await getClasses({
        branchId,
        schoolYearId,
        gradeId,
        search,
      });

      set({
        classes: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Fetch classes failed",
      });
    }
  },

  createBulkClasses: async (payload) => {
    try {
      set({ loading: true, error: null });

      const created = await bulkCreateClasses(payload);

      set((state) => ({
        classes: [...created, ...state.classes],
        loading: false,
      }));

      return created;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Bulk create classes failed",
      });
      throw err;
    }
  },

  deleteClassById: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteClass(id);

      set((state) => ({
        classes: state.classes.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Delete class failed",
      });
      throw err;
    }
  },

  importClassesFromFile: async (file) => {
    try {
      set({ loading: true, error: null });

      const global = useAppFilterStore.getState();

      const branchId = global.branchId;
      const schoolYearId = global.schoolYearId;

      if (!branchId || !schoolYearId) {
        throw new Error("Missing branch or school year");
      }

      const result = await importClasses(file, branchId, schoolYearId);

      await get().fetchClasses();

      set({ loading: false });

      return result;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Import failed",
      });
      throw err;
    }
  },
}));