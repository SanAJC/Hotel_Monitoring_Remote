import { useState, useEffect, useRef } from "react";
import { Nivel } from "@/types/models";

const useNivels = () => {
  const [nivel, setNivel] = useState<Nivel[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No se encontró el token de acceso.");
      return;
    }

    const connectWebSocket = () => {
      const newSocket = new WebSocket(
        `ws://localhost:8000/ws/niveles/?token=${accessToken}`
      );

      newSocket.onopen = () => console.log("WebSocket niveles conectado");

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (!data || !data.forEach) {
          console.error("El payload recibido no es un array:", data);
          return;
        }
        setNivel((prevNiveles) => {
          const nivelesMap = new Map(
            prevNiveles.map((nivel) => [nivel.id, nivel])
          );
          data.forEach((nivel: Nivel) => {
            nivelesMap.set(nivel.id, nivel);
          });
          return Array.from(nivelesMap.values());
        });
      };

      newSocket.onclose = () => {
        console.log(
          "WebSocket niveles desconectado. Reintentando conexión en 3 segundos..."
        );
        setTimeout(connectWebSocket, 3000);
      };

      newSocket.onerror = (error) =>
        console.error("Error en el WebSocket de niveles:", error);

      socketRef.current = newSocket;
    };

    connectWebSocket();

    // Función de limpieza que cierra el socket cuando el componente se desmonta
    return () => {
      console.log("Desmontando componente - cerrando WebSocket de niveles");
      socketRef.current?.close();
    };
  }, []);

  return { nivel };
};

export default useNivels;