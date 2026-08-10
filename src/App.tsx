import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Car, Shield, Navigation, Fuel, Users, Calendar, Filter, Plus, X,
  MapPin, CheckCircle2, Zap, Activity, DollarSign, Search,
  BatteryCharging, Clock, ChevronRight, User, LogIn, LogOut, Star,
  Award, HeartHandshake, HelpCircle, MessageSquare, Sparkles, Send,
  ShoppingCart, Trash2, CreditCard, ArrowLeft, Check, Lock, Gauge, UserPlus,
  Compass, Globe, Building2, Phone, ExternalLink, Info, CheckCircle, Sliders,
  SlidersHorizontal, ChevronDown, Eye, ShieldCheck, Sparkle, Mountain,
  Anchor, Route as RouteIcon, Plane, Play, Pause, Volume2, VolumeX
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

const CAPE_LANDMASS: [number, number][] = [
  [-33.80, 18.46],
  [-33.86, 18.50],
  [-33.895, 18.435],
  [-33.905, 18.421],
  [-33.915, 18.385],
  [-33.940, 18.376],
  [-33.951, 18.378],
  [-34.005, 18.348],
  [-34.049, 18.354],
  [-34.093, 18.360],
  [-34.110, 18.380],
  [-34.140, 18.325],
  [-34.200, 18.380],
  [-34.193, 18.429],
  [-34.108, 18.470],
  [-34.050, 18.465],
  [-33.998, 18.465],
  [-33.982, 18.465],
  [-33.958, 18.470],
  [-33.955, 18.510],
  [-33.892, 18.5085],
  [-33.905, 18.560],
  [-33.930, 18.620],
  [-33.9715, 18.6021],
  [-34.05, 18.68],
  [-34.22, 18.68],
  [-34.22, 18.32],
  [-33.78, 18.32],
  [-33.78, 18.46],
];

