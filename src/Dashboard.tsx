import HeroVideo from "../components/HeroVideo";
import FleetStats from "../components/FleetStats";
import FleetMap from "../components/FleetMap";
import AIConcierge from "../components/AIConcierge";
import VehicleComparison from "../components/VehicleComparison";

import FleetCommandCenter from "../components/FleetCommandCenter";
import RevenueCharts from "../components/RevenueCharts";
import LiveTelemetry from "../components/LiveTelemetry";
import BookingEngine from "../components/BookingEngine";
import CustomerPortal from "../components/CustomerPortal";
import WishlistPanel from "../components/WishlistPanel";

export default function Dashboard() {
  return (
    <div className="bg-[#050816] min-h-screen">

      <HeroVideo />

      <div className="max-w-7xl mx-auto px-6">

        <FleetStats />

        <FleetCommandCenter />

<div className="grid lg:grid-cols-2 gap-8 mt-12">
  <RevenueCharts />
  <LiveTelemetry />
</div>

        <div className="mt-12">
          <FleetMap />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <AIConcierge />

          <VehicleComparison />

        </div>

      </div>

    </div>

    <div className="grid lg:grid-cols-3 gap-8 mt-12">
  <BookingEngine />
  <CustomerPortal />
  <WishlistPanel />
</div>
  );
}
