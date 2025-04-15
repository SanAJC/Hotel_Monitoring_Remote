import { useWebSockets } from "@/context/RealTimeContex";

const useHotel = () => {
  // Use the global WebSocket context instead of creating new connections
  const { 
    hotel, 
  } = useWebSockets();
  
  return { hotel };
}

export default useHotel
