import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music2, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { initiateSpotifyAuth, SpotifyTrack } from '../lib/spotify';

interface SpotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpotifyModal: React.FC<SpotifyModalProps> = ({ isOpen, onClose }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    supabase
      .from('spotify_tracks')
      .select('*')
      .order('rank', { ascending: true })
      .then(({ data }) => {
        if (data) setTracks(data as SpotifyTrack[]);
        setLoading(false);
      });
  }, [isOpen]);

  const handleSync = async () => {
    setSyncing(true);
    await initiateSpotifyAuth();
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
            className="fixed top-1/2 left-1/2 z-50 w-[95vw] md:w-[90vw] max-w-lg"
            initial={{ scale: 0.9, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0.9, opacity: 0, x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-[#0a0a0a] border border-[#1DB954]/30 rounded-lg p-4 md:p-6 shadow-[0_0_40px_rgba(29,185,84,0.15)] relative flex flex-col max-h-[85vh] md:max-h-[80vh]">

              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-[#1DB954]/20 pb-3 md:pb-4 shrink-0 pr-8">
                <div className="flex items-center gap-3">
                  <Music2 className="text-[#1DB954] w-5 h-5 md:w-6 md:h-6" />
                  <div>
                    <h3 className="text-base md:text-xl font-mono text-[#1DB954] uppercase tracking-widest">
                      Sound Log
                    </h3>
                    <p className="text-[10px] text-[#1DB954]/50 font-mono uppercase tracking-[0.2em]">
                      Top Tracks · Past 6 Months
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  title="Sync from Spotify"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#1DB954]/70 border border-[#1DB954]/20 rounded hover:border-[#1DB954]/50 hover:text-[#1DB954] transition-all disabled:opacity-50"
                >
                  <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
                  Sync
                </button>
              </div>

              {/* Track list */}
              <div className="overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin opacity-50" />
                  </div>
                ) : tracks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 opacity-60">
                    <Music2 className="text-[#1DB954] animate-pulse" size={32} />
                    <p className="font-mono text-xs text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                      No tracks synced yet.<br />Click Sync to connect Spotify.
                    </p>
                  </div>
                ) : (
                  tracks.map((track, idx) => (
                    <motion.a
                      key={track.spotify_id}
                      href={track.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                      className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/5 hover:bg-[#1DB954]/5 hover:border-[#1DB954]/30 transition-all group"
                    >
                      <span className="font-mono text-xs text-[#1DB954]/40 w-5 text-right shrink-0 tabular-nums">
                        {track.rank}
                      </span>
                      <img
                        src={track.album_art}
                        alt={track.album}
                        className="w-10 h-10 rounded shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-white truncate group-hover:text-[#1DB954] transition-colors">
                          {track.name}
                        </p>
                        <p className="font-mono text-xs text-gray-500 truncate">
                          {track.artist}
                        </p>
                      </div>
                      <ExternalLink
                        size={13}
                        className="text-gray-600 group-hover:text-[#1DB954] shrink-0 transition-colors"
                      />
                    </motion.a>
                  ))
                )}
              </div>

              <div className="mt-4 text-center shrink-0">
                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                  Powered by Spotify
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpotifyModal;
