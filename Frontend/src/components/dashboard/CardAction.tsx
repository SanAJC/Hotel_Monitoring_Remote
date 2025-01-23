import "/src/styles/CardAction.css";

export const CardRoomAction = () => {
  return (
    <div className="card-room-action">
      <h2>Acciones Rapidas</h2>
      <div className="content-action">
        <div className="content-action-info">
          <p>Aire Acondiconado</p>
          <div className="content-button">
            <button id="off">
              <span> Apagar </span>
            </button>
            <button id="on">
              <span> Encender </span>
            </button>
          </div>
        </div>
        <div className="content-action-info">
          <p>Television</p>
          <div className="content-button">
            <button id="off">
              <span> Apagar </span>
            </button>
            <button id="on">
              <span> Encender </span>
            </button>
          </div>
        </div>
        <div className="content-action-info">
          <p>Foco-Habitacion</p>
          <div className="content-button">
            <button id="off">
              <span> Apagar </span>
            </button>
            <button id="on">
              <span> Encender </span>
            </button>
          </div>
        </div>
        <div className="content-action-info">
          <p>Foco-Baño</p>
          <div className="content-button">
            <button id="off">
              <span> Apagar </span>
            </button>
            <button id="on">
              <span> Enceder </span>
            </button>
          </div>
        </div>
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
