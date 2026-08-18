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
    if (percent < 0.06 || !cx || !cy) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-mono font-bold"
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
        <div className="bg-[#FFFFFF] dark:bg-[#18202A] border border-[#E2DDD5] dark:border-[#24303E] rounded-md shadow-sm p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: item.payload.color }}
            />
            <span className="text-xs font-sans font-medium text-[#24221F] dark:text-[#EAE7E1]">
              {item.name}
            </span>
          </div>
          <div className="text-sm font-mono font-bold text-[#24221F] dark:text-[#EAE7E1]">
            {item.value.toLocaleString("fr-FR")} MGA
            <span className="text-xs text-[#666159] dark:text-[#9E9A90] font-normal ml-1.5">
              ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-[#E2DDD5] dark:border-[#24303E]">
      <CardHeader className="py-3 px-4 bg-[#FAF8F5] dark:bg-[#141C25]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#666159] dark:text-[#9E9A90]">
            Répartition Analytique des Masses
          </CardTitle>
          <span className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
            Total : {total.toLocaleString("fr-FR")} MGA
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-[220px] sm:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
                animationBegin={50}
                animationDuration={400}
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
                height={30}
                formatter={(value: string) => (
                  <span className="text-xs font-mono text-[#666159] dark:text-[#9E9A90]">
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

