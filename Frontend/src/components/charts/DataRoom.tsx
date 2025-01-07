import { CardRoom } from "../dashboard/CardRoom"
import '/src/styles/CardRoom.css'

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
        <img src='src/assets/habitacion1.png' alt="room" />
    </CardRoom>
  )
}
