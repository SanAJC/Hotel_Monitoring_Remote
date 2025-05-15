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
import tvOff from "../../assets/tv-off.gif";
type DispositivoProps = {
  dispositivos: Dispositivo[];
}

export const TvChart = ({dispositivos}: DispositivoProps) => {

  const dispositivo = dispositivos.find(
    (d) => d.tipo === "TELEVISOR"
  );
  const maxConsumption = 200;
  const currentConsumption = dispositivo ? dispositivo.consumo_actual : 10;  

  const chartData = [
    {
      name: "Consumo Actual",
      value: currentConsumption,
      fill: "#8A6FC2",
    },
  ];

  const baseURL = import.meta.env.VITE_API_URL;
  let image_dispositivo: string;

  if (dispositivo && dispositivo.estado_remoto === "ENCENDER") {
    image_dispositivo = `${baseURL}${dispositivo.on_image}`;
  } else if (dispositivo && dispositivo.estado_remoto === "APAGAR") {
    image_dispositivo = `${baseURL}${dispositivo.off_image}`;
  } else {
    image_dispositivo = tvOff; 
  }

  let title :string;
  if(dispositivo && dispositivo.tipo === "TELEVISOR"){
    title = "Televisor";
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
                        Wh
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
