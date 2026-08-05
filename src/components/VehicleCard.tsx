import React from 'react';
import { Gauge, Users, Zap, Calendar } from 'lucide-react';
import { Vehicle } from '../App';

interface VehicleCardProps {
  vehicle: Vehicle;
  onBookSelect: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onBookSelect }: VehicleCardProps) {
  const isAvailable = vehicle.status === 'available';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAvailable
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {vehicle.status}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg">
              {vehicle.category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase">{vehicle.make}</p>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {vehicle.model} <span className="text-xs font-normal text-slate-400">'{vehicle.year}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-white">${vehicle.dailyRate}</span>
              <span className="text-xs text-slate-400 block">/day</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
              <span>{vehicle.transmission.slice(0, 4)}.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          disabled={!isAvailable}
          onClick={() => onBookSelect(vehicle)}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
            isAvailable
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{isAvailable ? 'Book This Vehicle' : 'Currently Rented'}</span>
        </button>
      </div>
    </div>
  );
}
