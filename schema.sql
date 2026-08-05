CREATE DATABASE IF NOT EXISTS car_rental_db;
USE car_rental_db;

-- Users (Renters & Owners)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('renter', 'owner', 'admin') DEFAULT 'renter',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fleet Inventory
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT DEFAULT 1,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  category ENUM('Sedan', 'SUV', 'EV / Hybrid', 'Luxury', 'Van') NOT NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  transmission ENUM('Automatic', 'Manual') DEFAULT 'Automatic',
  fuel_type ENUM('Electric', 'Gasoline', 'Hybrid', 'Diesel') DEFAULT 'Gasoline',
  seats INT DEFAULT 5,
  status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
  image_url VARCHAR(500),
  lat DECIMAL(10, 8) DEFAULT 37.774929,
  lng DECIMAL(11, 8) DEFAULT -122.419416,
  fuel_percent INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Car Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  license_photo VARCHAR(255),
  status ENUM('confirmed', 'active', 'completed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Seed Initial Vehicle Fleet
INSERT INTO vehicles (make, model, year, category, daily_rate, transmission, fuel_type, seats, status, image_url, lat, lng, fuel_percent)
VALUES 
('Tesla', 'Model 3', 2024, 'EV / Hybrid', 89.00, 'Automatic', 'Electric', 5, 'available', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80', 37.7749, -122.4194, 94),
('Porsche', '911 Carrera', 2023, 'Luxury', 249.00, 'Automatic', 'Gasoline', 4, 'available', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', 37.7833, -122.4167, 88),
('Ford', 'Bronco Wildtrak', 2023, 'SUV', 115.00, 'Automatic', 'Gasoline', 5, 'available', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 37.7690, -122.4480, 72),
('BMW', 'i4 M50', 2024, 'EV / Hybrid', 135.00, 'Automatic', 'Electric', 5, 'available', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', 37.7520, -122.4180, 100);
