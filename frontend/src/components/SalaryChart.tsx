import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface SalaryChartProps {
  data: ChartData[];
}

export function SalaryChart({ data }: SalaryChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (percent < 0.05 || !cx || !cy) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold drop-shadow-md"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: ChartData }>;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.payload.color }}
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {item.name}
            </span>
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-gray-100">
            {item.value.toLocaleString("fr-FR")} MGA
          </span>
          <span className="text-xs text-gray-500 ml-2 font-medium">
            ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Répartition Visuelle du Salaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                animationBegin={100}
                animationDuration={600}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
