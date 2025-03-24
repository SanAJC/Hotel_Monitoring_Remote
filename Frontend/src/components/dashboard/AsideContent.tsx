import { useLogout } from "../../hooks/useLogout";
import "/src/styles/Aside.css";
import { Link } from "react-router-dom";

export const AsideContent = () => {
  const { handleLogout } = useLogout();

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logout button clicked");
    handleLogout();
  };

  return (
    <aside className="aside-content">
      <img src="/src/assets/Hotel.png" alt="hotel" id="img-hotel" />
      <nav>
        <ul>
          <li className="tooltip">
            <Link to="/home">
              <img src="/src/assets/home.png" alt="home" />
              <span className="tooltip-text">Inicio</span>
            </Link>
          </li>

          <li className="tooltip">
            <Link to="/rooms">
              <img src="/src/assets/chart.png" alt="rooms" />
              <span className="tooltip-text">Habitaciones</span>
            </Link>
          </li>

          <li className="tooltip">
            <Link to="/export">
              <img src="/src/assets/document.png" alt="export" />
              <span className="tooltip-text">Reportes</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="icons-user">
        <button className="tooltip">
          <Link to="http://localhost:8000/admin/">
            <img src="/src/assets/user.png" alt="user" id="img-user" />
            <span className="tooltip-text">Admin</span>
          </Link>
        </button>

        <button onClick={handleClick} className="tooltip">
          <img src="/src/assets/Logout.png" alt="Logout" id="img-logut" />
          <span className="tooltip-text">Cerrar Session</span>
        </button>
      </div>
    </aside>
  );
};
