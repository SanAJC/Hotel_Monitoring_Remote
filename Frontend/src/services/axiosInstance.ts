import axios from "axios";
import { useAuth } from "../context/AuthContext";


const API_BASE_URL = "http://127.0.0.1:8000/api";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Funcion para refrescar el token
const refreshAccessToken = async () => {
  const { refreshToken, setAccessToken, logout } = useAuth();
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh_token/`, {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    setAccessToken(newAccessToken); 
    return newAccessToken;
  } catch (error) {
    logout(); 
    throw error;
  }
};

// Interceptor para adjuntar el token de acceso
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuth();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar el refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Reintenta la petición original
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
