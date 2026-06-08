import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface LaunchSequenceProps {
  onComplete: () => void;
}

const LaunchSequence: React.FC<LaunchSequenceProps> = ({ onComplete }) => {
  useEffect(() => {
    // Sequence duration matches animation duration + buffer
    const timer = setTimeout(() => {
      onComplete();
    }, 5500); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Smoke/Atmosphere Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 4, times: [0, 0.2, 1] }}
      />

      {/* The Rocket Container */}
      <motion.div
        className="relative"
        initial={{ y: "110vh", scale: 1 }}
        animate={{ y: "-120vh", scale: 0.8 }}
        transition={{ 
          duration: 5, 
          ease: [0.22, 1, 0.36, 1], // Custom bezier for "launch" acceleration feel
          delay: 0.5
        }}
      >
        {/* Thruster Shake Wrapper */}
        <motion.div
          animate={{ x: [-2, 2, -2, 2, 0] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        >
           {/* Rocket Body */}
           <Rocket size={120} className="text-white fill-gray-200 rotate-[-45deg] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
           
           {/* Engine Flame */}
           <motion.div 
             className="absolute top-full left-1/2 -translate-x-1/2 w-8 h-24 bg-gradient-to-b from-yellow-200 via-orange-500 to-transparent rounded-full blur-[4px]"
             animate={{ height: [80, 120, 80], opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 0.2, repeat: Infinity }}
             style={{ marginTop: '-10px', marginLeft: '-15px' }} // Alignment adjustment for the rotated icon
           />
           
           {/* Wide Glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />
        </motion.div>
      </motion.div>

      {/* Speed Lines */}
      <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-[2px] bg-white/20"
               style={{ 
                 height: Math.random() * 200 + 100, 
                 left: `${Math.random() * 100}%`,
                 top: '100%' 
               }}
               animate={{ top: '-50%' }}
               transition={{ 
                 duration: 0.5 + Math.random() * 0.5, 
                 repeat: Infinity, 
                 delay: Math.random() * 2,
                 ease: "linear"
               }}
             />
          ))}
      </div>
    </div>
  );
};

export default LaunchSequence;