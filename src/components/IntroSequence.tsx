import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateLevel, NAME } from '../../utils';

interface IntroSequenceProps {
  onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const level = calculateLevel();

  const sequence = [
    "Initializing System...",
    `Identity Verified: ${NAME}...`,
    "Loading Life Modules...",
    "Accessing Memory Archives...",
    `Welcome to Level ${level}, ${NAME}...`
  ];

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < sequence.length) {
        setLines((prev) => [...prev, sequence[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1500); // Wait a bit after last line before finishing
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [level, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#050505] flex items-center justify-center z-50 p-8"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div className="max-w-2xl w-full">
        <div className="font-mono text-green-500 text-base md:text-2xl leading-loose">
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-2"
            >
              <span className="mr-2">{'>'}</span>
              {line}
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 md:w-3 md:h-5 bg-green-500 ml-2 align-middle"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IntroSequence;