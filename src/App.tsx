import React, { useState } from 'react';
import { Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X, MapPin, CheckCircle2 } from 'lucide-react';

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
  lat: number;
  lng: number;
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
    speed: 0,
    lat: 37.7749,
    lng: -122.4194
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
    speed: 0,
    lat: 37.7833,
    lng: -122.4167
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
    speed: 42,
    lat: 37.7690,
    lng: -122.4480
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
    speed: 0,
    lat: 37.7520,
    lng: -122.4180
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals state
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 100,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    seats: 5,
    fuelType: 'Electric'
  });

  const categories = ['All', 'EV / Hybrid', 'Luxury', 'SUV', 'Sedan'];

  const filteredVehicles = selectedCategory === 'All'
    ? vehicles
    : vehicles.filter(v => v.category === selectedCategory);

  const handleBookVehicle = () => {
    if (!bookingVehicle) return;
    setVehicles(prev => prev.map(v => v.id === bookingVehicle.id ? { ...v, status: 'rented' } : v));
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingVehicle(null);
    }, 2000);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      id: Date.now(),
      make: newVehicle.make || 'Custom',
      model: newVehicle.model || 'Vehicle',
      year: Number(newVehicle.year),
      category: newVehicle.category,
      dailyRate: Number(newVehicle.dailyRate),
      transmission: 'Automatic',
      fuelType: newVehicle.fuelType,
      seats: Number(newVehicle.seats),
      status: 'available',
      imageUrl: newVehicle.imageUrl,
      fuelPercent: 100,
      speed: 0,
      lat: 37.7749,
      lng: -122.4194
    };

    setVehicles([created, ...vehicles]);
    setIsAddVehicleOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              DriveFleet
            </h1>
            <p className="text-sm text-slate-400">On-Demand Mobility System</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddVehicleOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-8">
        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map(v => (
            <div key={v.id} className="bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="relative">
                  <img src={v.imageUrl} alt={v.model} className="w-full h-48 object-cover" />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                    v.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {v.status}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-white">{v.make} {v.model}</h3>
                    <p className="text-xs text-slate-400">{v.year} • {v.category}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 my-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-blue-400" />
                      <span>{v.fuelPercent}% {v.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>{v.seats} Seats</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-auto">
                <div className="mt-4">
                  <span className="text-2xl font-bold text-white">${v.dailyRate}</span>
                  <span className="text-xs text-slate-400"> / day</span>
                </div>
                <button 
                  disabled={v.status !== 'available'}
                  onClick={() => setBookingVehicle(v)}
                  className={`mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    v.status === 'available'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {v.status === 'available' ? 'Book Now' : 'Rented'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* BOOKING MODAL */}
      {bookingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setBookingVehicle(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-sm text-slate-400">Enjoy your drive in the {bookingVehicle.make} {bookingVehicle.model}.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Confirm Rental</h2>
                <p className="text-sm text-slate-400 mb-4">{bookingVehicle.make} {bookingVehicle.model} ({bookingVehicle.year})</p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Daily Rate</span>
                    <span className="text-white">${bookingVehicle.dailyRate}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Insurance & Fee</span>
                    <span className="text-white">$15</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-base">
                    <span>Total Due</span>
                    <span className="text-blue-400">${bookingVehicle.dailyRate + 15}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBookVehicle}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
                >
                  Confirm & Rent Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsAddVehicleOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">Add New Fleet Vehicle</h2>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 mb-1">Make</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Audi"
                  value={newVehicle.make} 
                  onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Model</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. e-tron GT"
                  value={newVehicle.model} 
                  onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select 
                    value={newVehicle.category} 
                    onChange={e => setNewVehicle({...newVehicle, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>EV / Hybrid</option>
                    <option>Luxury</option>
                    <option>SUV</option>
                    <option>Sedan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Daily Rate ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newVehicle.dailyRate} 
                    onChange={e => setNewVehicle({...newVehicle, dailyRate: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                Add to Fleet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
