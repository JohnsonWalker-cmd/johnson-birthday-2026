import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { StarData } from '../../types';

interface StarProps {
  data: StarData;
  onClick: () => void;
}

const Star: React.FC<StarProps> = ({ data, onClick }) => {
  // Randomize animation parameters for an organic, non-uniform feel across the constellation
  const randomDelay = useMemo(() => Math.random() * 2, []);
  const pulseDuration = useMemo(() => 2 + Math.random() * 3, []);
  const rotateDuration = useMemo(() => 20 + Math.random() * 40, []);
  const spikeOpacity = useMemo(() => 0.4 + Math.random() * 0.4, []);

  return (
    <motion.div
      className="absolute group z-10"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Container centered on the coordinate */}
      <div className="relative flex items-center justify-center w-0 h-0">
        
        {/* --- HIT AREA: Invisible layer to capture clicks/hovers --- */}
        <div 
          className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full z-50 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />

        {/* -- Layer 1: The Glow Halo -- */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1], 
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ 
            duration: pulseDuration, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: randomDelay 
          }}
          className="absolute w-12 h-12 md:w-16 md:h-16 bg-yellow-400/20 rounded-full blur-[8px] pointer-events-none"
        />

        {/* -- Layer 2: Diffraction Spikes (The "Cross") -- */}
        <motion.div
          animate={{ opacity: [spikeOpacity * 0.7, spikeOpacity, spikeOpacity * 0.7] }}
          transition={{ 
            duration: pulseDuration * 1.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: randomDelay 
          }}
          className="absolute flex items-center justify-center pointer-events-none"
        >
          {/* Vertical Spike */}
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-transparent via-white to-transparent opacity-80 shadow-[0_0_8px_white]" />
          {/* Horizontal Spike */}
          <div className="absolute h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 shadow-[0_0_8px_white]" />
        </motion.div>

        {/* -- Layer 3: Orbiting Particle Ring -- */}
        <motion.div
          className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/5 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: rotateDuration, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {/* The Orbiting Dot */}
          <div className="absolute top-0 left-1/2 w-[2px] h-[2px] bg-yellow-200 rounded-full shadow-[0_0_4px_#fde047] -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        {/* -- Layer 4: The Core -- */}
        {/* Using CSS transform for group-hover since the Hit Area (sibling) triggers the 'group' state on parent */}
        <div
          className="relative w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] z-20 pointer-events-none transition-transform duration-300 group-hover:scale-125 group-active:scale-95"
        >
             {/* Inner Core Pulse */}
            <motion.div 
                 className="absolute inset-0 bg-yellow-100 rounded-full"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 0.5, repeat: Infinity }}
            />
        </div>

        {/* -- Layer 5: Tooltip/Reveal -- */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 md:w-72 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4 z-[60] hidden md:block">
           <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70" />
                <p className="text-white text-xs md:text-sm font-mono leading-relaxed relative z-10 drop-shadow-md truncate">
                  Click to view memory
                </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Star;