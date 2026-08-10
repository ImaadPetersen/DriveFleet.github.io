import {
  Car,
  DollarSign,
  Activity,
  Wrench,
  Users,
  TrendingUp
} from "lucide-react";

const metrics = [
  {
    title: "Fleet Revenue",
    value: "R14.2M",
    icon: DollarSign
  },
  {
    title: "Active Vehicles",
    value: "528",
    icon: Car
  },
  {
    title: "Utilization",
    value: "92%",
    icon: Activity
  },
  {
    title: "Maintenance",
    value: "12",
    icon: Wrench
  },
  {
    title: "Clients",
    value: "12 842",
    icon: Users
  },
  {
    title: "Growth",
    value: "+28%",
    icon: TrendingUp
  }
];

export default function FleetCommandCenter() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {

        const Icon = metric.icon;

        return (
          <div
            key={metric.title}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-6
            "
          >
            <Icon
              size={32}
              className="text-cyan-400"
            />

            <h3 className="text-gray-400 mt-4">
              {metric.title}
            </h3>

            <p className="text-4xl font-bold text-white mt-2">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
