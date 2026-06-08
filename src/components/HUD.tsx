import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateLevel, calculateXP, NAME, TARGET_DATE } from '../../utils';
import { Target, Zap, Heart, User, Crown } from 'lucide-react';

interface HUDProps {
  isLegendary?: boolean;
}

const HUD: React.FC<HUDProps> = ({ isLegendary = false }) => {
  // If Legendary (Birthday Mode), we calculate the level based on the TARGET_DATE
  // This ensures the age flips visually even if the user is simulating the event.
  const level = useMemo(() => {
    return isLegendary ? calculateLevel(TARGET_DATE) : calculateLevel();
  }, [isLegendary]);

  const xp = useMemo(() => calculateXP(), []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute top-6 left-6 md:top-10 md:left-10 z-30 pointer-events-none select-none max-w-[80vw] md:max-w-[60vw]"
    >
      <div className="flex flex-col gap-3 md:gap-2 font-mono text-xs md:text-base">
        
        {/* Pilot Name */}
        <div className="flex items-center gap-3 text-white/80">
          <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
          <span className="tracking-widest text-[10px] md:text-xs uppercase text-purple-400">Pilot</span>
          <span className="text-sm md:text-sm font-bold text-white uppercase truncate">{NAME}</span>
        </div>

        {/* Level Stat */}
        <div className="flex items-center gap-3 text-white/80">
          <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" />
          <span className="tracking-widest text-[10px] md:text-xs uppercase text-green-400">Level</span>
          <span className="text-lg md:text-xl font-bold text-white">{level}</span>
        </div>

        {/* XP Stat */}
        <div className="flex items-center gap-3 text-white/80">
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
          <span className="tracking-widest text-[10px] md:text-xs uppercase text-blue-400">XP (Days)</span>
          <span className="text-lg md:text-xl font-bold text-white">{xp.toLocaleString()}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 mt-1 md:mt-2">
          {isLegendary ? (
            <Crown className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 animate-bounce" />
          ) : (
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 animate-pulse" />
          )}
          <span className="tracking-widest text-[10px] md:text-xs uppercase text-yellow-500">Status</span>
          
          <AnimatePresence mode="wait">
            {isLegendary ? (
               <motion.span 
                key="legendary"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  textShadow: ["0 0 10px #f0abfc", "0 0 30px #d946ef", "0 0 10px #f0abfc"]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-base md:text-lg font-bold text-fuchsia-400 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-400"
              >
                LEGENDARY
              </motion.span>
            ) : (
              <motion.span 
                key="grateful"
                animate={{ textShadow: ["0 0 5px #ffd700", "0 0 20px #ffd700", "0 0 5px #ffd700"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-base md:text-lg font-bold text-yellow-400"
              >
                GRATEFUL
              </motion.span>
            )}
          </AnimatePresence>
        </div>

      </div>
      
      {/* Decorative Line */}
      <svg className="absolute -bottom-4 left-0 w-32 h-1" viewBox="0 0 100 2">
        <rect width="100" height="1" fill="#333" />
        <motion.rect 
          width="20" 
          height="2" 
          fill={isLegendary ? "#d946ef" : "#4ade80"} 
          animate={{ x: [0, 80, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </motion.div>
  );
};

export default HUD;