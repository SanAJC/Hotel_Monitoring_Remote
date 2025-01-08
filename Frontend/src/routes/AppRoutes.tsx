import { Route , Routes , Navigate } from "react-router-dom"
import { Login } from "../pages/Login"
import Home from "../pages/Home"
import { useAuth } from "../context/AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import Rooms from "../pages/Rooms"
import Export from "../pages/Export"
import Room from "../pages/Room"
import Profile from "../pages/Profile"
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

        <Route path="/export"element={
            <ProtectedRoute>
              <Export />
            </ProtectedRoute>
          }
        />

        <Route path="/room"element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route path="/profile"element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />



        <Route path="*" element={<Navigate to={accessToken ? "/home" : "/login"} />} />
    </Routes>
  )
}
