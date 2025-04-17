import { AppRoutes } from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  
  return (
    <>
      <AppRoutes/>
      <ToastContainer theme="colored"/>
    </>
  )
}

export default App
