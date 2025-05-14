import { CardChart } from "../dashboard/CardChart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useRegistros from "@/hooks/useRegistros";

export default function TotalConsumeHistory() {
  const {registrosConsumoNivel} = useRegistros()

  // const chartData = [
  //   { month: "January", level1: 50, level2: 40, level3: 20, level4: 10 },
  //   { month: "February", level1: 45, level2: 30, level3: 25, level4: 15 },
  //   { month: "March", level1: 40, level2: 35, level3: 30, level4: 20 },
  //   { month: "April", level1: 20, level2: 30, level3: 15, level4: 10 },
  //   { month: "May", level1: 50, level2: 20, level3: 10, level4: 20 },
  //   { month: "June", level1: 35, level2: 55, level3: 35, level4: 25 },
  //   { month: "July", level1: 55, level2: 45, level3: 25, level4: 30 },
  //   { month: "August", level1: 20, level2: 50, level3: 20, level4: 35 },
  //   { month: "September", level1: 40, level2: 40, level3: 30, level4: 20 },
  //   { month: "October", level1: 35, level2: 35, level3: 25, level4: 15 },
  //   { month: "November", level1: 30, level2: 20, level3: 20, level4: 10 },
  //   { month: "December", level1: 25, level2: 35, level3: 15, level4: 5 },
  // ];

  const chartData = registrosConsumoNivel.map((registro) => ({
    month: registro.month,
    level1: registro.niveles['Nivel 1']?.total || 0,
    level2: registro.niveles['Nivel 2']?.total || 0,
    level3: registro.niveles['Nivel 3']?.total || 0,
    level4: registro.niveles['Nivel 4']?.total || 0
  }));

  const chartConfig = {
    level1: {
      label: "Nivel 1",
      color: "#4BBE8C",
    },
    level2: {
      label: "Nivel 2",
      color: "#FBCB50",
    },
    level3: {
      label: "Nivel 3",
      color: "#56CCF2",
    },
    level4: {
      label: "Nivel 4",
      color: "#EB5757",
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
            <linearGradient id="fillLevel1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4BBE8C" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4BBE8C" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillLevel2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBCB50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FBCB50" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillLevel3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#56CCF2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#56CCF2" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillLevel4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EB5757" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EB5757" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="level1"
            type="natural"
            fill="url(#fillLevel1)"
            fillOpacity={0.4}
            stroke="#4BBE8C"
          />
          <Area
            dataKey="level2"
            type="natural"
            fill="url(#fillLevel2)"
            fillOpacity={0.4}
            stroke="#FBCB50"
          />
          <Area
            dataKey="level3"
            type="natural"
            fill="url(#fillLevel3)"
            fillOpacity={0.4}
            stroke="#56CCF2"
          />
          <Area
            dataKey="level4"
            type="natural"
            fill="url(#fillLevel4)"
            fillOpacity={0.4}
            stroke="#EB5757"
          />
        </AreaChart>
      </ChartContainer>
    </CardChart>
  );
}
