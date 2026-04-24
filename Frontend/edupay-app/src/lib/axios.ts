

// import axios from "axios";
// import { useAuthStore } from "@/stores/useAuthStore";

// export const api = axios.create({
//   baseURL: "http://localhost:5000/edupay/v1",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // REQUEST: gắn accessToken
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     // chặn login + refresh + retry loop
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes("/auth/login") &&
//       !originalRequest.url?.includes("/auth/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       const refreshToken = localStorage.getItem("refreshToken");

//       // không có refreshToken → logout luôn
//       if (!refreshToken) {
//         const logout = useAuthStore.getState().logout;
//         logout();
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       try {
//         const res = await api.post("/auth/refresh-token", {
//           refreshToken,
//         });

//         const newAccessToken = res.data.accessToken;
//         const newRefreshToken = res.data.refreshToken;

//         // lưu token mới
//         localStorage.setItem("accessToken", newAccessToken);
//         localStorage.setItem("refreshToken", newRefreshToken);

//         // gắn lại header
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (err) {
//         // refresh fail → logout
//         const logout = useAuthStore.getState().logout;
//         logout();
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

export const api = axios.create({
  baseURL: "http://localhost:5000/edupay/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST: gắn accessToken
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// refresh lock + queue
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      // không có refreshToken → logout
      if (!refreshToken) {
        const logout = useAuthStore.getState().logout;
        logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // nếu đang refresh → chờ
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        // lưu token mới
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // gọi lại các request đang chờ
        onRefreshed(newAccessToken);

        isRefreshing = false;

        // retry request hiện tại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;

        const logout = useAuthStore.getState().logout;
        logout();
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);