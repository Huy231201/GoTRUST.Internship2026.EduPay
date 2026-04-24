import { create } from "zustand";
import { getMainSchool } from "@/lib/api/school";
import type { SchoolInfo } from "@/lib/api/school";

interface SchoolState {
  school: SchoolInfo | null;
  loading: boolean;
  error: string | null;

  fetchSchool: () => Promise<void>;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  school: null,
  loading: false,
  error: null,

  fetchSchool: async () => {
    try {
      set({ loading: true, error: null });

      const data = await getMainSchool();

      set({
        school: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Fetch school failed",
      });
    }
  },
}));