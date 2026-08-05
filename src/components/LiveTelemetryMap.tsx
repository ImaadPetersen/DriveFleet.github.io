import React from 'react';
import { Navigation, BatteryCharging, Gauge } from 'lucide-react';
import { Vehicle } from '../App';

interface LiveTelemetryMapProps {
  vehicles: Vehicle[];
}

export default function LiveTelemetryMap({ vehicles }: LiveTelemetryMapProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mock Map View */}
      <div className="lg:col-span-2 relative h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />
        
        {vehicles.map(v => (
          <div
            key={v.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{
              top: `${((v.lat - 37.74) / 0.06) * 100}%`,
              left: `${((v.lng + 122.46) / 0.06) * 100}%`
            }}
          >
            <div className="relative group cursor-pointer">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  v.status === 'rented'
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 animate-pulse'
                    : 'bg-emerald-500 text-slate-950'
                }`}
              >
                <Navigation className="w-4 h-4 transform rotate-45" />
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 border border-slate-700 text-xs text-slate-200 py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-30">
                <p className="font-bold">{v.make} {v.model}</p>
                <p className="text-[10px] text-cyan-400">
                  {v.status === 'rented' ? `${v.speed} mph` : 'Parked'}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-400 backdrop-blur-md">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-2" />
          Live Telematics Feed Active
        </div>
      </div>

      {/* Rented Vehicles Telemetry Feed */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Active Drive Telemetry
        </h4>
        {vehicles.filter(v => v.status === 'rented').length === 0 ? (
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
            No active drives at the moment.
          </div>
        ) : (
          vehicles.filter(v => v.status === 'rented').map(car => (
            <div
              key={car.id}
              className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex justify-between items-center"
            >
              <div>
                <h5 className="text-sm font-bold text-white">{car.make} {car.model}</h5>
                <p className="text-xs text-slate-400">GPS: {car.lat.toFixed(4)}, {car.lng.toFixed(4)}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="flex items-center text-xs text-cyan-400 font-bold">
                  <Gauge className="w-3.5 h-3.5 mr-1" /> {car.speed} mph
                </span>
                <span className="flex items-center text-[10px] text-slate-400">
                  <BatteryCharging className="w-3 h-3 mr-1 text-emerald-400" /> {car.fuelPercent}% Charge
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
