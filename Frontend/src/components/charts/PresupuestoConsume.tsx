import { CardChart } from "../dashboard/CardChart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig } from "@/components/ui/chart";

export default function PresupuestoConsume() {
  const chartData = [
    { browser: "safari", visitors: 500, fill: "var(--color-presupuesto)" },
  ];

  const chartConfig = {
    visitors: {
      label: "$ 0.00 COP",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <CardChart title="Presupuesto del Consumo">
      <div className="card-hotel">
        <img src="/src/assets/money.png" alt="" id="presupuesto" />
        <RadialBarChart
          data={chartData}
          startAngle={-90}
          endAngle={-360}
          innerRadius={70}
          outerRadius={100}
          width={200}
          height={200}
          cx="50%"
          cy="50%"
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="fill-background"
            polarRadius={[66, 44]}
          />
          <RadialBar
            dataKey="visitors"
            background
            cornerRadius={10}
            fill={chartConfig.safari.color}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {chartData[0].visitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {chartConfig.visitors.label}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </div>
    </CardChart>
  );
}
