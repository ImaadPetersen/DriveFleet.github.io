import React, { useState, useEffect } from 'react';
import { 
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X, 
  MapPin, CheckCircle2, Zap, Activity, DollarSign, Search, 
  BatteryCharging, Clock, ChevronRight, User, LogIn, LogOut, Star, 
  Award, HeartHandshake, HelpCircle, MessageSquare, Sparkles, Send,
  ShoppingCart, Trash2, CreditCard, ArrowLeft, Check, Lock, Gauge, UserPlus,
  Compass, Globe, Building2, Phone, ExternalLink
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
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">CAPE TOWN</span>
              </div>
              <p className="text-xs text-slate-400">Japan • Germany • USA Luxury Fleet</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center p-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl">
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'fleet' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" /> Global Catalog
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'map' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" /> Live Tracking Map
            </button>
            <button 
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'branches' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> Cape Town Branches
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'about' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Tech Specs
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

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddVehicleOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl transition"
            >
              <Plus className="w-4 h-4 text-blue-400" /> Add Vehicle
            </button>

            {/* Cart Trigger */}
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
                <h3 className="text-2xl font-bold text-white mt-1">{availableCount} <span className="text-xs text-slate-500 font-normal">/ {vehicles.length} Total</span></h3>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Cape Town Network</p>
                <h3 className="text-2xl font-bold text-white mt-1">5 Branches</h3>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Total Fleet Valuation</p>
                <h3 className="text-2xl font-bold text-white mt-1">R{(totalFleetValue / 1000000).toFixed(1)}M ZAR</h3>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Global Origins</p>
                <h3 className="text-2xl font-bold text-white mt-1">Japan • DE • USA</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
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
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Origin Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 border border-slate-800/80 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase px-2">Origin:</span>
                  {origins.map(orig => (
                    <button
                      key={orig}
                      onClick={() => setSelectedOrigin(orig)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedOrigin === orig ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
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
                    className="w-full bg-slate-900/80 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
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
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {v.rating}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Specs Badge Grid in KM/H */}
                      <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/50 text-center">
                        <div className="p-1 rounded-lg bg-slate-900/60">
                          <p className="text-slate-500 font-medium">Power</p>
                          <p className="font-bold text-blue-400">{v.horsepower} HP</p>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-900/60">
                          <p className="text-slate-500 font-medium">0-100 km/h</p>
                          <p className="font-bold text-emerald-400">{v.zeroToHundred}</p>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-900/60">
                          <p className="text-slate-500 font-medium">Top Speed</p>
                          <p className="font-bold text-indigo-400">{v.topSpeed}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate max-w-[140px] text-slate-300">{v.locationName}</span>
                        </div>
                        <span className="text-slate-400 text-[11px] font-mono">{v.rangeOrConsumption}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800/40 mt-auto space-y-3">
                    <div className="flex justify-between items-end pt-3">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Rental Rate</p>
                        <span className="text-xl font-black text-white">R{v.dailyRate.toLocaleString()}</span>
                        <span className="text-xs text-slate-400"> / day</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Purchase Price</p>
                        <span className="text-sm font-extrabold text-blue-400">R{v.purchasePrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        disabled={v.status !== 'available'}
                        onClick={() => {
                          setBookingVehicle(v);
                          setRentalDays(3);
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
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
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
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

        {/* VIEW 2: LIVE TRACKING MAP (CAPE TOWN TELEMETRY) */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Real-time Map Canvas Frame */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[520px] flex flex-col justify-between">
              
              {/* Top Status Bar */}
              <div className="flex items-center justify-between z-10 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> Cape Town Live GPS Tracker
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span>Region: Western Cape</span>
                  <span>Precision: 0.1m</span>
                </div>
              </div>

              {/* Radar Grid Background */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-blue-500/10 rounded-full pointer-events-none animate-ping duration-1000 opacity-20" />

              {/* Simulated Map Markers for Cape Town */}
              <div className="relative my-auto flex flex-wrap items-center justify-center gap-8 p-8 z-10">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setFocusedVehicle(v)}
                    className={`group relative p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                      focusedVehicle.id === v.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/40 scale-110 z-20'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${focusedVehicle.id === v.id ? 'bg-white/20' : 'bg-slate-800 text-blue-400'}`}>
                      <Car className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-tight">{v.make} {v.model}</p>
                      <p className="text-[10px] opacity-80">{v.speed > 0 ? `${v.speed} km/h` : 'Parked'}</p>
                    </div>
                    
                    {v.status === 'rented' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#07090e] animate-bounce" />
                    )}
                  </button>
                ))}
              </div>

              {/* Bottom Selected Vehicle Quick Bar */}
              <div className="z-10 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{focusedVehicle.make} {focusedVehicle.model} ({focusedVehicle.origin})</h4>
                    <p className="text-xs text-slate-400">Location: {focusedVehicle.locationName} • Coordinates: {focusedVehicle.lat.toFixed(4)}°S, {focusedVehicle.lng.toFixed(4)}°E</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="text-slate-400">Current Speed</p>
                    <p className="font-mono font-bold text-emerald-400 text-sm">{focusedVehicle.speed} km/h</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Energy / Fuel</p>
                    <p className="font-mono font-bold text-blue-400 text-sm">{focusedVehicle.fuelPercent}%</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Telemetry Control Panel */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" /> Active Vehicle Telemetry
                </h3>
                <p className="text-xs text-slate-400">Live CAN bus telemetry streams from Cape Town</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Engine / Battery Output:</span>
                    <span className="font-bold text-white">{focusedVehicle.horsepower} HP</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Acceleration (0-100 km/h):</span>
                    <span className="font-bold text-emerald-400">{focusedVehicle.zeroToHundred}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Max Track Velocity:</span>
                    <span className="font-bold text-indigo-400">{focusedVehicle.topSpeed}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Efficiency / Range:</span>
                    <span className="font-bold text-amber-400">{focusedVehicle.rangeOrConsumption}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Battery / Fuel Cell Reserve</span>
                    <span>{focusedVehicle.fuelPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${focusedVehicle.fuelPercent > 30 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${focusedVehicle.fuelPercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> Autonomous Safety Guarantee
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Vehicle is under continuous satellite lock in the Western Cape region with remote immobilizer and emergency roadside support active.
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setBookingVehicle(focusedVehicle);
                    setRentalDays(3);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
                >
                  Rent {focusedVehicle.make} {focusedVehicle.model} Now
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: CAPE TOWN BRANCHES */}
        {activeTab === 'branches' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">In-Person Cape Town Branches</h2>
              <p className="text-slate-400 text-sm mt-1">Visit our physical pickup lounges and service centers across Cape Town</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capeTownBranches.map(branch => (
                <div key={branch.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                      {branch.area}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      {branch.address}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setActiveTab('map');
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    View Nearby Fleet on Map <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: TECH & PLATFORM */}
        {activeTab === 'about' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">
                DriveFleet Cape Town Technology
              </span>
              <h2 className="text-3xl font-black text-white">Next-Generation Vehicle Ecosystem</h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Bringing the world's most impressive Japanese, German, and American engineering directly to the roads of Cape Town.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Global Brand Curation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct imports from Japan (Nissan GT-R, Toyota GR), Germany (Porsche, BMW M, AMG), and USA (Tesla, Rivian).
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Sub-Meter Telemetry</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time telemetry tracking speed in km/h, range, battery health, and location across the Western Cape.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl w-fit">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Cape Town Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  5 physical branches offering instant pickup, concierge delivery, and 24/7 roadside assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Cape Town Driver Reviews</h2>
              <p className="text-slate-400 text-sm mt-1">Real feedback from drivers in South Africa</p>
            </div>

            {/* Submit Review */}
            <form onSubmit={handleAddReview} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white">Leave a Driver Review</h3>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>

              <textarea 
                rows={3}
                placeholder="Share your driving experience with DriveFleet..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button 
                type="submit" 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Post Review
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{r.author}</h4>
                      <p className="text-[10px] text-blue-400">{r.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {r.rating}.0
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                  <p className="text-[10px] text-slate-500">{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: CART */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Your Reservation Cart</h2>
                <p className="text-slate-400 text-sm mt-1">Review your selected rentals or purchases in South African Rands</p>
              </div>
              <button onClick={() => setActiveTab('fleet')} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Catalog
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">Your cart is currently empty</h3>
                <p className="text-xs text-slate-400">Explore our Japanese, German, and USA fleet to add a vehicle.</p>
                <button onClick={() => setActiveTab('fleet')} className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl">
                  Browse Vehicles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={`${item.vehicle.id}-${item.type}`} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                      <img src={item.vehicle.imageUrl} alt={item.vehicle.model} className="w-24 h-16 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">{item.vehicle.make} {item.vehicle.model}</h4>
                        <p className="text-xs text-slate-400 capitalize">{item.type} {item.type === 'rental' && `(${item.rentalDays} days)`}</p>
                        <p className="text-xs font-bold text-blue-400 mt-1">
                          R{(item.type === 'purchase' ? item.vehicle.purchasePrice : item.vehicle.dailyRate * (item.rentalDays || 1)).toLocaleString()}
                        </p>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.vehicle.id)} className="p-2 text-slate-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 h-fit">
                  <h3 className="text-base font-bold text-white">Order Summary</h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>15% SA VAT</span>
                      <span>R{estimatedVAT.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cape Town Delivery Fee</span>
                      <span>R{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
                      <span>Grand Total</span>
                      <span className="text-blue-400">R{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
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
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Complete Your Booking</h2>
              <button onClick={() => setActiveTab('cart')} className="text-xs text-blue-400 hover:underline">
                Return to Cart
              </button>
            </div>

            {orderComplete ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full w-fit mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
                <p className="text-xs text-slate-400">Order ID: <span className="font-mono text-white">{placedOrderId}</span></p>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for booking with DriveFleet Cape Town. A confirmation SMS & email with telemetry key codes have been dispatched.
                </p>
                <button onClick={() => { setOrderComplete(false); setActiveTab('fleet'); }} className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl">
                  Back to Fleet
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalCheckout} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6">
                
                {/* Fulfillment Method */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300">Fulfillment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        deliveryMethod === 'delivery' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Doorstep Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        deliveryMethod === 'pickup' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Branch Pickup
                    </button>
                  </div>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Cape Town Delivery Address</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. 15 Victoria Rd, Camps Bay, Cape Town"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Select Pickup Branch</label>
                    <select
                      value={selectedBranch}
                      onChange={e => setSelectedBranch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {capeTownBranches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.area})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Information */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-400" /> Payment Details (ZAR)
                  </h4>

                  <input 
                    required
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />

                  <input 
                    required
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      required
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      required
                      type="text"
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
                >
                  Pay R{grandTotal.toLocaleString()} ZAR & Confirm Booking
                </button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* RENTAL BOOKING MODAL */}
      {bookingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Rent {bookingVehicle.make} {bookingVehicle.model}</h3>
              <button onClick={() => setBookingVehicle(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Duration (Days)</label>
                <input 
                  type="number" 
                  min={1} 
                  max={30} 
                  value={rentalDays} 
                  onChange={e => setRentalDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1 text-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                <div className="flex justify-between text-slate-400"><span>Daily Rate:</span><span>R{bookingVehicle.dailyRate.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>Total Rental Price:</span>
                  <span className="text-blue-400">R{(bookingVehicle.dailyRate * rentalDays).toLocaleString()} ZAR</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBookVehicle}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
            >
              Confirm & Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Add New Fleet Vehicle</h3>
              <button onClick={() => setIsAddVehicleOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  required placeholder="Make (e.g. Nissan)" value={newVehicle.make} 
                  onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
                />
                <input 
                  required placeholder="Model (e.g. GT-R)" value={newVehicle.model} 
                  onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={newVehicle.origin} 
                  onChange={e => setNewVehicle({...newVehicle, origin: e.target.value as any})}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  <option value="Japan">Japan</option>
                  <option value="Germany">Germany</option>
                  <option value="USA">USA</option>
                  <option value="Other">Other</option>
                </select>

                <select 
                  value={newVehicle.category} 
                  onChange={e => setNewVehicle({...newVehicle, category: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" placeholder="Daily Rate (ZAR)" value={newVehicle.dailyRate} 
                  onChange={e => setNewVehicle({...newVehicle, dailyRate: Number(e.target.value)})}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
                />
                <input 
                  type="number" placeholder="Purchase Price (ZAR)" value={newVehicle.purchasePrice} 
                  onChange={e => setNewVehicle({...newVehicle, purchasePrice: Number(e.target.value)})}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
                />
              </div>

              <input 
                placeholder="Image URL" value={newVehicle.imageUrl} 
                onChange={e => setNewVehicle({...newVehicle, imageUrl: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
              />

              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">
                Add Vehicle to Cape Town Fleet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">DriveFleet Sign In</h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              <input 
                required type="email" placeholder="Email address" value={authEmail} 
                onChange={e => setAuthEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
              />
              <input 
                type="password" placeholder="Password" value={authPassword} 
                onChange={e => setAuthPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" 
              />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
