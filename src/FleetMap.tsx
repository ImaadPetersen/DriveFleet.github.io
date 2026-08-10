import { useMemo } from "react";
import { Globe, Navigation } from "lucide-react";
import { vehicles } from "../data/vehicles";
import { useFleetStore } from "../store/fleetStore";

export default function FleetMap() {
  const selectedCountry = useFleetStore(
    (s) => s.selectedCountry
  );

  const filteredVehicles = useMemo(() => {
    if (selectedCountry === "All") {
      return vehicles;
    }

    return vehicles.filter(
      (v) => v.origin === selectedCountry
    );
  }, [selectedCountry]);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">

      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">
          <Globe className="text-cyan-400" />
          <h2 className="text-white text-2xl font-bold">
            Global Fleet Tracking
          </h2>
        </div>

      </div>

      <div
        className="
          relative
          h-[600px]
          rounded-2xl
          overflow-hidden
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-slate-950
        "
      >

        <img
          src="/world-map.svg"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {filteredVehicles.map((vehicle) => {

          const left =
            ((vehicle.longitude + 180) / 360) * 100;

          const top =
            ((90 - vehicle.latitude) / 180) * 100;

          return (
            <div
              key={vehicle.id}
              className="absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`
              }}
            >
              <div className="relative">

                <div
                  className="
                    w-4
                    h-4
                    rounded-full
                    bg-cyan-400
                    animate-ping
                    absolute
                  "
                />

                <div
                  className="
                    w-4
                    h-4
                    rounded-full
                    bg-cyan-400
                    relative
                  "
                />

              </div>

              <div
                className="
                  mt-2
                  bg-black/80
                  text-white
                  text-xs
                  rounded-lg
                  p-2
                  whitespace-nowrap
                "
              >
                {vehicle.make} {vehicle.model}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-6">

        <button className="bg-slate-800 py-3 rounded-xl text-white">
          All
        </button>

        <button className="bg-slate-800 py-3 rounded-xl text-white">
          Japan
        </button>

        <button className="bg-slate-800 py-3 rounded-xl text-white">
          Germany
        </button>

        <button className="bg-slate-800 py-3 rounded-xl text-white">
          USA
        </button>

      </div>
    </div>
  );
}
