import { useState, useEffect } from "react";
import { Habitacion } from "@/types/models";

const useRooms = () => {
  const [rooms, setRooms] = useState<Habitacion[]>([]);

  useEffect(() => {
    // Obtenemos el token del almacenamiento local
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No se encontró el token de acceso.");
      return;
    }
    const roomName = "habitaciones";
    const socket = new WebSocket(
      `ws://localhost:8000/ws/channel/${roomName}/?token=${accessToken}`
    );

    // Cuando el WebSocket se abre, enviamos un mensaje inicial si es necesario
    socket.onopen = () => {
      console.log("WebSocket conectado");
    };

    // Cuando el WebSocket recibe un mensaje, actualizamos el estado
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Datos recibidos:", data);

      // Actualiza las habitaciones en tiempo real
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.filter((room) => room.id !== data.id);
        return [...updatedRooms, data];
      });
    };

    // Si el WebSocket se cierra
    socket.onclose = () => {
      console.log("WebSocket desconectado");
    };

    // Si hay un error en el WebSocket
    socket.onerror = (error) => {
      console.error("Error en el WebSocket:", error);
    };

    // Limpia la conexión del WebSocket cuando se desmonta el componente
    return () => {
      socket.close();
    };
  }, []);

  return {
    rooms,
  };
};

export default useRooms;
