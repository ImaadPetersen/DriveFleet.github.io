import React, { useState, useEffect } from 'react';
import { 
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X, 
  MapPin, CheckCircle2, Zap, Activity, DollarSign, Search, 
  BatteryCharging, Clock, ChevronRight, User, LogIn, LogOut, Star, 
  Award, HeartHandshake, HelpCircle, MessageSquare, Sparkles, Send,
  ShoppingCart, Trash2, CreditCard, ArrowLeft, Check, Lock, Gauge, UserPlus
} from 'lucide-react';

// Vehicle Data Model with Detailed Specs
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  dailyRate: number;
  purchasePrice: number;
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
  rating: number;
  // Enhanced Specs
  horsepower: number;
  zeroToSixty: string;
  topSpeed: string;
  rangeOrMpg: string;
}

// User Model
interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

// Review Model
interface Review {
  id: number;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

// Cart Item Model
interface CartItem {
  vehicle: Vehicle;
  type: 'rental' | 'purchase';
  rentalDays?: number;
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 149,
    purchasePrice: 89990,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 98,
    speed: 0,
    lat: 37.7749,
    lng: -122.4194,
    locationName: 'Downtown Station A',
    rating: 4.9,
    horsepower: 1020,
    zeroToSixty: '1.99s',
    topSpeed: '200 mph',
    rangeOrMpg: '359 miles range'
  },
  {
    id: 2,
    make: 'Porsche',
    model: 'Taycan Cross Turismo',
    year: 2024,
    category: 'Luxury',
    dailyRate: 289,
    purchasePrice: 111100,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 88,
    speed: 0,
    lat: 37.7833,
    lng: -122.4167,
    locationName: 'Financial Hub',
    rating: 5.0,
    horsepower: 750,
    zeroToSixty: '2.7s',
    topSpeed: '168 mph',
    rangeOrMpg: '235 miles range'
  },
  {
    id: 3,
    make: 'Rivian',
    model: 'R1S Quad-Motor',
    year: 2024,
    category: 'SUV',
    dailyRate: 175,
    purchasePrice: 92000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 7,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 64,
    speed: 58,
    lat: 37.7690,
    lng: -122.4480,
    locationName: 'In Transit (Hwy 101)',
    rating: 4.8,
    horsepower: 835,
    zeroToSixty: '3.0s',
    topSpeed: '125 mph',
    rangeOrMpg: '321 miles range'
  },
  {
    id: 4,
    make: 'BMW',
    model: 'i7 M70 xDrive',
    year: 2024,
    category: 'Luxury',
    dailyRate: 230,
    purchasePrice: 168500,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 100,
    speed: 0,
    lat: 37.7520,
    lng: -122.4180,
    locationName: 'North Bay Depot',
    rating: 4.9,
    horsepower: 650,
    zeroToSixty: '3.5s',
    topSpeed: '155 mph',
    rangeOrMpg: '295 miles range'
  },
  {
    id: 5,
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Sports',
    dailyRate: 450,
    purchasePrice: 241300,
    transmission: 'PDK Automatic',
    fuelType: 'Gasoline',
    seats: 2,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 92,
    speed: 0,
    lat: 37.7810,
    lng: -122.4110,
    locationName: 'Trackside Hub',
    rating: 5.0,
    horsepower: 518,
    zeroToSixty: '3.0s',
    topSpeed: '184 mph',
    rangeOrMpg: '15 MPG City / 18 Hwy'
  },
  {
    id: 6,
    make: 'Mercedes-AMG',
    model: 'GT 63 S E Performance',
    year: 2024,
    category: 'Luxury',
    dailyRate: 380,
    purchasePrice: 194900,
    transmission: '9-Speed Automatic',
    fuelType: 'Hybrid',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 95,
    speed: 0,
    lat: 37.7610,
    lng: -122.4210,
    locationName: 'Executive Suite Depot',
    rating: 4.9,
    horsepower: 831,
    zeroToSixty: '2.8s',
    topSpeed: '196 mph',
    rangeOrMpg: '21 MPG Combined'
  },
  {
    id: 7,
    make: 'Ford',
    model: 'Mustang Mach-E GT',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 115,
    purchasePrice: 53995,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 82,
    speed: 0,
    lat: 37.7650,
    lng: -122.4350,
    locationName: 'Central Depot',
    rating: 4.7,
    horsepower: 480,
    zeroToSixty: '3.5s',
    topSpeed: '124 mph',
    rangeOrMpg: '270 miles range'
  },
  {
    id: 8,
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 260,
    purchasePrice: 147100,
    transmission: '2-Speed Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 91,
    speed: 0,
    lat: 37.7720,
    lng: -122.4080,
    locationName: 'East Bay Hub',
    rating: 4.9,
    horsepower: 637,
    zeroToSixty: '3.1s',
    topSpeed: '155 mph',
    rangeOrMpg: '249 miles range'
  }
];

