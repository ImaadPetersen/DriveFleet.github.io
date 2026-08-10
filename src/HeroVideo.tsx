import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function HeroVideo() {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/videos/drivefleet-cinematic.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center max-w-5xl px-6">

          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-7xl font-black text-white"
          >
            DriveFleet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .5 }}
            className="text-xl text-gray-300 mt-6"
          >
            Global Luxury Fleet Management &
            Premium Vehicle Rentals
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-10 bg-cyan-500 px-8 py-4 rounded-xl text-white flex items-center gap-2 mx-auto"
          >
            <Play size={20}/>
            Explore Fleet
          </motion.button>

        </div>
      </div>
    </section>
  );
}
