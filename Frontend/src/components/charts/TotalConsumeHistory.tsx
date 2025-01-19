import { CardChart } from "../dashboard/CardChart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function TotalConsumeHistory() {
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305},
    { month: "March", desktop: 237},
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209},
    { month: "June", desktop: 214},
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <CardChart title="Consumo Total - Historico">
      <ChartContainer config={chartConfig} className="w-full h-64">
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
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-consumo)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-consumo)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="desktop"
            type="natural"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="var(--color-consumo)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </CardChart>
  );
}
