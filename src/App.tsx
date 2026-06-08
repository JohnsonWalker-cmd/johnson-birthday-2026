import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroSequence from './components/IntroSequence';
import GalaxyDashboard from './components/GalaxyDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { exchangeCodeForToken, fetchTopTracks } from './lib/spotify';
import { supabase } from './lib/supabase';

type Phase = 'intro' | 'galaxy';

const App: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const hasSpotifyCode = params.has('code');

  const [phase, setPhase] = useState<Phase>(hasSpotifyCode ? 'galaxy' : 'intro');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    // Clear the code from the URL immediately
    window.history.replaceState({}, '', window.location.pathname);

    (async () => {
      try {
        const token = await exchangeCodeForToken(code);
        const tracks = await fetchTopTracks(token);
        await supabase.from('spotify_tracks').upsert(tracks, { onConflict: 'spotify_id' });
      } catch {
        // Silently fail — cached tracks are still shown
      }
    })();
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-black text-white overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <IntroSequence key="intro" onComplete={() => setPhase('galaxy')} />
          )}
          {phase === 'galaxy' && (
            <GalaxyDashboard key="galaxy" />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default App;
