import { create } from "zustand";
import { getClasses } from "@/lib/api/class";
import type { ClassItem } from "@/lib/api/class";

interface ReportClassState {
  classes: ClassItem[];
  loading: boolean;
  error: string | null;

  fetchClasses: (params: {
    branchId?: string;
    schoolYearId?: string;
    gradeId?: string;
  }) => Promise<void>;
}

export const useReportClassStore = create<ReportClassState>((set) => ({
  classes: [],
  loading: false,
  error: null,

  fetchClasses: async (params) => {
    try {
      set({ loading: true, error: null });

      const { branchId, schoolYearId, gradeId } = params;

      if (!branchId) {
        set({ classes: [], loading: false });
        return;
      }

      const data = await getClasses({
        branchId,
        ...(schoolYearId ? { schoolYearId } : {}),
        ...(gradeId ? { gradeId } : {}),
      });

      set({
        classes: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        classes: [],
        loading: false,
        error: err?.response?.data?.message || "Fetch classes failed",
      });
    }
  },
}));