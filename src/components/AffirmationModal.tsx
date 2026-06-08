import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap } from 'lucide-react';

interface AffirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const AffirmationModal: React.FC<AffirmationModalProps> = ({ isOpen, onClose, message }) => {
  // Auto-close after a few seconds or allow click to close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-auto bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-[90vw] max-w-lg"
          >
            <div className="bg-[#111] border-l-4 border-r-4 border-yellow-500 relative p-8 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden">
              
              {/* Scanlines effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,_rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b border-yellow-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-full animate-pulse">
                    <Radio className="text-yellow-500 w-5 h-5" />
                  </div>
                  <span className="font-mono text-yellow-500 tracking-[0.2em] text-xs uppercase font-bold">
                    Incoming Transmission
                  </span>
                </div>
                <div className="flex gap-1">
                   <span className="w-1 h-1 bg-yellow-500 rounded-full animate-ping" />
                   <span className="w-1 h-1 bg-yellow-500 rounded-full" />
                   <span className="w-1 h-1 bg-yellow-500 rounded-full" />
                </div>
              </div>

              {/* Message */}
              <div className="relative text-center py-4">
                 <Zap className="absolute top-0 left-0 text-yellow-500/10 w-24 h-24 -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                 
                 <motion.p 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="font-mono text-xl md:text-2xl text-white font-bold leading-relaxed relative z-10"
                 >
                   "{message}"
                 </motion.p>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
                 <span>Priority: Alpha</span>
                 <span>Source: Inner Self</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AffirmationModal;
