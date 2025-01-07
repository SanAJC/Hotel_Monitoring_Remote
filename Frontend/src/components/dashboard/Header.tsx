import { useAuth } from "../../context/AuthContext";
import { Badge } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import '/src/styles/Header.css'
export default function Header() {

    const {user} = useAuth();
    return (
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
  )
}
