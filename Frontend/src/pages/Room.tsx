import { AsideContent } from "../components/dashboard/AsideContent";
import Header from "../components/dashboard/Header";
import "/src/styles/Room.css";
import { AireChart } from "../components/charts/AireChart";
import { TvChart } from "../components/charts/TvChart";
import { F1Chart } from "../components/charts/F-1Chart";
import { ConsumeWeeklyChart } from "../components/charts/ConsumeWeekly";
import { F2Chart } from "../components/charts/F-2Chart";
import { ConsumeMothklyChart } from "../components/charts/ConsumeMonthly";
import { CardRoomAction } from "../components/dashboard/CardAction";
import { useParams } from 'react-router-dom';
import useRooms from '../hooks/useRooms';  

export default function Room() {
  const { identifier } = useParams<{ identifier: string }>();
  const { rooms } = useRooms();
  
  // Buscamos la habitación ya sea por id o por número
  const room = rooms.find(room => 
    room.id.toString() === identifier || 
    room.numero.toString() === identifier
  );

  if (!room) {
    return <div>Cargando...</div>;
  }

  const baseURL = "http://localhost:8000";
  const imageUrl = `${baseURL}${room.images}`;

  return (
    <>
      <div className="Content-room">
        <AsideContent />
        <div className="main-content">
          <Header />
          <h2 id="titulo">Habitación-{room.numero}</h2>
          <div className="info-room-content">
            <AireChart />
            <TvChart />
            <F1Chart />
            <img src={imageUrl} alt={`Habitación ${room.numero}`} id="habitacion" />
            <ConsumeWeeklyChart />
            <F2Chart  />
            <CardRoomAction  />
            <ConsumeMothklyChart  />
          </div>
          <footer>
            <span>Todos los derechos de autor reservados</span>
          </footer>
        </div>
      </div>
    </>
  );
}