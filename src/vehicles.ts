import { Vehicle } from "../types";

export const vehicles: Vehicle[] = [
  {
    id: "gtr",
    make: "Nissan",
    model: "GT-R NISMO",
    year: 2025,
    origin: "Japan",
    type: "Sports",
    image: "/vehicles/gtr.jpg",
    dailyRate: 4500,
    horsepower: 600,
    topSpeed: 330,
    zeroToHundred: 2.9,
    status: "Available",
    latitude: 35.6764,
    longitude: 139.6500
  },

  {
    id: "gt3rs",
    make: "Porsche",
    model: "911 GT3 RS",
    year: 2025,
    origin: "Germany",
    type: "Sports",
    image: "/vehicles/gt3rs.jpg",
    dailyRate: 6800,
    horsepower: 518,
    topSpeed: 296,
    zeroToHundred: 3.0,
    status: "Available",
    latitude: 48.1351,
    longitude: 11.5820
  },

  {
    id: "plaid",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2025,
    origin: "USA",
    type: "EV",
    image: "/vehicles/plaid.jpg",
    dailyRate: 5200,
    horsepower: 1020,
    topSpeed: 322,
    zeroToHundred: 2.1,
    status: "Rented",
    latitude: 37.7749,
    longitude: -122.4194
  }
];
