import { CardChart } from "../dashboard/CardChart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useRegistros from "@/hooks/useRegistros";
import { Dispositivo } from "@/types/models";

type DispositivoProps = {
  dispositivos: Dispositivo[];
}
export const ConsumeMothklyChart = ({dispositivos}: DispositivoProps) => {
  const {registrosConsumoMonthly} = useRegistros()
  const dispositivoClima = dispositivos.find(
    (d) => d.tipo === "VENTILADOR" || d.tipo === "AIRE"
  );

  const chartData = registrosConsumoMonthly.map((registro) => {
    const consumoClima = dispositivoClima?.tipo === "VENTILADOR" 
      ? registro.dispositivos.VENTILADOR.total 
      : registro.dispositivos.AIRE.total;

    return {
      month: registro.month,
      clima: consumoClima,
      television: registro.dispositivos.TELEVISOR.total,
      "foco-1": registro.dispositivos.FOCO_HABITACION.total,
      "foco-2": registro.dispositivos.FOCO_BAÑO.total,
    };
  });

  const chartConfig = {
    clima: {
      label: dispositivoClima?.tipo === "VENTILADOR" ? "Ventilador" : "Aire Acondicionado",
      color: "#4A919D",
    },
    television: {
      label: "Televisión",
      color: "#BC99F3",
    },
    foco1: {
      label: "Foco Habitacion",
      color: "#FCCB50",
    },
    foco2: {
      label: "Foco Baño",
      color: "#f59e0b",
    },
  } satisfies ChartConfig;
  return (
    <CardChart title="Consumo Mensual de la Habitacion (kWh)">
      <ChartContainer config={chartConfig} className="w-full h-64" style={{ height: "200px" }}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          width={500}
          height={250}
          margin={{
            left: 5,
            right: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
                   
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
          <linearGradient id="fillAire" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6CC9D4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6CC9D4" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTelevision" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#BC99F3" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#BC99F3" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillFoco1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FCCB50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FCCB50" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillFoco2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="clima"
            type="natural"
            fill="url(#fillAire)"
            stroke="#6CC9D4"
            
          />
          <Area
            dataKey="television"
            type="natural"
            fill="url(#fillTelevision)"
            stroke="#BC99F3"
            
          />
          <Area
            dataKey="foco1"
            type="natural"
            fill="url(#fillFoco1)"
            stroke="#FCCB50"
            
          />
          <Area
            dataKey="foco2"
            type="natural"
            fill="url(#fillFoco2)"
            stroke="#f59e0b"
            
          />
        </AreaChart>
      </ChartContainer>
    </CardChart>
  );
};
