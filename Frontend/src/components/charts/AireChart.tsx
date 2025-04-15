import { CardChart } from "../dashboard/CardChart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";

import { Dispositivo } from "@/types/models";

type DispositivoProps = {
  dispositivos: Dispositivo[];
}

export const AireChart = ({dispositivos}: DispositivoProps) => {

  const dispositivo = dispositivos.find(
    (d) => d.tipo === "VENTILADOR" || d.tipo === "AIRE"
  );

  const maxConsumption = 1000; 
  const currentConsumption = dispositivo ? dispositivo.consumo_actual : 100;  

  const chartData = [
    {
      name: "Consumo Actual",
      value: currentConsumption, 
      fill: "#4A919D", 
    },
  ];

  const baseURL = "http://localhost:8000";
  let image_dispositivo: string;

  if (dispositivo && dispositivo.estado_remoto === "ENCENDER") {
    image_dispositivo = `${baseURL}${dispositivo.on_image}`;
  } else if (dispositivo && dispositivo.estado_remoto === "APAGAR") {
    image_dispositivo = `${baseURL}${dispositivo.off_image}`;
  } else {
    image_dispositivo = "/src/assets/ventilador-off.gif"; 
  }

  let title :string;
  if(dispositivo && dispositivo.tipo === "VENTILADOR"){
    title = "Ventilador";
  }else if( dispositivo && dispositivo.tipo === "AIRE"){
    title = "Aire";
  }else{
    title= "Dispositivo";
  }


  return (
    <CardChart title={title}>
      <div className="card-hotel-room">
        <img src={image_dispositivo} alt="Consumo Total" id="aire" />
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
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} >
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
