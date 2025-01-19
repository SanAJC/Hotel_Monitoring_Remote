import '/src/styles/Home.css'
import { AsideContent } from "../components/dashboard/AsideContent"
import Header from "../components/dashboard/Header"
import TotalConsume from '../components/charts/TotalConsume';
import PresupuestoConsume from '../components/charts/PresupuestoConsume';
import TotalConsumeHistory from '../components/charts/TotalConsumeHistory';
import TableRooms from '../components/charts/TableRooms';

export default function Home() {

  return (
    <>
      <div className="Content-home">
        <AsideContent />
        <div className='main-content'>
          
          <Header/>

          <span>Informe General</span>

          <div className='Content-cards'>

            <TotalConsume/>
            <PresupuestoConsume/>
            <TotalConsumeHistory/>
            <TableRooms/>
          </div>

          <footer>
            <span>Todos los derechos de autor reservados</span>
          </footer>

        </div>

      </div>

    </>
  )
}
