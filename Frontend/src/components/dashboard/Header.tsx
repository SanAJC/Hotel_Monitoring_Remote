import { useAuth } from "../../context/AuthContext";
import { Badge } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import '/src/styles/Header.css'
import { Link } from "react-router-dom";
import { useState } from "react";
import Alert from '@mui/material/Alert';

export default function Header() {

    const {user} = useAuth();
    const [menuOpen, setMenuOpen] = useState(false); 

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <div className='header-content'>

            <h1>Hotel Kamila</h1>

            <div className='input-badget'>
                <input type="text" placeholder='  Buscar Habitacion . . . .' />
                
                <Badge badgeContent={4} color="primary">
                 <NotificationsIcon style={{ fontSize: "30px", color: "#B51A28" }} onClick={toggleMenu}/>
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
                <Link to="/">
                    <img src="src/assets/user.png" alt="user" id="img-user" />
                </Link>
            </div>

        </div>
  )
}
