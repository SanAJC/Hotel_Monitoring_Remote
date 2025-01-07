import { AsideContent } from "../components/dashboard/AsideContent"
import '/src/styles/Rooms.css'
import Header from "../components/dashboard/Header"

export default function Rooms() {
  return (
    <>
        <div className="Content-rooms">
            <AsideContent/>
            <div className="main-content">

                <Header/>

            </div>
        </div>
    </>
  )
}
