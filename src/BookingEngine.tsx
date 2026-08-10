import { useState } from "react";
import { Calendar, CreditCard } from "lucide-react";

export default function BookingEngine() {
  const [days, setDays] = useState(1);

  const rate = 4500;

  const total = rate * days;

  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
      "
    >
      <h2 className="text-white text-2xl font-bold">
        Booking Engine
      </h2>

      <div className="mt-6">
        <label className="text-gray-400">
          Rental Days
        </label>

        <input
          type="number"
          value={days}
          min={1}
          onChange={(e) =>
            setDays(Number(e.target.value))
          }
          className="
            w-full
            mt-2
            bg-slate-800
            rounded-xl
            p-3
            text-white
          "
        />
      </div>

      <div className="mt-6">
        <p className="text-gray-400">
          Total Price
        </p>

        <p className="text-cyan-400 text-3xl font-bold">
          R{total.toLocaleString()}
        </p>
      </div>

      <button
        className="
          mt-6
          w-full
          bg-cyan-500
          py-3
          rounded-xl
          text-white
        "
      >
        <CreditCard className="inline mr-2" />
        Proceed To Checkout
      </button>
    </div>
  );
}
