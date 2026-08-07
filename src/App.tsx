import React, { useState, useEffect } from 'react';
import { 
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X, 
  MapPin, CheckCircle2, Zap, Activity, DollarSign, Search, 
  BatteryCharging, Clock, ChevronRight, User, LogIn, LogOut, Star, 
  Award, HeartHandshake, HelpCircle, MessageSquare, Sparkles, Send,
  ShoppingCart, Trash2, CreditCard, ArrowLeft, Check, Lock, Gauge, UserPlus,
  Compass, Globe, Building2, Phone, ExternalLink, Info, CheckCircle
} from 'lucide-react';

// Cape Town Branch Model
interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

// Vehicle Data Model with Detailed Specs
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  origin: 'Japan' | 'Germany' | 'USA' | 'Other';
  dailyRate: number; // in ZAR (R)
  purchasePrice: number; // in ZAR (R)
  transmission: string;
  fuelType: string;
  seats: number;
  status: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
  fuelPercent: number;
  speed: number; // in km/h
  lat: number;
  lng: number;
  locationName: string;
  rating: number;
  horsepower: number;
  zeroToHundred: string; // 0-100 km/h
  topSpeed: string; // km/h
  rangeOrConsumption: string;
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

// Cape Town Physical Branches Data
const capeTownBranches: Branch[] = [
  {
    id: 'ct-1',
    name: 'V&A Waterfront Flagship Hub',
    area: 'V&A Waterfront',
    address: 'Breakwater Blvd, V&A Waterfront, Cape Town, 8001',
    phone: '+27 (0)21 400 1000',
    hours: 'Mon - Sun: 07:00 - 20:00',
    lat: -33.9056,
    lng: 18.4211
  },
  {
    id: 'ct-2',
    name: 'Cape Town Int. Airport Express',
    area: 'Airport / Matroosfontein',
    address: 'Matroosfontein, Cape Town International Airport, 7525',
    phone: '+27 (0)21 937 1200',
    hours: '24/7 Operations',
    lat: -33.9715,
    lng: 18.6021
  },
  {
    id: 'ct-3',
    name: 'Century City Executive Depot',
    area: 'Century City',
    address: 'Bridgeway Precinct, Century City, Cape Town, 7441',
    phone: '+27 (0)21 550 8800',
    hours: 'Mon - Sat: 08:00 - 18:00',
    lat: -33.8922,
    lng: 18.5085
  },
  {
    id: 'ct-4',
    name: 'Camps Bay Coastal Lounge',
    area: 'Camps Bay',
    address: 'Victoria Rd, Camps Bay, Cape Town, 8005',
    phone: '+27 (0)21 438 9000',
    hours: 'Mon - Sun: 08:00 - 19:00',
    lat: -33.9512,
    lng: 18.3780
  },
  {
    id: 'ct-5',
    name: 'Claremont Southern Suburbs Hub',
    area: 'Claremont',
    address: 'Main Rd, Cavendish Precinct, Claremont, 7708',
    phone: '+27 (0)21 671 3300',
    hours: 'Mon - Fri: 08:00 - 17:30',
    lat: -33.9818,
    lng: 18.4650
  }
];

