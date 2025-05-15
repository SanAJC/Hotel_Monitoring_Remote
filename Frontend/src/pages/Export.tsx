import { AsideContent } from "../components/dashboard/AsideContent";
import "/src/styles/Export.css";
import Header from "../components/dashboard/Header";
import { useAuth } from "../context/AuthContext";
import exportImage from "../assets/export.png";

export default function Export() {
  const { accessToken } = useAuth();
 
  const handleDownload = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/reporte/file/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reporte_hotel_kamila.xlsx"; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error al descargar el informe:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      <div className="Content-export">
        <AsideContent />
        <div className="main-content">
          <Header />
          <div className="export-info">
            <span>Informe</span>

            <div className="info-informe">
              <div className="data-export">
                <p>
                  Nuestro sistema de monitoreo de consumo eléctrico ofrece la
                  posibilidad de generar informes completos en formato Excel con
                  todos los datos recolectados. Estos informes incluyen
                  información detallada sobre: Consumo de los equipos de cada
                  habitación del hotel, datos adicionales como registros de
                  apagados remotos, registros de presencias en las habitaciones
                  y registros de la temperatura y humedad de las habitaciones.
                </p>
                <br />
                <p>
                  Con esta funcionalidad, tendrás acceso a un reporte
                  estructurado y fácil de analizar, ideal para la toma de
                  decisiones estratégicas y la mejora de la eficiencia
                  operativa. ¡Transforma los datos en información valiosa con un
                  solo clic!
                </p>

                <button onClick={handleDownload}>
                  <div className="svg-wrapper-1">
                    <div className="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        className="icon"
                      >
                        <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                      </svg>
                    </div>
                  </div>
                  <span id="Descargar">Descargar</span>
                </button>
              </div>

              <div className="img">
                <img src={exportImage} alt="export" id="img-export" />
              </div>
            </div>
          </div>
        </div>
        <footer>
          <span>Todos los derechos de autor reservados</span>
        </footer>
      </div>
    </>
  );
}
