import { useAuth } from '../context/AuthContext'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';

export const useLogout = () => {
    const {logout}=useAuth();
    const [error,setError] = useState<string|null>(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setError(null);
      
        try {
            console.log("Attempting logout...");
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.error("No refresh token available");
                return;
            }
    
            const response = await axios.post(
                "http://127.0.0.1:8000/authentication/auth/logout/",
                { refresh_token: refreshToken },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            console.log("Logout successful:", response.data);
    
            logout();
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
      };
      

    return {
        handleLogout,
        error
    }
}
