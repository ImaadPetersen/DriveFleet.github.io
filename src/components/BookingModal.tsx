import React, { useState } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../App';

interface BookingModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export default function BookingModal({ vehicle, onClose }: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const calculateTotal = () => {
    if (!startDate || !endDate) return vehicle.dailyRate;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * vehicle.dailyRate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('vehicleId', String(vehicle.id));
    formData.append('customerName', customerName);
    formData.append('customerEmail', customerEmail);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('totalPrice', String(calculateTotal()));
    if (file) formData.append('licensePhoto', file);

    try {
      const res = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setConfirmed(true);
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
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

        {confirmed ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Reservation Confirmed!</h3>
            <p className="text-slate-400 text-sm">
              You reserved the <strong className="text-white">{vehicle.make} {vehicle.model}</strong>. Instructions to unlock the vehicle were sent to your email.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
            >
              Back to Fleet Dashboard
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Confirm Reservation</span>
              <h2 className="text-2xl font-black text-white">{vehicle.make} {vehicle.model}</h2>
              <p className="text-xs text-slate-400 mt-1">${vehicle.dailyRate} per day • {vehicle.fuelType}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pick-up Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Return Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Upload Driver's License (Verification)
                </label>
                <div className="border border-dashed border-slate-800 bg-slate-950/50 rounded-xl p-4 text-center cursor-pointer hover:border-slate-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="license-upload"
                  />
                  <label htmlFor="license-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <span className="text-xs text-slate-400">
                      {file ? file.name : 'Click to upload inspection/ID photo'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-400">Total Price:</span>
                <span className="text-2xl font-black text-cyan-400">${calculateTotal()}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition"
              >
                {loading ? 'Processing...' : 'Confirm & Reserve Now'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
