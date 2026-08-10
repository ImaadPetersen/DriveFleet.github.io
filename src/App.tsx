import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X,
  MapPin, CheckCircle2, Zap, Activity, DollarSign, Search,
  BatteryCharging, Clock, ChevronRight, User, LogIn, LogOut, Star,
  Award, HeartHandshake, HelpCircle, MessageSquare, Sparkles, Send,
  ShoppingCart, Trash2, CreditCard, ArrowLeft, Check, Lock, Gauge, UserPlus,
  Compass, Globe, Building2, Phone, ExternalLink, Info, CheckCircle, Sliders,
  SlidersHorizontal, ChevronDown, Eye, ShieldCheck, Sparkle, Mountain,
  Anchor, Route as RouteIcon, Plane
} from 'lucide-react';

// ============================================================================
// GEOGRAPHY — real Cape Town coordinates projected onto a stylised map
// ============================================================================

const MAP_BOUNDS = { latMin: -34.22, latMax: -33.78, lngMin: 18.32, lngMax: 18.68 };
const MAP_W = 620;
const MAP_H = 760;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin)) * MAP_W;
  const y = ((MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * MAP_H;
  return [x, y];
}

function pathFromCoords(coords: [number, number][]): string {
  return coords
    .map(([lat, lng], i) => {
      const [x, y] = project(lat, lng);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

// Simplified but geographically-ordered outline of the Cape Peninsula + Cape Flats,
// built from real named landmarks so the coastline silhouette is recognisable.
const CAPE_LANDMASS: [number, number][] = [
  [-33.80, 18.46],   // Bloubergstrand
  [-33.86, 18.50],   // Milnerton
  [-33.895, 18.435], // Table Bay Harbour
  [-33.905, 18.421], // V&A Waterfront
  [-33.915, 18.385], // Sea Point
  [-33.940, 18.376], // Clifton
  [-33.951, 18.378], // Camps Bay
  [-34.005, 18.348], // Llandudno
  [-34.049, 18.354], // Hout Bay
  [-34.093, 18.360], // Chapman's Peak
  [-34.110, 18.380], // Noordhoek
  [-34.140, 18.325], // Kommetjie
  [-34.200, 18.380], // Cape Point
  [-34.193, 18.429], // Simon's Town
  [-34.108, 18.470], // Muizenberg
  [-34.050, 18.465], // Lakeside
  [-33.998, 18.465], // Wynberg
  [-33.982, 18.465], // Claremont
  [-33.958, 18.470], // Rondebosch
  [-33.955, 18.510], // Athlone
  [-33.892, 18.5085],// Century City
  [-33.905, 18.560],
  [-33.930, 18.620],
  [-33.9715, 18.6021],// Airport
  [-34.05, 18.68],
  [-34.22, 18.68],    // SE map corner (fill)
  [-34.22, 18.32],    // SW map corner (fill)
  [-33.78, 18.32],    // NW map corner (fill)
  [-33.78, 18.46],    // back near start along N edge
];

const TABLE_MOUNTAIN: [number, number] = [-33.9628, 18.4098];
const ROBBEN_ISLAND: [number, number] = [-33.807, 18.366];

// Stylised road corridors, built from real route waypoints
const ROADS: { name: string; coords: [number, number][] }[] = [
  {
    name: 'Victoria Road (M6) — Atlantic Seaboard',
    coords: [
      [-33.905, 18.421], [-33.915, 18.385], [-33.940, 18.376],
      [-33.951, 18.378], [-34.005, 18.348], [-34.049, 18.354],
      [-34.093, 18.360], [-34.110, 18.380],
    ],
  },
  {
    name: 'M3 — Southern Suburbs',
    coords: [
      [-33.905, 18.421], [-33.958, 18.470], [-33.982, 18.465],
      [-33.998, 18.465], [-34.050, 18.465], [-34.108, 18.470],
    ],
  },
  {
    name: 'N2 — Airport Freeway',
    coords: [
      [-33.905, 18.421], [-33.930, 18.480], [-33.955, 18.510],
      [-33.9715, 18.6021],
    ],
  },
  {
    name: 'N1 / Century City Link',
    coords: [
      [-33.905, 18.421], [-33.86, 18.50], [-33.892, 18.5085],
    ],
  },
];

// Real driving loops used to animate rented vehicles smoothly along actual roads
const VEHICLE_ROUTES: Record<number, [number, number][]> = {
  103: [
    [-33.905, 18.421], [-33.915, 18.385], [-33.940, 18.376],
    [-33.951, 18.378], [-34.005, 18.348], [-34.049, 18.354], [-34.093, 18.360],
  ],
  302: [
    [-33.892, 18.5085], [-33.955, 18.510], [-33.982, 18.465], [-33.9715, 18.6021],
  ],
};

function pointAtRoute(route: [number, number][], t: number): [number, number] {
  const segs = route.length - 1;
  const segFloat = Math.min(0.999999, Math.max(0, t)) * segs;
  const segIdx = Math.min(segs - 1, Math.floor(segFloat));
  const segT = segFloat - segIdx;
  const [lat1, lng1] = route[segIdx];
  const [lat2, lng2] = route[segIdx + 1];
  return [lat1 + (lat2 - lat1) * segT, lng1 + (lng2 - lng1) * segT];
}

function pingPong(t: number): number {
  const mod = t % 2;
  return mod <= 1 ? mod : 2 - mod;
}

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

// Initial Vehicles — real production models with verified factory specs
const initialVehicles: Vehicle[] = [
  // --- JAPAN ---
  {
    id: 101,
    make: 'Nissan',
    model: 'GT-R NISMO',
    year: 2024,
    category: 'Sports',
    origin: 'Japan',
    dailyRate: 8500,
    purchasePrice: 4800000,
    transmission: '6-Speed Dual-Clutch',
    fuelType: 'Twin-Turbo 3.8L V6',
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
    rangeOrConsumption: '12.0 L / 100 km'
  },
  {
    id: 102,
    make: 'Toyota',
    model: 'GR Supra 3.0 (Manual)',
    year: 2024,
    category: 'Sports',
    origin: 'Japan',
    dailyRate: 3800,
    purchasePrice: 1550000,
    transmission: '6-Speed Manual',
    fuelType: 'Turbo 3.0L Inline-6',
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
    zeroToHundred: '4.1s',
    topSpeed: '250 km/h',
    rangeOrConsumption: '9.5 L / 100 km'
  },
  {
    id: 103,
    make: 'Honda',
    model: 'NSX Type S',
    year: 2022,
    category: 'EV / Hybrid',
    origin: 'Japan',
    dailyRate: 9200,
    purchasePrice: 4200000,
    transmission: '9-Speed Dual-Clutch',
    fuelType: 'Twin-Turbo V6 Hybrid (AWD)',
    seats: 2,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 74,
    speed: 112,
    lat: -33.9249,
    lng: 18.4241,
    locationName: "En Route — Victoria Rd / Camps Bay",
    rating: 5.0,
    horsepower: 600,
    zeroToHundred: '2.7s',
    topSpeed: '307 km/h',
    rangeOrConsumption: '11.1 L / 100 km'
  },

  // --- GERMANY ---
  {
    id: 201,
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Sports',
    origin: 'Germany',
    dailyRate: 11500,
    purchasePrice: 5900000,
    transmission: '7-Speed PDK Dual-Clutch',
    fuelType: 'Naturally Aspirated 4.0L Flat-6',
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
    model: 'i7 M70 xDrive',
    year: 2024,
    category: 'Luxury',
    origin: 'Germany',
    dailyRate: 5800,
    purchasePrice: 3850000,
    transmission: 'Single-Speed Direct Drive',
    fuelType: 'Dual Electric Motors (AWD)',
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
    zeroToHundred: '3.5s',
    topSpeed: '250 km/h (limited)',
    rangeOrConsumption: '488 km range (WLTP)'
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
    fuelType: '4.0L V8 Biturbo Hybrid',
    seats: 4,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 92,
    speed: 0,
    lat: -33.9818,
    lng: 18.4650,
    locationName: 'Claremont Hub',
    rating: 4.9,
    horsepower: 843,
    zeroToHundred: '2.9s',
    topSpeed: '316 km/h',
    rangeOrConsumption: '8.5 L / 100 km'
  },
  {
    id: 204,
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'Germany',
    dailyRate: 6200,
    purchasePrice: 3300000,
    transmission: '2-Speed Automatic',
    fuelType: 'Dual Electric Motors (Quattro)',
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
    topSpeed: '250 km/h (limited)',
    rangeOrConsumption: '472 km range (WLTP)'
  },

  // --- USA ---
  {
    id: 301,
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 4900,
    purchasePrice: 2600000,
    transmission: 'Single-Speed Direct Drive',
    fuelType: 'Tri-Motor Electric (AWD)',
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
    rangeOrConsumption: '637 km range (EPA)'
  },
  {
    id: 302,
    make: 'Rivian',
    model: 'R1S Performance (Quad-Motor)',
    year: 2024,
    category: 'SUV',
    origin: 'USA',
    dailyRate: 4500,
    purchasePrice: 2400000,
    transmission: 'Single-Speed Direct Drive',
    fuelType: 'Quad Electric Motors (AWD)',
    seats: 7,
    status: 'rented',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    fuelPercent: 68,
    speed: 84,
    lat: -33.9350,
    lng: 18.4720,
    locationName: 'En Route — N2 Airport Freeway',
    rating: 4.8,
    horsepower: 835,
    zeroToHundred: '3.1s',
    topSpeed: '200 km/h (limited)',
    rangeOrConsumption: '516 km range (EPA)'
  },
  {
    id: 303,
    make: 'Ford',
    model: 'Mustang Mach-E GT Performance Edition',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 3100,
    purchasePrice: 1650000,
    transmission: 'Single-Speed Direct Drive',
    fuelType: 'Dual Electric Motors (AWD)',
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
    zeroToHundred: '3.5s',
    topSpeed: '200 km/h (limited)',
    rangeOrConsumption: '434 km range (WLTP)'
  }
];

const initialReviews: Review[] = [
  {
    id: 1,
    author: 'Elena Rostova',
    role: 'Managing Director, Horizon Global',
    rating: 5,
    comment: 'The Nissan GT-R NISMO delivery to our private yacht at V&A Waterfront was flawless. DriveFleet provides an unmatched ultra-luxury mobility experience in South Africa.',
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

  // Route animation clock (drives cars along real roads on the map)
  const routeClockRef = useRef(0);

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

  // Dynamic Live Simulation for Vehicle Telemetry — rented cars with a known
  // route drive along real Cape Town roads; others get light positional jitter.
  useEffect(() => {
    const interval = setInterval(() => {
      routeClockRef.current += 0.045;
      const clock = routeClockRef.current;
      setVehicles(prev => prev.map(v => {
        if (v.status !== 'rented') return v;
        const route = VEHICLE_ROUTES[v.id];
        if (route) {
          const direction = pingPong(clock + v.id) ;
          const forward = (clock + v.id * 0.37) % 2 < 1;
          const [lat, lng] = pointAtRoute(route, direction);
          return {
            ...v,
            lat,
            lng,
            speed: forward ? 70 + Math.floor(Math.random() * 50) : 40 + Math.floor(Math.random() * 30),
            fuelPercent: Math.max(5, v.fuelPercent - (Math.random() > 0.7 ? 1 : 0)),
          };
        }
        return {
          ...v,
          speed: Math.floor(75 + Math.random() * 45),
          fuelPercent: Math.max(5, v.fuelPercent - (Math.random() > 0.6 ? 1 : 0)),
          lat: v.lat + (Math.random() * 0.002 - 0.001),
          lng: v.lng + (Math.random() * 0.002 - 0.001)
        };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Keep the focused telemetry card in sync with live vehicle updates
  useEffect(() => {
    setFocusedVehicle(prev => vehicles.find(v => v.id === prev.id) || prev);
  }, [vehicles]);

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

  // Precompute static SVG paths once
  const landPath = useMemo(() => pathFromCoords(CAPE_LANDMASS), []);
  const roadPaths = useMemo(() => ROADS.map(r => ({ name: r.name, d: pathFromCoords(r.coords) })), []);
  const [tmX, tmY] = project(TABLE_MOUNTAIN[0], TABLE_MOUNTAIN[1]);
  const [riX, riY] = project(ROBBEN_ISLAND[0], ROBBEN_ISLAND[1]);

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
              <Navigation className="w-4 h-4" /> Live Map
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
                        alt={`${v.make} ${v.model}`}
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

        {/* VIEW 2: LIVE MAP — real Cape Town coastline, roads, depots & moving cars */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Map Visual Container */}
            <div className="lg:col-span-2 bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-5 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" /> Cape Town Live Telemetry Map
                  </h2>
                  <p className="text-[11px] text-slate-400">GPS positions refresh every 2.5 seconds along real road corridors</p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-[10px] font-mono font-bold whitespace-nowrap">
                  ● LIVE
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-cyan-950/70 bg-[#08111f]">
                <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-auto max-h-[640px]" role="img" aria-label="Map of Cape Town showing DriveFleet vehicle positions">
                  <defs>
                    <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#04283a" />
                      <stop offset="100%" stopColor="#031a28" />
                    </linearGradient>
                    <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d1c22" />
                      <stop offset="100%" stopColor="#0a1519" />
                    </linearGradient>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M24 0H0V24" fill="none" stroke="#0891b2" strokeOpacity="0.06" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* Ocean base */}
                  <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#ocean)" />
                  <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#grid)" />

                  {/* Land mass */}
                  <path d={landPath} fill="url(#land)" stroke="#0e7490" strokeOpacity="0.5" strokeWidth="1.5" />

                  {/* Robben Island */}
                  <circle cx={riX} cy={riY} r="4" fill="#1e293b" stroke="#0891b2" strokeOpacity="0.4" />

                  {/* Table Mountain marker */}
                  <g transform={`translate(${tmX - 9}, ${tmY - 22})`} opacity="0.85">
                    <Mountain x="0" y="0" width="18" height="18" color="#64748b" />
                  </g>
                  <text x={tmX} y={tmY + 2} fontSize="8" fill="#64748b" textAnchor="middle" fontFamily="monospace">TABLE MTN</text>

                  {/* Roads */}
                  {roadPaths.map((r, i) => (
                    <path key={i} d={r.d} fill="none" stroke="#22d3ee" strokeOpacity="0.35" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
                  ))}

                  {/* Branch depots */}
                  {capeTownBranches.map(b => {
                    const [x, y] = project(b.lat, b.lng);
                    return (
                      <g key={b.id} transform={`translate(${x}, ${y})`}>
                        <circle r="9" fill="#0891b2" fillOpacity="0.15" />
                        <circle r="4.5" fill="#06b6d4" stroke="#e6fffb" strokeWidth="1" />
                        <text x="9" y="4" fontSize="9" fill="#a5f3fc" fontFamily="monospace" fontWeight="700">{b.area}</text>
                      </g>
                    );
                  })}

                  {/* Vehicles */}
                  {vehicles.map(v => {
                    const [x, y] = project(v.lat, v.lng);
                    const isFocused = focusedVehicle.id === v.id;
                    const color = v.status === 'rented' ? '#fbbf24' : v.status === 'available' ? '#34d399' : '#64748b';
                    return (
                      <g
                        key={v.id}
                        transform={`translate(${x}, ${y})`}
                        style={{ transition: 'transform 2.3s linear', cursor: 'pointer' }}
                        onClick={() => setFocusedVehicle(v)}
                      >
                        {v.status === 'rented' && (
                          <circle r="10" fill={color} fillOpacity="0.25">
                            <animate attributeName="r" values="7;13;7" dur="2.4s" repeatCount="indefinite" />
                            <animate attributeName="fill-opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle r={isFocused ? 7 : 5.5} fill={color} stroke="#030712" strokeWidth="1.5" />
                        {isFocused && (
                          <circle r="10.5" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.8" />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md border border-cyan-950/80 rounded-xl px-3 py-2 flex flex-col gap-1.5 text-[10px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Available</span>
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> En Route</span>
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Depot</span>
                </div>
              </div>

              {/* Live Telemetry Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-4 bg-slate-900/80 p-4 mt-4 rounded-xl border border-cyan-950 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{focusedVehicle.make} {focusedVehicle.model}</span>
                  <span className="text-xl font-mono font-black text-cyan-400">{focusedVehicle.speed} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Energy / Fuel</span>
                  <span className="text-xl font-mono font-black text-emerald-400">{focusedVehicle.fuelPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className="text-xl font-mono font-black text-amber-400 capitalize">{focusedVehicle.status}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Selection List for Map */}
            <div className="bg-slate-950/80 border border-cyan-950/80 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" /> Active Vehicles ({vehicles.length})
              </h3>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[560px] pr-2">
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
                    <img src={v.imageUrl} alt={`${v.make} ${v.model}`} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
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
              DriveFleet Cape Town offers dynamic telemetry integration across Japanese, German, and USA performance engineering standards, with every listed figure sourced from manufacturer specifications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 bg-slate-900/60 border border-cyan-950 rounded-2xl">
                <h4 className="font-bold text-cyan-400 text-xs uppercase font-mono mb-1">Live Road-Mapped Telemetry</h4>
                <p className="text-xs text-slate-400">Rented vehicles are animated along real Cape Town corridors — Victoria Road, the M3 and the N2 — with GPS coordinates refreshed every 2.5 seconds.</p>
              </div>
              <div className="p-5 bg-slate-900/60 border border-cyan-950 rounded-2xl">
                <h4 className="font-bold text-cyan-400 text-xs uppercase font-mono mb-1">Dual Transaction Model</h4>
                <p className="text-xs text-slate-400">Seamlessly toggle between short-term executive rentals or direct purchase acquisitions in ZAR.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-cyan-950/70">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Power</th>
                    <th className="px-4 py-3">0–100 km/h</th>
                    <th className="px-4 py-3">Top Speed</th>
                    <th className="px-4 py-3">Range / Consumption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-950/50">
                  {vehicles.map(v => (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition">
                      <td className="px-4 py-3 text-white font-bold whitespace-nowrap">{v.make} {v.model}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">{v.horsepower} HP</td>
                      <td className="px-4 py-3 font-mono text-slate-300">{v.zeroToHundred}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">{v.topSpeed}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">{v.rangeOrConsumption}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                      <img src={item.vehicle.imageUrl} alt={`${item.vehicle.make} ${item.vehicle.model}`} className="w-24 h-18 rounded-xl object-cover" />
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
              </form>
            )}
          </div>
        )}

      </main>

      {/* MODAL 1: AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-950 rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white mb-1">VIP Member Portal</h3>
            <p className="text-xs text-slate-400 mb-6">Sign in for priority Cape Town fleet allocation.</p>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl text-xs mt-2"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOKING MODAL */}
      {bookingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-950 rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setBookingVehicle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Configure Booking</h3>
            <p className="text-xs text-cyan-400 font-bold mb-4">{bookingVehicle.make} {bookingVehicle.model}</p>

            <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-2xl border border-slate-800 mb-6">
              <img src={bookingVehicle.imageUrl} alt={`${bookingVehicle.make} ${bookingVehicle.model}`} className="w-18 h-14 rounded-xl object-cover" />
              <div>
                <span className="text-xs font-bold text-white block">Daily Rate</span>
                <span className="text-sm font-mono text-cyan-400 font-bold">R{bookingVehicle.dailyRate.toLocaleString()} / day</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs text-slate-400 block mb-2 font-medium">Rental Period (Days)</label>
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2">
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
              <span className="text-slate-400">Total Calculation</span>
              <span className="text-lg font-mono font-bold text-white">R{(bookingVehicle.dailyRate * rentalDays).toLocaleString()}</span>
            </div>

            <button
              onClick={handleBookVehicle}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl text-xs"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: SPECS DETAIL MODAL */}
      {detailVehicle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-950 rounded-3xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setDetailVehicle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4">
              <img src={detailVehicle.imageUrl} alt={`${detailVehicle.make} ${detailVehicle.model}`} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-extrabold text-white">{detailVehicle.make} {detailVehicle.model}</h3>
            <p className="text-xs text-cyan-400 font-bold mb-6">{detailVehicle.year} • {detailVehicle.origin} Origin • {detailVehicle.category}</p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Output</span>
                <span className="font-bold text-white font-mono">{detailVehicle.horsepower} HP</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Acceleration (0-100)</span>
                <span className="font-bold text-white font-mono">{detailVehicle.zeroToHundred}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Top Speed</span>
                <span className="font-bold text-white font-mono">{detailVehicle.topSpeed}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block text-[10px]">Efficiency / Range</span>
                <span className="font-bold text-white font-mono">{detailVehicle.rangeOrConsumption}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAddToCart(detailVehicle, 'rental', 3)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Reserve (R{detailVehicle.dailyRate}/day)
              </button>
              <button
                onClick={() => handleAddToCart(detailVehicle, 'purchase')}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl text-xs"
              >
                Buy (R{(detailVehicle.purchasePrice / 1000000).toFixed(2)}M)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD VEHICLE MODAL */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-950 rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsAddVehicleOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Fleet Vehicle</h3>

            <form onSubmit={handleAddVehicle} className="flex flex-col gap-3 text-xs">
              <input
                type="text"
                placeholder="Make (e.g. Porsche)"
                required
                value={newVehicle.make}
                onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600"
              />
              <input
                type="text"
                placeholder="Model (e.g. Taycan Turbo S)"
                required
                value={newVehicle.model}
                onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Daily Rate (ZAR)"
                  required
                  value={newVehicle.dailyRate}
                  onChange={e => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600"
                />
                <input
                  type="number"
                  placeholder="Purchase Price (ZAR)"
                  required
                  value={newVehicle.purchasePrice}
                  onChange={e => setNewVehicle({ ...newVehicle, purchasePrice: Number(e.target.value) })}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600"
                />
              </div>
              <input
                type="text"
                placeholder="Image URL"
                value={newVehicle.imageUrl}
                onChange={e => setNewVehicle({ ...newVehicle, imageUrl: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black rounded-xl mt-2"
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
