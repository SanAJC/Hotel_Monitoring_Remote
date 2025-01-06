import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken} = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  Vamos Simula un pequeño retraso mientras verificamos el accessToken.
    const checkToken = () => {
      setLoading(false);
    };
    checkToken();
  }, []);

  
  if (loading) {
    return <p>Cargando...</p>; 
  }

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}