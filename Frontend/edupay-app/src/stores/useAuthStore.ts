


import { create } from "zustand";
import { loginApi, logoutApi } from "@/lib/api/auth";

interface AuthState {
  token: string | null;
  fullName: string | null;
  schoolId: string | null;

  loading: boolean;
  error: string | null;

  login: (account: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => Promise<void>; 
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken"),

  fullName:
    localStorage.getItem("fullName") ||
    sessionStorage.getItem("fullName"),

  schoolId:
    localStorage.getItem("schoolId") ||
    sessionStorage.getItem("schoolId"),

  loading: false,
  error: null,

  login: async (account, password, remember) => {
    try {
      set({ loading: true, error: null });

      const data = await loginApi({ account, password });

      if (!data.accessToken) {
        set({ error: "Sai tài khoản hoặc mật khẩu", loading: false });
        return false;
      }

      // lưu storage
      if (remember) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("schoolId", data.schoolId);
      } else {
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        sessionStorage.setItem("fullName", data.fullName);
        sessionStorage.setItem("schoolId", data.schoolId);
      }

      set({
        token: data.accessToken,
        fullName: data.fullName,
        schoolId: data.schoolId,
        loading: false,
      });

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message,
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        await logoutApi({ refreshToken }); // gọi API
      }
    } catch (err) {
      // ignore lỗi
    }

    // clear storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("schoolId");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("fullName");
    sessionStorage.removeItem("schoolId");

    set({
      token: null,
      fullName: null,
      schoolId: null,
    });
  },
}));