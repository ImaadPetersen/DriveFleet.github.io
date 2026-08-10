import { vehicles } from "../data/vehicles";

export default function VehicleComparison() {

  const compare = vehicles.slice(0, 3);

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
        Vehicle Comparison
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {compare.map((vehicle) => (
          <div
            key={vehicle.id}
            className="
              bg-slate-800
              rounded-2xl
              p-4
            "
          >
            <h3 className="text-white font-bold">
              {vehicle.make}
            </h3>

            <p className="text-gray-400">
              {vehicle.model}
            </p>

            <div className="space-y-2 mt-4">

              <p className="text-white">
                HP: {vehicle.horsepower}
              </p>

              <p className="text-white">
                Top Speed:
                {vehicle.topSpeed}
              </p>

              <p className="text-white">
                0-100:
                {vehicle.zeroToHundred}s
              </p>

              <p className="text-cyan-400">
                R{vehicle.dailyRate}/day
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
