import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import api from '@/services/api';
import { cn } from '@/lib/utils';
import { Clock, Users, Volume2, VolumeX } from 'lucide-react';

const PublicQueueDisplayPage = () => {
  const { queueId } = useParams();
  const { socket } = useSocket();
  const [queue, setQueue] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [nextTokens, setNextTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch queue data
  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [queueId]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !queueId) return;

    socket.emit('join-queue', queueId);

    const handleTokenCalled = (data) => {
      if (data.queueId === queueId) {
        setCurrentToken(data.token);
        fetchQueueData();
        if (soundEnabled) playChime();
      }
    };

    const handleQueueUpdate = (data) => {
      if (data.queueId === queueId) {
        fetchQueueData();
      }
    };

    socket.on('token-called', handleTokenCalled);
    socket.on('queue-update', handleQueueUpdate);

    return () => {
      socket.emit('leave-queue', queueId);
      socket.off('token-called', handleTokenCalled);
      socket.off('queue-update', handleQueueUpdate);
    };
  }, [socket, queueId, soundEnabled]);

  const fetchQueueData = async () => {
    try {
      const response = await api.get(`/queues/${queueId}/display`);
      const data = response.data;
      setQueue(data.queue);
      setCurrentToken(data.currentToken);
      setNextTokens(data.nextTokens || []);
    } catch (error) {
      console.error('Failed to fetch queue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const playChime = () => {
    // Create a simple beep sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading display...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold">{queue?.name || 'Queue Display'}</h1>
          <p className="text-white/60">{queue?.organisation?.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6 text-white/50" />
            )}
          </button>
          <div className="text-right">
            <p className="text-3xl font-mono font-bold">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-white/60">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-100px)]">
        {/* Current Token - Large Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-2xl text-white/60 mb-4 uppercase tracking-widest">Now Serving</p>
          {currentToken ? (
            <div className="text-center animate-fade-in">
              <p className="text-[12rem] font-bold leading-none tracking-wider bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                {currentToken.tokenNumber || currentToken.displayNumber}
              </p>
              {currentToken.counter && (
                <p className="mt-4 text-3xl text-emerald-400">
                  Counter {currentToken.counter}
                </p>
              )}
            </div>
          ) : (
            <p className="text-6xl text-white/30">---</p>
          )}
        </div>

        {/* Next Tokens Panel */}
        <div className="w-96 bg-white/5 border-l border-white/10 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Up Next
          </h2>
          
          <div className="space-y-3">
            {nextTokens.length > 0 ? (
              nextTokens.slice(0, 8).map((token, index) => (
                <div
                  key={token.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-all",
                    index === 0 
                      ? "bg-emerald-500/20 border border-emerald-500/30" 
                      : "bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg text-white/40 font-mono w-6">
                      {index + 1}
                    </span>
                    <span className="text-2xl font-bold">
                      {token.tokenNumber || token.displayNumber}
                    </span>
                  </div>
                  {token.estimatedWait && (
                    <span className="text-sm text-white/60 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      ~{token.estimatedWait}m
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/40">
                <p>No one waiting</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{nextTokens.length}</p>
              <p className="text-sm text-white/60">Waiting</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">~{queue?.averageTime || 10}m</p>
              <p className="text-sm text-white/60">Avg Wait</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 px-8 py-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Powered by Q-Ease Digital Queue Management
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm text-white/60">Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicQueueDisplayPage;
