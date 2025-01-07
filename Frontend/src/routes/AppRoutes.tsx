import { Route , Routes , Navigate } from "react-router-dom"
import { Login } from "../pages/Login"
import Home from "../pages/Home"
import { useAuth } from "../context/AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import Rooms from "../pages/Rooms"
export const AppRoutes = () => {

  const {accessToken} = useAuth();


  return (
    <Routes>
        <Route path="/login" element={!accessToken ? <Login /> : <Navigate to="/home" />} />
        
        <Route path="/home"element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/rooms"element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />



        <Route path="*" element={<Navigate to={accessToken ? "/home" : "/login"} />} />
    </Routes>
  )
}
