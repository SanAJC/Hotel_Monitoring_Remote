import { CardChart } from "../dashboard/CardChart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const ConsumeMothklyChart = () => {
  const chartData = [
    { month: "January", aire: 50, television: 20, foco1: 20, foco2: 10 },
    { month: "February", aire: 80, television: 30, foco1: 12, foco2: 4 },
    { month: "March", aire: 70, television: 45, foco1: 16, foco2: 12 },
    { month: "April", aire: 20, television: 34, foco1: 12, foco2: 8 },
    { month: "May", aire: 21, television: 30, foco1: 22, foco2: 7 },
    { month: "June", aire: 90, television: 40, foco1: 17, foco2: 12 },
    { month: "July", aire: 22, television: 20, foco1: 15, foco2: 5 },
    { month: "August", aire: 30, television: 35, foco1: 20, foco2: 6 },
    { month: "September", aire: 90, television: 40, foco1: 17, foco2: 11 },
    { month: "October", aire: 50, television: 30, foco1: 15, foco2: 5 },
    { month: "November", aire: 40, television: 30, foco1: 22, foco2: 4 },
    { month: "December", aire: 40, television: 35, foco1: 22, foco2: 2 },
  ];

  const chartConfig = {
    aire: {
      label: "Aire",
      color: "#6CC9D4",
    },
    television: {
      label: "Televisión",
      color: "#BC99F3",
    },
    foco1: {
      label: "Foco 1",
      color: "#FCCB50",
    },
    foco2: {
      label: "Foco 2",
      color: "#f59e0b",
    },
  } satisfies ChartConfig;
  return (
    <CardChart title="Consumo Mensual de la Habitacion">
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
            dataKey="aire"
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
