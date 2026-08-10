export default function CustomerPortal() {
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
        Customer Portal
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mt-6">

        <div className="bg-slate-800 p-4 rounded-2xl">
          <h3 className="text-white">
            Active Rentals
          </h3>

          <p className="text-cyan-400 text-3xl font-bold">
            3
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl">
          <h3 className="text-white">
            Saved Vehicles
          </h3>

          <p className="text-cyan-400 text-3xl font-bold">
            12
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl">
          <h3 className="text-white">
            Loyalty Points
          </h3>

          <p className="text-cyan-400 text-3xl font-bold">
            24 500
          </p>
        </div>

      </div>
    </div>
  );
}
