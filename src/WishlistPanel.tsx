import { useFleetStore } from "../store/fleetStore";

export default function WishlistPanel() {

  const wishlist =
    useFleetStore((s) => s.wishlist);

  return (
    <div
      className="
        bg-slate-900
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-white text-2xl font-bold">
        Wishlist
      </h2>

      <div className="mt-4 space-y-3">

        {wishlist.length === 0 && (
          <p className="text-gray-400">
            No saved vehicles
          </p>
        )}

        {wishlist.map((item) => (
          <div
            key={item}
            className="
              bg-slate-800
              rounded-xl
              p-3
              text-white
            "
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
