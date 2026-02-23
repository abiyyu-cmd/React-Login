import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setToken,
  clearToken,
} from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

/* ===============================
   REFRESH LOCKING SYSTEM
=================================*/
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

/* ===============================
   REQUEST INTERCEPTOR
=================================*/
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ===============================
   RESPONSE INTERCEPTOR
=================================*/
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const is401 = error.response?.status === 401;
    const isLogout = originalRequest.url?.includes("/auth/logout");
    const isRefresh = originalRequest.url?.includes("/auth/refresh");

    if (is401 && !originalRequest._retry && !isLogout && !isRefresh) {
      originalRequest._retry = true;

      // 🔒 Kalau lagi refresh, tunggu saja
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("http://localhost:8080/api/auth/refresh", {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;

        // Simpan token baru
        setToken(newAccessToken, refreshToken);

        // Update default header
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Lanjutkan semua request yang nunggu
        onRefreshed(newAccessToken);

        return api(originalRequest);
      } catch (err) {
        console.error("Refresh gagal:", err);
        // console.log("Response refresh:", err.response);

        clearToken();
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