const initialReviews: Review[] = [
  {
    id: 1,
    author: 'Elena Rostova',
    role: 'Executive Member',
    rating: 5,
    comment: 'The Tesla S Plaid experience was seamlessly handled from pickup to auto-key deployment. DriveFleet is setting a brand new standard for luxury mobility.',
    date: 'Yesterday'
  },
  {
    id: 2,
    author: 'Marcus Vance',
    role: 'Verified Driver',
    rating: 5,
    comment: 'Extremely fluid app experience! Tracked the Rivian telemetry in real-time. Unlocking via phone worked instantly.',
    date: '3 days ago'
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'fleet' | 'map' | 'about' | 'reviews' | 'cart' | 'checkout'>('fleet');
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Focused Map Telemetry
  const [focusedVehicle, setFocusedVehicle] = useState<Vehicle>(initialVehicles[0]);

  // Modals & Details State
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [rentalDays, setRentalDays] = useState(3);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [testDriveDate, setTestDriveDate] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // New Review Form State
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'EV / Hybrid',
    dailyRate: 135,
    purchasePrice: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    seats: 5,
    fuelType: 'Electric',
    locationName: 'Central Depot',
    horsepower: 450,
    zeroToSixty: '3.8s',
    topSpeed: '150 mph',
    rangeOrMpg: '300 miles range'
  });

  // Dynamic Live Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'rented') {
          return {
            ...v,
            speed: Math.floor(45 + Math.random() * 30),
            fuelPercent: Math.max(5, v.fuelPercent - (Math.random() > 0.6 ? 1 : 0))
          };
        }
        return v;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', 'EV / Hybrid', 'Luxury', 'SUV', 'Sports', 'Sedan'];

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setCurrentUser({
      name: authName || authEmail.split('@')[0],
      email: authEmail,
      role: 'Fleet VIP Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });
    setIsAuthModalOpen(false);
    setAuthEmail('');
    setAuthName('');
    setAuthPassword('');
  };

  const handleAddToCart = (vehicle: Vehicle, type: 'rental' | 'purchase', days = 3) => {
    setCart(prev => {
      const exists = prev.find(item => item.vehicle.id === vehicle.id && item.type === type);
      if (exists) return prev;
      return [...prev, { vehicle, type, rentalDays: days }];
    });
    setBookingVehicle(null);
    setDetailVehicle(null);
  };

  const handleRemoveFromCart = (vehicleId: number) => {
    setCart(prev => prev.filter(item => item.vehicle.id !== vehicleId));
  };

  const handleBookVehicle = () => {
    if (!bookingVehicle) return;
    handleAddToCart(bookingVehicle, 'rental', rentalDays);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveTab('cart');
    }, 1000);
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      if (item.type === 'purchase') {
        return acc + item.vehicle.purchasePrice;
      }
      return acc + (item.vehicle.dailyRate * (item.rentalDays || 1));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const estimatedTax = subtotal * 0.08;
  const destinationFee = cart.length > 0 ? 495 : 0;
  const grandTotal = subtotal + estimatedTax + destinationFee;

  const handleFinalCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = 'FLT-' + Math.floor(100000 + Math.random() * 900000);
    setPlacedOrderId(generatedId);
    
    // Mark cars as rented if rented
    const cartVehicleIds = cart.map(c => c.vehicle.id);
    setVehicles(prev => prev.map(v => cartVehicleIds.includes(v.id) ? { ...v, status: 'rented' } : v));

    setCart([]);
    setOrderComplete(true);
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
      purchasePrice: Number(newVehicle.purchasePrice),
      transmission: 'Automatic',
      fuelType: newVehicle.fuelType,
      seats: Number(newVehicle.seats),
      status: 'available',
      imageUrl: newVehicle.imageUrl,
      fuelPercent: 100,
      speed: 0,
      lat: 37.7749 + (Math.random() * 0.04 - 0.02),
      lng: -122.4194 + (Math.random() * 0.04 - 0.02),
      locationName: newVehicle.locationName,
      rating: 5.0,
      horsepower: Number(newVehicle.horsepower),
      zeroToSixty: newVehicle.zeroToSixty,
      topSpeed: newVehicle.topSpeed,
      rangeOrMpg: newVehicle.rangeOrMpg
    };

    setVehicles([created, ...vehicles]);
    setIsAddVehicleOpen(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;
    const rev: Review = {
      id: Date.now(),
      author: currentUser ? currentUser.name : 'Guest User',
      role: currentUser ? currentUser.role : 'Verified Customer',
      rating: newRating,
      comment: newComment,
      date: 'Just now'
    };
    setReviews([rev, ...reviews]);
    setNewComment('');
  };

  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const totalRevenue = vehicles.filter(v => v.status === 'rented').reduce((acc, curr) => acc + (curr.dailyRate * 3), 5240);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased relative overflow-x-hidden">
      
      {/* Background Ambient Lights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('fleet')}>
            <div className="relative p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl text-white shadow-lg shadow-blue-500/25">
              <Car className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">DriveFleet</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">ENTERPRISE</span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Mobility & Dealership</p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="hidden lg:flex items-center p-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl">
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'fleet' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" /> Vehicle Catalog
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'map' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" /> Live Telemetry
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'about' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Tech & Platform
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Reviews
            </button>
          </div>

          {/* Right Action Buttons & Auth */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddVehicleOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl transition"
            >
              <Plus className="w-4 h-4 text-blue-400" /> Add Vehicle
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 transition"
            >
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#07090e]">
                  {cart.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800/80 p-1.5 pl-3 rounded-2xl">
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-blue-400 font-medium">{currentUser.role}</p>
                </div>
                <button 
                  onClick={() => setCurrentUser(null)} 
                  title="Logout"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition shadow-lg shadow-blue-600/25"
              >
                <LogIn className="w-4 h-4" /> Login / Sign Up
              </button>
            )}
          </div>

        </div>
      </header>

      {/* METRIC DASHBOARD BANNER */}
      {activeTab !== 'cart' && activeTab !== 'checkout' && (
        <section className="max-w-7xl mx-auto px-6 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Available Vehicles</p>
                <h3 className="text-2xl font-bold text-white mt-1">{availableCount} <span className="text-xs text-slate-500 font-normal">/ {vehicles.length} Active</span></h3>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Active Rentals</p>
                <h3 className="text-2xl font-bold text-white mt-1">{vehicles.length - availableCount} Vehicles</h3>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Uptime & Safety Rating</p>
                <h3 className="text-2xl font-bold text-white mt-1">99.9%</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* MAIN VIEW SYSTEM */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VIEW 1: VEHICLE CATALOG */}
        {activeTab === 'fleet' && (
          <div>
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
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

              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search make or model..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVehicles.map(v => (
                <div 
                  key={v.id} 
                  className="group bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setDetailVehicle(v)}>
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
                          <h3 className="font-extrabold text-base tracking-tight">{v.make} {v.model}</h3>
                          <p className="text-[11px] text-slate-300">{v.year} • {v.category}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                          <Star className="w-3 h-3 fill-amber-400" /> {v.rating}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      {/* Specs Badge Grid */}
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/50 text-center">
                        <div className="p-1 rounded-lg bg-slate-900/60">
                          <p className="text-slate-500 font-medium">Power</p>
                          <p className="font-bold text-blue-400">{v.horsepower} HP</p>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-900/60">
                          <p className="text-slate-500 font-medium">0-60 mph</p>
                          <p className="font-bold text-emerald-400">{v.zeroToSixty}</p>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-900/60">
                          <p className="text-slate-500 font-medium">Top Speed</p>
                          <p className="font-bold text-indigo-400">{v.topSpeed}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate max-w-[120px]">{v.locationName}</span>
                        </div>
                        <span className="text-slate-400 text-[11px] font-mono">{v.rangeOrMpg}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800/40 mt-auto space-y-3">
                    <div className="flex justify-between items-end pt-3">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Rental</p>
                        <span className="text-xl font-black text-white">${v.dailyRate}</span>
                        <span className="text-xs text-slate-400"> / day</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Buy MSRP</p>
                        <span className="text-sm font-extrabold text-blue-400">${v.purchasePrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        disabled={v.status !== 'available'}
                        onClick={() => {
                          setBookingVehicle(v);
                          setRentalDays(3);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          v.status === 'available'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Rent Vehicle
                      </button>
                      <button 
                        disabled={v.status !== 'available'}
                        onClick={() => handleAddToCart(v, 'purchase')}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                          v.status === 'available'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        Buy Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE TELEMETRY MAP */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry Feed
                </div>
                <span className="text-xs text-slate-400 font-mono">GPS Precision: 0.2m</span>
              </div>

              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

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
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                      {v.make} {v.model}
                    </span>
                  </button>
                ))}
              </div>

              <div className="z-10 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
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

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Horsepower</span>
                    <span className="font-bold text-white font-mono">{focusedVehicle.horsepower} HP</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">0-60 MPH Acceleration</span>
                    <span className="font-bold text-emerald-400 font-mono">{focusedVehicle.zeroToSixty}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Live Speed</span>
                    <span className="font-bold text-amber-400 font-mono">{focusedVehicle.speed} MPH</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Charge / Fuel</span>
                    <span className="font-bold text-emerald-400 font-mono">{focusedVehicle.fuelPercent}%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Station Hub</span>
                    <span className="font-bold text-white">{focusedVehicle.locationName}</span>
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

        {/* VIEW 3: ABOUT & INNOVATION */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-12 py-4">
            <div className="text-center space-y-4">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                Reinventing Mobility
              </span>
              <h2 className="text-4xl font-black text-white">The Future of Fleet & E-Commerce</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                DriveFleet connects premium vehicles with telemetry networks, offering digital purchases, contactless smart-key unlock, autonomous dispatching, and live inventory booking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
                <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl w-fit">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Instant Unlock</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No keycards or lines. Encrypted mobile keys deploy directly to your smartphone.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
                <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Autonomous Safety</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every vehicle is continuously evaluated by live telemetry monitoring speed, battery, and route health.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
                <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl w-fit">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Direct-to-Door Delivery</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Order online and receive direct enclosed flatbed delivery right to your home or office.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: REVIEWS & COMMUNITY */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white">Customer Reviews</h2>
                <p className="text-xs text-slate-400">Verified driver feedback across our global network.</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> 4.93 Overall Fleet Score
              </div>
            </div>

            {/* Post a Review */}
            <form onSubmit={handleAddReview} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white">Write a Review</h3>
              <textarea 
                rows={3}
                placeholder="Share your driving experience..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`p-1 ${star <= newRating ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/25"
                >
                  <Send className="w-3.5 h-3.5" /> Post Review
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                      <p className="text-[10px] text-blue-400">{rev.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: SHOPPING CART PAGE */}
        {activeTab === 'cart' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <ShoppingCart className="w-7 h-7 text-blue-500" /> Your Shopping Cart
                </h2>
                <p className="text-xs text-slate-400 mt-1">Review reserved vehicles, selected rentals, and direct purchases.</p>
              </div>
              <button 
                onClick={() => setActiveTab('fleet')}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Browsing
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Your Cart is Currently Empty</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our premium lineup of high-performance electric, luxury, and sport vehicles to make a reservation or purchase.
                </p>
                <button
                  onClick={() => setActiveTab('fleet')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5"
                    >
                      <img 
                        src={item.vehicle.imageUrl} 
                        alt={item.vehicle.model} 
                        className="w-full sm:w-36 h-24 object-cover rounded-xl border border-slate-800"
                      />
                      
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.type === 'purchase' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.type === 'purchase' ? 'Direct Vehicle Purchase' : `Rental Reservation (${item.rentalDays} Days)`}
                        </span>
                        <h4 className="text-base font-extrabold text-white">{item.vehicle.make} {item.vehicle.model}</h4>
                        <p className="text-xs text-slate-400">{item.vehicle.year} • {item.vehicle.horsepower} HP • {item.vehicle.locationName}</p>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <div>
                          <p className="text-xs text-slate-500">Price</p>
                          <p className="text-lg font-black text-white">
                            ${item.type === 'purchase' 
                              ? item.vehicle.purchasePrice.toLocaleString() 
                              : ((item.vehicle.dailyRate) * (item.rentalDays || 1)).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.vehicle.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Order Summary Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">
                  <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Order Summary</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Vehicle Subtotal</span>
                      <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Sales Tax / VAT (8%)</span>
                      <span className="font-mono text-white">${estimatedTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Destination & Handling Fee</span>
                      <span className="font-mono text-white">${destinationFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-3 flex justify-between text-sm font-black text-white">
                      <span>Estimated Total</span>
                      <span className="text-blue-400 font-mono">${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: MULTI-STEP CHECKOUT PAGE */}
        {activeTab === 'checkout' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <CreditCard className="w-7 h-7 text-emerald-400" /> Platform Checkout
                </h2>
                <p className="text-xs text-slate-400 mt-1">Complete delivery details, test drive scheduling, and secure payment.</p>
              </div>
              <button 
                onClick={() => setActiveTab('cart')}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </button>
            </div>

            {orderComplete ? (
              <div className="bg-slate-900/60 border border-emerald-500/30 rounded-3xl p-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">Order Confirmed!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your reservation reference is <span className="font-mono text-emerald-400 font-bold">{placedOrderId}</span>. Your vehicle dispatch agreement and mobile auto-key have been sent to your profile email.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setOrderComplete(false);
                      setActiveTab('fleet');
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
                  >
                    Return to Fleet Catalog
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Multi-step Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
                    <div className={`flex items-center gap-2 text-xs font-bold ${checkoutStep >= 1 ? 'text-blue-400' : 'text-slate-600'}`}>
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">1</span> Delivery
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                    <div className={`flex items-center gap-2 text-xs font-bold ${checkoutStep >= 2 ? 'text-blue-400' : 'text-slate-600'}`}>
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">2</span> Scheduling
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                    <div className={`flex items-center gap-2 text-xs font-bold ${checkoutStep >= 3 ? 'text-blue-400' : 'text-slate-600'}`}>
                      <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">3</span> Payment
                    </div>
                  </div>

                  <form onSubmit={handleFinalCheckout} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
                    {/* STEP 1: Delivery Option */}
                    {checkoutStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white">Select Fulfillment Option</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('delivery')}
                            className={`p-4 rounded-2xl border text-left transition ${
                              deliveryMethod === 'delivery'
                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <MapPin className="w-5 h-5 text-blue-400 mb-2" />
                            <p className="text-xs font-bold">Flatbed Home Delivery</p>
                            <p className="text-[10px] text-slate-400 mt-1">Direct enclosed carrier dispatch to your address.</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('pickup')}
                            className={`p-4 rounded-2xl border text-left transition ${
                              deliveryMethod === 'pickup'
                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <Car className="w-5 h-5 text-indigo-400 mb-2" />
                            <p className="text-xs font-bold">Dealership Pickup</p>
                            <p className="text-[10px] text-slate-400 mt-1">Pick up directly at our regional hub station.</p>
                          </button>
                        </div>

                        {deliveryMethod === 'delivery' && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Delivery Address</label>
                            <input
                              type="text"
                              required
                              placeholder="1234 Silicon Valley Blvd, San Francisco, CA"
                              value={deliveryAddress}
                              onChange={e => setDeliveryAddress(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setCheckoutStep(2)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                        >
                          Continue to Test Drive & Scheduling
                        </button>
                      </div>
                    )}

                    {/* STEP 2: Scheduling */}
                    {checkoutStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white">Test Drive & Delivery Schedule</h3>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">Preferred Date & Orientation Time</label>
                          <input
                            type="date"
                            required
                            value={testDriveDate}
                            onChange={e => setTestDriveDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(1)}
                            className="w-1/2 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(3)}
                            className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Payment */}
                    {checkoutStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-400" /> Secure Payment Details
                        </h3>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-400">Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="4532 •••• •••• 8892"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Expiry</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">CVC</label>
                            <input
                              type="text"
                              required
                              placeholder="123"
                              value={cardCvc}
                              onChange={e => setCardCvc(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(2)}
                            className="w-1/2 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
                          >
                            Complete Order (${grandTotal.toLocaleString()})
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Checkout Summary Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 h-fit">
                  <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Checkout Items</h3>
                  <div className="space-y-3">
                    {cart.map((c, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{c.vehicle.make} {c.vehicle.model}</p>
                          <p className="text-[10px] text-slate-400">{c.type === 'purchase' ? 'Purchase' : `${c.rentalDays} Days Rental`}</p>
                        </div>
                        <span className="font-mono text-slate-300">
                          ${c.type === 'purchase' ? c.vehicle.purchasePrice.toLocaleString() : (c.vehicle.dailyRate * (c.rentalDays || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 pt-3 flex justify-between text-xs font-extrabold text-white">
                    <span>Total Due</span>
                    <span className="text-blue-400 font-mono">${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL: AUTHENTICATION (SIGN IN / SIGN UP) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 relative space-y-6">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">
                {authMode === 'login' ? 'Welcome Back to DriveFleet' : 'Create DriveFleet Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login' ? 'Access your telemetry dashboard & active reservations.' : 'Register to unlock luxury rentals and direct car purchases.'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`w-1/2 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`w-1/2 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'signup' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Alex Morgan"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="alex@enterprise.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                {authMode === 'login' ? 'Sign In to Account' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VEHICLE SPECIFICATION DETAILS */}
      {detailVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden relative space-y-6">
            <button 
              onClick={() => setDetailVehicle(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/60 text-slate-400 hover:text-white rounded-xl backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 bg-slate-950">
              <img src={detailVehicle.imageUrl} alt={detailVehicle.model} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {detailVehicle.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{detailVehicle.make} {detailVehicle.model}</h3>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-6">
              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <Gauge className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">Horsepower</p>
                  <p className="text-xs font-black text-white">{detailVehicle.horsepower} HP</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">0-60 MPH</p>
                  <p className="text-xs font-black text-white">{detailVehicle.zeroToSixty}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <Activity className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">Top Speed</p>
                  <p className="text-xs font-black text-white">{detailVehicle.topSpeed}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <BatteryCharging className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">Range / Economy</p>
                  <p className="text-xs font-black text-white">{detailVehicle.rangeOrMpg}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <div>
                  <p className="text-xs text-slate-400">Rental Rate: <span className="text-white font-bold">${detailVehicle.dailyRate}/day</span></p>
                  <p className="text-xs text-slate-400">Purchase MSRP: <span className="text-blue-400 font-bold">${detailVehicle.purchasePrice.toLocaleString()}</span></p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setBookingVehicle(detailVehicle);
                      setDetailVehicle(null);
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    Reserve Rental
                  </button>
                  <button
                    onClick={() => handleAddToCart(detailVehicle, 'purchase')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BOOKING / RENTAL CONFIGURATION */}
      {bookingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 relative space-y-6">
            <button 
              onClick={() => setBookingVehicle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-bold uppercase">
                Configure Reservation
              </span>
              <h3 className="text-xl font-black text-white">{bookingVehicle.make} {bookingVehicle.model}</h3>
              <p className="text-xs text-slate-400">Location: {bookingVehicle.locationName}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 flex justify-between">
                  <span>Rental Duration</span>
                  <span className="text-blue-400 font-bold">{rentalDays} Days</span>
                </label>
                <input 
                  type="range" 
                  min={1} 
                  max={14} 
                  value={rentalDays}
                  onChange={e => setRentalDays(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-950"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Daily Rate</span>
                  <span className="font-mono text-white">${bookingVehicle.dailyRate}/day</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duration</span>
                  <span className="font-mono text-white">{rentalDays} Days</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span className="text-blue-400 font-mono">${(bookingVehicle.dailyRate * rentalDays).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleBookVehicle}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                Add Reservation to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD VEHICLE TO CATALOG */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAddVehicleOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white">Add New Vehicle to Inventory</h3>

            <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Make (e.g. Porsche)" 
                  required
                  value={newVehicle.make} 
                  onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="Model (e.g. Taycan)" 
                  required
                  value={newVehicle.model} 
                  onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="Daily Rate ($)" 
                  required
                  value={newVehicle.dailyRate} 
                  onChange={e => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="number" 
                  placeholder="MSRP Price ($)" 
                  required
                  value={newVehicle.purchasePrice} 
                  onChange={e => setNewVehicle({ ...newVehicle, purchasePrice: Number(e.target.value) })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="number" 
                  placeholder="HP" 
                  value={newVehicle.horsepower} 
                  onChange={e => setNewVehicle({ ...newVehicle, horsepower: Number(e.target.value) })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
                <input 
                  type="text" 
                  placeholder="0-60 time" 
                  value={newVehicle.zeroToSixty} 
                  onChange={e => setNewVehicle({ ...newVehicle, zeroToSixty: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
                <input 
                  type="text" 
                  placeholder="Top Speed" 
                  value={newVehicle.topSpeed} 
                  onChange={e => setNewVehicle({ ...newVehicle, topSpeed: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <input 
                type="text" 
                placeholder="Image URL" 
                value={newVehicle.imageUrl} 
                onChange={e => setNewVehicle({ ...newVehicle, imageUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
              />

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                Publish Vehicle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
