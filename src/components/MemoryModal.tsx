import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coordinates } from '../../types';
import { X, Sparkles } from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  position: Coordinates | null;
  onClose: () => void;
  onIgnite: (memory: string) => void;
}

const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, position, onClose, onIgnite }) => {
  const [memory, setMemory] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setMemory('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memory.trim()) {
      onIgnite(memory);
    }
  };

  // On mobile: Center the modal. On Desktop: Position relative to click (clamped to viewport)
  const modalStyle: React.CSSProperties = isMobile
    ? {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }
    : position
    ? {
        left: Math.min(Math.max(position.x, 15), 85) + '%',
        top: Math.min(Math.max(position.y, 20), 80) + '%',
        transform: 'translate(-50%, -50%)',
      }
    : {};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40"
          />
          
          <motion.div
            className="fixed z-50 w-[90vw] max-w-sm"
            style={modalStyle}
            initial={{ scale: 0.8, opacity: 0, y: 20, x: isMobile ? '-50%' : '-50%' }}
            animate={{ scale: 1, opacity: 1, y: isMobile ? '-50%' : 0, x: isMobile ? '-50%' : '-50%' }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-[#0f0f0f] border border-green-500/30 rounded-lg p-6 shadow-[0_0_30px_rgba(74,222,128,0.1)] relative overflow-hidden">
              
              {/* Decorative headers */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-4 text-green-400">
                <Sparkles size={16} />
                <h3 className="text-sm font-mono uppercase tracking-widest">New Memory Node</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    placeholder="What is a bright spot from this year?"
                    className="w-full bg-[#050505] text-white border border-gray-800 rounded p-3 text-sm font-mono focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all resize-none h-24 placeholder-gray-600"
                    maxLength={140}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                  />
                  <div className="text-right text-[10px] text-gray-600 mt-1 font-mono">
                    {memory.length}/140
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!memory.trim()}
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 border border-green-600/50 py-2 rounded font-mono text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <span>Ignite Star</span>
                  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MemoryModal;