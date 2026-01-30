import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, Volume2, Settings, ArrowLeft, 
  Maximize, Captions, Globe, Download, Lock
} from 'lucide-react';
import { WatchOrderItem, ContentType } from '../types';

interface VideoPlayerProps {
  item: WatchOrderItem;
  availableLanguages: string[];
  isGuest: boolean;
  onClose: () => void;
  onNext: () => void;
  nextItem?: WatchOrderItem;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  item, availableLanguages, isGuest, onClose, onNext, nextItem 
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLang, setSelectedLang] = useState(availableLanguages[0] || 'Japanese (Sub)');

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          if (prev > 5 && prev < 15) setShowSkipIntro(true);
          else setShowSkipIntro(false);
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!showSettings) setShowControls(false);
    }, 3000);
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [showControls, showSettings]);

  const handleSkipIntro = () => {
    setProgress(15);
    setShowSkipIntro(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden font-sans perspective-container">
      {/* Background Video Layer */}
      <div className="absolute inset-0 bg-[#050505] z-0">
        <img 
          src={item.thumbnail} 
          alt="Video Background" 
          className="w-full h-full object-cover opacity-60 blur-md scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="glass-panel p-8 rounded-2xl flex flex-col items-center border border-brand-green/30 shadow-neon-green animate-pulse-fast">
                 <p className="text-brand-green text-3xl font-black italic tracking-tighter">ANIMAX STREAM</p>
                 <p className="text-white mt-4 text-xl font-bold">{item.title}</p>
                 <p className="text-gray-400 mt-2 font-mono text-sm">{selectedLang}</p>
             </div>
        </div>
      </div>

      {showSkipIntro && (
        <button 
          onClick={handleSkipIntro}
          className="absolute bottom-32 right-12 bg-white text-black px-8 py-4 font-bold rounded-sm shadow-3d-float hover:bg-brand-green hover:shadow-neon-green transition-all z-50 flex items-center gap-3 animate-fade-in font-mono tracking-widest transform skew-x-[-5deg]"
        >
          <SkipForward size={20} fill="black" />
          SKIP INTRO
        </button>
      )}

      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 transition-opacity duration-500 flex flex-col justify-between p-10 z-10 ${showControls ? 'opacity-100' : 'opacity-0 cursor-none'}`}
      >
        {/* Top Bar - High Z-Index to be clickable */}
        <div className="flex justify-between items-start relative z-50 pointer-events-auto">
          <button onClick={onClose} className="group flex items-center gap-2 text-white hover:text-brand-green transition-colors">
            <div className="bg-white/10 p-3 rounded-full group-hover:bg-brand-green group-hover:text-black transition-all shadow-neon-green">
                <ArrowLeft size={24} />
            </div>
            <span className="font-mono font-bold tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">EXIT</span>
          </button>
          
          <div className="flex flex-col items-center glass-panel px-8 py-2 rounded-b-xl border-t-0 border-brand-green/20">
             <span className="text-brand-green text-xs font-mono font-bold tracking-[0.3em] mb-1">NOW PLAYING</span>
             <div className="text-white font-black text-xl tracking-tight italic">
                {item.title}
             </div>
             <span className="text-gray-400 text-xs mt-1 font-mono">
                {item.type === ContentType.EPISODE ? `EPISODE ${item.orderIndex}` : 'MOVIE'}
             </span>
          </div>

          <div className="flex gap-4 relative">
             <button 
               className={`flex items-center gap-2 px-6 py-3 rounded-sm text-xs font-bold font-mono tracking-widest transition border ${isGuest ? 'border-gray-700 text-gray-600 cursor-not-allowed' : 'border-white/20 text-white hover:bg-white/10 hover:border-brand-green'}`}
               title={isGuest ? "Login to download" : "Download offline"}
             >
                {isGuest ? <Lock size={14} /> : <Download size={16} />}
                DOWNLOAD
             </button>

             <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-brand-green relative p-3 hover:rotate-90 transition-transform duration-500"
             >
                <Settings size={24} />
             </button>

             {showSettings && (
               <div className="absolute top-16 right-0 bg-black/90 backdrop-blur-xl border border-brand-green/30 rounded-xl p-6 w-72 shadow-neon-green z-50 animate-slide-up">
                  <h4 className="text-brand-green text-sm font-black mb-4 border-b border-white/10 pb-2 font-mono tracking-widest">AUDIO CONFIG</h4>
                  <div className="space-y-2">
                     {availableLanguages.map(lang => (
                        <button 
                          key={lang} 
                          onClick={() => { setSelectedLang(lang); setShowSettings(false); }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all font-mono uppercase tracking-wide ${selectedLang === lang ? 'bg-brand-green text-black shadow-neon-green' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                           {lang}
                        </button>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Center Play Button - Lower Z-Index to allow Top/Bottom interactions */}
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-0"
        >
           {!isPlaying && (
            <div className="relative group z-10">
                <div className="absolute inset-0 bg-brand-green rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse"></div>
                <div className="bg-black/80 p-8 rounded-full backdrop-blur-md border-2 border-brand-green shadow-neon-green relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <Play size={64} className="text-brand-green ml-2" fill="#00ffa3" />
                </div>
            </div>
           )}
        </div>

        {/* Bottom Controls - High Z-Index */}
        <div className="relative z-50 space-y-6 pointer-events-auto bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 mb-8 mx-8 shadow-3d-float hover:border-brand-green/30 transition-colors">
           {/* Progress Bar */}
           <div className="w-full bg-white/10 h-2 rounded-full cursor-pointer relative group" onClick={(e) => e.stopPropagation()}>
              <div 
                className="bg-brand-green h-2 rounded-full relative shadow-neon-green transition-all duration-100 ease-linear" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 -top-2 w-6 h-6 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-brand-green" />
              </div>
           </div>

           <div className="flex justify-between items-center">
             <div className="flex items-center gap-8">
               <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-brand-green transition transform hover:scale-110">
                 {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
               </button>
               <button className="text-white hover:text-brand-green transition transform hover:scale-110">
                 <SkipForward size={24} />
               </button>
               <div className="flex items-center gap-3 group cursor-pointer">
                 <Volume2 size={24} className="text-white group-hover:text-brand-green transition-colors" />
                 <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-brand-green shadow-neon-green"></div>
                 </div>
               </div>
               <span className="text-brand-green font-mono font-bold text-sm tracking-widest">
                 {Math.floor(progress * 0.24)}:{(Math.floor(progress * 0.6) % 60).toString().padStart(2, '0')} <span className="text-gray-500">/</span> {item.duration}
               </span>
             </div>

             <div className="flex items-center gap-6">
               <button className="text-gray-400 hover:text-white transition flex flex-col items-center gap-1 group">
                   <Captions size={20} />
                   <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-brand-green">CC</span>
               </button>
               <button className="text-gray-400 hover:text-white transition flex flex-col items-center gap-1 group">
                   <Globe size={20} />
                   <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-brand-green">LANG</span>
               </button>

               {nextItem && (
                 <button 
                  onClick={onNext}
                  className="bg-white/5 hover:bg-brand-green hover:text-black text-white px-6 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 border border-white/10 font-mono tracking-wide"
                 >
                   NEXT EP
                   <SkipForward size={14} />
                 </button>
               )}
               <button className="text-white hover:text-brand-green transition transform hover:scale-110"><Maximize size={24} /></button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;