import "/src/styles/CardAction.css";
import { Dispositivo , Habitacion } from "@/types/models";
import temperaturaOff from "../../assets/temperatura-off.gif";
import humedadOff from "../../assets/humedad-off.gif";
import presencia from "../../assets/presencia.gif";
type DispositivoProps = {
  dispositivos: Dispositivo[];
  sendCommand: (id: number, estado: "ENCENDER" | "APAGAR") => void;
  habitacion: Habitacion;
};
export const CardRoomAction = ({dispositivos,sendCommand,habitacion}: DispositivoProps) => {
  const handleChangeEstade = (dispositivo:Dispositivo,estado: 'ENCENDER' | 'APAGAR') => {
    sendCommand(dispositivo.id,estado)
  };

  return (
    <div className="card-room-action">
      <h2>Acciones Rapidas</h2>
      <div className="content-action">
        {dispositivos.length === 0 && <div className="content-action-info-error"><p>No hay dispositivos conectados a esta habitacion</p></div>}
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
              <p id="temp">{habitacion.temperatura} °C</p>
              <img src={temperaturaOff} alt="" id="icon" />
            </div>
          </div>
          <div className="data-item">
            <span>Humedad</span>
            <div className=" content-data-img">
              <p id="hum">{habitacion.humedad} %</p>
              <img src={humedadOff} alt="" id="icon" />
            </div>
          </div>
          <div className="data-item">
            <span>Presencia</span>
            <div className=" content-data-img">
              <p id="pre">{habitacion.presencia_humana ? "Activo" : "Inactivo"}</p>
              <img src={presencia} alt="" id="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
