import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUOTES } from '../../utils';

const MotivationalTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-md border-t border-white/10 z-30">
      <div className="max-w-screen-lg mx-auto flex items-center justify-center min-h-[3rem] py-2 px-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center"
          >
            <p className="font-mono text-xs md:text-sm text-gray-300 uppercase tracking-widest leading-relaxed">
              <span className="text-green-500 mr-2 md:mr-3 inline-block">{">>"}</span>
              {QUOTES[index]}
              <span className="text-green-500 ml-2 md:ml-3 inline-block">{'<<'}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Decorative scanline */}
      <motion.div 
        className="absolute top-0 left-0 h-[1px] bg-green-500/50"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default MotivationalTicker;