import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, ImagePlus, Check, Pencil } from 'lucide-react';
import { StarData } from '../../types';

interface ViewMemoryModalProps {
  star: StarData | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, photo: string, year: number) => void;
}

const ViewMemoryModal: React.FC<ViewMemoryModalProps> = ({ star, onClose, onDelete, onUpdate }) => {
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [pendingYear, setPendingYear] = useState<number>(new Date().getFullYear());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (star) {
      setPendingPhoto(null);
      setPendingYear(star.year ?? new Date().getFullYear());
    }
  }, [star]);

  if (!star) return null;

  const dateStr = new Date(star.timestamp).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayPhoto = pendingPhoto ?? star.photo;
  const hasChanges = pendingPhoto !== null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (pendingPhoto) {
      onUpdate(star.id, pendingPhoto, pendingYear);
      setPendingPhoto(null);
    }
  };

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
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 md:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            title="Close"
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

          {/* Photo section */}
          {displayPhoto ? (
            <div className="relative mb-6 rounded-lg overflow-hidden border border-white/10 group">
              <img
                src={displayPhoto}
                alt="memory"
                className="w-full max-h-64 object-cover"
              />

              {/* Year badge / editable when pending */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/70 backdrop-blur-sm px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-mono text-xs">Year:</span>
                  <input
                    type="number"
                    title="Year photo was taken"
                    value={pendingPhoto ? pendingYear : (star.year ?? '')}
                    onChange={(e) => setPendingYear(Number(e.target.value))}
                    min={1990}
                    max={new Date().getFullYear()}
                    readOnly={!pendingPhoto}
                    className="w-16 bg-transparent border-b border-yellow-500/40 text-yellow-300 font-mono text-xs text-center focus:outline-none focus:border-yellow-400 read-only:border-transparent read-only:cursor-default"
                  />
                </div>

                {/* Change photo button */}
                <button
                  type="button"
                  title="Change photo"
                  onClick={() => fileRef.current?.click()}
                  className="text-white/40 hover:text-white/80 transition-colors"
                >
                  <Pencil size={12} />
                </button>
              </div>

              {/* Pending save banner */}
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/90 hover:bg-yellow-400 text-black font-mono text-xs px-2 py-1 rounded transition-all"
                >
                  <Check size={12} />
                  Save
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full py-3 mb-6 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-gray-300 hover:border-gray-500 font-mono text-xs uppercase tracking-widest transition-all"
            >
              <ImagePlus size={14} />
              Add a photo to this memory
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            title="Upload photo for this memory"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="relative mb-8">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-500/50 to-transparent" />
            <p className="pl-6 text-gray-200 font-mono text-lg leading-relaxed italic">
              "{star.memory}"
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="button"
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
