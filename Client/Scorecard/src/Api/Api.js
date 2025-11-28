import axios from "axios";
import { store } from "../redux/store";
import { updateAccessToken, logout } from "../Redux/Slices/AuthSlice.js";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true // allows cookies (for refresh token)
});

const API_URL = "/api/platform/auth"

// Interceptor to auto-refresh token
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post(`${API_URL}/refresh`);
        const newAccessToken = res.data.accessToken;
        store.dispatch(updateAccessToken(newAccessToken));
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        console.log(err.message+"Refresh failed, redirect to login");
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user.auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
