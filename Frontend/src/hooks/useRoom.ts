import { useWebSockets } from "@/context/RealTimeContex";

const useRoom = () => {
  // Use the global WebSocket context instead of creating new connections
  const { 
    dispositivos, 
    registrosConsumo, 
    sendCommand
  } = useWebSockets();

  return { 
    dispositivos, 
    registrosConsumo, 
    sendCommand
  };
};

export default useRoom;