const TABLE_MOUNTAIN: [number, number] = [-33.9628, 18.4098];
const ROBBEN_ISLAND: [number, number] = [-33.807, 18.366];

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

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  category: 'Sports' | 'EV / Hybrid' | 'Luxury' | 'SUV';
  origin: 'Japan' | 'Germany' | 'USA' | 'Other';
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
  horsepower: number;
  zeroToHundred: string;
  topSpeed: string;
  rangeOrConsumption: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface Review {
  id: number;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

interface CartItem {
  vehicle: Vehicle;
  type: 'rental' | 'purchase';
  rentalDays?: number;
}

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

// FIXED: Exact matching vehicle images for every entry
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
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', // Exact Nissan GT-R
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
    imageUrl: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&w=1200&q=80', // Exact Toyota Supra
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
    imageUrl: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80', // Exotic Sports Hybrid / NSX profile
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
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', // Exact Porsche 911 GT3
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
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', // Exact BMW Sedan
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
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', // Exact Mercedes-AMG GT
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
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', // Exact Audi e-tron GT
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
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80', // Exact Tesla Model S
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
    imageUrl: 'https://images.unsplash.com/photo-1669048033620-71707248c062?auto=format&fit=crop&w=1200&q=80', // Exact Electric SUV Rivian
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
    model: 'Mustang Mach-E GT Performance',
    year: 2024,
    category: 'EV / Hybrid',
    origin: 'USA',
    dailyRate: 3100,
    purchasePrice: 1650000,
    transmission: 'Single-Speed Direct Drive',
    fuelType: 'Dual Electric Motors (AWD)',
    seats: 5,
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', // Ford Performance
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

  // Video Showcase Player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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

  // Route animation clock
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

  // Review state
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

  // Dynamic Live Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      routeClockRef.current += 0.045;
      const clock = routeClockRef.current;
      setVehicles(prev => prev.map(v => {
        if (v.status !== 'rented') return v;
        const route = VEHICLE_ROUTES[v.id];
        if (route) {
          const direction = pingPong(clock + v.id);
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

  useEffect(() => {
    setFocusedVehicle(prev => vehicles.find(v => v.id === prev.id) || prev);
  }, [vehicles]);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

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
  const estimatedVAT = subtotal * 0.15;
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

  const landPath = useMemo(() => pathFromCoords(CAPE_LANDMASS), []);
  const roadPaths = useMemo(() => ROADS.map(r => ({ name: r.name, d: pathFromCoords(r.coords) })), []);
  const [tmX, tmY] = project(TABLE_MOUNTAIN[0], TABLE_MOUNTAIN[1]);
  const [riX, riY] = project(ROBBEN_ISLAND[0], ROBBEN_ISLAND[1]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-400 selection:text-black font-sans antialiased relative overflow-x-hidden">

      {/* AMBIENT GLOWS */}
      <div className="fixed top-0 left-1/3 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[220px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[200px] pointer-events-none" />

      {/* ANNOUNCEMENT BAR */}
      <div className="bg-slate-950 border-b border-cyan-950/80 px-6 py-2 text-[11px] font-semibold text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Cape Town VIP Doorstep Delivery Active</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">100% Insured Fleet</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-cyan-400" /> Concierge: +27 (0)21 400 1000</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully Insured</span>
          </div>
        </div>
      </div>

      {/* EXECUTIVE NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-3xl border-b border-cyan-950/80 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          {/* Logo */}
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

          {/* Nav Links */}
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
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/20"
              >
                <LogIn className="w-4 h-4" /> VIP Access
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: VEHICLE FLEET CATALOG & DEALERSHIP VIDEO SHOWCASE */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'fleet' && (
          <div className="space-y-10">

            {/* DEALERSHIP FLEET SHOWCASE VIDEO PLAYER */}
            <div className="relative rounded-3xl overflow-hidden border border-cyan-950 bg-slate-950 shadow-2xl group">
              <div className="relative h-[340px] md:h-[420px] w-full overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition duration-700"
                  src="https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-road-at-sunset-41617-large.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
              </div>

              {/* Video Overlay Info & Controls */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div className="max-w-xl space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/40 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" /> DEALERSHIP SHOWCASE
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase font-mono">
                    Experience Our Entire Cape Town Fleet
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 line-clamp-2">
                    Tour our available lineup including the Nissan GT-R NISMO, Porsche 911 GT3 RS, Mercedes-AMG GT 63 S, and Tesla Model S Plaid in 4K resolution.
                  </p>
                </div>

                <div className="flex items-center gap-3 backdrop-blur-md bg-slate-900/80 p-2 rounded-2xl border border-white/10">
                  <button
                    onClick={toggleVideoPlay}
                    className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition shadow-lg"
                    title={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={toggleVideoMute}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition"
                    title={isMuted ? "Unmute Sound" : "Mute Sound"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/80 p-4 rounded-2xl border border-cyan-950">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search model, make or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedCategory === cat ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* VEHICLES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="bg-slate-950 border border-cyan-950 hover:border-cyan-500/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl"
                >
                  {/* Image Container */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/30">
                        {vehicle.origin}
                      </span>
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-bold rounded-full border border-slate-700">
                        {vehicle.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {vehicle.rating}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs text-cyan-400 font-mono uppercase font-bold">{vehicle.make}</p>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">{vehicle.model}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {vehicle.locationName}
                      </p>
                    </div>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-900 text-center text-[11px]">
                      <div>
                        <p className="text-slate-500 text-[9px] uppercase font-mono">Power</p>
                        <p className="font-bold text-slate-200">{vehicle.horsepower} HP</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[9px] uppercase font-mono">0-100 km/h</p>
                        <p className="font-bold text-slate-200">{vehicle.zeroToHundred}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[9px] uppercase font-mono">Top Speed</p>
                        <p className="font-bold text-slate-200">{vehicle.topSpeed}</p>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-mono">Rental / Day</p>
                        <p className="text-lg font-black text-white font-mono">R {vehicle.dailyRate.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailVehicle(vehicle)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => setBookingVehicle(vehicle)}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black transition shadow-lg shadow-cyan-500/20"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: LIVE TELEMETRY MAP */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-950 border border-cyan-950 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[550px]">
              <div className="flex justify-between items-center z-10">
                <div>
                  <h3 className="text-lg font-mono font-black text-white">Cape Peninsula Telemetry Map</h3>
                  <p className="text-xs text-slate-400">Live GPS position tracking for active fleet</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Realtime Sync
                </span>
              </div>

              {/* SVG Stylized Map */}
              <div className="relative my-4 flex justify-center">
                <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-auto max-h-[480px]">
                  <path d={landPath} fill="#091322" stroke="#1e293b" strokeWidth="2" />
                  {roadPaths.map((r, i) => (
                    <path key={i} d={r.d} fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                  ))}
                  {/* Table Mountain Marker */}
                  <g transform={`translate(${tmX}, ${tmY})`}>
                    <circle r="6" fill="#f59e0b" opacity="0.8" />
                    <text x="10" y="4" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Table Mountain</text>
                  </g>
                  {/* Vehicles on Map */}
                  {vehicles.map(v => {
                    const [vx, vy] = project(v.lat, v.lng);
                    const isFocused = focusedVehicle.id === v.id;
                    return (
                      <g key={v.id} transform={`translate(${vx}, ${vy})`} className="cursor-pointer" onClick={() => setFocusedVehicle(v)}>
                        <circle r={isFocused ? "10" : "6"} fill={v.status === 'rented' ? '#38bdf8' : '#10b981'} opacity="0.8" className="animate-pulse" />
                        <circle r={isFocused ? "5" : "3"} fill="#ffffff" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Focused Vehicle Telemetry Panel */}
            <div className="bg-slate-950 border border-cyan-950 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Focused Telemetry</span>
                <h3 className="text-xl font-bold text-white mt-1">{focusedVehicle.make} {focusedVehicle.model}</h3>
                <p className="text-xs text-slate-400 mt-1">{focusedVehicle.locationName}</p>

                <img src={focusedVehicle.imageUrl} alt={focusedVehicle.model} className="w-full h-40 object-cover rounded-2xl my-4 border border-slate-800" />

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl">
                    <span className="text-slate-400">Current Speed</span>
                    <span className="text-cyan-400 font-bold">{focusedVehicle.speed} km/h</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl">
                    <span className="text-slate-400">Battery / Fuel Level</span>
                    <span className="text-emerald-400 font-bold">{focusedVehicle.fuelPercent}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl">
                    <span className="text-slate-400">Latitude / Longitude</span>
                    <span className="text-slate-300">{focusedVehicle.lat.toFixed(3)}, {focusedVehicle.lng.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBookingVehicle(focusedVehicle)}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition shadow-lg"
              >
                Reserve This Vehicle
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: BRANCHES / DEPOTS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-mono text-white">Cape Town Executive Depots</h2>
              <p className="text-xs text-slate-400">Pick up or drop off your supercar at any of our luxury hubs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capeTownBranches.map(branch => (
                <div key={branch.id} className="bg-slate-950 border border-cyan-950 p-6 rounded-3xl space-y-4">
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl w-fit">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5">{branch.area}</p>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 font-mono">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" /> {branch.address}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-500" /> {branch.phone}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> {branch.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: PERFORMANCE TECH */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black font-mono text-white">Full Fleet Performance Matrix</h2>
              <p className="text-xs text-slate-400">Compare power, speed, acceleration and pricing side-by-side</p>
            </div>

            <div className="overflow-x-auto bg-slate-950 border border-cyan-950 rounded-3xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 border-b border-slate-800 text-cyan-400 uppercase">
                  <tr>
                    <th className="p-4">Vehicle Model</th>
                    <th className="p-4">Origin</th>
                    <th className="p-4">Horsepower</th>
                    <th className="p-4">0-100 km/h</th>
                    <th className="p-4">Top Speed</th>
                    <th className="p-4">Daily Rate</th>
                    <th className="p-4">Purchase Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {vehicles.map(v => (
                    <tr key={v.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4 font-bold text-white">{v.make} {v.model}</td>
                      <td className="p-4">{v.origin}</td>
                      <td className="p-4 text-cyan-400 font-bold">{v.horsepower} HP</td>
                      <td className="p-4">{v.zeroToHundred}</td>
                      <td className="p-4">{v.topSpeed}</td>
                      <td className="p-4 text-emerald-400">R {v.dailyRate.toLocaleString()}</td>
                      <td className="p-4">R {v.purchasePrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: CONCIERGE REVIEWS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black font-mono text-white">VIP Concierge Reviews</h2>
              <p className="text-xs text-slate-400">Verified feedback from our global clientele</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-slate-950 border border-cyan-950 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                  </div>
                  <div className="border-t border-slate-900 pt-3">
                    <p className="text-xs font-bold text-white">{rev.author}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">{rev.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="bg-slate-950 border border-cyan-950 p-6 rounded-3xl space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-white">Leave a Review</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your DriveFleet experience..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                rows={3}
              />
              <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition">
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 6: CART & CHECKOUT */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'cart' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-black font-mono text-white">Your Executive Reservation Cart</h2>

            {cart.length === 0 ? (
              <div className="bg-slate-950 border border-cyan-950 rounded-3xl p-12 text-center space-y-4">
                <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-sm">Your cart is currently empty.</p>
                <button
                  onClick={() => setActiveTab('fleet')}
                  className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Browse Fleet
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 border border-cyan-950 p-4 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={item.vehicle.imageUrl} alt={item.vehicle.model} className="w-20 h-14 object-cover rounded-xl" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.vehicle.make} {item.vehicle.model}</h4>
                          <p className="text-xs text-cyan-400 font-mono">
                            {item.type === 'rental' ? `Rental (${item.rentalDays} Days)` : 'Direct Purchase'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className="text-sm font-black font-mono text-white">
                          R {(item.type === 'rental' ? item.vehicle.dailyRate * (item.rentalDays || 1) : item.vehicle.purchasePrice).toLocaleString()}
                        </p>
                        <button onClick={() => handleRemoveFromCart(item.vehicle.id)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Box */}
                <div className="bg-slate-950 border border-cyan-950 p-6 rounded-3xl space-y-4">
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>R {subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Estimated 15% VAT</span><span>R {estimatedVAT.toLocaleString()}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Delivery Fee</span><span>R {deliveryFee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-900"><span>Grand Total</span><span className="text-cyan-400">R {grandTotal.toLocaleString()}</span></div>
                  </div>

                  <button
                    onClick={handleFinalCheckout}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition shadow-lg"
                  >
                    Confirm & Complete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: VEHICLE SPECIFICATIONS & DETAIL MODAL */}
      {/* ------------------------------------------------------------------ */}
      {detailVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-950 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative overflow-hidden">
            <button onClick={() => setDetailVehicle(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img src={detailVehicle.imageUrl} alt={detailVehicle.model} className="w-32 h-20 object-cover rounded-xl" />
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">{detailVehicle.make}</span>
                <h3 className="text-xl font-bold text-white">{detailVehicle.model} ({detailVehicle.year})</h3>
                <p className="text-xs text-slate-400">{detailVehicle.locationName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-xl">
                <p className="text-slate-500 text-[10px]">Transmission</p>
                <p className="font-bold text-slate-200 mt-1">{detailVehicle.transmission}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <p className="text-slate-500 text-[10px]">Engine / Powertrain</p>
                <p className="font-bold text-slate-200 mt-1">{detailVehicle.fuelType}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <p className="text-slate-500 text-[10px]">Seating Capacity</p>
                <p className="font-bold text-slate-200 mt-1">{detailVehicle.seats} Seats</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <p className="text-slate-500 text-[10px]">Horsepower</p>
                <p className="font-bold text-cyan-400 mt-1">{detailVehicle.horsepower} HP</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <p className="text-slate-500 text-[10px]">0-100 km/h</p>
                <p className="font-bold text-slate-200 mt-1">{detailVehicle.zeroToHundred}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl">
                <p className="text-slate-500 text-[10px]">Efficiency / Range</p>
                <p className="font-bold text-slate-200 mt-1">{detailVehicle.rangeOrConsumption}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleAddToCart(detailVehicle, 'rental');
                  setDetailVehicle(null);
                }}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition"
              >
                Reserve Rental
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: ADD VEHICLE MODAL */}
      {/* ------------------------------------------------------------------ */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddVehicle} className="bg-slate-950 border border-cyan-950 rounded-3xl max-w-lg w-full p-6 space-y-4 relative">
            <button type="button" onClick={() => setIsAddVehicleOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-mono font-bold text-white">Add Supercar to Fleet</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Make (e.g. Ferrari)"
                value={newVehicle.make}
                onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
                required
              />
              <input
                type="text"
                placeholder="Model (e.g. 296 GTB)"
                value={newVehicle.model}
                onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
                required
              />
              <input
                type="number"
                placeholder="Daily Rate (ZAR)"
                value={newVehicle.dailyRate}
                onChange={e => setNewVehicle({ ...newVehicle, dailyRate: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newVehicle.imageUrl}
                onChange={e => setNewVehicle({ ...newVehicle, imageUrl: e.target.value })}
                className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
                required
              />
            </div>

            <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
              Add Vehicle
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 3: VIP AUTH MODAL */}
      {/* ------------------------------------------------------------------ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAuthSubmit} className="bg-slate-950 border border-cyan-950 rounded-3xl max-w-sm w-full p-6 space-y-4 relative">
            <button type="button" onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-mono font-bold text-white">VIP Concierge Access</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={authName}
              onChange={e => setAuthName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={authEmail}
              onChange={e => setAuthEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white"
              required
            />

            <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
              Login as VIP
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
