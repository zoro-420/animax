import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Bell, User as UserIcon, PlayCircle, Info, Star,
    Download, List, Clock, ArrowLeft, X, LogIn, Lock, LogOut,
    Menu, Home, Tv, Film, Layers, Calendar, Disc, Mic, ChevronRight, ChevronLeft,
    Loader2, Zap, ShieldCheck, Cpu, Fingerprint, Activity, ScanFace, Command
} from 'lucide-react';
import { getAnimeCatalog, getTrendingAnime, getNewReleases } from '../services/contentService';
import { addToWatchlist, removeFromWatchlist } from '../services/userService';
import { Anime, ViewState, User, WatchOrderItem, ContentType } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import AIAssistant from '../components/AIAssistant';
import AnimeDetail from './AnimeDetail';
import { useAuth } from '../context/AuthContext';

// --- Sub-Components ---

const SidebarItem = ({ icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-mono tracking-wide transition-all duration-300 group relative overflow-hidden ${active
            ? 'text-black font-bold shadow-neon-green'
            : 'text-gray-400 hover:text-white'
            }`}
    >
        {active && <div className="absolute inset-0 bg-brand-green opacity-100 z-0"></div>}
        {!active && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>}

        <div className="relative z-10 flex items-center gap-3">
            {React.cloneElement(icon, {
                className: `transition-colors duration-300 ${active ? 'text-black' : 'text-gray-500 group-hover:text-brand-green'}`,
                size: 20
            })}
            {label}
        </div>
        {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black/20 rounded-l"></div>}
    </button>
);

const Sidebar = ({ view, setView, isSidebarOpen, setIsSidebarOpen, user, handleLogout, onLoginClick }: any) => (
    <>
        {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-black/90 z-40 lg:hidden backdrop-blur-xl"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}
        <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-80 glass-panel border-r-0 lg:border-r border-white/5 transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
            <div className="flex flex-col h-full relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none"></div>

                {/* Logo */}
                <div className="p-8 pb-6 flex items-center justify-center cursor-pointer group" onClick={() => setView('HOME')}>
                    <div className="text-3d-logo text-4xl font-extrabold tracking-tight italic transform skew-x-[-5deg] group-hover:scale-105 transition-transform duration-300">
                        ANIMAX
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 no-scrollbar">
                    <div>
                        <p className="px-5 text-[10px] font-bold text-brand-green/60 uppercase tracking-[0.2em] mb-4 font-mono">Main Deck</p>
                        <nav className="space-y-2">
                            <SidebarItem icon={<Home />} label="Dashboard" active={view === 'HOME'} onClick={() => { setView('HOME'); setIsSidebarOpen(false); }} />
                            <SidebarItem icon={<Disc />} label="Subtitles" />
                            <SidebarItem icon={<Mic />} label="Dubbed" />
                            <SidebarItem icon={<Film />} label="Movies" />
                            <SidebarItem icon={<Calendar />} label="Schedule" />
                        </nav>
                    </div>

                    <div>
                        <p className="px-5 text-[10px] font-bold text-brand-orange/60 uppercase tracking-[0.2em] mb-4 font-mono">My Collection</p>
                        <nav className="space-y-2">
                            <SidebarItem icon={<Clock />} label="History" />
                            <SidebarItem icon={<Layers />} label="Watchlist" />
                        </nav>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                    {!user ? (
                        <button
                            onClick={onLoginClick}
                            className="w-full py-4 bg-gradient-to-r from-brand-green to-emerald-600 text-black font-bold font-mono text-lg rounded-sm transition-all hover:shadow-neon-green hover:scale-[1.02] transform skew-x-[-2deg]"
                        >
                            INITIALIZE LOGIN
                        </button>
                    ) : (
                        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer border border-white/5 hover:border-brand-green/30">
                            <div className="relative">
                                <img src={user.avatar} className="w-10 h-10 rounded-md object-cover ring-2 ring-brand-green/50" alt="avatar" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand-green rounded-full shadow-neon-green animate-pulse"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate font-mono">{user.name}</p>
                                <p className="text-[10px] text-brand-orange uppercase tracking-wide truncate">Premium Citizen</p>
                            </div>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-white p-2 rounded hover:bg-white/10"><LogOut size={18} /></button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    </>
);

const Topbar = ({
    view, setView,
    isSidebarOpen, setIsSidebarOpen,
    searchTerm, setSearchTerm,
    isSearchFocused, setIsSearchFocused,
    searchResults, handleAnimeClick,
    user, handleLogout, onLoginClick
}: any) => (
    <header className="sticky top-0 z-30 h-24 flex items-center justify-between px-8 md:px-12 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent pointer-events-none"></div>

        <div className="flex items-center gap-6 flex-1 pointer-events-auto z-50">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-brand-green hover:text-white transition-transform hover:scale-110">
                <Menu size={28} />
            </button>

            {view !== 'HOME' && (
                <button
                    onClick={() => setView('HOME')}
                    className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-brand-green hover:text-black border border-white/10 px-4 py-2 rounded-lg transition-all group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs font-bold tracking-widest">BACK</span>
                </button>
            )}

            <div className={`relative hidden md:block w-full max-w-xl transition-all duration-500 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                <div className={`
              relative group flex items-center
              glass-panel rounded-2xl border transition-all duration-300
              ${isSearchFocused ? 'border-brand-green shadow-neon-green bg-black/80' : 'border-white/10 bg-black/40'}
          `}>
                    <Search size={20} className={`ml-4 transition-colors ${isSearchFocused ? 'text-brand-green' : 'text-gray-500'}`} />
                    <input
                        type="text"
                        placeholder="SEARCH DATABASE..."
                        value={searchTerm}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent border-none rounded-2xl px-4 py-4 text-sm text-white focus:outline-none font-mono tracking-wider placeholder-gray-600"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="mr-4 text-gray-500 hover:text-brand-orange transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {isSearchFocused && searchTerm && (
                    <div className="absolute top-16 left-0 w-full glass-panel border border-brand-green/30 rounded-2xl shadow-3d-float overflow-hidden z-50 animate-slide-up">
                        {searchResults.length > 0 ? (
                            <div className="py-2">
                                {searchResults.map((anime: Anime) => (
                                    <div
                                        key={anime.id}
                                        onClick={() => handleAnimeClick(anime)}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-brand-green/10 cursor-pointer transition-all border-b border-white/5 last:border-0 group"
                                    >
                                        <img src={anime.coverImage} className="w-12 h-16 object-cover rounded-md shadow-md group-hover:scale-105 transition-transform" alt="cover" />
                                        <div>
                                            <div className="text-white font-bold text-sm line-clamp-1 group-hover:text-brand-green transition-colors font-mono">{anime.title}</div>
                                            <div className="text-gray-500 text-xs flex items-center gap-2 mt-1">
                                                <span className="text-brand-green font-bold">{anime.year}</span>
                                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{anime.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-gray-500 text-sm font-mono">No data found in archives.</div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto z-50">
            <button
                onClick={() => setView('HOME')}
                className="text-gray-400 hover:text-brand-green transition md:hidden"
            >
                <Home size={24} />
            </button>

            <button className="text-gray-400 hover:text-brand-green transition md:hidden"><Search size={24} /></button>

            <button
                onClick={() => setView('HOME')}
                className="hidden md:flex items-center gap-2 text-gray-400 hover:text-brand-green transition group"
                title="Go to Dashboard"
            >
                <div className="p-2 rounded-full border border-transparent group-hover:border-brand-green/50 group-hover:bg-brand-green/10 transition-all">
                    <Home size={22} />
                </div>
            </button>

            {user && !user.isGuest && (
                <button className="relative text-gray-400 hover:text-white transition group">
                    <div className="absolute inset-0 bg-brand-orange/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Bell size={24} className="relative z-10" />
                    <span className="absolute -top-0.5 right-0.5 w-2.5 h-2.5 bg-brand-orange rounded-full border-2 border-black animate-pulse z-20"></span>
                </button>
            )}
            {!user && (
                <button
                    onClick={onLoginClick}
                    className="hidden md:flex bg-white/5 border border-brand-green/50 text-brand-green px-8 py-3 rounded-sm text-sm font-bold font-mono tracking-widest transition-all hover:bg-brand-green hover:text-black hover:shadow-neon-green transform hover:-translate-y-1"
                >
                    LOGIN
                </button>
            )}
            {user && (
                <div className="group relative">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 group-hover:border-brand-green transition-all cursor-pointer shadow-lg transform group-hover:scale-105">
                        <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                    </div>
                </div>
            )}
        </div>
    </header>
);

const AnimeCard: React.FC<{ anime: Anime; onClick: (a: Anime) => void }> = ({ anime, onClick }) => (
    <div
        onClick={() => onClick(anime)}
        className="group cursor-pointer relative perspective-container w-full"
    >
        <div className="card-3d relative aspect-[2/3] rounded-xl overflow-hidden mb-5 bg-[#111] border border-white/5 group-hover:border-brand-green/50">
            <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute inset-0 bg-brand-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 card-content">
                <div className="bg-brand-green text-black rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-neon-green">
                    <PlayCircle size={32} fill="black" />
                </div>
            </div>
            <div className="absolute top-3 left-3 flex flex-col gap-2 items-start card-content">
                <span className="bg-black/60 backdrop-blur-md border border-white/10 text-brand-green text-[10px] font-mono font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                    {anime.type}
                </span>
            </div>
            <div className="absolute top-3 right-3 card-content">
                <span className="bg-brand-orange/90 text-black text-[10px] font-extrabold px-2 py-1 rounded shadow-neon-orange">
                    {anime.quality}
                </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end card-content">
                <div className="flex gap-1.5">
                    {anime.hasSub && <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">SUB</span>}
                    {anime.hasDub && <span className="bg-brand-orange/20 text-brand-orange text-[9px] px-1.5 py-0.5 rounded font-bold border border-brand-orange/30 backdrop-blur-sm">DUB</span>}
                </div>
                {anime.currentEpisode && (
                    <span className="text-brand-green font-mono font-bold text-xs bg-black/80 px-2 py-1 rounded border border-brand-green/30 shadow-lg">
                        EP {anime.currentEpisode}
                    </span>
                )}
            </div>
        </div>
        <div className="transform transition-transform group-hover:translate-x-1">
            <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:text-brand-green transition-colors leading-tight font-sans tracking-tight drop-shadow-md">
                {anime.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 font-mono uppercase tracking-wide">
                <span className="text-brand-green">{anime.year}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="truncate text-gray-400">{anime.status}</span>
            </div>
        </div>
    </div>
);

const HeroCarousel = ({ items, currentIndex, setCurrentIndex, handleAnimeClick }: any) => {
    const heroItems = items.slice(0, 5);
    const item = heroItems[currentIndex] || heroItems[0];

    if (!item) return null;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev: number) => (prev + 1) % heroItems.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [heroItems.length, setCurrentIndex]);

    return (
        <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden group perspective-container">
            <div className="absolute inset-0 transform scale-105 group-hover:scale-100 transition-transform duration-[10s]">
                <img
                    key={item.id}
                    src={item.bannerImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-center opacity-80 transition-all duration-[20s] ease-linear transform scale-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/60 to-transparent" />
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10 pointer-events-none"></div>
            </div>

            <div className="absolute bottom-0 left-0 p-8 md:p-24 w-full md:w-3/4 lg:w-3/5 space-y-8 z-10 card-content">
                <div className="flex items-center gap-4 animate-fade-in">
                    <span className="bg-brand-green/20 text-brand-green border border-brand-green/40 px-3 py-1 text-xs font-mono font-bold tracking-widest uppercase rounded shadow-neon-green backdrop-blur-md">
                        # {currentIndex + 1} Trending
                    </span>
                    <div className="flex items-center gap-2">
                        <Star size={14} className="text-brand-orange" fill="#ff8800" />
                        <span className="text-brand-orange font-bold font-mono">{item.rating}</span>
                    </div>
                </div>

                <h1 className="text-5xl md:text-8xl font-black text-white leading-none line-clamp-2 animate-slide-up tracking-tighter drop-shadow-2xl italic">
                    {item.title}
                </h1>

                <div className="flex items-center gap-8 text-gray-300 text-sm font-medium animate-fade-in delay-100 font-mono tracking-wide">
                    <span className="flex items-center gap-2 text-brand-green"><Tv size={18} /> {item.type}</span>
                    <span className="flex items-center gap-2"><Clock size={18} /> 24m</span>
                    <span className="flex items-center gap-2"><Calendar size={18} /> {item.year}</span>
                    <div className="flex gap-3 ml-2">
                        {item.hasSub && <span className="bg-white/10 text-white px-3 py-1 rounded-sm text-xs border border-white/20">SUB</span>}
                        {item.hasDub && <span className="bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-sm text-xs border border-brand-orange/30">DUB</span>}
                    </div>
                </div>

                <p className="text-gray-400 text-sm md:text-lg line-clamp-3 leading-relaxed animate-fade-in delay-200 max-w-2xl border-l-2 border-brand-green/50 pl-6">
                    {item.description}
                </p>

                <div className="flex items-center gap-6 pt-6 animate-fade-in delay-300">
                    <button
                        onClick={() => handleAnimeClick(item)}
                        className="group relative flex items-center gap-3 bg-brand-green text-black px-12 py-5 rounded-sm font-bold text-lg font-mono tracking-widest transition-all hover:scale-105 hover:shadow-neon-green overflow-hidden skew-x-[-5deg]"
                    >
                        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <PlayCircle size={24} fill="black" className="relative z-10" />
                        <span className="relative z-10">START STREAM</span>
                    </button>
                    <button
                        onClick={() => handleAnimeClick(item)}
                        className="p-5 glass-panel text-white rounded-sm transition-all hover:bg-white/10 hover:text-brand-green hover:border-brand-green/50 skew-x-[-5deg]"
                    >
                        <Info size={24} className="skew-x-[5deg]" />
                    </button>
                </div>
            </div>

            <div className="absolute right-12 bottom-12 flex gap-4">
                <button
                    onClick={() => setCurrentIndex((prev: number) => (prev === 0 ? heroItems.length - 1 : prev - 1))}
                    className="p-4 glass-panel text-white rounded-sm hover:border-brand-green hover:text-brand-green transition hover:shadow-neon-green skew-x-[-5deg]"
                >
                    <ChevronLeft size={24} className="skew-x-[5deg]" />
                </button>
                <button
                    onClick={() => setCurrentIndex((prev: number) => (prev + 1) % heroItems.length)}
                    className="p-4 glass-panel text-white rounded-sm hover:border-brand-green hover:text-brand-green transition hover:shadow-neon-green skew-x-[-5deg]"
                >
                    <ChevronRight size={24} className="skew-x-[5deg]" />
                </button>
            </div>
        </div>
    );
};

const HomeView = ({
    trending,
    newReleases,
    mages,
    topAiring,
    currentHeroIndex,
    setCurrentHeroIndex,
    handleAnimeClick
}: any) => (
    <div className="animate-fade-in pb-32">
        <HeroCarousel
            items={trending}
            currentIndex={currentHeroIndex}
            setCurrentIndex={setCurrentHeroIndex}
            handleAnimeClick={handleAnimeClick}
        />

        <div className="px-8 md:px-16 space-y-20 mt-16 relative">
            <section>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-brand-green skew-x-[-10deg] shadow-neon-green"></div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic">TRENDING <span className="text-brand-green">NOW</span></h2>
                    </div>
                    <button className="text-sm text-gray-400 hover:text-brand-green flex items-center gap-2 transition-colors group font-mono tracking-widest uppercase">
                        View Full List <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x perspective-container pl-4">
                    {trending.map((anime: Anime) => (
                        <div key={anime.id} className="min-w-[220px] md:min-w-[260px] snap-start">
                            <AnimeCard anime={anime} onClick={handleAnimeClick} />
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-brand-green skew-x-[-10deg] shadow-neon-green"></div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic">MAGES & <span className="text-brand-green">MAGIC</span></h2>
                    </div>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x perspective-container pl-4">
                    {mages.map((anime: Anime) => (
                        <div key={anime.id} className="min-w-[220px] md:min-w-[260px] snap-start">
                            <AnimeCard anime={anime} onClick={handleAnimeClick} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-3 space-y-12">
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-2 h-10 bg-brand-orange skew-x-[-10deg] shadow-neon-orange"></div>
                            <h2 className="text-3xl font-black text-white tracking-tighter italic">FRESH <span className="text-brand-orange">DROPS</span></h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {newReleases.slice(0, 8).map((anime: Anime, idx: number) => (
                                <AnimeCard key={`${anime.id}-${idx}`} anime={anime} onClick={handleAnimeClick} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-panel rounded-2xl p-8 border-t-4 border-t-brand-green sticky top-28">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 italic">
                            <Zap size={24} className="text-brand-green" fill="currentColor" />
                            TOP AIRING
                        </h3>
                        <div className="space-y-6">
                            {topAiring.slice(0, 5).map((anime: Anime, idx: number) => (
                                <div
                                    key={anime.id}
                                    onClick={() => handleAnimeClick(anime)}
                                    className="flex items-center gap-5 cursor-pointer group"
                                >
                                    <div className={`
                            w-8 h-8 rounded-sm transform rotate-45 flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg
                            ${idx < 3 ? 'bg-brand-green text-black' : 'bg-white/10 text-gray-400'}
                         `}>
                                        <span className="transform -rotate-45">{idx + 1}</span>
                                    </div>
                                    <div className="w-14 h-20 rounded-md overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-brand-green/50 transition shadow-md">
                                        <img src={anime.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-brand-green transition font-mono tracking-wide">{anime.title}</h4>
                                        <div className="flex gap-3 text-[10px] text-gray-500 mt-2">
                                            <span className="flex items-center gap-1"><Star size={12} className="text-brand-orange" fill="#ff8800" /> {anime.rating}</span>
                                            <span className="bg-white/5 px-2 py-0.5 rounded text-brand-green uppercase font-bold">{anime.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 bg-white/5 hover:bg-brand-green/20 text-brand-green border border-brand-green/30 text-xs font-bold rounded-sm transition font-mono tracking-widest uppercase hover:shadow-neon-green">
                            View Full Leaderboard
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
);

// --- Main Dashboard Component ---

const Dashboard = () => {
    const [view, setView] = useState<ViewState>('HOME');
    const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
    const [currentWatchItem, setCurrentWatchItem] = useState<WatchOrderItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [catalog, setCatalog] = useState<Anime[]>([]);
    const [trending, setTrending] = useState<Anime[]>([]);
    const [newReleases, setNewReleases] = useState<Anime[]>([]);
    const [mages, setMages] = useState<Anime[]>([]);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    const [searchResults, setSearchResults] = useState<Anime[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    const { userData: user, logout, refreshUserProfile } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        // UI updates automatically
    };

    const handleWatchlistToggle = async () => {
        if (!user || user.isGuest) {
            navigate('/login');
            return;
        }
        if (!selectedAnime) return;

        const isAdded = user.watchlist?.includes(selectedAnime.id);
        if (isAdded) {
            await removeFromWatchlist(user.id, selectedAnime.id);
        } else {
            await addToWatchlist(user.id, selectedAnime.id);
        }
        await refreshUserProfile();
    };

    useEffect(() => {
        const loadContent = async () => {
            setIsLoadingContent(true);
            try {
                const [catalogData, trendingData, newData] = await Promise.all([
                    getAnimeCatalog(),
                    getTrendingAnime(10),
                    getNewReleases(12)
                ]);
                setCatalog(catalogData);
                setTrending(trendingData);
                setNewReleases(newData);
                setMages(catalogData.filter(a => a.genres.includes('Fantasy') || a.description.toLowerCase().includes('mage')));
            } catch (error) {
                console.error("Failed to load content:", error);
            } finally {
                setIsLoadingContent(false);
            }
        };
        loadContent();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        const results = catalog.filter(anime =>
            anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            anime.japaneseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, catalog]);

    const handleAnimeClick = (anime: Anime) => {
        setSelectedAnime(anime);
        setView('DETAIL');
        setSearchTerm('');
        setIsSearchFocused(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePlayClick = (item: WatchOrderItem) => {
        setCurrentWatchItem(item);
        setView('WATCH');
    };

    const handleClosePlayer = () => {
        setView('DETAIL');
        setCurrentWatchItem(null);
    };

    const handleNextVideo = () => {
        if (!selectedAnime || !currentWatchItem) return;
        const currentIndex = selectedAnime.watchOrder.findIndex(i => i.id === currentWatchItem.id);
        const next = selectedAnime.watchOrder[currentIndex + 1];
        if (next) {
            setCurrentWatchItem(next);
        } else {
            handleClosePlayer();
        }
    };

    return (
        <div className="flex h-screen bg-[#020202] text-gray-200 font-sans overflow-hidden">
            <Sidebar
                view={view}
                setView={setView}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                user={user}
                handleLogout={handleLogout}
                onLoginClick={() => navigate('/login')}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Topbar
                    view={view}
                    setView={setView}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearchFocused={isSearchFocused}
                    setIsSearchFocused={setIsSearchFocused}
                    searchResults={searchResults}
                    handleAnimeClick={handleAnimeClick}
                    user={user}
                    handleLogout={handleLogout}
                    onLoginClick={() => navigate('/login')}
                />

                <main className="flex-1 overflow-y-auto scroll-smooth bg-[#020202] perspective-container">
                    {view === 'HOME' && (
                        <HomeView
                            trending={trending}
                            newReleases={newReleases}
                            mages={mages}
                            topAiring={catalog} // Using full catalog as top airing fallback for now
                            currentHeroIndex={currentHeroIndex}
                            setCurrentHeroIndex={setCurrentHeroIndex}
                            handleAnimeClick={handleAnimeClick}
                        />
                    )}
                    {view === 'DETAIL' && (
                        <AnimeDetail
                            selectedAnime={selectedAnime}
                            handlePlayClick={handlePlayClick}
                            onBack={() => setView('HOME')}
                            onWatchlistToggle={handleWatchlistToggle}
                            isAdded={user?.watchlist?.includes(selectedAnime?.id || '')}
                        />
                    )}
                </main>
            </div>

            {view === 'WATCH' && currentWatchItem && (
                <VideoPlayer
                    item={currentWatchItem}
                    isGuest={!user || user.isGuest}
                    availableLanguages={selectedAnime?.availableLanguages || ['English']}
                    onClose={handleClosePlayer}
                    onNext={handleNextVideo}
                    nextItem={
                        selectedAnime?.watchOrder[
                        selectedAnime.watchOrder.findIndex(i => i.id === currentWatchItem.id) + 1
                        ]
                    }
                />
            )}

            {view !== 'WATCH' && (
                <AIAssistant
                    catalog={catalog}
                    currentAnime={selectedAnime || undefined}
                    isGuest={!user || user.isGuest}
                    onLoginRequest={() => navigate('/login')}
                />
            )}
        </div>
    );
};

export default Dashboard;
