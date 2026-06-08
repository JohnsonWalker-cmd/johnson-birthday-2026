import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Wifi, Send, Loader2 } from 'lucide-react';
import { supabase, Wish } from '../lib/supabase';

interface CommsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CombinedMessage = {
  id: string;
  sender: string;
  text: string;
  date: string;
};

type ViewState = 'list' | 'compose';

const CommsModal: React.FC<CommsModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ViewState>('list');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [senderName, setSenderName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchWishes = async () => {
      const { data } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setWishes(data as Wish[]);
    };

    fetchWishes();

    const channel = supabase
      .channel('wishes-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
        setWishes(prev => [...prev, payload.new as Wish]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isOpen]);

  // Scroll to bottom when new wishes arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [wishes]);

  const allMessages: CombinedMessage[] = wishes.map(w => ({
    id: `wish-${w.id}`,
    sender: w.sender,
    text: w.text,
    date: w.created_at,
  }));

  const handleSend = async () => {
    if (!senderName.trim() || !messageText.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setSending(true);
    setError('');

    const { error: dbError } = await supabase.from('wishes').insert({
      sender: senderName.trim(),
      text: messageText.trim(),
    });

    setSending(false);

    if (dbError) {
      setError('Transmission failed. Try again.');
      return;
    }

    setSent(true);
    setSenderName('');
    setMessageText('');
    setTimeout(() => {
      setSent(false);
      setView('list');
    }, 2000);
  };

  const resetCompose = () => {
    setView('list');
    setSenderName('');
    setMessageText('');
    setSent(false);
    setError('');
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
          />

          {/* Sliding Side Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[90vw] md:w-[420px] z-50 bg-[#0a0c10] border-l border-green-500/30 shadow-[-10px_0_40px_rgba(34,197,94,0.1)] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-green-500/20 bg-green-900/5">
              <button
                type='button'
                onClick={onClose}
                className="absolute top-6 right-6 text-green-500/50 hover:text-green-400 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-1">
                <Terminal className="text-green-500" size={20} />
                <h3 className="font-mono text-green-500 font-bold uppercase tracking-widest text-sm">
                  Comms Log
                </h3>
              </div>
              <p className="text-[10px] text-green-500/60 font-mono uppercase tracking-[0.2em]">
                Encrypted Transmissions Received
              </p>

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-green-500/30" />
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-green-400"
                animate={{ width: ["0%", "100%", "0%"], left: ["0%", "0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Body */}
            <AnimatePresence mode="wait">
              {view === 'list' ? (
                <motion.div
                  key="list"
                  className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-4"
                  ref={listRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {allMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 opacity-50 space-y-3">
                      <Wifi className="text-green-500 animate-pulse" size={32} />
                      <p className="font-mono text-xs text-green-400 uppercase tracking-widest text-center">
                        No signals detected.<br />Scanner active...
                      </p>
                    </div>
                  ) : (
                    allMessages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                        className="group relative bg-white/5 border border-white/5 rounded-sm p-4 hover:bg-white/10 hover:border-green-500/30 transition-all"
                      >
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500/0 group-hover:border-green-500/50 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500/0 group-hover:border-green-500/50 transition-colors" />

                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-yellow-500 uppercase tracking-wider">
                            [{msg.sender}]
                          </span>
                          <span className="font-mono text-[10px] text-gray-600">
                            {new Date(msg.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-mono text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors whitespace-pre-line">
                          {msg.text}
                        </p>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="compose"
                  className="flex-1 flex flex-col p-6 gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div>
                    <label className="font-mono text-[10px] text-green-500/70 uppercase tracking-widest block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      maxLength={60}
                      placeholder="e.g. Grace Mensah"
                      className="w-full bg-white/5 border border-green-500/20 rounded-sm px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="font-mono text-[10px] text-green-500/70 uppercase tracking-widest block mb-1">
                      Message
                    </label>
                    <textarea
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      maxLength={500}
                      placeholder="Write your birthday wish..."
                      className="flex-1 w-full bg-white/5 border border-green-500/20 rounded-sm px-3 py-2 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/60 transition-colors resize-none"
                    />
                    <span className="font-mono text-[10px] text-gray-600 mt-1 text-right">
                      {messageText.length}/500
                    </span>
                  </div>

                  {error && (
                    <p className="font-mono text-xs text-red-400 uppercase tracking-wider">{error}</p>
                  )}

                  {sent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-xs text-green-400 uppercase tracking-wider text-center"
                    >
                      ✓ Transmission received!
                    </motion.p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetCompose}
                      className="flex-1 px-4 py-2 border border-white/10 text-gray-400 font-mono text-xs uppercase tracking-widest hover:border-white/30 hover:text-gray-200 transition-all rounded-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={sending || sent}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/40 text-green-400 font-mono text-xs uppercase tracking-widest hover:bg-green-900/50 hover:border-green-400 transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {sending ? 'Sending...' : 'Transmit'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/20 rounded-full border border-green-500/10">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-500/80 font-mono uppercase tracking-widest">
                  {wishes.length > 0 ? `${wishes.length} live` : 'Secure Connection'}
                </span>
              </div>

              {view === 'list' && (
                <button
                  type="button"
                  onClick={() => setView('compose')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-500/30 text-green-400 font-mono text-[10px] uppercase tracking-widest hover:bg-green-900/40 hover:border-green-500/60 transition-all rounded-sm"
                >
                  <Send size={12} />
                  Send Wish
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommsModal;
