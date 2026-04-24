// src/stores/useTeacherStore.ts
import { create } from "zustand";
import { getTeachers, createTeacher, deleteTeacher, updateTeacher} from "@/lib/api/teacher";
import type { Teacher } from "@/lib/api/teacher";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import type {CreateTeacherPayload, UpdateTeacherPayload} from "@/lib/api/teacher";

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;

  search: string;
  status: number | undefined;

  setSearch: (search: string) => void;
  setStatus: (status: number | undefined) => void;

  fetchTeachers: () => Promise<void>;
  createTeacher: (payload: CreateTeacherPayload) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  updateTeacher: (id: string, payload: UpdateTeacherPayload) => Promise<void>;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  search: "",
  status: undefined,
 
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),

  // ================= GET LIST =================
  fetchTeachers: async () => {
    try {
      set({ loading: true, error: null });

      const { search, status } = get();
      const { branchId, schoolYearId } = useAppFilterStore.getState();

      if (!branchId || !schoolYearId) {
        set({ loading: false });
        return;
      }

      const data = await getTeachers({
        branchId,
        schoolYearId,
        search,
        status
      });

      set({
        teachers: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Fetch teachers failed",
      });
    }
  },

  createTeacher: async (payload) => {
  try {
    set({ loading: true, error: null });

    const res = await createTeacher(payload);
    const newTeacher = res.data;

    set({
      teachers: [...get().teachers, newTeacher],
      loading: false,
    });
  } catch (err: any) {
    set({
      loading: false,
      error: err?.response?.data?.message || "Create teacher failed",
    });
    throw err;
  }
},

deleteTeacher: async (id) => {
  try {
    set({ loading: true, error: null });

    await deleteTeacher(id);

    set({
      teachers: get().teachers.filter((t) => t.id !== id),
      loading: false,
    });
  } catch (err: any) {
    set({
      loading: false,
      error: err?.response?.data?.message || "Delete teacher failed",
    });
    throw err;
  }
},

updateTeacher: async (id, payload) => {
  try {
    set({ loading: true, error: null });

    const res = await updateTeacher(id, payload);
    const updated = res.data;

    set({
      teachers: get().teachers.map((t) =>
        t.id === id ? { ...t, ...updated } : t
      ),
      loading: false,
    });
  } catch (err: any) {
    set({
      loading: false,
      error: err?.response?.data?.message || "Update teacher failed",
    });
    throw err;
  }
},
}));