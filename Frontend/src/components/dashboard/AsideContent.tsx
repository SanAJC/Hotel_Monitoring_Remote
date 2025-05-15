import { useLogout } from "../../hooks/useLogout";
import "/src/styles/Aside.css";
import { Link } from "react-router-dom";
import logoHotel from "../../assets/Hotel.png";
import homeIcon from "../../assets/home.png";
import chartIcon from "../../assets/chart.png";
import documentIcon from "../../assets/document.png";
import userIcon from "../../assets/user.png";
import logoutIcon from "../../assets/Logout.png";

export const AsideContent = () => {
  const { handleLogout } = useLogout();

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logout button clicked");
    handleLogout();
  };

  return (
    <aside className="aside-content">
      <img src={logoHotel} alt="hotel" id="img-hotel" />
      <nav>
        <ul>
          <li className="tooltip">
            <Link to="/home">
              <img src={homeIcon} alt="home" />
              <span className="tooltip-text">Inicio</span>
            </Link>
          </li>

          <li className="tooltip">
            <Link to="/rooms">
              <img src={chartIcon} alt="rooms" />
              <span className="tooltip-text">Habitaciones</span>
            </Link>
          </li>

          <li className="tooltip">
            <Link to="/export">
              <img src={documentIcon} alt="export" />
              <span className="tooltip-text">Reportes</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="icons-user">
        <button className="tooltip">
          <Link to={`${import.meta.env.VITE_API_URL}/admin/`}>
            <img src={userIcon} alt="user" id="img-user" />
            <span className="tooltip-text">Admin</span>
          </Link>
        </button>

        <button onClick={handleClick} className="tooltip">
          <img src={logoutIcon} alt="Logout" id="img-logut" />
          <span className="tooltip-text">Cerrar Session</span>
        </button>
      </div>
    </aside>
  );
};
