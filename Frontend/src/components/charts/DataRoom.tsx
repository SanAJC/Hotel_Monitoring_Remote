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
                <p id="p-consumo">{habitacion.consumo} kWh</p> 
            </div>
            <div className="info-item">
                <span>Presencia</span>
                <p id="p-presencia">{habitacion.presencia_humana ? "Activo" : "Inactivo"}</p> 
            </div>
        </div>
        <Link to="/room">
          <img src={imageUrl} alt={`Habitación ${habitacion.numero}`} />
        </Link>
       
    </CardRoom>
  )
}
