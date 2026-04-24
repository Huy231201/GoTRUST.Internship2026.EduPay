import { create } from "zustand";
import { getSchoolYears, createSchoolYear, deleteSchoolYear, updateSchoolYear } from "@/lib/api/schoolYear";
import type { CreateSchoolYearRequest, SchoolYear, UpdateSchoolYearRequest } from "@/lib/api/schoolYear";

interface SchoolYearState {
  schoolYears: SchoolYear[];
  loading: boolean;
  error: string | null;
  search: string;

  setSearch: (search: string) => void;
  fetchSchoolYears: () => Promise<void>;
  createSchoolYear: (schoolYear: CreateSchoolYearRequest) => Promise<void>;
  deleteSchoolYear: (id: string) => Promise<void>;
  updateSchoolYear: (id: string, schoolYear: UpdateSchoolYearRequest) => Promise<void>;  
}

export const useSchoolYearStore = create<SchoolYearState>((set, get) => ({
  schoolYears: [],
  loading: false,
  error: null,
  search: "",

  setSearch: (search) => set({ search }),

  fetchSchoolYears: async () => {
    try {
      set({ loading: true, error: null });

      const { search } = get();

      const data = await getSchoolYears(search);

      set({
        schoolYears: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err?.response?.data?.message || "Fetch school years failed",
      });
    }
  },

  createSchoolYear: async (schoolYear: CreateSchoolYearRequest) => {
  try {
    set({ loading: true, error: null });

    const res = await createSchoolYear(schoolYear);

    set({
      schoolYears: [res, ...get().schoolYears], // thêm lên đầu list
      loading: false,
    });

  } catch (err: any) {
    set({
      loading: false,
      error:
        err?.response?.data?.message || "Create school year failed",
    });
    throw err;
  }
},

  deleteSchoolYear: async (id: string) => {
  try {
    set({ loading: true, error: null });

    await deleteSchoolYear(id);

    set({
      schoolYears: get().schoolYears.filter((x) => x.id !== id),
      loading: false,
    });
  } catch (err: any) {
        set({
        loading: false,
        error:
            err?.response?.data?.message || "Delete failed",
        });
    }
    },

    updateSchoolYear: async (id: string, schoolYear: UpdateSchoolYearRequest) => {
  try {
    set({ loading: true, error: null });

    await updateSchoolYear(id, schoolYear);

    set({
      schoolYears: get().schoolYears.map((item) =>
        item.id === id
          ? { ...item, ...schoolYear }
          : item
      ),
      loading: false,
    });
  } catch (err: any) {
    set({
      loading: false,
      error:
        err?.response?.data?.message || "Update school year failed",
    });
    throw err;
  }
},



}));