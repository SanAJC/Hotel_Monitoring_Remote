import '/src/styles/Home.css'
import { AsideContent } from "../components/dashboard/AsideContent"
import { useAuth } from '../context/AuthContext'
import { Badge } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import TotalConsume from '../components/charts/TotalConsume';
import PisosConsume from '../components/charts/PisosConsume';
import TotalConsumeHistory from '../components/charts/TotalConsumeHistory';
import TableRooms from '../components/charts/TableRooms';
export default function Home() {

  const {user} = useAuth();

  return (
    <>
      <div className="Content-home">
        <AsideContent />
        <div className='main-content'>
          <div className='header-content'>

            <h1>Hotel Kamila</h1>

            <div className='input-badget'>
              <input type="text" placeholder='  Buscar Habitacion . . . .' />
              
              <Badge badgeContent={4} color="primary">
                <NotificationsIcon style={{ fontSize: "30px", color: "#B51A28" }}/>
              </Badge>
            </div>
            
            <div className="user-info">
              <p>{user?.rol}</p>
              <img src="src/assets/user.png" alt="user" id="img-user" />
            </div>

          </div>

          <span>Informe General</span>

          <div className='Content-cards'>

            <TotalConsume/>
            <PisosConsume/>
            <TotalConsumeHistory/>
            <TableRooms/>
          </div>

          <footer>
            <span>Todos los derechos de autor reservados</span>
          </footer>

        </div>

      </div>

    </>
  )
}
