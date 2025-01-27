import { useState, useEffect } from "react";
import axios from "axios";
import { Habitacion } from "@/types/models";

const useRooms = () => {
  const [rooms, setRooms] = useState<Habitacion[]>([]);

  useEffect(() => {
    const handleRoom = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/habitacion/habitacion-data/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setRooms(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de la Habitacion", error);
      }
    };
    handleRoom();

    const intervalId = setInterval(handleRoom, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return {
    rooms,
  };
};

export default useRooms;