// Initial Vehicles (Japan, German, USA, and International Brands)
const initialVehicles: Vehicle[] = [
  // --- JAPAN ---
  {
    id: 101,
    make: 'Nissan',
    model: 'GT-R Nismo',
    year: 2024,
    category: 'Sports',
    origin: 'Japan',
    dailyRate: 6500,
    purchasePrice: 4200000,
    transmission: '6-Speed Dual-Clutch',
    fuelType: 'Gasoline',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 95,
    speed: 0,
    lat: -33.9056,
    lng: 18.4211,
    locationName: 'V&A Waterfront Hub',
    rating: 5.0,
    horsepower: 600,
    zeroToHundred: '2.7s',
    topSpeed: '315 km/h',
    rangeOrConsumption: '12.8 L / 100 km'
  },
  {
    id: 102,
    make: 'Toyota',
    model: 'GR Supra 3.0',
    year: 2024,
    category: 'Sports',
    origin: 'Japan',
    dailyRate: 3200,
    purchasePrice: 1450000,
    transmission: '6-Speed Manual',
    fuelType: 'Gasoline',
    seats: 2,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 88,
    speed: 0,
    lat: -33.9512,
    lng: 18.3780,
    locationName: 'Camps Bay Lounge',
    rating: 4.8,
    horsepower: 382,
    zeroToHundred: '3.9s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '8.8 L / 100 km'
  },
  {
    id: 103,
    make: 'Honda',
    model: 'NSX Type S',
    year: 2023,
    category: 'EV / Hybrid',
    origin: 'Japan',
    dailyRate: 7800,
    purchasePrice: 3850000,
    transmission: '9-Speed Dual-Clutch',
    fuelType: 'Hybrid',
    seats: 2,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 72,
    speed: 85,
    lat: -33.9249,
    lng: 18.4241,
    locationName: 'In Transit (N2 Highway)',
    rating: 4.9,
    horsepower: 600,
    zeroToHundred: '2.9s',
    topSpeed: '307 km/h',
    rangeOrConsumption: '10.2 L / 100 km'
  },

  // --- GERMAN ---
  {
    id: 201,
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Sports',
    origin: 'Germany',
    dailyRate: 8500,
    purchasePrice: 4800000,
    transmission: 'PDK Automatic',
    fuelType: 'Gasoline',
    seats: 2,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 92,
    speed: 0,
    lat: -33.9056,
    lng: 18.4211,
    locationName: 'V&A Waterfront Hub',
    rating: 5.0,
    horsepower: 518,
    zeroToHundred: '3.2s',
    topSpeed: '296 km/h',
    rangeOrConsumption: '13.4 L / 100 km'
  },
  {
    id: 202,
    make: 'BMW',
    model: 'i7 M70 xDrive',
    year: 2024,
    category: 'Luxury',
    origin: 'Germany',
    dailyRate: 4500,
    purchasePrice: 3250000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 100,
    speed: 0,
    lat: -33.8922,
    lng: 18.5085,
    locationName: 'Century City Depot',
    rating: 4.9,
    horsepower: 650,
    zeroToHundred: '3.7s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '475 km range'
  },
  {
    id: 203,
    make: 'Mercedes-AMG',
    model: 'GT 63 S E Performance',
    year: 2024,
    category: 'Luxury',
    origin: 'Germany',
    dailyRate: 7200,
    purchasePrice: 3900000,
    transmission: '9-Speed Automatic',
    fuelType: 'Hybrid',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 95,
    speed: 0,
    lat: -33.9818,
    lng: 18.4650,
    locationName: 'Claremont Hub',
    rating: 4.9,
    horsepower: 831,
    zeroToHundred: '2.9s',
    topSpeed: '316 km/h',
    rangeOrConsumption: '7.9 L / 100 km'
  },
  {
    id: 204,
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'Germany',
    dailyRate: 5100,
    purchasePrice: 2900000,
    transmission: '2-Speed Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 91,
    speed: 0,
    lat: -33.9715,
    lng: 18.6021,
    locationName: 'Airport Express Depot',
    rating: 4.9,
    horsepower: 637,
    zeroToHundred: '3.3s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '400 km range'
  },

  // --- USA ---
  {
    id: 301,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 3800,
    purchasePrice: 2200000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 98,
    speed: 0,
    lat: -33.9056,
    lng: 18.4211,
    locationName: 'V&A Waterfront Hub',
    rating: 4.9,
    horsepower: 1020,
    zeroToHundred: '2.1s',
    topSpeed: '322 km/h',
    rangeOrConsumption: '578 km range'
  },
  {
    id: 302,
    make: 'Rivian',
    model: 'R1S Quad-Motor',
    year: 2024,
    category: 'SUV',
    origin: 'USA',
    dailyRate: 3500,
    purchasePrice: 1950000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 7,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 64,
    speed: 92,
    lat: -33.9350,
    lng: 18.4720,
    locationName: 'In Transit (M5 Highway)',
    rating: 4.8,
    horsepower: 835,
    zeroToHundred: '3.1s',
    topSpeed: '201 km/h',
    rangeOrConsumption: '516 km range'
  },
  {
    id: 303,
    make: 'Ford',
    model: 'Mustang Mach-E GT',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 2300,
    purchasePrice: 1250000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    fuelPercent: 82,
    speed: 0,
    lat: -33.8922,
    lng: 18.5085,
    locationName: 'Century City Depot',
    rating: 4.7,
    horsepower: 480,
    zeroToHundred: '3.7s',
    topSpeed: '200 km/h',
    rangeOrConsumption: '434 km range'
  }
];

