import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2 } from 'lucide-react';
import { StarData } from '../../types';

interface ViewMemoryModalProps {
  star: StarData | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ViewMemoryModal: React.FC<ViewMemoryModalProps> = ({ star, onClose, onDelete }) => {
  if (!star) return null;

  const dateStr = new Date(star.timestamp).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 md:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
        >
           {/* Decorative Elements */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
           <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

           <button 
             onClick={onClose}
             className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
           >
             <X size={20} />
           </button>

           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
               <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
             </div>
             <div>
               <h3 className="text-white font-mono text-sm uppercase tracking-widest">Memory Log</h3>
               <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-mono">
                 <Calendar size={12} />
                 <span>{dateStr}</span>
               </div>
             </div>
           </div>

           <div className="relative mb-8">
             <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-500/50 to-transparent" />
             <p className="pl-6 text-gray-200 font-mono text-lg leading-relaxed italic">
               "{star.memory}"
             </p>
           </div>

           <div className="flex justify-end pt-4 border-t border-white/5">
             <button
               onClick={() => {
                 onDelete(star.id);
                 onClose();
               }}
               className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-xs font-mono uppercase tracking-widest hover:bg-red-900/10 px-3 py-2 rounded transition-all"
             >
               <Trash2 size={14} />
               Delete Memory
             </button>
           </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewMemoryModal;