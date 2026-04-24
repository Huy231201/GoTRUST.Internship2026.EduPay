import { create } from "zustand";
import { getGrades } from "@/lib/api/grade";
import type { Grade } from "@/lib/api/grade";

interface ReportGradeState {
  grades: Grade[];
  loading: boolean;
  error: string | null;

  fetchGrades: (params: {
    branchId?: string;
    schoolYearId?: string;
  }) => Promise<void>;
}

export const useReportGradeStore = create<ReportGradeState>((set) => ({
  grades: [],
  loading: false,
  error: null,

  fetchGrades: async (params) => {
    try {
      set({ loading: true, error: null });

      const { branchId, schoolYearId } = params;

      // ❗ chỉ cần branchId
      if (!branchId) {
        set({ grades: [], loading: false });
        return;
      }

      const data = await getGrades({
        branchId,
        ...(schoolYearId ? { schoolYearId } : {}),
      });

      set({
        grades: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        grades: [],
        loading: false,
        error: err?.response?.data?.message || "Fetch grades failed",
      });
    }
  },
}));