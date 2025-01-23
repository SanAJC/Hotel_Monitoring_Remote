import { CardChart } from "../dashboard/CardChart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Wind, Tv, Lightbulb } from "lucide-react";

export const ConsumeWeeklyChart = () => {
  const chartData = [
    { day: "Lunes", aire: 69, television: 40, "foco-1": 30, "foco-2": 15 },
    { day: "Martes", aire: 45, television: 25, "foco-1": 18, "foco-2": 10 },
    { day: "Miércoles", aire: 60, television: 35, "foco-1": 22, "foco-2": 12 },
    { day: "Jueves", aire: 55, television: 28, "foco-1": 19, "foco-2": 14 },
    { day: "Viernes", aire: 65, television: 40, "foco-1": 25, "foco-2": 18 },
    { day: "Sábado", aire: 70, television: 45, "foco-1": 30, "foco-2": 20 },
    { day: "Domingo", aire: 60, television: 50, "foco-1": 35, "foco-2": 25 },
  ];

  const chartConfig = {
    aire: {
      label: "Aire Acondicionado",
      icon: Wind,
      color: "#4A919D",
    },
    television: {
      label: "Televisión",
      icon: Tv,
      color: "#8A6FC2",
    },
    "foco-1": {
      label: "Foco 1",
      icon: Lightbulb,
      color: "#D1A03D",
    },
    "foco-2": {
      label: "Foco 2",
      icon: Lightbulb,
      color: "#C37B08",
    },
  } satisfies ChartConfig;
  return (
    <CardChart title="Consumo Semanal de la Habitacion">
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
          <Bar dataKey="aire" fill={chartConfig.aire.color} radius={4} barSize={20} />
          <Bar dataKey="television" fill={chartConfig.television.color} radius={4} barSize={20} />
          <Bar dataKey="foco-1" fill={chartConfig["foco-1"].color} radius={4} barSize={20} />
          <Bar dataKey="foco-2" fill={chartConfig["foco-2"].color} radius={4} barSize={20} />
        </BarChart>
      </ChartContainer>
    </CardChart>
  );
};
