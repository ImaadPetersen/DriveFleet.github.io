import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists for vehicle & license photos
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Storage Engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `fleet-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Fleet State (Simulated Sync for Live Socket.IO stream)
let fleet = [
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
    lat: 37.7749,
    lng: -122.4194,
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
    lat: 37.7833,
    lng: -122.4167,
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
    lat: 37.7690,
    lng: -122.4480,
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
    lat: 37.7520,
    lng: -122.4180,
    fuelPercent: 100,
    speed: 0
  }
];

let reservations = [];

// REST: Get All Vehicles
app.get('/api/vehicles', (req, res) => {
  res.json(fleet);
});

// REST: Onboard New Vehicle (Multer Photo Upload)
app.post('/api/vehicles', upload.single('vehicleImage'), (req, res) => {
  const { make, model, year, category, dailyRate, seats, fuelType } = req.body;
  
  const newVehicle = {
    id: fleet.length + 1,
    make,
    model,
    year: Number(year),
    category,
    dailyRate: Number(dailyRate),
    transmission: 'Automatic',
    fuelType,
    seats: Number(seats),
    status: 'available',
    imageUrl: req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    lat: 37.7749 + (Math.random() - 0.5) * 0.05,
    lng: -122.4194 + (Math.random() - 0.5) * 0.05,
    fuelPercent: 100,
    speed: 0
  };

  fleet.push(newVehicle);
  io.emit('fleet:updated', fleet);
  res.status(201).json(newVehicle);
});

// REST: Create Reservation & Upload License
app.post('/api/reservations', upload.single('licensePhoto'), (req, res) => {
  const { vehicleId, customerName, customerEmail, startDate, endDate, totalPrice } = req.body;

  const targetVehicle = fleet.find(v => v.id === Number(vehicleId));
  if (!targetVehicle || targetVehicle.status !== 'available') {
    return res.status(400).json({ error: 'Vehicle unavailable.' });
  }

  targetVehicle.status = 'rented';

  const reservation = {
    id: `RES-${Date.now()}`,
    vehicleId: Number(vehicleId),
    customerName,
    customerEmail,
    startDate,
    endDate,
    totalPrice: Number(totalPrice),
    licensePhoto: req.file ? `/uploads/${req.file.filename}` : null,
    status: 'confirmed',
    createdAt: new Date()
  };

  reservations.push(reservation);
  io.emit('fleet:updated', fleet);

  res.status(201).json({ message: 'Vehicle reserved successfully!', reservation });
});

// Socket.IO Connection & Live Telemetry Broadcasting
io.on('connection', (socket) => {
  console.log(`[Socket] DriveFleet Client Connected: ${socket.id}`);
  socket.emit('fleet:updated', fleet);
});

// Telematics Simulator: Streams GPS coordinates and speed for active rentals
setInterval(() => {
  let updated = false;
  fleet.forEach(car => {
    if (car.status === 'rented') {
      car.lat += (Math.random() - 0.48) * 0.001;
      car.lng += (Math.random() - 0.48) * 0.001;
      car.speed = Math.floor(Math.random() * 35) + 25;
      if (Math.random() > 0.7 && car.fuelPercent > 10) car.fuelPercent -= 1;
      updated = true;
    }
  });

  if (updated) {
    io.emit('telemetry:stream', fleet.filter(c => c.status === 'rented'));
  }
}, 3000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚗 DriveFleet Backend Live on http://localhost:${PORT}`);
});
