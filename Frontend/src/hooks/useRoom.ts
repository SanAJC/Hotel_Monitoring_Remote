import { useWebSockets } from "@/context/RealTimeContex";

const useRoom = () => {
  // Use the global WebSocket context instead of creating new connections
  const { 
    dispositivos, 
    sendCommand
  } = useWebSockets();

  return { 
    dispositivos,  
    sendCommand
  };
};

export default useRoom;