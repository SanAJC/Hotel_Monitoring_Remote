import { useState, useEffect, useRef } from "react";
import { Habitacion } from "@/types/models";
const useRooms = () => {
  const [rooms, setRooms] = useState<Habitacion[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No se encontró el token de acceso.");
      return;
    }

    const connectWebSocket = () => {
      const newSocket = new WebSocket(
        `ws://localhost:8000/ws/habitaciones/?token=${accessToken}`
      );

      newSocket.onopen = () => console.log("WebSocket habitaciones conectado");

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Datos de habitaciones recibidos:", data);
      
        setRooms((prevRooms) => {
          const roomsMap = new Map(prevRooms.map((room) => [room.id, room]));
          
          if (Array.isArray(data)) {
            data.forEach((habitacion: Habitacion) => {
              roomsMap.set(habitacion.id, habitacion);
            });
          } else {
            console.error("El dato recibido no es un array:", data);
            
          }
          
          return Array.from(roomsMap.values())
            .sort((a, b) => a.numero - b.numero);
        });
      };

      newSocket.onclose = () => {
        console.log("WebSocket habitaciones desconectado. Reintentando conexión en 3 segundos...");
        setTimeout(connectWebSocket, 3000); 
      };

      newSocket.onerror = (error) => console.error("Error en el WebSocket de habitaciones:", error);

      socketRef.current = newSocket;
    };

    connectWebSocket();

    // Función de limpieza que cierra el socket cuando el componente se desmonta
    return () => {
      console.log("Desmontando componente - cerrando WebSocket de habitaciones");
      socketRef.current?.close();
    };
  }, []);

  return { rooms };
};

export default useRooms;