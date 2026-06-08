import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AlliesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Ally {
  id: number;
  name: string;
}

const AlliesModal: React.FC<AlliesModalProps> = ({ isOpen, onClose }) => {
  const [allies, setAllies] = useState<Ally[]>([]);
  const [newAlly, setNewAlly] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllies = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('allies')
        .select('*')
        .order('id', { ascending: true });
      if (data) setAllies(data as Ally[]);
      setLoading(false);
    };

    fetchAllies();
  }, [isOpen]);

  const handleAddAlly = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newAlly.trim();
    if (!name) return;

    const { data, error } = await supabase
      .from('allies')
      .insert({ name })
      .select()
      .single();

    if (!error && data) {
      setAllies(prev => [...prev, data as Ally]);
      setNewAlly('');
    }
  };

  const handleRemoveAlly = async (id: number) => {
    const { error } = await supabase.from('allies').delete().eq('id', id);
    if (!error) {
      setAllies(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[95vw] md:w-[90vw] max-w-md"
            initial={{ scale: 0.9, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0.9, opacity: 0, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-lg p-4 md:p-6 shadow-[0_0_40px_rgba(59,130,246,0.2)] relative flex flex-col max-h-[85vh] md:max-h-[80vh]">

              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4 md:mb-6 border-b border-blue-500/20 pb-3 md:pb-4 shrink-0 pr-8">
                <Users className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
                <h3 className="text-lg md:text-xl font-mono text-blue-400 uppercase tracking-widest truncate">
                  Alliance Roster
                </h3>
              </div>

              {/* Input Form */}
              <form onSubmit={handleAddAlly} className="flex gap-2 mb-4 shrink-0">
                <input
                  type="text"
                  value={newAlly}
                  onChange={(e) => setNewAlly(e.target.value)}
                  placeholder="Add new ally..."
                  className="flex-1 bg-white/5 border border-blue-500/30 rounded px-3 py-2 text-xs md:text-sm text-white font-mono focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!newAlly.trim()}
                  className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/50 rounded p-2 transition-colors disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </form>

              {/* List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  <div className="col-span-2 flex justify-center items-center py-8 opacity-50">
                    <Loader2 className="text-blue-400 animate-spin" size={24} />
                  </div>
                ) : (
                  allies.map((ally, idx) => (
                    <motion.div
                      key={ally.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                      className="flex items-center justify-between gap-2 bg-white/5 p-2 md:p-3 rounded border border-white/5 hover:border-blue-500/50 hover:bg-blue-900/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-500 rounded-full group-hover:shadow-[0_0_8px_#3b82f6] transition-shadow shrink-0" />
                        <span className="font-mono text-xs md:text-sm text-gray-200 group-hover:text-white truncate">
                          {ally.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        title="Remove ally"
                        onClick={() => handleRemoveAlly(ally.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1"
                      >
                        <Trash2 size={12} className="md:w-[14px] md:h-[14px]" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-4 md:mt-6 text-center shrink-0">
                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                  Gratitude Protocol Active
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlliesModal;
