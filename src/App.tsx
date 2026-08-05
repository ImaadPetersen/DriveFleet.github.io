import React, { useState } from 'react';
import { Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus } from 'lucide-react';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  dailyRate: number;
  transmission: string;
  fuelType: string;
  seats: number;
  status: string;
  imageUrl: string;
  fuelPercent: number;
  speed: number;
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 89,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 94,
    speed: 0
  },
  {
    id: 2,
    make: 'Porsche',
    model: '911 Carrera',
    year: 2023,
    category: 'Luxury',
    dailyRate: 249,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 88,
    speed: 0
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Bronco Wildtrak',
    year: 2023,
    category: 'SUV',
    dailyRate: 115,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    seats: 5,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 72,
    speed: 42
  },
  {
    id: 4,
    make: 'BMW',
    model: 'i4 M50',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 135,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 100,
    speed: 0
  }
];

export default function App() {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'EV / Hybrid', 'Luxury', 'SUV', 'Sedan'];

  const filteredVehicles = selectedCategory === 'All'
    ? vehicles
    : vehicles.filter(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              DriveFleet
            </h1>
            <p className="text-sm text-slate-400">On-Demand Mobility System</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-8">
        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-slate-400 mr-2" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map(v => (
            <div key={v.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition">
              <img src={v.imageUrl} alt={v.model} className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{v.make} {v.model}</h3>
                    <p className="text-xs text-slate-400">{v.year} • {v.category}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    v.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 my-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-blue-400" />
                    <span>{v.fuelPercent}% {v.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>{v.seats} Seats</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-2xl font-bold text-white">${v.dailyRate}</span>
                    <span className="text-xs text-slate-400"> / day</span>
                  </div>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
