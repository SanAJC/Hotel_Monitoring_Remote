import { useState, useEffect } from "react";
import { Habitacion } from "@/types/models";

const useRooms = () => {
  const [rooms, setRooms] = useState<Habitacion[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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

      newSocket.onopen = () => console.log("WebSocket conectado");

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Datos recibidos:", data);
      
        setRooms((prevRooms) => {
          
          const roomsMap = new Map(prevRooms.map((room) => [room.id, room]));
      
          
          data.forEach((habitacion:Habitacion) => {
            roomsMap.set(habitacion.id, habitacion);
          });
      
          
          const updatedRooms = Array.from(roomsMap.values());
          return updatedRooms;
        });
      };

      newSocket.onclose = () => {
        console.log("WebSocket desconectado. Reintentando conexión en 3 segundos...");
        setTimeout(connectWebSocket, 3000); 
      };

      newSocket.onerror = (error) => console.error("Error en el WebSocket:", error);

      setSocket(newSocket);
    };

    connectWebSocket();

    return () => socket?.close();
  }, []);

  return { rooms };
};


export default useRooms;
