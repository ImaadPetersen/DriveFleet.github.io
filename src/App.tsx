import React, { useState } from 'react';
import { 
  ShoppingBag, User, History, Shield, Info, Check, 
  Trash2, X, ChevronRight, Lock, Car, Search, Filter,
  ArrowLeft, CreditCard, Truck, CheckCircle2, Award, Gauge, KeyRound
} from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface VehicleHistory {
  origin: string;
  previousOwners: number;
  serviceRecords: string;
  background: string;
  milestones: string[];
  provenanceNote: string;
}

export interface CarItem {
  id: string;
  vin: string;
  name: string;
  tagline: string;
  price: number;
  category: 'Hypercar' | 'Classic Luxury' | 'Muscle' | 'EV / Concept' | 'Track Special';
  year: number;
  mileage: number;
  engine: string;
  transmission: string;
  hp: number;
  image: string;
  history: VehicleHistory;
}

export interface CartItem extends CarItem {
  qty: number;
}

export interface UserSession {
  name: string;
  email: string;
  membershipTier: 'VIP Collector' | 'Founders Club' | 'Standard';
}

export type CurrentView = 'catalog' | 'auth' | 'cart' | 'checkout';

// ==========================================
// REALISTIC CAR DATASET
// ==========================================

const CARS_INVENTORY: CarItem[] = [
  {
    id: "car-001",
    vin: "ZFF78AHA000087192",
    name: "1987 Ferrari F40",
    tagline: "Enzo Ferrari's Final Masterpiece",
    price: 2850000,
    category: "Supercar" as any,
    year: 1987,
    mileage: 3420,
    engine: "2.9L Twin-Turbo V8",
    transmission: "5-Speed Manual",
    hp: 471,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Maranello, Italy",
      previousOwners: 2,
      serviceRecords: "Classiche Certified by Ferrari SpA (2023)",
      background: "Built to celebrate Ferrari's 40th anniversary, the F40 was the last car personally approved by Enzo Ferrari before his death. Features zero electronic driver aids and raw Kevlar composite panels.",
      milestones: [
        "First production street car to break the 200 mph barrier.",
        "Original factory Tubi style exhaust fitted.",
        "Delivered new to a private collector in Switzerland."
      ],
      provenanceNote: "Paint applied so thinly from factory that carbon fiber weave remains visible under light."
    }
  },
  {
    id: "car-002",
    vin: "DB5/1488/R",
    name: "1963 Aston Martin DB5",
    tagline: "The Grand Tourer of Cinema Legend",
    price: 1150000,
    category: "Classic Luxury",
    year: 1963,
    mileage: 18900,
    engine: "4.0L Straight-Six",
    transmission: "5-Speed ZF Manual",
    hp: 282,
    image: "https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Gaydon, United Kingdom",
      previousOwners: 3,
      serviceRecords: "Full Aston Martin Works Restoration",
      background: "Hand-crafted by Superleggera in Milan. Painted in iconic Silver Birch over Connolly Black leather interior.",
      milestones: [
        "Displayed at the 1964 Geneva Motor Show.",
        "Retains matching numbers engine and chassis.",
        "Includes original owner handbook and tool kit."
      ],
      provenanceNote: "Direct lineage from the production batch used during Goldfinger filming."
    }
  },
  {
    id: "car-003",
    vin: "W2919800000109",
    name: "1955 Mercedes-Benz 300 SL Gullwing",
    tagline: "The World's First Supercar",
    price: 1950000,
    category: "Classic Luxury",
    year: 1955,
    mileage: 12400,
    engine: "3.0L Inline-6 Direct-Injection",
    transmission: "4-Speed Manual",
    hp: 215,
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Stuttgart, Germany",
      previousOwners: 2,
      serviceRecords: "Maintained by Kienle Automobiltechnik",
      background: "Derived from the 1952 W194 race car, featuring iconic roof-hinged Gullwing doors dictated by the lightweight tubular spaceframe.",
      milestones: [
        "First road vehicle with mechanical direct fuel injection.",
        "Featured in original Silver Metallic over Blue plaid interior.",
        "Fitted with rare original fitted leather luggage set."
      ],
      provenanceNote: "Imported originally by Max Hoffman to New York in late 1955."
    }
  },
  {
    id: "car-004",
    vin: "BS23H0E119201",
    name: "1970 Plymouth Hemi 'Cuda",
    tagline: "Peak American Big-Block Muscle",
    price: 490000,
    category: "Muscle",
    year: 1970,
    mileage: 8200,
    engine: "426 ci (7.0L) Hemi V8",
    transmission: "4-Speed Hurst Manual",
    hp: 425,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Detroit, USA",
      previousOwners: 4,
      serviceRecords: "Grover Restoration Certification",
      background: "Equipped with dual four-barrel carburetors and functional 'Shaker' hood scoop. Finished in factory Plum Crazy Purple.",
      milestones: [
        "1 of only 652 Hemi Hardtops produced for 1970.",
        "Includes original broadcast sheet and fender tag.",
        "Super Track Pak option with 4.10 Dana 60 rear axle."
      ],
      provenanceNote: "Documented original engine block certified by Galen Govier."
    }
  },
  {
    id: "car-005",
    vin: "SPARK001F1MCL",
    name: "1994 McLaren F1",
    tagline: "The Uncompromised Hypercar Benchmark",
    price: 21500000,
    category: "Hypercar",
    year: 1994,
    mileage: 1890,
    engine: "6.1L BMW S70/2 V12",
    transmission: "6-Speed Transverse Manual",
    hp: 618,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Woking, United Kingdom",
      background: "Engineered by Gordon Murray with central driving position and gold foil heat shielding in engine compartment.",
      previousOwners: 1,
      serviceRecords: "Serviced Annually by McLaren Special Operations (MSO)",
      milestones: [
        "Holds record for world's fastest naturally aspirated production car (240.1 mph).",
        "Includes titanium luggage set and original TAG Heuer F1 watch.",
        "Chassis #029 with factory High Downforce Kit."
      ],
      provenanceNote: "Single owner from new; maintained in climate-controlled museum vault."
    }
  },
  {
    id: "car-006",
    vin: "CSX301920192",
    name: "1967 Shelby Cobra 427 S/C",
    tagline: "V8 Power in a Lightweight Frame",
    price: 1850000,
    category: "Track Special",
    year: 1967,
    mileage: 5120,
    engine: "7.0L Ford FE 427 V8",
    transmission: "4-Speed Toploader Manual",
    hp: 485,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Venice, California, USA",
      previousOwners: 3,
      serviceRecords: "SAAC World Registry Documented",
      background: "Semi-Competition model featuring side pipes, halogen headlights, flared fenders, and competition fuel filler.",
      milestones: [
        "Signed on glovebox by Carroll Shelby.",
        "0 to 60 mph in under 3.8 seconds in 1967.",
        "Includes original Halibrand knock-off magnesium wheels."
      ],
      provenanceNote: "Listed in the Shelby American World Registry since 1974."
    }
  },
  {
    id: "car-007",
    vin: "WP0ZZZ99ZTS39201",
    name: "1998 Porsche 911 GT1 Strassenversion",
    tagline: "Le Mans Homologation Special",
    price: 12400000,
    category: "Track Special",
    year: 1998,
    mileage: 780,
    engine: "3.2L Twin-Turbo Flat-6",
    transmission: "6-Speed Manual",
    hp: 537,
    image: "https://images.unsplash.com/photo-1611244420077-440232a9a499?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Weissach, Germany",
      previousOwners: 1,
      serviceRecords: "Porsche Museum Maintenance Division",
      background: "One of only 20 road-going Strassenversion cars built to satisfy FIA GT1 racing homologation requirements.",
      milestones: [
        "Carbon fiber chassis and Kevlar bodywork.",
        "Direct water-cooled twin turbocharged engine.",
        "Factory Arctic Silver Metallic paint."
      ],
      provenanceNote: "Delivered directly from Weissach to a private German collection in 1998."
    }
  },
  {
    id: "car-008",
    vin: "RIMAC2024NEVERA09",
    name: "2024 Rimac Nevera Time Attack",
    tagline: "The Pinnacle of Electric Performance",
    price: 2400000,
    category: "EV / Concept",
    year: 2024,
    mileage: 140,
    engine: "Quad Electric Motors (120kWh)",
    transmission: "Single-Speed Independent Direct-Drive",
    hp: 1914,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    history: {
      origin: "Sveta Nedelja, Croatia",
      previousOwners: 1,
      serviceRecords: "Factory Warranty Active",
      background: "Limited Time Attack Edition celebrating 20+ performance world records set across Nürburgring and acceleration trials.",
      milestones: [
        "0 to 60 mph in 1.74 seconds.",
        "All-Wheel Torque Vectoring 3.0 system.",
        "Bespoke Squadron Black & Light Green livery."
      ],
      provenanceNote: "Number 1 of 12 Time Attack editions manufactured."
    }
  }
];

