import { useWebSockets } from "@/context/RealTimeContex"

const useRegistros = () => {
  const { registrosConsumoWeekly, registrosConsumoMonthly, registrosConsumoNivel } = useWebSockets();

  return {
    registrosConsumoWeekly,
    registrosConsumoMonthly,
    registrosConsumoNivel
  }
}

export default useRegistros
