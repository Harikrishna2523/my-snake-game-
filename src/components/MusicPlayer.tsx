import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Synthwave AI Override",
    artist: "AI Gen 01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Neon Cyber Pulse",
    artist: "AI Gen 02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Digital Grid Runner",
    artist: "AI Gen 03",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const toggleMute = () => setIsMuted(!isMuted);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full flex flex-col gap-4 border-2 border-brand-cyan p-4 bg-black/80 blur-0">
      <h3 className="text-xl uppercase text-brand-cyan mb-2 border-b-2 border-brand-cyan pb-1 glitch-text" data-text=">>SND_TRK">
        &gt;&gt;SND_TRK
      </h3>
      
      {/* Track List */}
      <div className="flex flex-col gap-2">
        {TRACKS.map((track, i) => {
          const isActive = i === currentTrackIndex;
          return (
            <div 
              key={track.id}
              onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
              className={`p-2 flex items-center gap-3 transition-colors cursor-pointer border-l-4 ${isActive ? 'bg-brand-cyan text-black border-brand-cyan shadow-[0_0_10px_var(--color-brand-cyan)]' : 'border-transparent text-brand-dim hover:border-brand-magenta hover:text-brand-magenta'}`}
            >
              <div className="flex flex-col">
                <h4 className="text-lg mb-0 uppercase leading-none">{track.title}</h4>
                <p className="text-sm opacity-80 uppercase leading-none mt-1">{track.artist}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls mimicking footer */}
      <div className="mt-4 pt-4 border-t-2 border-brand-cyan flex flex-col gap-4">
        {/* Playback bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-brand-cyan uppercase">
            <span>{currentTrack.title}</span> <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-2 bg-brand-bg relative overflow-hidden border border-brand-cyan">
            <div 
              className="absolute left-0 top-0 h-full bg-brand-cyan transition-all duration-300 ease-linear" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between items-center mt-2">
           <button onClick={toggleMute} className="text-brand-cyan hover:text-brand-magenta transition-colors">
             {isMuted ? <VolumeX className="w-6 h-6"/> : <Volume2 className="w-6 h-6"/>}
           </button>
           <div className="flex items-center gap-4">
             <button onClick={skipBack} className="w-10 h-10 border-2 border-brand-cyan text-brand-cyan flex items-center justify-center hover:bg-brand-cyan hover:text-black hover:shadow-[0_0_10px_var(--color-brand-cyan)] transition-colors">
               <SkipBack className="w-5 h-5 fill-current"/>
             </button>
             <button onClick={togglePlay} className="w-14 h-14 border-2 border-brand-magenta bg-brand-magenta text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:bg-black hover:text-brand-magenta transition-colors">
               {isPlaying ? <Pause className="w-6 h-6 fill-current"/> : <Play className="w-6 h-6 fill-current ml-1"/>}
             </button>
             <button onClick={skipForward} className="w-10 h-10 border-2 border-brand-cyan text-brand-cyan flex items-center justify-center hover:bg-brand-cyan hover:text-black hover:shadow-[0_0_10px_var(--color-brand-cyan)] transition-colors">
               <SkipForward className="w-5 h-5 fill-current"/>
             </button>
           </div>
        </div>
      </div>
      
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
