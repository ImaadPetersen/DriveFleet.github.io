import React, { useState, useEffect } from 'react';
import {
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X,
  MapPin, CheckCircle2, Zap, Activity, DollarSign, Search,
  BatteryCharging, Clock, ChevronRight, User, LogIn, LogOut, Star,
  Award, HeartHandshake, HelpCircle, MessageSquare, Sparkles, Send,
  ShoppingCart, Trash2, CreditCard, ArrowLeft, Check, Lock, Gauge, UserPlus,
  Compass, Globe, Building2, Phone, ExternalLink, Info, CheckCircle, Sliders,
  SlidersHorizontal, ChevronDown, Eye, ShieldCheck, Sparkle
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
  category: 'Sports' | 'EV / Hybrid' | 'Luxury' | 'SUV';
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
    hours: '24/7 VIP Concierge',
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
    model: 'GT-R Nismo Track Edition',
    year: 2024,
    category: 'Sports',
    origin: 'Japan',
    dailyRate: 8500,
    purchasePrice: 4800000,
    transmission: '6-Speed Dual-Clutch',
    fuelType: 'Twin-Turbo V6',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 98,
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
    model: 'GR Supra 3.0 Performance',
    year: 2024,
    category: 'Sports',
    origin: 'Japan',
    dailyRate: 3800,
    purchasePrice: 1550000,
    transmission: '6-Speed Manual',
    fuelType: 'Inline-6 Turbo',
    seats: 2,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 88,
    speed: 0,
    lat: -33.9512,
    lng: 18.3780,
    locationName: 'Camps Bay Lounge',
    rating: 4.9,
    horsepower: 382,
    zeroToHundred: '3.9s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '8.8 L / 100 km'
  },
  {
    id: 103,
    make: 'Honda',
    model: 'NSX Type S Hybrid Supercar',
    year: 2023,
    category: 'EV / Hybrid',
    origin: 'Japan',
    dailyRate: 9200,
    purchasePrice: 4200000,
    transmission: '9-Speed Dual-Clutch',
    fuelType: 'Twin-Turbo V6 Hybrid',
    seats: 2,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 74,
    speed: 112,
    lat: -33.9249,
    lng: 18.4241,
    locationName: 'En Route (Chapman\'s Peak Drive)',
    rating: 5.0,
    horsepower: 600,
    zeroToHundred: '2.9s',
    topSpeed: '307 km/h',
    rangeOrConsumption: '10.2 L / 100 km'
  },

  // --- GERMANY ---
  {
    id: 201,
    make: 'Porsche',
    model: '911 GT3 RS Weissach',
    year: 2024,
    category: 'Sports',
    origin: 'Germany',
    dailyRate: 11500,
    purchasePrice: 5900000,
    transmission: '7-Speed PDK Dual-Clutch',
    fuelType: 'Naturally Aspirated Flat-6',
    seats: 2,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 95,
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
    model: 'i7 M70 xDrive Luxury Sedan',
    year: 2024,
    category: 'Luxury',
    origin: 'Germany',
    dailyRate: 5800,
    purchasePrice: 3850000,
    transmission: 'Direct Drive',
    fuelType: 'Pure Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 100,
    speed: 0,
    lat: -33.8922,
    lng: 18.5085,
    locationName: 'Century City Depot',
    rating: 4.9,
    horsepower: 650,
    zeroToHundred: '3.7s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '560 km range'
  },
  {
    id: 203,
    make: 'Mercedes-AMG',
    model: 'GT 63 S E Performance',
    year: 2024,
    category: 'Luxury',
    origin: 'Germany',
    dailyRate: 8900,
    purchasePrice: 4400000,
    transmission: '9-Speed AMG Speedshift',
    fuelType: 'V8 Hybrid',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 92,
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
    model: 'RS e-tron GT Ice Race Edition',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'Germany',
    dailyRate: 6200,
    purchasePrice: 3300000,
    transmission: '2-Speed Automatic',
    fuelType: 'Pure Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 91,
    speed: 0,
    lat: -33.9715,
    lng: 18.6021,
    locationName: 'Airport Express Depot',
    rating: 4.9,
    horsepower: 637,
    zeroToHundred: '3.3s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '472 km range'
  },

  // --- USA ---
  {
    id: 301,
    make: 'Tesla',
    model: 'Model S Plaid Tri-Motor',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 4900,
    purchasePrice: 2600000,
    transmission: 'Direct Drive',
    fuelType: 'Pure Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 96,
    speed: 0,
    lat: -33.9056,
    lng: 18.4211,
    locationName: 'V&A Waterfront Hub',
    rating: 4.9,
    horsepower: 1020,
    zeroToHundred: '2.1s',
    topSpeed: '322 km/h',
    rangeOrConsumption: '600 km range'
  },
  {
    id: 302,
    make: 'Rivian',
    model: 'R1S Quad-Motor Adventure',
    year: 2024,
    category: 'SUV',
    origin: 'USA',
    dailyRate: 4500,
    purchasePrice: 2400000,
    transmission: 'Direct Drive',
    fuelType: 'Pure Electric',
    seats: 7,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 68,
    speed: 84,
    lat: -33.9350,
    lng: 18.4720,
    locationName: 'En Route (M5 Highway North)',
    rating: 4.8,
    horsepower: 835,
    zeroToHundred: '3.1s',
    topSpeed: '201 km/h',
    rangeOrConsumption: '516 km range'
  },
  {
    id: 303,
    make: 'Ford',
    model: 'Mustang Mach-E GT Performance',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 3100,
    purchasePrice: 1650000,
    transmission: 'Direct Drive',
    fuelType: 'Pure Electric',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 88,
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
    role: 'Managing Director, Horizon Global',
    rating: 5,
    comment: 'The Nissan GT-R Nismo delivery to our private yacht at V&A Waterfront was flawless. DriveFleet provides an unmatched ultra-luxury mobility experience in South Africa.',
    date: '2 hours ago'
  },
  {
    id: 2,
    author: 'Marcus Vance',
    role: 'Private Equity Investor',
    rating: 5,
    comment: 'Real-time telemetry tracking on the Porsche GT3 RS while taking the coastline drive to Cape Point gave complete peace of mind. Immaculate condition.',
    date: '2 days ago'
  },
  {
    id: 3,
    author: 'Dr. Aris Thorne',
    role: 'Chief Technology Officer',
    rating: 5,
    comment: 'Seamless checkout and immediate doorstep drop-off at Camps Bay. The BMW i7 M70 was charged to 100% and pre-conditioned perfectly.',
    date: '4 days ago'
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'fleet' | 'map' | 'branches' | 'specs' | 'reviews' | 'cart' | 'checkout'>('fleet');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Alexander Wright',
    email: 'alexander@wright.capetown',
    role: 'VIP Black Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });
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
  const [deliveryAddress, setDeliveryAddress] = useState('42 Victoria Road, Camps Bay, Cape Town');
  const [selectedBranch, setSelectedBranch] = useState(capeTownBranches[0].id);
  const [cardName, setCardName] = useState('Alexander Wright');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 9842');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('•••');
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // New Review Form State
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: 2025,
    category: 'EV / Hybrid' as 'EV / Hybrid' | 'Sports' | 'Luxury' | 'SUV',
    origin: 'Germany' as 'Japan' | 'Germany' | 'USA' | 'Other',
    dailyRate: 6500,
    purchasePrice: 2900000,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    seats: 4,
    fuelType: 'Pure Electric',
    locationName: 'V&A Waterfront Hub',
    horsepower: 650,
    zeroToHundred: '3.1s',
    topSpeed: '280 km/h',
    rangeOrConsumption: '500 km range'
  });

  // Dynamic Live Simulation for Vehicle Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'rented') {
          return {
            ...v,
            speed: Math.floor(75 + Math.random() * 45),
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

  const categories = ['All', 'Sports', 'EV / Hybrid', 'Luxury', 'SUV'];
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
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
    }, 800);
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
  const deliveryFee = cart.length > 0 && deliveryMethod === 'delivery' ? 950 : 0;
  const grandTotal = subtotal + estimatedVAT + deliveryFee;

  const handleFinalCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = 'CPT-EX-9' + Math.floor(10000 + Math.random() * 90000);
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
      model: newVehicle.model || 'Special Edition',
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
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-400 selection:text-black font-sans antialiased relative overflow-x-hidden">

      {/* LUXURY BACKGROUND AMBIENT GLOWS */}
      <div className="fixed top-0 left-1/3 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* VIP TOP CONCIERGE ANNOUNCEMENT BAR */}
      <div className="bg-slate-950 border-b border-cyan-950/80 px-6 py-2 text-[11px] font-semibold text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Cape Town VIP Doorstep Delivery Active</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">100% Insured Fleet</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-cyan-400" /> Concierge Hotline: +27 (0)21 400 1000</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully Insured</span>
          </div>
        </div>
      </div>

      {/* EXECUTIVE NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-3xl border-b border-cyan-950/80 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          {/* Logo & Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('fleet')}>
            <div className="relative p-3 bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 rounded-2xl text-slate-950 shadow-xl shadow-cyan-500/25 ring-1 ring-white/20">
              <Car className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">DriveFleet</h1>
                <span className="px-2 py-0.5 text-[9px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full tracking-widest">
                  CAPE TOWN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Ultra-Luxury & Supercar Mobility</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center p-1.5 bg-slate-950/80 border border-cyan-950 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('fleet')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'fleet' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" /> Global Catalog
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'map' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" /> GPS Radar Map
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'branches' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> Cape Town Depots
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'specs' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-4 h-4" /> Performance Tech
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === 'reviews' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Concierge Reviews
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddVehicleOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-cyan-950 text-xs font-bold text-slate-200 rounded-xl transition shadow-md"
            >
              <Plus className="w-4 h-4 text-cyan-400" /> Add Vehicle
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-3 bg-slate-900 hover:bg-slate-800 border border-cyan-950 rounded-xl text-slate-200 transition shadow-md group"
            >
              <ShoppingCart className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#030712] shadow-md">
                  {cart.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-950 border border-cyan-950 p-1.5 pl-3 rounded-2xl">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-cyan-500/50" />
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-cyan-400 font-semibold">{currentUser.role}</p>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  title="Logout"
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 rounded-xl text-xs font-black text-slate-950 transition shadow-xl shadow-cyan-500/20"
              >
                <LogIn className="w-4 h-4" /> VIP Login
              </button>
            )}
          </div>

        </div>
      </header>

      {/* CINEMATIC HERO & STATS BANNER */}
      {activeTab !== 'cart' && activeTab !== 'checkout' && (
        <section className="relative max-w-7xl mx-auto px-6 pt-8 pb-4">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-950/80 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
                  <Sparkle className="w-4 h-4" /> South Africa&apos;s Flagship Mobility Platform
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Experience DriveFleet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Cape Town</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Precision engineered vehicles from Japan, Germany, and the USA. Available for high-tier daily reservation or direct executive acquisition with real-time telemetry.
                </p>
              </div>

              {/* Realtime Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="bg-slate-950/80 border border-cyan-950/80 p-3.5 rounded-2xl text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Available</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{availableCount} / {vehicles.length}</span>
                </div>
                <div className="bg-slate-950/80 border border-cyan-950/80 p-3.5 rounded-2xl text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Locations</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">5 Depots</span>
                </div>
                <div className="bg-slate-950/80 border border-cyan-950/80 p-3.5 rounded-2xl text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Fleet Value</span>
                  <span className="text-xl font-bold font-mono text-amber-400">R{(totalFleetValue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="bg-slate-950/80 border border-cyan-950/80 p-3.5 rounded-2xl text-center min-w-[110px]">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Telemetry</span>
                  <span className="text-xl font-bold font-mono text-teal-400">Live 2.5s</span>
                </div>
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
            <div className="bg-slate-950/80 backdrop-blur-xl border border-cyan-950/80 rounded-2xl p-4 mb-8 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mr-2 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" /> Category:
                </span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Origin & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase px-2">Origin:</span>
                  {origins.map(orig => (
                    <button
                      key={orig}
                      onClick={() => setSelectedOrigin(orig)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedOrigin === orig ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {orig}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search make, model, location..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  />
                </div>
              </div>

            </div>

            {/* Luxury Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(v => (
                <div
                  key={v.id}
                  className="group bg-slate-950/80 border border-cyan-950/80 hover:border-cyan-500/50 rounded-3xl overflow-hidden hover:shadow-[0_0_35px_rgba(6,182,212,0.15)] transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    {/* Vehicle Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setDetailVehicle(v)}>
                      <img
                        src={v.imageUrl}
                        alt={v.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Origin Tag */}
                      <div className="absolute top-3.5 left-3.5 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                          {v.origin}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <span className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                        v.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {v.status}
                      </span>

                      {/* Floating Title Bar */}
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                        <div>
                          <h3 className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition">{v.make} {v.model}</h3>
                          <p className="text-[11px] text-slate-300 font-medium">{v.year} • {v.category}</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{v.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specs Performance Grid */}
                    <div className="grid grid-cols-3 border-y border-cyan-950/60 bg-slate-900/30 text-center py-3 px-2 text-[11px] text-slate-300 font-medium">
                      <div className="flex flex-col items-center gap-1 border-r border-cyan-950/60">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono font-bold text-white">{v.horsepower} HP</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-r border-cyan-950/60">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono font-bold text-white">{v.zeroToHundred}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono font-bold text-white truncate max-w-[85px]">{v.rangeOrConsumption}</span>
                      </div>
                    </div>

                    {/* Location Badge */}
                    <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-400 border-b border-cyan-950/40">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{v.locationName}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">{v.fuelType}</span>
                    </div>
                  </div>

                  {/* Actions & Pricing Bar */}
                  <div className="p-5 flex items-center justify-between gap-3 bg-slate-950/60">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Daily Reservation</span>
                      <span className="text-lg font-black text-white font-mono">R{v.dailyRate.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/day</span></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailVehicle(v)}
                        className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition border border-slate-800"
                        title="View Full Specifications"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBookingVehicle(v)}
                        disabled={v.status !== 'available'}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                          v.status === 'available'
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20'
                            : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: GPS RADAR MAP */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Map Visual Container */}
            <div className="lg:col-span-2 bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-6 relative min-h-[520px] flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" /> Live Telemetry Radar
                  </h2>
                  <p className="text-xs text-slate-400">Cape Town active telemetry stream with real-time GPS updating every 2.5 seconds</p>
                </div>
                <span className="px-3.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono font-bold">
                  ● LIVE RADAR
                </span>
              </div>

              {/* Graphical Simulated Radar Canvas */}
              <div className="relative z-10 my-8 p-8 border border-cyan-950/80 bg-slate-900/60 backdrop-blur-md rounded-2xl min-h-[320px] flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-cyan-500/30 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 rounded-full border border-cyan-400/50 flex items-center justify-center bg-cyan-500/10">
                      <Compass className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-white">{focusedVehicle.make} {focusedVehicle.model}</h3>
                <p className="text-xs text-cyan-400 font-bold mt-1">{focusedVehicle.locationName}</p>
                <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
                  <span>Lat: {focusedVehicle.lat.toFixed(4)}° S</span>
                  <span>•</span>
                  <span>Lng: {focusedVehicle.lng.toFixed(4)}° E</span>
                </div>
              </div>

              {/* Live Telemetry Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-xl border border-cyan-950 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Speed</span>
                  <span className="text-xl font-mono font-black text-cyan-400">{focusedVehicle.speed} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Energy / Fuel</span>
                  <span className="text-xl font-mono font-black text-emerald-400">{focusedVehicle.fuelPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Transmission State</span>
                  <span className="text-xl font-mono font-black text-amber-400 capitalize">{focusedVehicle.status}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Selection List for Map */}
            <div className="bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" /> Active Vehicles ({vehicles.length})
              </h3>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-2">
                {vehicles.map(v => (
                  <div
                    key={v.id}
                    onClick={() => setFocusedVehicle(v)}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3.5 ${
                      focusedVehicle.id === v.id
                        ? 'bg-cyan-500/10 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img src={v.imageUrl} alt={v.model} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate text-white">{v.make} {v.model}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{v.locationName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
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

        {/* VIEW 3: CAPE TOWN DEPOTS */}
        {activeTab === 'branches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capeTownBranches.map(branch => (
              <div key={branch.id} className="bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition duration-300 shadow-xl">
                <div>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl w-fit mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{branch.name}</h3>
                  <p className="text-xs text-cyan-400 font-bold mt-1">{branch.area}</p>

                  <div className="mt-6 flex flex-col gap-3 text-xs text-slate-300 font-medium">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>{branch.hours}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBranch(branch.id);
                    setActiveTab('fleet');
                  }}
                  className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  Browse Branch Vehicles <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 4: PERFORMANCE SPECS */}
        {activeTab === 'specs' && (
          <div className="bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-cyan-400" /> Engineering & Performance Specs
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
              DriveFleet Cape Town offers dynamic telemetry integration across Japanese, German, and USA performance engineering standards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 bg-slate-900/60 border border-cyan-950 rounded-2xl">
                <h4 className="font-bold text-cyan-400 text-xs uppercase font-mono mb-1">Telemetry Interactivity</h4>
                <p className="text-xs text-slate-400">Live GPS tracking with simulated speed calculations polled directly from active Cape Town routes.</p>
              </div>
              <div className="p-5 bg-slate-900/60 border border-cyan-950 rounded-2xl">
                <h4 className="font-bold text-cyan-400 text-xs uppercase font-mono mb-1">Dual Transaction Model</h4>
                <p className="text-xs text-slate-400">Seamlessly toggle between short-term executive rentals or direct purchase acquisitions in ZAR.</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: CONCIERGE REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <form onSubmit={handleAddReview} className="bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">Leave a Client Review</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1"
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your experience with DriveFleet Cape Town..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 mb-4 h-28"
              />
              <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-md">
                Post Review
              </button>
            </form>

            <div className="flex flex-col gap-4">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-slate-950/80 border border-cyan-950/80 rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm">{rev.author}</h4>
                      <span className="text-[10px] text-cyan-400 font-semibold">{rev.role}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-500 mt-3 block font-mono">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: CART */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-cyan-400" /> Reservation Cart
            </h2>

            {cart.length === 0 ? (
              <div className="bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-12 text-center shadow-2xl">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">Your cart is currently empty</h3>
                <p className="text-xs text-slate-400 mb-6">Select a vehicle from our global fleet catalog to proceed.</p>
                <button
                  onClick={() => setActiveTab('fleet')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg"
                >
                  Browse Global Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={item.vehicle.id} className="bg-slate-950/80 border border-cyan-950/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl">
                      <img src={item.vehicle.imageUrl} alt={item.vehicle.model} className="w-24 h-18 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-white text-sm truncate">{item.vehicle.make} {item.vehicle.model}</h4>
                        <p className="text-xs text-cyan-400 uppercase font-mono font-bold mt-0.5">{item.type} {item.type === 'rental' ? `(${item.rentalDays} Days)` : ''}</p>
                        <span className="text-sm font-mono text-white font-black mt-1 block">
                          R{(item.type === 'purchase' ? item.vehicle.purchasePrice : item.vehicle.dailyRate * (item.rentalDays || 1)).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.vehicle.id)}
                        className="p-2.5 text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary Box */}
                <div className="bg-slate-950/80 border border-cyan-950/80 rounded-2xl p-6 h-fit flex flex-col gap-4 shadow-2xl">
                  <h3 className="font-extrabold text-white text-base border-b border-cyan-950 pb-3">Reservation Summary</h3>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono font-bold">R{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>SA VAT (15%)</span>
                    <span className="text-white font-mono font-bold">R{estimatedVAT.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-cyan-950 pt-3 flex justify-between font-extrabold text-white text-base">
                    <span>Grand Total</span>
                    <span className="text-cyan-400 font-mono">R{grandTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl text-xs mt-2 shadow-lg shadow-cyan-500/20"
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
          <div className="max-w-2xl mx-auto bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-8 shadow-2xl">
            {orderComplete ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Reservation Confirmed</h2>
                <p className="text-xs text-slate-400 mb-2">Reference Token:</p>
                <span className="px-4 py-2 bg-slate-900 border border-cyan-950 font-mono text-cyan-400 text-sm font-black rounded-xl inline-block mb-6">
                  {placedOrderId}
                </span>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
                  Your executive booking has been dispatched to our Cape Town concierge team. You will receive real-time SMS tracking updates.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setActiveTab('fleet');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl text-xs"
                >
                  Return to Fleet
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalCheckout} className="flex flex-col gap-6">
                <h2 className="text-2xl font-black text-white border-b border-cyan-950 pb-4">Executive Checkout</h2>

                {/* Delivery Option */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Fulfillment Preference</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition ${
                        deliveryMethod === 'delivery' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Doorstep Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition ${
                        deliveryMethod === 'pickup' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Depot Pickup
                    </button>
                  </div>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 font-medium">Cape Town Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Victoria Road, Camps Bay, Cape Town"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 font-medium">Select Pickup Depot</label>
                    <select
                      value={selectedBranch}
                      onChange={e => setSelectedBranch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {capeTownBranches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.area})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Information */}
                <div className="border-t border-cyan-950 pt-4 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" /> Secure Payment Encryption
                  </h3>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">CVC</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl text-xs mt-2 shadow-xl shadow-cyan-500/20 uppercase tracking-wider"
                >
                  Confirm Reservation (R{grandTotal.toLocaleString()})
                </button>
              </
