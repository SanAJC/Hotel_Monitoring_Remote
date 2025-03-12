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
          <li>
            <Link to="/home">
              <img src="/src/assets/home.png" alt="home" />
            </Link>
          </li>
          <li>
            <Link to="/rooms">
              <img src="/src/assets/chart.png" alt="home" />
            </Link>
          </li>
          <li>
            <Link to="/export">
              <img src="/src/assets/document.png" alt="home" />
            </Link>
          </li>
        </ul>
      </nav>
      <div className="icons-user">
        <button>
          <Link to="http://localhost:8000/admin/">
            <img src="/src/assets/user.png" alt="user" id="img-user" />
          </Link>
        </button>

        <button onClick={handleClick}>
          <img src="/src/assets/Logout.png" alt="Logout" id="img-logut" />
        </button>
      </div>
      
    </aside>
  );
};
