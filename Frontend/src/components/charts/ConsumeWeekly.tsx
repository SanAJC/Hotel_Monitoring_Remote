import { CardChart } from "../dashboard/CardChart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Wind, Tv, Lightbulb } from "lucide-react";
import useRegistros from "@/hooks/useRegistros";
import { Dispositivo } from "@/types/models";

type DispositivoProps = {
  dispositivos: Dispositivo[];
}

export const ConsumeWeeklyChart = ({dispositivos}: DispositivoProps) => {
  const {registrosConsumoWeekly} = useRegistros()
  const dispositivoClima = dispositivos.find(
    (d) => d.tipo === "VENTILADOR" || d.tipo === "AIRE"
  );

  const chartData = registrosConsumoWeekly.map((registro) => {
    const consumoClima = dispositivoClima?.tipo === "VENTILADOR" 
      ? registro.dispositivos.VENTILADOR.total 
      : registro.dispositivos.AIRE.total;

    return {
      day: registro.day,
      clima: consumoClima,
      television: registro.dispositivos.TELEVISOR.total,
      "foco-1": registro.dispositivos.FOCO_HABITACION.total,
      "foco-2": registro.dispositivos.FOCO_BAÑO.total,
    };
  });

  const chartConfig = {
    clima: {
      label: dispositivoClima?.tipo === "VENTILADOR" ? "Ventilador" : "Aire Acondicionado",
      icon: Wind,
      color: "#4A919D",
    },
    television: {
      label: "Televisión",
      icon: Tv,
      color: "#8A6FC2",
    },
    "foco-1": {
      label: "Foco habitacion",
      icon: Lightbulb,
      color: "#D1A03D",
    },
    "foco-2": {
      label: "Foco baño",
      icon: Lightbulb,
      color: "#C37B08",
    },
  } satisfies ChartConfig;

  return (
    <CardChart title="Consumo Semanal de la Habitacion (kWh)">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full" style={{ height: "190px" }}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="clima" fill={chartConfig.clima.color} radius={4} barSize={20} />
          <Bar dataKey="television" fill={chartConfig.television.color} radius={4} barSize={20} />
          <Bar dataKey="foco-1" fill={chartConfig["foco-1"].color} radius={4} barSize={20} />
          <Bar dataKey="foco-2" fill={chartConfig["foco-2"].color} radius={4} barSize={20} />
        </BarChart>
      </ChartContainer>
    </CardChart>
  );
};
