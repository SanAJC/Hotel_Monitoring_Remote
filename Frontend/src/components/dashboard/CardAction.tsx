import '/src/styles/CardAction.css'

export const CardRoomAction = () => {
  return (
    <div className="card-room-action">
      <h2>Acciones Rapidas</h2>
      <div className='content-action'>

      </div>

      <div className='content-data'>
        <h2>Datos</h2>
        <div className="data-room">
            <div className="data-item">
                <span>Temperatura</span>
                <p>22 °C</p> 
            </div>
            <div className="data-item">
                <span>Humedad</span>
                <p>50%</p> 
            </div>
            <div className="data-item">
                <span>Presencia</span>
                <p>Activo</p> 
            </div>
        </div>

      </div>
      
    </div>
  )
}