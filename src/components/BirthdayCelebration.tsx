import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore
import confetti from 'canvas-confetti';
import { NAME } from '../../utils';
import { Heart } from 'lucide-react';

const BirthdayCelebration: React.FC = () => {
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    // 1. Trigger Confetti Cannon
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ffd700', '#ff0000', '#ffffff', '#4ade80']
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ffd700', '#ff0000', '#ffffff', '#4ade80']
      });
    }, 250);

    // 2. Generate Floating Hearts
    const newHearts = Array.from({ length: 20 }, (_, i) => i);
    setHearts(newHearts);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
      
      {/* Background Love Animation */}
      {hearts.map((i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: "110vh", 
            x: Math.random() * 100 + "vw",
            scale: Math.random() * 0.5 + 0.5 
          }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            y: "-20vh",
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          className="absolute text-pink-500/20"
        >
          <Heart size={Math.random() * 100 + 50} fill="currentColor" />
        </motion.div>
      ))}

      {/* Main Message */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        className="relative text-center z-30 px-4"
      >
        <h1 className="font-cinzel text-5xl md:text-8xl font-bold text-yellow-400 mb-6 tracking-wide drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
          HAPPY BIRTHDAY
        </h1>
        <motion.div 
          className="font-cinzel text-3xl md:text-6xl text-white font-bold uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          animate={{ 
            textShadow: ["0 0 15px #ffffff", "0 0 40px #facc15", "0 0 15px #ffffff"],
            scale: [1, 1.05, 1] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {NAME}!
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BirthdayCelebration;