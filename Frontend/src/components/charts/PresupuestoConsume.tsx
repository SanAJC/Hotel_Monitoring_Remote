import { CardChart } from "../dashboard/CardChart";
import useHotel from "@/hooks/useHotel";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";

export default function PresupuestoConsume() {
  const { hotel } = useHotel();
  const maxBudget = 10000000; 
  const Budget = hotel && hotel.length > 0 ? hotel[0].presupuesto : 1000000; 

  const chartData = [
    {
      name: "Presupuesto",
      value: Budget, 
      fill: "hsl(43, 96%, 65%)", 
    },
  ];

  return (
    <CardChart title="Presupuesto del Consumo">
      <div className="card-hotel">
        <img src="/src/assets/money.png" alt="" id="presupuesto" />
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={450}
          innerRadius={70}
          outerRadius={100}
          width={200}
          height={200}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="fill-background"
            polarRadius={[66, 44]}
          />
          <RadialBar
            dataKey="value"
            background={{ fill: "#27272A" }}
            cornerRadius={10}
            fill={chartData[0].fill}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, maxBudget]}
            angleAxisId={0}
            tick={false}
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
                        className="fill-foreground text-2xl font-bold"
                      >
                        {Budget.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        COP
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
