import { CardRoom } from "../dashboard/CardRoom"
import '/src/styles/CardRoom.css'
import { Link } from "react-router-dom";

export default function DataRoom() {
  return (
    <CardRoom title="Habitacion-101">
        <div className="info-room">
            <div className="info-item">
                <span>Consumo</span>
                <p>50 kWh</p> 
            </div>
            <div className="info-item">
                <span>Presencia</span>
                <p>Activo</p> 
            </div>
        </div>
        <Link to="/room">
          <img src='src/assets/habitacion1.png' alt="room" />
        </Link>
       
    </CardRoom>
  )
}
