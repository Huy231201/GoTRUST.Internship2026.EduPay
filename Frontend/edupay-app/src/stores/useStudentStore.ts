// src/stores/useStudentStore.ts
import { create } from "zustand";
import {
  getStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  importStudents
} from "@/lib/api/student";

import type {
  Student,
  CreateStudentPayload,
  UpdateStudentPayload,
} from "@/lib/api/student";

import { useAppFilterStore } from "@/stores/useAppFilterStore";

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;

  search: string;
  status: number | undefined;
  classId: string | undefined;

  setSearch: (search: string) => void;
  setStatus: (status: number | undefined) => void;
  setClassId: (classId: string | undefined) => void;

  fetchStudents: () => Promise<void>;
  createStudent: (payload: CreateStudentPayload) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  updateStudent: (id: string, payload: UpdateStudentPayload) => Promise<void>;
  importStudentsFromFile: (file: File) => Promise<any>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  search: "",
  status: undefined,
  classId: undefined,

  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setClassId: (classId) => set({ classId }),

  // ================= GET LIST =================
  fetchStudents: async () => {
    try {
      set({ loading: true, error: null });

      const { search, status, classId } = get();
      const { branchId, schoolYearId } = useAppFilterStore.getState();

      if (!branchId || !schoolYearId) {
        set({ loading: false });
        return;
      }

      const data = await getStudents({
        branchId,
        schoolYearId,
        search,
        status,
        classId,
      });

      set({
        students: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Fetch students failed",
      });
    }
  },

  // ================= CREATE =================
  createStudent: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await createStudent(payload);
      const newStudent = res.data;

      set({
        students: [...get().students, newStudent],
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Create student failed",
      });
      throw err;
    }
  },

  // ================= DELETE =================
  deleteStudent: async (id) => {
    try {
      set({ loading: true, error: null });

      await deleteStudent(id);

      set({
        students: get().students.filter((s) => s.id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Delete student failed",
      });
      throw err;
    }
  },

  // ================= UPDATE =================
  updateStudent: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const res = await updateStudent(id, payload);
      const updated = res.data;

      set({
        students: get().students.map((s) =>
          s.id === id ? { ...s, ...updated } : s
        ),
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Update student failed",
      });
      throw err;
    }
  },

importStudentsFromFile: async (file) => {
  try {
    set({ loading: true, error: null });

    const { branchId, schoolYearId } = useAppFilterStore.getState();

    if (!branchId || !schoolYearId) {
      throw new Error("Missing branch or school year");
    }

    const result = await importStudents(file, branchId, schoolYearId);

    await get().fetchStudents();

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


