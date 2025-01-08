import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken, refreshToken, setAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false); 

  useEffect(() => {
    const verifyToken = async () => {
      if (!refreshToken || hasAttemptedRefresh) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post('/auth/refresh_token/', {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        setAccessToken(newAccessToken);
        setIsValid(true);
      } catch (error) {
        console.error('Error verificando token:', error);
        setIsValid(false);
      } finally {
        setLoading(false);
        setHasAttemptedRefresh(true); 
      }
    };

    verifyToken();
  }, [refreshToken, setAccessToken, hasAttemptedRefresh]); 

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!accessToken || !refreshToken || !isValid) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
