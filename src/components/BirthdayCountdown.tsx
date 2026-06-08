import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TARGET_DATE } from '../../utils';
import { Timer } from 'lucide-react';

const BirthdayCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Time is up
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-3 mb-6 bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-green-500/20">
          <Timer className="text-green-500 w-5 h-5 animate-pulse" />
          <span className="text-green-500 font-mono tracking-[0.3em] text-sm md:text-base uppercase">
            Mission Launch In
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 md:gap-8 text-center">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative">
                 <span className="text-4xl md:text-7xl font-bold font-mono text-white tracking-tighter">
                    {String(item.value).padStart(2, '0')}
                 </span>
                 {/* Retro glow effect */}
                 <span className="absolute inset-0 text-4xl md:text-7xl font-bold font-mono text-green-500 blur-lg opacity-30 tracking-tighter select-none">
                    {String(item.value).padStart(2, '0')}
                 </span>
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BirthdayCountdown;