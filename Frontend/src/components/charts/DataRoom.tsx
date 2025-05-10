import { CardRoom } from "../dashboard/CardRoom"
import '/src/styles/CardRoom.css'
import { Link } from "react-router-dom";
import { Habitacion } from "@/types/models";

type DataRoomProps = {
  habitacion: Habitacion;
};

export default function DataRoom({habitacion}:DataRoomProps) {
  const baseURL = "http://localhost:8000";
  const imageUrl = `${baseURL}${habitacion.images}`;
  
  return (
    <CardRoom title={`Habitación-${habitacion.numero}`}>
        <div className="info-room">
            <div className="info-item">
                <span>Consumo</span>
                <p id="p-consumo">{Number(habitacion.consumo).toFixed(2)} kWh</p> 
            </div>
            <div className="info-item">
                <span>C. Desperdiciado</span>
                <p id="p-consumo">{Number(habitacion.consumo_desperdicio).toFixed(2)} kWh</p> 
            </div>
            <div className="info-item">
                <span>Presencia</span>
                <p id="p-presencia">{habitacion.presencia_humana ? "Activo" : "Inactivo"}</p> 
            </div>
        </div>
        <Link to={`/room/${habitacion.id}`}>
          <img src={imageUrl} alt={`Habitación ${habitacion.numero}`} />
        </Link>
       
    </CardRoom>
  )
}
