import { CardChart } from "../dashboard/CardChart";
import { useState } from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";
export const F1Chart = () => {
  const maxConsumption = 1000;
  const [currentConsumption] = useState(140);

  const chartData = [
    {
      name: "Consumo Actual",
      value: currentConsumption,
      fill: "#D1A03D",
    },
  ];
  return (
    <CardChart title="Foco-Habitacion">
      <div className="card-hotel-room">
        <img src="/src/assets/bombilla-on.gif" alt="Consumo Total" id="aire" />
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={450}
          innerRadius={60}
          outerRadius={90}
          width={140}
          height={140}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="fill-background"
            polarRadius={[56, 34]}
          />
          <RadialBar
            dataKey="value"
            background={{ fill: "#27272A" }}
            cornerRadius={10}
            fill={chartData[0].fill}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, maxConsumption]}
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
                        {currentConsumption.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        kWh
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
};
