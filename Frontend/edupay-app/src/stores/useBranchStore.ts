import { create } from "zustand";
import { createBranch, deleteBranch, getBranches, updateBranch, getBranchById } from "@/lib/api/branch/branch";
import type { BranchItem, CreateBranchRequest, UpdateBranchRequest } from "@/lib/api/branch/branch-type";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSchoolStore } from "./useSchoolStore";

interface BranchState {
  branches: BranchItem[];
  loading: boolean;
  error: string | null;

  fetchBranches: () => Promise<void>;
  createBranch: (branch: CreateBranchRequest) => Promise<void>;
  deleteBranch: (branchId: string) => Promise<void>;
  updateBranch: (branchId: string, branch: UpdateBranchRequest) => Promise<void>;
  getBranchById: (branchId: string) => Promise<BranchItem | null>;
}

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  loading: false,
  error: null,

  fetchBranches: async () => {
    try {
      set({ loading: true, error: null });

      const schoolId =
        localStorage.getItem("schoolId") ||
        sessionStorage.getItem("schoolId") ||
        useAuthStore.getState().schoolId;

      if (!schoolId) {
        throw new Error("Missing schoolId");
      }

      const data = await getBranches(schoolId);

      set({
        branches: data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ||
          err.message ||
          "Fetch branches failed",
      });
    }
  },

   getBranchById: async (branchId: string) => {
    try {
      set({ loading: true, error: null });

      const branch = await getBranchById(branchId);

      set({ loading: false });

      return branch;
    } catch (err: any) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ||
          err.message ||
          "Get branch failed",
      });
      return null;
    }
  },

   createBranch: async (branch: CreateBranchRequest) => {
    try {
      set({ loading: true, error: null });

      const schoolId =
        localStorage.getItem("schoolId") ||
        sessionStorage.getItem("schoolId") ||
        useAuthStore.getState().schoolId;
      if (!schoolId) throw new Error("Missing schoolId");

      // thêm schoolId vào payload
      const payload = { ...branch, schoolId };

      const newBranch = await createBranch(payload);

      // cập nhật state
      set({ branches: [...get().branches, newBranch], loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message || "Create branch failed",
      });
      throw err; // ném ra component nếu cần alert
    }
  },

  deleteBranch: async (branchId: string) => {
    try {
      set({ loading: true, error: null });

      await deleteBranch(branchId);

      // xóa khỏi state
      set({
        branches: get().branches.filter((b: any) => b.id !== branchId),
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message || "Delete branch failed",
      });
      throw err;
    }
  },

  updateBranch: async (branchId: string, branch: UpdateBranchRequest) => {
  try {
    set({ loading: true, error: null });

    // 🔥 1. Lấy branch cũ trước khi update
    const current = get().branches.find(b => b.id === branchId);

    const updatedBranch = await updateBranch(branchId, branch);

    // 🔥 2. Update state (ép boolean luôn cho chắc)
    set({
      branches: get().branches.map((b) =>
        b.id === branchId
          ? { ...b, ...updatedBranch, isMain: !!b.isMain }
          : b
      ),
      loading: false,
    });

    // 🔥 3. Nếu là main branch → sync school
    if (current?.isMain) {
      await useSchoolStore.getState().fetchSchool();
    }

  } catch (err: any) {
    set({
      loading: false,
      error:
        err?.response?.data?.message ||
        err.message ||
        "Update branch failed",
    });
    throw err;
  }
},
      
}));
