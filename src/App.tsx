import React, { useState, useEffect } from 'react';
import { 
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X, 
  MapPin, CheckCircle2, Zap, Activity, DollarSign, TrendingUp, Search, 
  BatteryCharging, Clock, ChevronRight, SlidersHorizontal
} from 'lucide-react';

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
  status: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
  fuelPercent: number;
  speed: number;
  lat: number;
  lng: number;
  locationName: string;
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 149,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 98,
    speed: 0,
    lat: 37.7749,
    lng: -122.4194,
    locationName: 'Downtown Station A'
  },
  {
    id: 2,
    make: 'Porsche',
    model: 'Taycan Cross Turismo',
    year: 2024,
    category: 'Luxury',
    dailyRate: 289,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 88,
    speed: 0,
    lat: 37.7833,
    lng: -122.4167,
    locationName: 'Financial Hub'
  },
  {
    id: 3,
    make: 'Rivian',
    model: 'R1S Quad-Motor',
    year: 2024,
    category: 'SUV',
    dailyRate: 175,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 7,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 64,
    speed: 58,
    lat: 37.7690,
    lng: -122.4480,
    locationName: 'In Transit (Hwy 101)'
  },
  {
    id: 4,
    make: 'BMW',
    model: 'i7 M70 xDrive',
    year: 2024,
    category: 'Luxury',
    dailyRate: 230,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 100,
    speed: 0,
    lat: 37.7520,
    lng: -122.4180,
    locationName: 'North Bay Depot'
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'fleet' | 'map'>('fleet');
  
  // Active Selected Vehicle for Detail View / Map focus
  const [focusedVehicle, setFocusedVehicle] = useState<Vehicle>(initialVehicles[0]);

  // Modals state
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [rentalDays, setRentalDays] = useState(3);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 120,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    seats: 5,
    fuelType: 'Electric',
    locationName: 'Main Hub'
  });

  // Dynamic Telemetry Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'rented') {
          return {
            ...v,
            speed: Math.floor(40 + Math.random() * 35),
            fuelPercent: Math.max(10, v.fuelPercent - (Math.random() > 0.7 ? 1 : 0))
          };
        }
        return v;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', 'EV / Hybrid', 'Luxury', 'SUV', 'Sedan'];

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookVehicle = () => {
    if (!bookingVehicle) return;
    setVehicles(prev => prev.map(v => v.id === bookingVehicle.id ? { ...v, status: 'rented' } : v));
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingVehicle(null);
    }, 2200);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      id: Date.now(),
      make: newVehicle.make || 'Apex',
      model: newVehicle.model || 'GT',
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
      lat: 37.7749 + (Math.random() * 0.04 - 0.02),
      lng: -122.4194 + (Math.random() * 0.04 - 0.02),
      locationName: newVehicle.locationName
    };

    setVehicles([created, ...vehicles]);
    setIsAddVehicleOpen(false);
  };

  const totalRevenue = vehicles.filter(v => v.status === 'rented').reduce((acc, curr) => acc + (curr.dailyRate * 3), 4820);
  const availableCount = vehicles.filter(v => v.status === 'available').length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased relative overflow-x-hidden">
      
      {/* Glowing Ambient Backgrounds */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl text-white shadow-lg shadow-blue-500/25">
              <Car className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">DriveFleet</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">PRO v2.4</span>
              </div>
              <p className="text-xs text-slate-400">Autonomous & On-Demand Mobility</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center p-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl">
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'fleet' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" /> Fleet Catalog
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'map' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" /> Live Telemetry Map
            </button>
          </div>

          <button 
            onClick={() => setIsAddVehicleOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/25 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>

        </div>
      </header>

      {/* HERO / METRICS BANNER */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Available Fleet</p>
              <h3 className="text-2xl font-bold text-white mt-1">{availableCount} <span className="text-xs text-slate-500 font-normal">/ {vehicles.length} Units</span></h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Active Bookings</p>
              <h3 className="text-2xl font-bold text-white mt-1">{vehicles.length - availableCount} Vehicles</h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Estimated Revenue</p>
              <h3 className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Fleet Health</p>
              <h3 className="text-2xl font-bold text-white mt-1">99.4%</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Controls Bar: Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search make or model..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition"
            />
          </div>

        </div>

        {/* TAB 1: VEHICLE CATALOG GRID */}
        {activeTab === 'fleet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map(v => (
              <div 
                key={v.id} 
                className="group bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img 
                      src={v.imageUrl} 
                      alt={v.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                      v.status === 'available' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {v.status}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <h3 className="font-extrabold text-base tracking-tight leading-tight">{v.make} {v.model}</h3>
                        <p className="text-[11px] text-slate-300 font-medium">{v.year} • {v.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Specs & Status */}
                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="w-4 h-4 text-blue-400" />
                        <span>{v.fuelPercent}% Charge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>{v.seats} Seats</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 px-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{v.locationName}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/40 mt-auto">
                  <div className="pt-3">
                    <span className="text-2xl font-black text-white">${v.dailyRate}</span>
                    <span className="text-xs text-slate-400 font-medium"> / day</span>
                  </div>

                  <button 
                    disabled={v.status !== 'available'}
                    onClick={() => {
                      setBookingVehicle(v);
                      setRentalDays(3);
                    }}
                    className={`pt-3 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      v.status === 'available'
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {v.status === 'available' ? (
                      <>Book Now <ChevronRight className="w-3.5 h-3.5" /></>
                    ) : 'Rented'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* TAB 2: LIVE TELEMETRY MAP SIMULATION */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Map Visual Box */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry Feed
                </div>
                <span className="text-xs text-slate-400 font-mono">GPS Precision: 0.4m</span>
              </div>

              {/* Simulated Map UI Canvas */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Active Pins */}
              <div className="relative my-auto flex flex-wrap items-center justify-center gap-12 p-12">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setFocusedVehicle(v)}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                      focusedVehicle.id === v.id
                        ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-2xl shadow-blue-500/50'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Car className="w-6 h-6" />
                    {v.status === 'rented' && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full">
                        {v.speed} mph
                      </span>
                    )}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap group-hover:text-white">
                      {v.make} {v.model}
                    </span>
                  </button>
                ))}
              </div>

              <div className="z-10 bg-slate-950/80 backdrop-blur border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300">Selected Telemetry Focus</h4>
                  <p className="text-sm font-extrabold text-white mt-0.5">{focusedVehicle.make} {focusedVehicle.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-xs font-bold text-blue-400 uppercase">{focusedVehicle.status}</p>
                </div>
              </div>

            </div>

            {/* Vehicle Telemetry Detail Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" /> Vehicle Telemetry
                </h3>

                <img 
                  src={focusedVehicle.imageUrl} 
                  alt={focusedVehicle.model} 
                  className="w-full h-36 object-cover rounded-2xl mb-6 border border-slate-800"
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60 text-xs">
                    <span className="text-slate-400">Current Speed</span>
                    <span className="font-bold text-white font-mono">{focusedVehicle.speed} MPH</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60 text-xs">
                    <span className="text-slate-400">Battery Level</span>
                    <span className="font-bold text-emerald-400 font-mono">{focusedVehicle.fuelPercent}%</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60 text-xs">
                    <span className="text-slate-400">Location Hub</span>
                    <span className="font-bold text-white">{focusedVehicle.locationName}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60 text-xs">
                    <span className="text-slate-400">Hourly Rate</span>
                    <span className="font-bold text-blue-400">${(focusedVehicle.dailyRate / 24).toFixed(2)}/hr</span>
                  </div>
                </div>
              </div>

              <button 
                disabled={focusedVehicle.status !== 'available'}
                onClick={() => setBookingVehicle(focusedVehicle)}
                className={`w-full py-3 mt-6 rounded-xl text-xs font-bold transition-all ${
                  focusedVehicle.status === 'available'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {focusedVehicle.status === 'available' ? `Book ${focusedVehicle.make}` : 'Currently Rented'}
              </button>

            </div>

          </div>
        )}

      </main>

      {/* MODAL: INTERACTIVE BOOKING FLOW */}
      {bookingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setBookingVehicle(null)} 
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-10 h-10 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-white">DriveFleet Confirmed!</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Your smart key for the <strong className="text-white">{bookingVehicle.make} {bookingVehicle.model}</strong> has been issued to your device.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-extrabold text-white mb-1">Confirm Reservation</h2>
                <p className="text-xs text-slate-400 mb-6">{bookingVehicle.make} {bookingVehicle.model} ({bookingVehicle.year})</p>

                {/* Days Slider */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Duration</span>
                    <span className="text-blue-400">{rentalDays} Days</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="14" 
                    value={rentalDays} 
                    onChange={e => setRentalDays(Number(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-6 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>${bookingVehicle.dailyRate} × {rentalDays} Days</span>
                    <span className="text-white font-mono">${bookingVehicle.dailyRate * rentalDays}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Autonomous Insurance</span>
                    <span className="text-white font-mono">$25</span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 flex justify-between font-extrabold text-white text-sm">
                    <span>Total Amount</span>
                    <span className="text-blue-400 font-mono">${(bookingVehicle.dailyRate * rentalDays) + 25}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBookVehicle}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-blue-600/30 active:scale-98"
                >
                  Unlock & Rent Now
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: ADD VEHICLE */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsAddVehicleOpen(false)} 
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-1">Add Fleet Vehicle</h2>
            <p className="text-xs text-slate-400 mb-6">Instantly onboard a new autonomous vehicle.</p>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Make</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Lucid"
                    value={newVehicle.make} 
                    onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Model</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Air Sapphire"
                    value={newVehicle.model} 
                    onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select 
                    value={newVehicle.category} 
                    onChange={e => setNewVehicle({...newVehicle, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option>EV / Hybrid</option>
                    <option>Luxury</option>
                    <option>SUV</option>
                    <option>Sedan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold font-mono">Rate ($/day)</label>
                  <input 
                    type="number" 
                    required 
                    value={newVehicle.dailyRate} 
                    onChange={e => setNewVehicle({...newVehicle, dailyRate: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Image URL</label>
                <input 
                  type="text" 
                  value={newVehicle.imageUrl} 
                  onChange={e => setNewVehicle({...newVehicle, imageUrl: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-blue-600/30 active:scale-98"
              >
                Publish Vehicle to Fleet
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
