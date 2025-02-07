import { AsideContent } from "../components/dashboard/AsideContent";
import "/src/styles/Rooms.css";
import Header from "../components/dashboard/Header";
import { Menu } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DataRoom from "../components/charts/DataRoom";
import useRooms from "@/hooks/useRooms";
import useNivels from "@/hooks/useNivels";
import { useState } from "react";

export default function Rooms() {
  const { rooms } = useRooms();
  const { nivel } = useNivels();

  const [nivelSeleccionado, setNivelSeleccionado] = useState<number | null>(
    null
  );

  // Filtrar habitaciones según el nivel seleccionado
  const habitacionesFiltradas =
    nivelSeleccionado !== null
      ? rooms.filter(
          (habitacion) => habitacion.nivel.nivel === nivelSeleccionado
        )
      : rooms;
  return (
    <>
      <div className="Content-rooms">
        <AsideContent />
        <div className="main-content">
          <Header />
          <div className="info-content">
            <span>Habitaciones</span>

            <div className="menu-btn">
              <span>Pisos</span>
              <label htmlFor="menu">
                <Menu style={{ fontSize: "25px", color: "#FFFFFF" }} />
              </label>
            </div>

            <input type="checkbox" id="menu" />

            <div className="container-menu">
              <div className="cont-menu">
                <nav>
                  {nivel.map((nivel) => (
                    <a
                      key={nivel.id}
                      onClick={() => {
                        setNivelSeleccionado(nivel.nivel);
                        console.log("Nivel seleccionado:", nivel.nivel);
                      }}
                      style={{
                        cursor: "pointer",
                        fontWeight:
                          nivelSeleccionado === nivel.nivel ? "bold" : "normal",
                        color:
                          nivelSeleccionado === nivel.nivel
                            ? "yellow"
                            : "white",
                      }}
                    >
                      Nivel {nivel.nivel} - Consumo: {nivel.consumo}
                    </a>
                  ))}
                </nav>
                <label htmlFor="menu">
                  <HighlightOffIcon
                    style={{ fontSize: "25px", color: "#FFFFFF" }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="Content-cards-rooms">
            {habitacionesFiltradas.length > 0 ? (
              habitacionesFiltradas.map((habitacion) => (
                <DataRoom key={habitacion.id} habitacion={habitacion} />
              ))
            ) : (
              <p
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                No hay habitaciones en este nivel.
              </p>
            )}
          </div>

          <footer>
            <span>Todos los derechos de autor reservados</span>
          </footer>
        </div>
      </div>
    </>
  );
}