const initialReviews: Review[] = [
  {
    id: 1,
    author: 'Elena Rostova',
    role: 'Executive Member',
    rating: 5,
    comment: 'The Nissan GT-R Nismo pickup from the V&A Waterfront branch was flawless. DriveFleet is setting a brand new standard for luxury mobility in Cape Town!',
    date: 'Yesterday'
  },
  {
    id: 2,
    author: 'Marcus Vance',
    role: 'Verified Driver',
    rating: 5,
    comment: 'Extremely fluid app experience! Tracked the Rivian telemetry in real-time while cruising up Signal Hill.',
    date: '3 days ago'
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'fleet' | 'map' | 'branches' | 'about' | 'reviews' | 'cart' | 'checkout'>('fleet');
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(capeTownBranches[0].id);
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
    origin: 'Japan' as 'Japan' | 'Germany' | 'USA' | 'Other',
    dailyRate: 2800,
    purchasePrice: 1100000,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    seats: 5,
    fuelType: 'Electric',
    locationName: 'V&A Waterfront Hub',
    horsepower: 450,
    zeroToHundred: '3.8s',
    topSpeed: '240 km/h',
    rangeOrConsumption: '450 km range'
  });

  // Dynamic Live Simulation for Vehicle Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'rented') {
          return {
            ...v,
            speed: Math.floor(60 + Math.random() * 40),
            fuelPercent: Math.max(5, v.fuelPercent - (Math.random() > 0.6 ? 1 : 0)),
            lat: v.lat + (Math.random() * 0.002 - 0.001),
            lng: v.lng + (Math.random() * 0.002 - 0.001)
          };
        }
        return v;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', 'EV / Hybrid', 'Luxury', 'SUV', 'Sports'];
  const origins = ['All', 'Japan', 'Germany', 'USA'];

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesOrigin = selectedOrigin === 'All' || v.origin === selectedOrigin;
    const matchesSearch = `${v.make} ${v.model} ${v.locationName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesOrigin && matchesSearch;
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setCurrentUser({
      name: authName || authEmail.split('@')[0],
      email: authEmail,
      role: 'Cape Town VIP Member',
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
  const estimatedVAT = subtotal * 0.15; // 15% South African VAT
  const deliveryFee = cart.length > 0 && deliveryMethod === 'delivery' ? 750 : 0;
  const grandTotal = subtotal + estimatedVAT + deliveryFee;

  const handleFinalCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = 'CPT-' + Math.floor(100000 + Math.random() * 900000);
    setPlacedOrderId(generatedId);
    
    const cartVehicleIds = cart.map(c => c.vehicle.id);
    setVehicles(prev => prev.map(v => cartVehicleIds.includes(v.id) ? { ...v, status: 'rented' } : v));

    setCart([]);
    setOrderComplete(true);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Vehicle = {
      id: Date.now(),
      make: newVehicle.make || 'Custom',
      model: newVehicle.model || 'Edition',
      year: Number(newVehicle.year),
      category: newVehicle.category,
      origin: newVehicle.origin,
      dailyRate: Number(newVehicle.dailyRate),
      purchasePrice: Number(newVehicle.purchasePrice),
      transmission: 'Automatic',
      fuelType: newVehicle.fuelType,
      seats: Number(newVehicle.seats),
      status: 'available',
      imageUrl: newVehicle.imageUrl,
      fuelPercent: 100,
      speed: 0,
      lat: -33.9056 + (Math.random() * 0.05 - 0.025),
      lng: 18.4211 + (Math.random() * 0.05 - 0.025),
      locationName: newVehicle.locationName,
      rating: 5.0,
      horsepower: Number(newVehicle.horsepower),
      zeroToHundred: newVehicle.zeroToHundred,
      topSpeed: newVehicle.topSpeed,
      rangeOrConsumption: newVehicle.rangeOrConsumption
    };

    setVehicles([created, ...vehicles]);
    setIsAddVehicleOpen(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;
    const rev: Review = {
      id: Date.now(),
      author: currentUser ? currentUser.name : 'Cape Town Guest',
      role: currentUser ? currentUser.role : 'Verified Customer',
      rating: newRating,
      comment: newComment,
      date: 'Just now'
    };
    setReviews([rev, ...reviews]);
    setNewComment('');
  };

  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const totalFleetValue = vehicles.reduce((acc, curr) => acc + curr.purchasePrice, 0);

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 selection:bg-cyan-500 selection:text-black font-sans antialiased relative overflow-x-hidden">
      
      {/* Background Ambient Lights */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#06080d]/85 backdrop-blur-2xl border-b border-cyan-950/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('fleet')}>
            <div className="relative p-2.5 bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 rounded-2xl text-slate-950 shadow-lg shadow-cyan-500/20">
              <Car className="w-6 h-6 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">DriveFleet</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.15)]">CAPE TOWN</span>
              </div>
              <p className="text-xs text-slate-400">Japan • Germany • USA Luxury Fleet</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center p-1 bg-slate-900/90 border border-cyan-950/80 rounded-2xl">
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'fleet' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" /> Global Catalog
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'map' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" /> Live Tracking Map
            </button>
            <button 
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'branches' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> Cape Town Branches
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'about' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Tech Specs
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reviews' ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Reviews
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddVehicleOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-950 text-xs font-bold text-slate-200 rounded-xl transition"
            >
              <Plus className="w-4 h-4 text-cyan-400" /> Add Vehicle
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-cyan-950 rounded-xl text-slate-200 transition"
            >
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#06080d]">
                  {cart.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-900/90 border border-cyan-950 p-1.5 pl-3 rounded-2xl">
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-cyan-400 font-medium">{currentUser.role}</p>
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
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 rounded-xl text-xs font-black text-slate-950 transition shadow-lg shadow-cyan-500/20"
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
            
            <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-950/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Available Vehicles</p>
                <h3 className="text-2xl font-bold text-white mt-1">{availableCount} <span className="text-xs text-slate-500 font-normal">/ {vehicles.length} Total</span></h3>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-950/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Cape Town Network</p>
                <h3 className="text-2xl font-bold text-white mt-1">5 Branches</h3>
              </div>
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-950/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Total Fleet Valuation</p>
                <h3 className="text-2xl font-bold text-white mt-1">R{(totalFleetValue / 1000000).toFixed(1)}M ZAR</h3>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-950/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Global Origins</p>
                <h3 className="text-2xl font-bold text-white mt-1">Japan • DE • USA</h3>
              </div>
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
                <Globe className="w-5 h-5" />
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
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
              
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-2">Category:</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-cyan-950'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Origin Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 border border-cyan-950 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase px-2">Origin:</span>
                  {origins.map(orig => (
                    <button
                      key={orig}
                      onClick={() => setSelectedOrigin(orig)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedOrigin === orig ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {orig}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Search make, model, or location..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/80 border border-cyan-950 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredVehicles.map(v => (
                <div 
                  key={v.id} 
                  className="group bg-slate-900/50 backdrop-blur-xl border border-cyan-950 hover:border-cyan-500/50 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setDetailVehicle(v)}>
                      <img 
                        src={v.imageUrl} 
                        alt={v.model} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                          {v.origin}
                        </span>
                      </div>

                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                        v.status === 'available' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {v.status}
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <div>
                          <h3 className="font-extrabold text-lg tracking-tight">{v.make} {v.model}</h3>
                          <p className="text-[11px] text-slate-300">{v.year} • {v.category}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{v.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 border-y border-cyan-950/60 bg-slate-950/40 text-center py-2.5 px-2 text-[11px] text-slate-400">
                      <div className="flex flex-col items-center gap-1 border-r border-cyan-950/60">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{v.horsepower} HP</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-r border-cyan-950/60">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{v.zeroToHundred}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate max-w-[80px]">{v.rangeOrConsumption}</span>
                      </div>
                    </div>

                    {/* Location Badge */}
                    <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-400 border-b border-cyan-950/40">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{v.locationName}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">{v.fuelType}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 flex items-center justify-between gap-3 bg-slate-900/30">
                    <div>
                      <span className="text-xs text-slate-400 block">Daily Rate</span>
                      <span className="text-lg font-black text-white">R{v.dailyRate.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/day</span></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setDetailVehicle(v)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
                      >
                        Specs
                      </button>
                      <button 
                        onClick={() => setBookingVehicle(v)}
                        disabled={v.status !== 'available'}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                          v.status === 'available'
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Book
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
            
            {/* Map Visual Container */}
            <div className="lg:col-span-2 bg-slate-900/50 border border-cyan-950 rounded-3xl p-6 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" /> Live Fleet Radar
                  </h2>
                  <p className="text-xs text-slate-400">Real-time GPS telemetry across Greater Cape Town</p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-mono font-bold">
                  2.5s Latency • Live
                </span>
              </div>

              {/* Simulated Map Graphical Representation */}
              <div className="relative z-10 my-8 p-8 border border-cyan-950 bg-slate-950/60 rounded-2xl min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-500/40 mx-auto flex items-center justify-center animate-spin-slow mb-4">
                    <Compass className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{focusedVehicle.make} {focusedVehicle.model}</h3>
                  <p className="text-xs text-cyan-400 mt-1">{focusedVehicle.locationName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">GPS: {focusedVehicle.lat.toFixed(4)}° S, {focusedVehicle.lng.toFixed(4)}° E</p>
                </div>
              </div>

              {/* Live Telemetry Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-xl border border-cyan-950/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Speed</span>
                  <span className="text-lg font-mono font-bold text-cyan-400">{focusedVehicle.speed} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fuel/Battery</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">{focusedVehicle.fuelPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                  <span className="text-lg font-mono font-bold text-amber-400 capitalize">{focusedVehicle.status}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Selection List for Map */}
            <div className="bg-slate-900/50 border border-cyan-950 rounded-3xl p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white">Tracked Vehicles</h3>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-2">
                {vehicles.map(v => (
                  <div 
                    key={v.id}
                    onClick={() => setFocusedVehicle(v)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-4 ${
                      focusedVehicle.id === v.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                        : 'bg-slate-950/40 border-cyan-950/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img src={v.imageUrl} alt={v.model} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-white">{v.make} {v.model}</h4>
                      <p className="text-xs text-slate-400 truncate">{v.locationName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          v.status === 'rented' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {v.status === 'rented' ? `${v.speed} km/h` : 'Stationary'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: CAPE TOWN BRANCHES */}
        {activeTab === 'branches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capeTownBranches.map(branch => (
              <div key={branch.id} className="bg-slate-900/50 border border-cyan-950 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition">
                <div>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl w-fit mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                  <p className="text-xs text-cyan-400 font-semibold mt-1">{branch.area}</p>
                  
                  <div className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedBranch(branch.id);
                    setActiveTab('fleet');
                  }}
                  className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  View Vehicles Here <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 4: TECH SPECS & ABOUT */}
        {activeTab === 'about' && (
          <div className="bg-slate-900/50 border border-cyan-950 rounded-3xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" /> Platform Architecture & Specs
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              DriveFleet Cape Town operates a real-time high-performance fleet management and luxury booking system tailored for South Africa&apos;s premier coastal destination.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 bg-slate-950/60 border border-cyan-950 rounded-2xl">
                <h4 className="font-bold text-cyan-400 text-sm mb-1">Real-time Telemetry</h4>
                <p className="text-xs text-slate-400">Continuous 2.5s polling interval simulating GPS, speed, and energy capacity for active vehicles.</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-cyan-950 rounded-2xl">
                <h4 className="font-bold text-cyan-400 text-sm mb-1">Dual Transaction System</h4>
                <p className="text-xs text-slate-400">Integrated cart supporting daily luxury rentals or outright vehicle acquisition with ZAR pricing and local VAT calculations.</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            {/* Add Review Box */}
            <form onSubmit={handleAddReview} className="bg-slate-900/50 border border-cyan-950 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Leave a Review</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your DriveFleet Cape Town experience..."
                className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 mb-4 h-24"
              />
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs transition">
                Submit Review
              </button>
            </form>

            {/* Review List */}
            <div className="flex flex-col gap-4">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-slate-900/40 border border-cyan-950 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                      <span className="text-[10px] text-cyan-400 font-medium">{rev.role}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-500 mt-3 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: CART */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-cyan-400" /> Your Booking Cart
            </h2>

            {cart.length === 0 ? (
              <div className="bg-slate-900/40 border border-cyan-950 rounded-3xl p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mb-6">Explore our global fleet catalog to select a vehicle.</p>
                <button 
                  onClick={() => setActiveTab('fleet')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={item.vehicle.id} className="bg-slate-900/50 border border-cyan-950 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <img src={item.vehicle.imageUrl} alt={item.vehicle.model} className="w-20 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{item.vehicle.make} {item.vehicle.model}</h4>
                        <p className="text-xs text-cyan-400 capitalize">{item.type} {item.type === 'rental' ? `(${item.rentalDays} days)` : ''}</p>
                        <span className="text-xs font-mono text-slate-300 mt-1 block">
                          R{(item.type === 'purchase' ? item.vehicle.purchasePrice : item.vehicle.dailyRate * (item.rentalDays || 1)).toLocaleString()}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(item.vehicle.id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary Box */}
                <div className="bg-slate-900/50 border border-cyan-950 rounded-2xl p-6 h-fit flex flex-col gap-4">
                  <h3 className="font-bold text-white text-base border-b border-cyan-950 pb-3">Order Summary</h3>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono">R{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Est. VAT (15%)</span>
                    <span className="text-white font-mono">R{estimatedVAT.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-cyan-950 pt-3 flex justify-between font-bold text-white text-sm">
                    <span>Grand Total</span>
                    <span className="text-cyan-400 font-mono">R{grandTotal.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs mt-2"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 7: CHECKOUT */}
        {activeTab === 'checkout' && (
          <div className="max-w-2xl mx-auto bg-slate-900/50 border border-cyan-950 rounded-3xl p-8">
            {orderComplete ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
                <p className="text-xs text-slate-400 mb-2">Order Reference ID:</p>
                <span className="px-4 py-2 bg-slate-950 border border-cyan-950 font-mono text-cyan-400 text-sm font-bold rounded-xl inline-block mb-6">
                  {placedOrderId}
                </span>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-8">
                  Your reservation request has been processed. A DriveFleet Cape Town representative will contact you shortly regarding delivery or pickup details.
                </p>
                <button 
                  onClick={() => {
                    setOrderComplete(false);
                    setActiveTab('fleet');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Return to Fleet
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalCheckout} className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white border-b border-cyan-950 pb-4">Checkout & Reserve</h2>
                
                {/* Delivery Option */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Fulfillment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        deliveryMethod === 'delivery' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-cyan-950 text-slate-400'
                      }`}
                    >
                      Doorstep Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        deliveryMethod === 'pickup' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-cyan-950 text-slate-400'
                      }`}
                    >
                      Branch Pickup
                    </button>
                  </div>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Delivery Address (Cape Town Area)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., 12 Camps Bay Drive, Camps Bay, Cape Town"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Select Pickup Branch</label>
                    <select 
                      value={selectedBranch}
                      onChange={e => setSelectedBranch(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {capeTownBranches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.area})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Fields */}
                <div className="border-t border-cyan-950 pt-4 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" /> Secure Payment Information
                  </h3>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Card Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="4000 0000 0000 0000"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">CVC</label>
                      <input 
                        type="text" 
                        required
                        placeholder="123"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs mt-4 shadow-lg shadow-cyan-500/20"
                >
                  Complete Reservation (R{grandTotal.toLocaleString()})
                </button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* MODAL 1: AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-950 rounded-3xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">DriveFleet VIP Access</h3>
            <p className="text-xs text-slate-400 mb-6">Sign in or register for express luxury rentals in Cape Town.</p>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah Jenkins"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="sarah@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-950 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs mt-2"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOKING MODAL */}
      {bookingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-950 rounded-3xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setBookingVehicle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Configure Rental</h3>
            <p className="text-xs text-cyan-400 mb-4">{bookingVehicle.make} {bookingVehicle.model}</p>

            <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-cyan-950/60 mb-6">
              <img src={bookingVehicle.imageUrl} alt={bookingVehicle.model} className="w-16 h-12 rounded-xl object-cover" />
              <div>
                <span className="text-xs font-bold text-white block">Daily Rate</span>
                <span className="text-sm font-mono text-cyan-400 font-bold">R{bookingVehicle.dailyRate.toLocaleString()} / day</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs text-slate-400 block mb-2">Duration (Days)</label>
              <div className="flex items-center justify-between bg-slate-950 border border-cyan-950 rounded-xl p-2">
                <button 
                  onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                  className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                >
                  -
                </button>
                <span className="font-mono font-bold text-white text-sm">{rentalDays} Days</span>
                <button 
                  onClick={() => setRentalDays(rentalDays + 1)}
                  className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-cyan-950 pt-4 mb-6 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Price</span>
              <span className="text-lg font-mono font-bold text-white">R{(bookingVehicle.dailyRate * rentalDays).toLocaleString()}</span>
            </div>

            <button 
              onClick={handleBookVehicle}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Add Rental to Cart
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: DETAIL / SPECS MODAL */}
      {detailVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-950 rounded-3xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setDetailVehicle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4">
              <img src={detailVehicle.imageUrl} alt={detailVehicle.model} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white">{detailVehicle.make} {detailVehicle.model}</h3>
            <p className="text-xs text-cyan-400 mb-6">{detailVehicle.year} • {detailVehicle.origin} Origin • {detailVehicle.category}</p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 bg-slate-950 border border-cyan-950 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Horsepower</span>
                <span className="font-bold text-white">{detailVehicle.horsepower} HP</span>
              </div>
              <div className="p-3 bg-slate-950 border border-cyan-950 rounded-xl">
                <span className="text-slate-500 block text-[10px]">0-100 km/h</span>
                <span className="font-bold text-white">{detailVehicle.zeroToHundred}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-cyan-950 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Top Speed</span>
                <span className="font-bold text-white">{detailVehicle.topSpeed}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-cyan-950 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Efficiency / Range</span>
                <span className="font-bold text-white">{detailVehicle.rangeOrConsumption}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleAddToCart(detailVehicle, 'rental', 3)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
              >
                Rent (R{detailVehicle.dailyRate}/day)
              </button>
              <button 
                onClick={() => handleAddToCart(detailVehicle, 'purchase')}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Buy (R{(detailVehicle.purchasePrice / 1000000).toFixed(2)}M)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD VEHICLE MODAL */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-950 rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAddVehicleOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Vehicle to Fleet</h3>

            <form onSubmit={handleAddVehicle} className="flex flex-col gap-3 text-xs">
              <input 
                type="text" 
                placeholder="Make (e.g. Porsche)"
                required
                value={newVehicle.make}
                onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="bg-slate-950 border border-cyan-950 rounded-xl p-3 text-white placeholder-slate-600"
              />
              <input 
                type="text" 
                placeholder="Model (e.g. Taycan Turbo S)"
                required
                value={newVehicle.model}
                onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="bg-slate-950 border border-cyan-950 rounded-xl p-3 text-white placeholder-slate-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder="Daily Rate (ZAR)"
                  required
                  value={newVehicle.dailyRate}
                  onChange={e => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                  className="bg-slate-950 border border-cyan-950 rounded-xl p-3 text-white placeholder-slate-600"
                />
                <input 
                  type="number" 
                  placeholder="Purchase Price (ZAR)"
                  required
                  value={newVehicle.purchasePrice}
                  onChange={e => setNewVehicle({ ...newVehicle, purchasePrice: Number(e.target.value) })}
                  className="bg-slate-950 border border-cyan-950 rounded-xl p-3 text-white placeholder-slate-600"
                />
              </div>
              <input 
                type="text" 
                placeholder="Image URL"
                value={newVehicle.imageUrl}
                onChange={e => setNewVehicle({ ...newVehicle, imageUrl: e.target.value })}
                className="bg-slate-950 border border-cyan-950 rounded-xl p-3 text-white placeholder-slate-600"
              />
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl mt-2"
              >
                Add Vehicle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
