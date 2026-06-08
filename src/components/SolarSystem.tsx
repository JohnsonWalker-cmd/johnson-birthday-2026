
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const SolarSystem: React.FC = () => {
  // Generate random stars for the background layer
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100, // percentage
      size: Math.random() * 2 + 1, // 1px - 3px
      opacity: Math.random() * 0.3 + 0.1, // 0.1 - 0.4 base opacity
      duration: Math.random() * 3 + 2, // 2s - 5s
      delay: Math.random() * 5, // 0s - 5s
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* --- TWINKLING STAR FIELD (Deep Background) --- */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: star.opacity }}
          animate={{
            opacity: [star.opacity, 0.8, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
      
      {/* --- PLANET 1: THE RED GIANT (Bottom Left) --- */}
      <motion.div
        className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] md:w-[20vw] md:h-[20vw] rounded-full bg-gradient-to-tr from-red-900 via-orange-900/40 to-transparent blur-[2px] opacity-60"
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          rotate: { duration: 200, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Surface texture effect */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,100,50,0.1)_0%,_transparent_60%)]" />
      </motion.div>

      {/* --- PLANET 2: THE RINGED WANDERER (Top Right) --- */}
      <motion.div
        className="absolute top-[10%] right-[10%]"
        initial={{ y: 0 }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* The Planet Body */}
        <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-yellow-100/10 via-yellow-600/20 to-stone-900 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8)] opacity-70">
           {/* The Ring */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[40%] border-[2px] border-yellow-500/10 rounded-[50%] rotate-[-15deg] shadow-[0_0_10px_rgba(234,179,8,0.1)]" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[30%] border border-stone-500/20 rounded-[50%] rotate-[-15deg]" />
        </div>
      </motion.div>

      {/* --- PLANET 3: THE ICE GIANT (Deep Background Center) --- */}
      <motion.div
        className="absolute top-[40%] left-[60%] w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-b from-blue-500/5 to-purple-900/20 blur-xl"
        animate={{ 
          x: [-50, 50, -50],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      {/* --- PLANET 4: TINY MOON (Orbiting Red Giant) --- */}
      <motion.div
         className="absolute bottom-[20%] left-[15%] w-4 h-4 bg-gray-400 rounded-full opacity-40 shadow-[0_0_5px_white]"
         animate={{
             x: [0, 100, 0],
             y: [0, -50, 0],
             scale: [0.5, 1, 0.5],
             opacity: [0.2, 0.6, 0.2]
         }}
         transition={{
             duration: 25,
             repeat: Infinity,
             ease: "easeInOut"
         }}
      />

    </div>
  );
};

export default SolarSystem;
