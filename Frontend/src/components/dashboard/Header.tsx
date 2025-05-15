import { useAuth } from "../../context/AuthContext";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "/src/styles/Header.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import useRooms from "@/hooks/useRooms";
import userImage from "../../assets/user.png";
import useAlerts from "@/hooks/useAlerts";

export default function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { rooms } = useRooms();
  const { alertas } = useAlerts();
  const [searchError, setSearchError] = useState(false); // Para manejar errores

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const roomNumber = searchQuery.trim();
      const room = rooms.find((r) => r.numero.toString() === roomNumber);

      if (room) {
        navigate(`/room/${room.id}`);
        setSearchQuery(""); 
        setSearchError(false);
      } else {
        setSearchError(true); 
      }
    }
  };

  return (
    <div className="header-content">
      <h1>Hotel Kamila</h1>

      <div className="input-badget">
        <input
          type="text"
          placeholder="Buscar por número de habitación..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={searchError ? "error" : ""}
        />
        {searchError && (
          <div className="error-message">Habitación no encontrada</div>
        )}

        <Badge badgeContent={alertas.length > 0 ? alertas.length : 1} color="primary">
          <NotificationsIcon
            style={{ fontSize: "30px", color: "#B51A28" }}
            onClick={toggleMenu}
          />
        </Badge>

        {menuOpen && (
          <div className="notifications-menu">
            <h3>Alertas</h3>
            <ul>
              {alertas?.length === 0 && (
                <li>
                  <Alert variant="filled" severity="info">
                    No hay alertas
                  </Alert>
                </li>
              )}
              {alertas.map((alerta) => (
                <li key={alerta.id}>
                  <Alert variant="filled" severity="warning">
                    {alerta.tipo} | {alerta.habitacion.numero} | {alerta.mensaje}
                  </Alert>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="user-info">
        <p>{user?.rol}</p>
        <Link to={`${import.meta.env.VITE_API_URL}/admin/`}>
          <img src={userImage} alt="user" id="img-user" />
        </Link>
      </div>
    </div>
  );
}
