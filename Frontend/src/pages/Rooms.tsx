import { AsideContent } from "../components/dashboard/AsideContent";
import "/src/styles/Rooms.css";
import Header from "../components/dashboard/Header";
import { Menu } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DataRoom from "../components/charts/DataRoom";

export default function Rooms() {
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
                  <a href="">Piso 1</a>
                  <a href="">Piso 2</a>
                  <a href="">Piso 3</a>
                  <a href="">Piso 4</a>
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
            <DataRoom />
            <DataRoom />
            <DataRoom />
            <DataRoom />
            <DataRoom />
            <DataRoom />
            <DataRoom />
            <DataRoom />
            <DataRoom />
          </div>
          <footer>
            <span>Todos los derechos de autor reservados</span>
          </footer>
        </div>
      </div>
    </>
  );
}
