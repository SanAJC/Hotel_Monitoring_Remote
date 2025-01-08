import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adjuntar el token de acceso
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh_token/`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        
        // Actualizar token en localStorage
        localStorage.setItem("accessToken", newAccessToken);
        
        // Actualizar header de la petición original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Reintentar la petición original
        return axiosInstance(originalRequest);
      } catch (error) {
        // Si falla el refresh, limpiar localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirigir a login
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;