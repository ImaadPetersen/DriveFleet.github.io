import { Heart } from "lucide-react";
import { Vehicle } from "../types";
import { useFleetStore } from "../store/fleetStore";

interface Props {
  vehicle: Vehicle;
}

export default function VehicleCard({
  vehicle
}: Props) {

  const addWishlist =
    useFleetStore(
      (s) => s.addWishlist
    );

  return (
    <div
      className="
        bg-slate-900
        rounded-2xl
        overflow-hidden
        border
        border-slate-800
      "
    >

      <img
        src={vehicle.image}
        alt={vehicle.model}
        className="
          w-full
          h-56
          object-cover
        "
      />

      <div className="p-5">

        <div className="flex justify-between">

          <h3 className="text-white text-xl font-bold">
            {vehicle.make}
          </h3>

          <button
            onClick={() =>
              addWishlist(vehicle.id)
            }
          >
            <Heart
              className="
                text-red-500
              "
            />
          </button>

        </div>

        <p className="text-gray-400">
          {vehicle.model}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">

          <div>
            <p className="text-gray-500">
              Horsepower
            </p>

            <p className="text-white">
              {vehicle.horsepower} HP
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Top Speed
            </p>

            <p className="text-white">
              {vehicle.topSpeed} km/h
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              0-100
            </p>

            <p className="text-white">
              {vehicle.zeroToHundred}s
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Daily Rate
            </p>

            <p className="text-cyan-400">
              R{vehicle.dailyRate}
            </p>
          </div>

        </div>

        <button
          className="
            mt-6
            w-full
            bg-cyan-500
            hover:bg-cyan-600
            rounded-xl
            py-3
            text-white
            font-semibold
          "
        >
          Book Vehicle
        </button>

      </div>
    </div>
  );
}
