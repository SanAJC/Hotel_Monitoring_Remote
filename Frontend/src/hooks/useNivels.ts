import { useWebSockets } from "@/context/RealTimeContex";
;
const useNivels = () => {
  // Use the global WebSocket context instead of creating a new connection
  const { niveles: nivel } = useWebSockets();

  return { nivel };
};

export default useNivels;