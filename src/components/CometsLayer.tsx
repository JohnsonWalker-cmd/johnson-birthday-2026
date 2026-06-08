import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CometData {
  id: number;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  duration: number;
  width: number;
  color: string;
}

const CometsLayer: React.FC = () => {
  const [comets, setComets] = useState<CometData[]>([]);

  const spawnComet = useCallback(() => {
    const id = Date.now() + Math.random();
    
    // Determine start and end points for a screen-crossing trajectory
    const isTopStart = Math.random() > 0.5;
    
    let xStart, yStart, xEnd, yEnd;

    if (isTopStart) {
        // Start from Top, move generally down/diagonal
        xStart = Math.random() * 100; // 0-100vw
        yStart = -20; // Above screen
        
        xEnd = xStart + (Math.random() * 60 - 30); // Drift left or right
        yEnd = 120; // Below screen
    } else {
        // Start from Left, move generally right/diagonal
        xStart = -20; // Left of screen
        yStart = Math.random() * 60; // Upper 60% of screen
        
        xEnd = 120; // Right of screen
        yEnd = yStart + (Math.random() * 60 - 30); // Drift up or down
    }

    // Aesthetic randomization
    const colors = [
        'from-blue-300',
        'from-cyan-200', 
        'from-white',
        'from-indigo-300',
        'from-teal-200',
        'from-emerald-200'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newComet: CometData = {
      id,
      xStart,
      yStart,
      xEnd,
      yEnd,
      duration: 2.5 + Math.random() * 3, // 2.5s - 5.5s
      width: 100 + Math.random() * 200, // 100px - 300px tail
      color: randomColor
    };

    setComets(prev => [...prev, newComet]);

    // Cleanup after animation finishes
    setTimeout(() => {
      setComets(prev => prev.filter(c => c.id !== id));
    }, newComet.duration * 1000 + 500);
  }, []);

  useEffect(() => {
    // Initial spawn chance
    if (Math.random() > 0.5) spawnComet();

    const interval = setInterval(() => {
        // 40% chance to spawn a comet every 2.5 seconds
        if (Math.random() < 0.4) {
            spawnComet();
        }
    }, 2500);
    return () => clearInterval(interval);
  }, [spawnComet]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      <AnimatePresence>
        {comets.map(comet => {
            // Calculate rotation angle based on trajectory
            const dx = comet.xEnd - comet.xStart;
            const dy = comet.yEnd - comet.yStart;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            return (
                <motion.div
                    key={comet.id}
                    initial={{ 
                        opacity: 0, 
                        left: `${comet.xStart}vw`, 
                        top: `${comet.yStart}vh`,
                    }}
                    animate={{ 
                        opacity: [0, 1, 1, 0], // Fade in, stay, fade out
                        left: [`${comet.xStart}vw`, `${comet.xEnd}vw`],
                        top: [`${comet.yStart}vh`, `${comet.yEnd}vh`]
                    }}
                    transition={{ 
                        duration: comet.duration, 
                        ease: "linear", // Linear movement looks most physical for comets
                    }}
                    style={{
                        position: 'absolute',
                        width: `${comet.width}px`,
                        height: '2px', // Thin streak
                        transform: `rotate(${angle}deg)`,
                    }}
                >
                    {/* The Head (Leading Edge - Right side due to 0deg rotation alignment) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.9)]" />
                    
                    {/* The Tail (Trailing - Gradient to left) */}
                    <div className={`w-full h-full bg-gradient-to-l ${comet.color} to-transparent opacity-60 rounded-full`} />
                </motion.div>
            );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CometsLayer;