export default function App(): React.JSX.Element {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState<CurrentView>('catalog');
  const [cars] = useState<CarItem[]>(CARS_INVENTORY);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Selected car history modal
  const [selectedCarHistory, setSelectedCarHistory] = useState<CarItem | null>(null);
  
  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<UserSession | null>({
    name: "Alexandre Vance",
    email: "a.vance@sovereign-vault.com",
    membershipTier: "VIP Collector"
  });

  // Auth Form State
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    membershipType: 'VIP Collector'
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { ...CARS_INVENTORY[0], qty: 1 }
  ]);

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: 'Alexandre Vance',
    email: 'a.vance@sovereign-vault.com',
    phone: '+1 (555) 019-2831',
    address: '740 Park Avenue, Penthouse B',
    city: 'New York',
    state: 'NY',
    zip: '10021',
    country: 'United States',
    escrowProvider: 'JPMorgan Automotive Escrow',
    cardNumber: '•••• •••• •••• 8819',
    exp: '12/28',
    cvc: '942'
  });

  // --- ACTIONS ---
  const handleAddToCart = (car: CarItem) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === car.id);
      if (exists) {
        return prev.map(item => item.id === car.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...car, qty: 1 }];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null));
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: authForm.name || (authForm.email ? authForm.email.split('@')[0] : "Member Collector"),
      email: authForm.email || "collector@aura-motors.com",
      membershipTier: (authForm.membershipType as any) || "VIP Collector"
    });
    setCurrentView('catalog');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderConfirmed(true);
    setCart([]);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const escrowFee = cartSubtotal > 0 ? 12500 : 0;
  const transportInsurance = cartSubtotal * 0.015;
  const cartTotal = cartSubtotal + escrowFee + transportInsurance;

  // Filter Logic
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.engine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          car.vin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Hypercar', 'Classic Luxury', 'Muscle', 'Track Special', 'EV / Concept'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-xl font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-white uppercase block leading-none font-serif">AURA</span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">Heritage & Provenance</span>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button 
              onClick={() => setCurrentView('catalog')}
              className={`transition hover:text-amber-400 ${currentView === 'catalog' ? 'text-amber-400 font-bold' : ''}`}
            >
              Private Marketplace
            </button>
            <button 
              onClick={() => setCurrentView('cart')}
              className={`transition hover:text-amber-400 flex items-center gap-1.5 ${currentView === 'cart' ? 'text-amber-400 font-bold' : ''}`}
            >
              Vault / Cart
              {cart.length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>
          </div>

          {/* User Account & Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 pl-3 pr-2 py-1.5 rounded-full">
                <div className="w-7 h-7 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-200 block leading-tight">{user.name}</span>
                  <span className="text-[10px] text-amber-400 block">{user.membershipTier}</span>
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setCurrentView('auth'); }}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition"
              >
                <User className="w-4 h-4 text-amber-400" />
                Sign In
              </button>
            )}

            <button 
              onClick={() => setCurrentView('cart')}
              className="relative p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition font-medium flex items-center gap-2 shadow-lg shadow-amber-500/10"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Vault</span>
              {cart.length > 0 && (
                <span className="bg-slate-950 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= VIEW 1: CATALOG / MARKETPLACE ================= */}
      {currentView === 'catalog' && (
        <main>
          {/* Hero Banner */}
          <section className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border-b border-slate-800 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-widest mb-6">
                <Award className="w-3.5 h-3.5" /> Verified Authenticity & Escrow Protected
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-serif max-w-4xl mx-auto leading-tight">
                Curated Automotive Rarities & Provenance
              </h1>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Direct access to blue-chip hypercars, museum-grade homologation specials, and certified historical legends with full title escrow.
              </p>

              {/* Search & Filter Inputs */}
              <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="Search model, VIN, or specs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      selectedCategory === cat 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Vehicle Inventory Grid */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Available Inventory</h2>
                <p className="text-xs text-slate-400">Showing {filteredCars.length} authenticated vehicles</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map(car => (
                <div 
                  key={car.id} 
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col group shadow-2xl"
                >
                  {/* Car Image Header */}
                  <div className="relative h-60 overflow-hidden bg-slate-950">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700">
                      {car.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700">
                      {car.year}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                      <span className="bg-slate-950/90 px-2 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
                        VIN: {car.vin}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Gauge className="w-3.5 h-3.5" /> {car.mileage.toLocaleString()} mi
                      </span>
                    </div>
                  </div>

                  {/* Car Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition font-serif">{car.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 italic">{car.tagline}</p>
                      
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block uppercase">Powertrain</span>
                          <span className="font-semibold text-slate-200 truncate block">{car.engine}</span>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 block uppercase">Output</span>
                          <span className="font-semibold text-slate-200 truncate block">{car.hp} HP</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Acquisition Price</span>
                        <span className="text-lg font-black text-white">
                          ${car.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedCarHistory(car)}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition border border-slate-700"
                          title="View Vehicle History & Provenance"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleAddToCart(car)}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10 flex items-center gap-1.5 uppercase tracking-wider"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Acquire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ================= VIEW 2: AUTHENTICATION (SIGN IN / SIGN UP) ================= */}
      {currentView === 'auth' && (
        <main className="max-w-md mx-auto px-4 py-16">
          <button 
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white font-serif">
                {authMode === 'login' ? 'Collector Sign In' : 'Private Membership Application'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access private vehicle allocations and escrow transfers.
              </p>
            </div>

            {/* Auth Toggle Tabs */}
            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
              <button
                onClick={() => setAuthMode('login')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'signup' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Apply for Membership
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Lord Sterling Crawford"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="collector@sovereign.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Requested Membership Tier</label>
                  <select 
                    value={authForm.membershipType}
                    onChange={(e) => setAuthForm({...authForm, membershipType: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                  >
                    <option value="VIP Collector">VIP Collector (Priority Escrow)</option>
                    <option value="Founders Club">Founders Club (Private Bidding)</option>
                    <option value="Standard">Standard Access</option>
                  </select>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10 mt-2"
              >
                {authMode === 'login' ? 'Authenticate Account' : 'Submit Application'}
              </button>
            </form>
          </div>
        </main>
      )}

      {/* ================= VIEW 3: CART / VAULT ================= */}
      {currentView === 'cart' && (
        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setCurrentView('catalog')}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Browsing
            </button>
            <h1 className="text-2xl font-bold text-white font-serif">Acquisition Vault ({cart.length})</h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <Car className="w-16 h-16 mx-auto mb-4 text-slate-600 opacity-40" />
              <h3 className="text-xl font-bold text-white">Your Vault is Empty</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                Select from our curated inventory of rare vehicles to initiate escrow transfer.
              </p>
              <button 
                onClick={() => setCurrentView('catalog')}
                className="mt-6 px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Explore Inventory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-20 object-cover rounded-xl bg-slate-950" />
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 block">VIN: {item.vin}</span>
                        <h4 className="text-lg font-bold text-white font-serif">{item.name}</h4>
                        <p className="text-xs text-slate-400">{item.engine} • {item.hp} HP</p>
                        <span className="text-sm font-bold text-white block mt-1">${item.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                      <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950">
                        <button 
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="px-3 py-1 text-slate-400 hover:text-white font-bold"
                        >-</button>
                        <span className="px-2 text-xs font-bold text-slate-200">{item.qty}</span>
                        <button 
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="px-3 py-1 text-slate-400 hover:text-white font-bold"
                        >+</button>
                      </div>

                      <button 
                        onClick={() => handleUpdateQty(item.id, -item.qty)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-4">
                <h3 className="text-lg font-bold text-white font-serif border-b border-slate-800 pb-3">Financial Summary</h3>
                
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Vehicle Subtotal</span>
                    <span className="text-white font-semibold">${cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Title Escrow Processing</span>
                    <span className="text-white font-semibold">${escrowFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enclosed Transport Insurance</span>
                    <span className="text-white font-semibold">${transportInsurance.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Total Commitment</span>
                  <span className="text-xl font-black text-amber-400">${cartTotal.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => setCurrentView('checkout')}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  Proceed to Escrow Checkout <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ================= VIEW 4: CHECKOUT PAGE ================= */}
      {currentView === 'checkout' && (
        <main className="max-w-4xl mx-auto px-4 py-12">
          <button 
            onClick={() => setCurrentView('cart')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Vault
          </button>

          {orderConfirmed ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white font-serif">Acquisition Contract Initiated</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your purchase agreement and escrow instructions have been dispatched to <span className="text-amber-400 font-semibold">{checkoutForm.email}</span>. A private concierge representative will contact you within 2 hours.
              </p>
              
              <div className="my-6 p-4 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs space-y-1 font-mono text-slate-400">
                <div>Order Reference: <span className="text-slate-200">AUR-2026-9902</span></div>
                <div>Escrow Bank: <span className="text-slate-200">{checkoutForm.escrowProvider}</span></div>
                <div>Status: <span className="text-emerald-400">Escrow Pending Wire Transfer</span></div>
              </div>

              <button 
                onClick={() => {
                  setOrderConfirmed(false);
                  setCurrentView('catalog');
                }}
                className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Return to Marketplace
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-6 mb-6">
                <Shield className="w-6 h-6 text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-white font-serif">Automotive Purchase & Escrow Agreement</h2>
                  <p className="text-xs text-slate-400">Complete legally binding buyer and delivery registration.</p>
                </div>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                {/* 1. Buyer Profile */}
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> 1. Buyer & Legal Title Holder
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Legal Name</label>
                      <input 
                        type="text" 
                        required 
                        value={checkoutForm.fullName}
                        onChange={(e) => setCheckoutForm({...checkoutForm, fullName: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. White Glove Delivery Address */}
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> 2. Enclosed Vehicle Delivery Location
                  </h3>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      required 
                      placeholder="Street Address or Private Hangar"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input 
                        type="text" 
                        required 
                        placeholder="City"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                      <input 
                        type="text" 
                        required 
                        placeholder="State / Region"
                        value={checkoutForm.state}
                        onChange={(e) => setCheckoutForm({...checkoutForm, state: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                      <input 
                        type="text" 
                        required 
                        placeholder="ZIP Code"
                        value={checkoutForm.zip}
                        onChange={(e) => setCheckoutForm({...checkoutForm, zip: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Escrow Funding Details */}
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> 3. Escrow Funding & Guarantee
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Escrow Provider:</span>
                      <span className="text-slate-200 font-semibold">{checkoutForm.escrowProvider}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                      <span className="text-slate-400">Total Purchase Amount:</span>
                      <span className="text-amber-400 font-bold text-base">${cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-4"
                >
                  Authorize Purchase & Sign Escrow Agreement
                </button>
              </form>
            </div>
          )}
        </main>
      )}

      {/* ================= MODAL: CAR HISTORY & PROVENANCE ================= */}
      {selectedCarHistory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative h-64">
              <img 
                src={selectedCarHistory.image} 
                alt={selectedCarHistory.name} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedCarHistory(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950/80 text-slate-300 hover:text-white rounded-full backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 block uppercase">VIN: {selectedCarHistory.vin}</span>
                <h2 className="text-2xl font-bold text-white font-serif">{selectedCarHistory.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Heritage & Provenance</h4>
                <p className="text-slate-300 text-xs leading-relaxed">{selectedCarHistory.history.background}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Assembly Origin</span>
                  <span className="font-semibold text-slate-200">{selectedCarHistory.history.origin}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Previous Custodians</span>
                  <span className="font-semibold text-slate-200">{selectedCarHistory.history.previousOwners} Owners</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Historical Milestones</h4>
                <ul className="space-y-2">
                  {selectedCarHistory.history.milestones.map((milestone, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Acquisition Price</span>
                  <span className="text-xl font-bold text-white">${selectedCarHistory.price.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    handleAddToCart(selectedCarHistory);
                    setSelectedCarHistory(null);
                  }}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  Initiate Acquisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
