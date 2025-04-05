import { useAuth } from "../../context/AuthContext";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "/src/styles/Header.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import useRooms from "@/hooks/useRooms";
import userImage from "/src/assets/user.png";

export default function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { rooms } = useRooms(); // Obtener las habitaciones
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

        <Badge badgeContent={4} color="primary">
          <NotificationsIcon
            style={{ fontSize: "30px", color: "#B51A28" }}
            onClick={toggleMenu}
          />
        </Badge>

        {menuOpen && (
          <div className="notifications-menu">
            <ul>
              <Alert variant="filled" severity="success">
                This is a filled success Alert.
              </Alert>
              <Alert variant="filled" severity="info">
                This is a filled info Alert.
              </Alert>
              <Alert variant="filled" severity="warning">
                This is a filled warning Alert.
              </Alert>
              <Alert variant="filled" severity="error">
                This is a filled error Alert.
              </Alert>
            </ul>
          </div>
        )}
      </div>

      <div className="user-info">
        <p>{user?.rol}</p>
        <Link to="http://localhost:8000/admin/">
          <img src={userImage} alt="user" id="img-user" />
        </Link>
      </div>
    </div>
  );
}
