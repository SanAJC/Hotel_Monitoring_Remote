import { useState, useEffect } from "react";
import { Nivel } from "@/types/models";

const useNivels = () => {
  const [nivel, setNivel] = useState<Nivel[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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

      newSocket.onopen = () => console.log("WebSocket conectado");

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Datos recibidos:", data);

        setNivel((prevNiveles) => {
          const nivelesMap = new Map(
            prevNiveles.map((nivel) => [nivel.id, nivel])
          );
          data.forEach((nivel: Nivel) => {
            nivelesMap.set(nivel.id, nivel);
          });
          const updatedNiveles = Array.from(nivelesMap.values());
          return updatedNiveles;
        });
      };

      newSocket.onclose = () => {
        console.log(
          "WebSocket desconectado. Reintentando conexión en 3 segundos..."
        );
        setTimeout(connectWebSocket, 3000);
      };

      newSocket.onerror = (error) =>
        console.error("Error en el WebSocket:", error);

      setSocket(newSocket);
    };

    connectWebSocket();

    return () => socket?.close();
  }, []);

  return { nivel };
};

export default useNivels;
