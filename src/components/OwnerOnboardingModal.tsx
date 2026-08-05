import React, { useState } from 'react';
import { X } from 'lucide-react';

interface OwnerOnboardingModalProps {
  onClose: () => void;
}

export default function OwnerOnboardingModal({ onClose }: OwnerOnboardingModalProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2024');
  const [category, setCategory] = useState('EV / Hybrid');
  const [dailyRate, setDailyRate] = useState('95');
  const [seats, setSeats] = useState('5');
  const [fuelType, setFuelType] = useState('Electric');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('category', category);
    formData.append('dailyRate', dailyRate);
    formData.append('seats', seats);
    formData.append('fuelType', fuelType);
    if (imageFile) formData.append('vehicleImage', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Fleet Partner</span>
          <h2 className="text-2xl font-black text-white">List Your Car for Rent</h2>
          <p className="text-xs text-slate-400 mt-1">Earn income by offering your vehicle to verified drivers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Make</label>
              <input
                type="text"
                required
                placeholder="e.g. Audi"
                value={make}
                onChange={e => setMake(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Model</label>
              <input
                type="text"
                required
                placeholder="e.g. e-tron GT"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Year</label>
              <input
                type="number"
                required
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Daily Rate ($)</label>
              <input
                type="number"
                required
                value={dailyRate}
                onChange={e => setDailyRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option>EV / Hybrid</option>
                <option>Luxury</option>
                <option>SUV</option>
                <option>Sedan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Vehicle Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition mt-4"
          >
            Publish Vehicle to Fleet
          </button>
        </form>
      </div>
    </div>
  );
}
