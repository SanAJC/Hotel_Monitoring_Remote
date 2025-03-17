import { useAuth } from "../context/AuthContext";
import axios from "axios";

export const useRefreshToken = () => {
  const { refreshToken, setAccessToken } = useAuth();

  const refresh = async () => {
    if (!refreshToken) {
      throw new Error("No existe refresh token");
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/authentication/auth/refresh_token/', {
        refresh_token: refreshToken,
      });
      const newAccessToken = response.data.access_token;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      throw error;
    }
  };

  return refresh;
};
