import { useWebSockets } from "@/context/RealTimeContex";

const useAlerts = () => {
  const { alertas } = useWebSockets();
  return { alertas };
}

export default useAlerts;
