
import '/src/styles/Aside.css'
import { Link } from "react-router-dom";

export const AsideContent = () => {

  return (
    <aside className='aside-content'>
        <img src="/src/assets/Hotel.png" alt="hotel"  id='img-hotel'/>
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
        <div className='icons-user'>
            <Link to="/">
                <img src="/src/assets/user.png" alt="user" id='img-user'/>
            </Link>

            <Link to="">
                <img src="/src/assets/Logout.png" alt="Logout" id='img-logut'/>
            </Link>
        </div>
        
    </aside>
  )
}
