import { create } from "zustand";
import { getStatistics } from "@/lib/api/statistics";

interface BranchStatistic {
  branchId: string;
  branchName: string;
  isMain: boolean;
  studentCount: number;
  teacherCount: number;
  classCount: number;
}

interface StatisticsResponse {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  mainBranch: BranchStatistic;
  subBranches: BranchStatistic[];
}

interface StatisticsState {
  data: StatisticsResponse | null;
  loading: boolean;
  error: string | null;

  fetchStatistics: (schoolId: string, schoolYearId: string) => Promise<void>;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchStatistics: async (schoolId, schoolYearId) => {
    try {
      set({ loading: true, error: null });

      const data = await getStatistics({ schoolId, schoolYearId });

      set({ data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || "Statistics loading failed",
        loading: false,
      });
    }
  },
}));