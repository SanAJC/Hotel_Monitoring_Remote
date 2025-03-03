import "/src/styles/CardAction.css";
import { Dispositivo } from "@/types/models";

type DispositivoProps = {
  dispositivos: Dispositivo[];
  sendCommand: (id: number, estado: "ENCENDER" | "APAGAR") => void;
};
export const CardRoomAction = ({dispositivos,sendCommand,}: DispositivoProps) => {

  
  const handleChangeEstade = (dispositivo:Dispositivo,estado: 'ENCENDER' | 'APAGAR') => {
    sendCommand(dispositivo.id,estado)
  };

  return (
    <div className="card-room-action">
      <h2>Acciones Rapidas</h2>
      <div className="content-action">
        {dispositivos.map((dispositivo) => (
          <div className="content-action-info" key={dispositivo.id}>
            <p>{dispositivo.tipo}</p>
            <div className="content-button">
              <button id="off" className={dispositivo.estado_remoto === 'APAGAR' ? 'active' : ''}
                onClick={() => handleChangeEstade(dispositivo, 'APAGAR')}>
                <span> Apagar </span>
              </button>
              <button id="on" className={dispositivo.estado_remoto === 'ENCENDER' ? 'active' : ''}
                onClick={() => handleChangeEstade(dispositivo, 'ENCENDER')}>
                <span> Encender </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="content-data">
        <h2>Datos</h2>
        <div className="data-room">
          <div className="data-item">
            <span>Temperatura</span>
            <div className=" content-data-img">
              <p id="temp">22 °C</p>
              <img src="/src/assets/temperatura-off.gif" alt="" id="icon" />
            </div>
          </div>
          <div className="data-item">
            <span>Humedad</span>
            <div className=" content-data-img">
              <p id="hum">40 %</p>
              <img src="/src/assets/humedad-off.gif" alt="" id="icon" />
            </div>
          </div>
          <div className="data-item">
            <span>Presencia</span>
            <div className=" content-data-img">
              <p id="pre">Activa</p>
              <img src="/src/assets/presencia.gif" alt="" id="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
