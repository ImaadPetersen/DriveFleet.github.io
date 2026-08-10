import HeroVideo from "../components/HeroVideo";
import FleetStats from "../components/FleetStats";
import FleetMap from "../components/FleetMap";
import AIConcierge from "../components/AIConcierge";
import VehicleComparison from "../components/VehicleComparison";

export default function Dashboard() {
  return (
    <div className="bg-[#050816] min-h-screen">

      <HeroVideo />

      <div className="max-w-7xl mx-auto px-6">

        <FleetStats />

        <div className="mt-12">
          <FleetMap />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <AIConcierge />

          <VehicleComparison />

        </div>

      </div>

    </div>
  );
}
