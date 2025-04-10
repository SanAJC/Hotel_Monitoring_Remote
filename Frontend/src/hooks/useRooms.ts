import { useWebSockets } from "@/context/RealTimeContex";

const useRooms = () => {
  // Use the global WebSocket context instead of creating a new connection
  const { rooms } = useWebSockets();

  return { rooms };
};

export default useRooms;