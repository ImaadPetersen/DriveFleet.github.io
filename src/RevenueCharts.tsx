import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 1200000 },
  { month: "Feb", revenue: 1600000 },
  { month: "Mar", revenue: 2100000 },
  { month: "Apr", revenue: 2600000 },
  { month: "May", revenue: 3200000 },
  { month: "Jun", revenue: 4200000 }
];

export default function RevenueCharts() {
  return (
    <div
      className="
        bg-slate-900
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-white text-2xl font-bold mb-6">
        Revenue Analytics
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer>
          <LineChart data={revenueData}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              dataKey="revenue"
              stroke="#06B6D4"
              strokeWidth={4}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}
