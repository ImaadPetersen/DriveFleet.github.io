import { motion } from "framer-motion";
import {
  Car,
  DollarSign,
  Activity,
  Users
} from "lucide-react";

const stats = [
  {
    title: "Fleet Vehicles",
    value: "528",
    icon: Car
  },
  {
    title: "Revenue",
    value: "R14.2M",
    icon: DollarSign
  },
  {
    title: "Utilization",
    value: "92%",
    icon: Activity
  },
  {
    title: "Clients",
    value: "12 842",
    icon: Users
  }
];

export default function FleetStats() {
  return (
    <section className="grid md:grid-cols-4 gap-6 py-12">

      {stats.map((item) => {

        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            whileHover={{
              scale: 1.03
            }}
            className="
              bg-white/5
              backdrop-blur-lg
              border
              border-white/10
              rounded-2xl
              p-6
            "
          >
            <Icon className="text-cyan-400"/>

            <h3 className="text-white mt-4">
              {item.title}
            </h3>

            <p className="text-3xl font-bold text-white mt-2">
              {item.value}
            </p>

          </motion.div>
        );
      })}
    </section>
  );
}
