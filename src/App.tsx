import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Car, ShieldCheck, MapPin, PlusCircle, Activity, Filter, Sparkles } from 'lucide-react';
import VehicleCard from './components/VehicleCard';
import BookingModal from './components/BookingModal';
import OwnerOnboardingModal from './components/OwnerOnboardingModal';
import LiveTelemetryMap from './components/LiveTelemetryMap';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  category: 'Sedan' | 'SUV' | 'EV / Hybrid' | 'Luxury' | 'Van';
  dailyRate: number;
  transmission: string;
  fuelType: string;
  seats: number;
  status: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
  lat: number;
  lng: number;
  fuelPercent: number;
  speed: number;
}

const socket = io('http://localhost:5000', { autoConnect: false });
export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error('Error fetching fleet:', err));

    socket.on('fleet:updated', (updatedFleet: Vehicle[]) => {
      setVehicles(updatedFleet);
    });

    socket.on('telemetry:stream', (rentedVehicles: Vehicle[]) => {
      setVehicles(prev =>
        prev.map(v => {
          const streamCar = rentedVehicles.find(rc => rc.id === v.id);
          return streamCar ? streamCar : v;
        })
      );
    });

    return () => {
      socket.off('fleet:updated');
      socket.off('telemetry:stream');
    };
  }, []);

  const categories = ['All', 'EV / Hybrid', 'Luxury', 'SUV', 'Sedan'];

  const filteredVehicles = selectedCategory === 'All'
    ? vehicles
    : vehicles.filter(v => v.category === selectedCategory);

  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const rentedCount = vehicles.filter(v => v.status === 'rented').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                DRIVE<span className="text-cyan-400">FLEET</span>
              </span>
              <p className="text-xs text-slate-400">On-Demand Mobility & Fleet System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 mr-4 text-xs font-semibold">
              <span className="flex items-center text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-800/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2" />
                {availableCount} Available Cars
              </span>
              <span className="flex items-center text-cyan-400 bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-800/40">
                <Activity className="w-3.5 h-3.5 mr-1.5" />
                {rentedCount} Active Telemetry Drives
              </span>
            </div>

            <button
              onClick={() => setIsOwnerModalOpen(true)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl transition text-sm"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>List Your Vehicle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Unlocking • Zero Paperwork • Live Telemetry</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
              Rent Premium Vehicles <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                On-Demand in Seconds.
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl leading-relaxed">
              Explore electric vehicles, sports cars, and rugged SUVs. Track your vehicle’s live battery status, GPS telemetry, and lock state right from your browser.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mr-2 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" /> Category:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-16">
        {/* Fleet Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Available Fleet</h2>
              <p className="text-slate-400 text-sm">Select a vehicle to view specifications and reserve instantly.</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Showing {filteredVehicles.length} vehicles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBookSelect={car => setSelectedVehicleForBooking(car)}
              />
            ))}
          </div>
        </section>

        {/* Live GPS Telemetry Dashboard */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="text-cyan-400 w-5 h-5" />
                Live Telematics & Fleet GPS Tracker
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time active vehicle locations and telemetry metrics streamed via WebSockets.
              </p>
            </div>
          </div>
          <LiveTelemetryMap vehicles={vehicles} />
        </section>
      </main>

      {/* Booking Modal */}
      {selectedVehicleForBooking && (
        <BookingModal
          vehicle={selectedVehicleForBooking}
          onClose={() => setSelectedVehicleForBooking(null)}
        />
      )}

      {/* Owner Onboarding Modal */}
      {isOwnerModalOpen && (
        <OwnerOnboardingModal onClose={() => setIsOwnerModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 DriveFleet Rental Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Insured Fleet
            </span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
