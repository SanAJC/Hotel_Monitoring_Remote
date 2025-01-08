import { AsideContent } from "../components/dashboard/AsideContent"
import Header from "../components/dashboard/Header"
import '/src/styles/Room.css'
import { AireChart } from "../components/charts/AireChart"
import { TvChart } from "../components/charts/TvChart"
import { F1Chart } from "../components/charts/F-1Chart"
import { ConsumeWeeklyChart } from "../components/charts/ConsumeWeekly"
import { F2Chart } from "../components/charts/F-2Chart"
import { ConsumeMothklyChart } from "../components/charts/ConsumeMonthly"
import { CardRoomAction } from "../components/dashboard/CardAction"
export default function Room() {
  return (
    <>
        <div className="Content-room">
            <AsideContent/>
            <div className="main-content">
                <Header/>
                <h2 id="titulo">Habitacion-205</h2>
                <div className="info-room-content">
                    <AireChart/>
                    <TvChart/>
                    <F1Chart/>
                    <img src='/src/assets/habitacion2.png' alt="habitacion2" />
                    <ConsumeWeeklyChart/>
                    <F2Chart/>
                    <CardRoomAction/>
                    <ConsumeMothklyChart/>
                </div>
            
            </div>

        </div>
    
    </>
  )
}
