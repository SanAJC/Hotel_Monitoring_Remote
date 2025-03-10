import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRefreshToken } from "../hooks/useRefreshToken";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken, refreshToken} = useAuth();
  const refresh = useRefreshToken();
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
        await refresh();
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      } finally {
        setLoading(false);
        setHasAttemptedRefresh(true);
      }
    };

    verifyToken();
  }, [accessToken,refreshToken, hasAttemptedRefresh, refresh]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!accessToken || !refreshToken || !isValid) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
