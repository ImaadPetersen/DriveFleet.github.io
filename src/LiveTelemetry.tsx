import {
  BatteryCharging,
  Gauge,
  MapPin
} from "lucide-react";

const telemetry = [
  {
    vehicle: "Porsche GT3 RS",
    speed: 242,
    battery: 89,
    location: "Munich"
  },
  {
    vehicle: "Nissan GT-R",
    speed: 181,
    battery: 72,
    location: "Tokyo"
  },
  {
    vehicle: "Tesla Plaid",
    speed: 202,
    battery: 94,
    location: "California"
  }
];

export default function LiveTelemetry() {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
      "
    >
      <h2 className="text-white text-2xl font-bold mb-6">
        Live Telemetry
      </h2>

      <div className="space-y-4">

        {telemetry.map((item) => (
          <div
            key={item.vehicle}
            className="
              bg-slate-800
              rounded-2xl
              p-4
            "
          >

            <h3 className="text-white font-bold">
              {item.vehicle}
            </h3>

            <div className="grid grid-cols-3 gap-4 mt-3">

              <div className="flex gap-2 items-center text-cyan-400">
                <Gauge size={18}/>
                {item.speed} km/h
              </div>

              <div className="flex gap-2 items-center text-green-400">
                <BatteryCharging size={18}/>
                {item.battery}%
              </div>

              <div className="flex gap-2 items-center text-white">
                <MapPin size={18}/>
                {item.location}
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
