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


export default function TotalConsume() {
  const maxConsumption = 1000; 
  const [currentConsumption] = useState(600); 

  const chartData = [
    {
      name: "Consumo Actual",
      value: currentConsumption, 
      fill: "hsl(154, 47%, 52%)", 
    },
  ];

  console.log(chartData);

  return (
    <CardChart title="Consumo Total">
      <div className="card-hotel">
        <img
          src="/src/assets/Autoconsumo.gif"
          alt="Consumo Total"
          id="consumoGif"
        />

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
          <PolarAngleAxis type="number" domain={[0, maxConsumption]} angleAxisId={0} tick={false} />
          <PolarRadiusAxis
            tick={false}
            tickLine={false}
            axisLine={false}
             
          >
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
}
