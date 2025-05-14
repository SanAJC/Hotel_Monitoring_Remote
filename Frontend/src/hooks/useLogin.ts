import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/auth/login/`,
        { username, password }
      );

      const { user, access_token, refresh_token } = response.data;

      console.log(user, access_token, refresh_token);

      login(user, access_token, refresh_token);

      navigate("/home");
    } catch (error: any) {
      setError(error.response?.data?.detail || "Login Fallo");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    error,
  };
};
