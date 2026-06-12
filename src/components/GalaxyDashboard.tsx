import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarData, Coordinates } from '../../types';
import { generateId, AFFIRMATIONS, TARGET_DATE } from '../../utils';
import { supabase, StarRow } from '../lib/supabase';
import { Users, Radio, MessageSquare, Music2 } from 'lucide-react';
import HUD from './HUD';
import Star from './Star';
import SolarSystem from './SolarSystem';
import MemoryModal from './MemoryModal';
import MotivationalTicker from './MotivationalTicker';
import AlliesModal from './AlliesModal';
import AffirmationModal from './AffirmationModal';
import ViewMemoryModal from './ViewMemoryModal';
import BirthdayCountdown from './BirthdayCountdown';
import BirthdayCelebration from './BirthdayCelebration';
import LaunchSequence from './LaunchSequence';
import CommsModal from './CommsModal';
import CometsLayer from './CometsLayer';
import SpotifyModal from './SpotifyModal';

type BirthdayPhase = 'countdown' | 'launch' | 'celebration';

const GalaxyDashboard: React.FC = () => {
  const [stars, setStars] = useState<StarData[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  
  // Modal State
  const [alliesOpen, setAlliesOpen] = useState(false);
  const [commsOpen, setCommsOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  
  // Affirmation State
  const [affirmationOpen, setAffirmationOpen] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  // Star View State
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);

  // Birthday State Phase
  const [birthdayPhase, setBirthdayPhase] = useState<BirthdayPhase>('countdown');

  const [pendingCoords, setPendingCoords] = useState<Coordinates | null>(null);

  // Check Birthday Protocol
  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      // If we are past the target date
      if (now >= TARGET_DATE) {
        // If we are currently in countdown mode, trigger launch
        // We use a functional state update to ensure we don't restart launch if already launching/celebrating
        setBirthdayPhase(prev => {
          if (prev === 'countdown') return 'launch';
          return prev;
        });
      }
    };
    
    checkDate();
    const timer = setInterval(checkDate, 1000); 
    return () => clearInterval(timer);
  }, []);

  // Fetch stars from Supabase and subscribe to real-time changes
  useEffect(() => {
    const rowToStar = (row: StarRow): StarData => ({
      id: row.id,
      x: row.x,
      y: row.y,
      memory: row.memory,
      timestamp: row.timestamp,
      photo: row.photo ?? undefined,
      year: row.year ?? undefined,
    });

    supabase
      .from('stars')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setStars((data as StarRow[]).map(rowToStar));
      });

    const channel = supabase
      .channel('stars-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stars' }, (payload) => {
        const incoming = rowToStar(payload.new as StarRow);
        setStars(prev => prev.some(s => s.id === incoming.id) ? prev : [...prev, incoming]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stars' }, (payload) => {
        const updated = rowToStar(payload.new as StarRow);
        setStars(prev => prev.map(s => s.id === updated.id ? updated : s));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'stars' }, (payload) => {
        setStars(prev => prev.filter(s => s.id !== (payload.old as StarRow).id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLaunchComplete = () => {
    setBirthdayPhase('celebration');
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger if clicking directly on the background, not on a star or modal
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Overlap Check: Ensure new star isn't too close to existing stars
    const isOverlapping = stars.some(star => {
      const dx = star.x - x;
      const dy = star.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 6; // 6% threshold
    });

    if (isOverlapping) {
      return;
    }
    
    setPendingCoords({ x, y });
    setModalOpen(true);
  };

  const handleIgnite = async (data: { memory: string; photo?: string; year?: number }) => {
    if (!pendingCoords) return;
    setModalOpen(false);
    setPendingCoords(null);
    await supabase.from('stars').insert({
      id: generateId(),
      x: pendingCoords.x,
      y: pendingCoords.y,
      memory: data.memory,
      timestamp: Date.now(),
      photo: data.photo ?? null,
      year: data.year ?? null,
    });
  };

  const handleDeleteStar = async (id: string) => {
    await supabase.from('stars').delete().eq('id', id);
  };

  const handleUpdateStar = async (id: string, photo: string, year: number) => {
    await supabase.from('stars').update({ photo, year }).eq('id', id);
  };

  const handleSignalClick = () => {
    const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    setCurrentAffirmation(AFFIRMATIONS[randomIndex]);
    setAffirmationOpen(true);
  };

  const toggleAllies = () => {
    setAlliesOpen(!alliesOpen);
    if (!alliesOpen) { setCommsOpen(false); setSpotifyOpen(false); }
  };

  const toggleComms = () => {
    setCommsOpen(!commsOpen);
    if (!commsOpen) { setAlliesOpen(false); setSpotifyOpen(false); }
  };

  const toggleSpotify = () => {
    setSpotifyOpen(!spotifyOpen);
    if (!spotifyOpen) { setAlliesOpen(false); setCommsOpen(false); }
  };

  // Derived state for passing to HUD
  const isBirthdayActive = birthdayPhase === 'launch' || birthdayPhase === 'celebration';

  return (
    <motion.div
      className="relative w-full h-screen bg-[#050505] overflow-hidden cursor-crosshair touch-action-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      onClick={handleBackgroundClick}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(20,20,30,0.4)_0%,_rgba(5,5,5,1)_100%)]" />
        
        {/* Distant stars static layer 1 */}
        <motion.div 
          className="absolute inset-0 opacity-40" 
          style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
          animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Distant stars layer 2 */}
        <motion.div 
          className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '120px 120px' }}
          animate={{ backgroundPosition: ["0px 0px", "-60px 60px"] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* --- BACKGROUND LAYERS --- */}
      <SolarSystem />
      <CometsLayer />

      {/* --- HUD --- */}
      <HUD isLegendary={isBirthdayActive} />

      {/* --- PROTOCOL LAYERS --- */}
      {birthdayPhase === 'countdown' && <BirthdayCountdown />}
      {birthdayPhase === 'launch' && <LaunchSequence onComplete={handleLaunchComplete} />}
      {birthdayPhase === 'celebration' && <BirthdayCelebration />}

      {/* --- CONTROLS --- */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30 flex gap-2 md:gap-3">
        {/* Allies Button */}
        <button
          onClick={toggleAllies}
          className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-900/20 border border-blue-500/30 text-blue-400 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-blue-900/40 hover:text-blue-300 hover:border-blue-500/60 transition-all rounded backdrop-blur-sm"
        >
          <Users size={16} />
          <span className="hidden md:inline">Allies</span>
        </button>

        {/* Comms Button */}
        <button
          onClick={toggleComms}
          className="flex items-center gap-2 px-3 py-2 md:px-4 bg-green-900/20 border border-green-500/30 text-green-400 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-green-900/40 hover:text-green-300 hover:border-green-500/60 transition-all rounded backdrop-blur-sm"
        >
          <MessageSquare size={16} />
          <span className="hidden md:inline">Comms</span>
        </button>

        {/* Spotify Button */}
        <button
          onClick={toggleSpotify}
          className="flex items-center gap-2 px-3 py-2 md:px-4 bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-[#1DB954]/20 hover:border-[#1DB954]/60 transition-all rounded backdrop-blur-sm"
        >
          <Music2 size={16} />
          <span className="hidden md:inline">Sounds</span>
        </button>
      </div>

      {/* Receive Signal Button */}
      <div className="absolute bottom-24 md:bottom-16 right-6 md:right-10 z-30">
        <button
           onClick={handleSignalClick}
           className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 font-mono text-xs md:text-sm uppercase tracking-widest hover:bg-yellow-900/40 hover:text-yellow-300 hover:border-yellow-500/60 transition-all rounded backdrop-blur-sm group shadow-[0_0_15px_rgba(234,179,8,0.1)]"
        >
           <Radio size={16} className="group-hover:animate-pulse" />
           <span>Receive Signal</span>
        </button>
      </div>

      {/* Render User Stars */}
      {stars.map((star) => (
        <Star 
          key={star.id} 
          data={star} 
          onClick={() => setSelectedStar(star)}
        />
      ))}

      {/* --- MODALS --- */}
      <MemoryModal
        isOpen={modalOpen}
        position={pendingCoords}
        onClose={() => setModalOpen(false)}
        onIgnite={handleIgnite}
      />

      <ViewMemoryModal
        star={selectedStar}
        onClose={() => setSelectedStar(null)}
        onDelete={handleDeleteStar}
        onUpdate={handleUpdateStar}
      />

      <AlliesModal 
        isOpen={alliesOpen} 
        onClose={() => setAlliesOpen(false)} 
      />

      <CommsModal 
        isOpen={commsOpen} 
        onClose={() => setCommsOpen(false)} 
      />

      <AffirmationModal
        isOpen={affirmationOpen}
        onClose={() => setAffirmationOpen(false)}
        message={currentAffirmation}
      />

      <SpotifyModal
        isOpen={spotifyOpen}
        onClose={() => setSpotifyOpen(false)}
      />

      {/* Guidance Text for Empty State */}
      {stars.length === 0 && !modalOpen && birthdayPhase === 'countdown' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-36 md:bottom-28 w-full text-center pointer-events-none z-20 px-4"
        >
          <p className="text-gray-500 font-mono text-[10px] md:text-sm tracking-[0.2em] uppercase animate-pulse">
            Click anywhere in the void to ignite a memory
          </p>
        </motion.div>
      )}

      {/* Motivational Ticker */}
      <MotivationalTicker />
    </motion.div>
  );
};

export default GalaxyDashboard;