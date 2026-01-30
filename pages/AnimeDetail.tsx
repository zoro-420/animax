import { ArrowLeft, PlayCircle, Layers, Star, Clock, Calendar, List } from 'lucide-react';
import { WatchOrderItem, ContentType } from '../types';

interface AnimeDetailProps {
    selectedAnime: any;
    handlePlayClick: (item: WatchOrderItem) => void;
    onBack: () => void;
    onWatchlistToggle: () => void;
    isAdded: boolean;
}

const AnimeDetail = ({ selectedAnime, handlePlayClick, onBack, onWatchlistToggle, isAdded }: AnimeDetailProps) => {
    if (!selectedAnime) return null;
    return (
        <div className="min-h-screen bg-[#020202] animate-fade-in pb-20 relative">
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={onBack}
                    className="bg-black/60 backdrop-blur-md border border-white/10 hover:border-brand-green text-white p-4 rounded-full transition-all hover:scale-110 hover:shadow-neon-green group"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img src={selectedAnime.bannerImage} className="w-full h-full object-cover opacity-40 blur-sm scale-105" alt="banner" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent" />
                </div>

                <div className="absolute inset-0 px-8 md:px-16 py-12 flex flex-col md:flex-row items-center md:items-end gap-12 max-w-7xl mx-auto z-10">
                    <div className="perspective-container">
                        <div className="card-3d w-64 md:w-80 aspect-[2/3] rounded-xl overflow-hidden shadow-3d-float border border-white/10 flex-shrink-0 relative group">
                            <img src={selectedAnime.coverImage} className="w-full h-full object-cover" alt="cover" />
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <span className="bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-sm shadow-neon-green font-mono">{selectedAnime.quality}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-8 mb-4">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter italic drop-shadow-lg text-3d-logo">{selectedAnime.title}</h1>
                            <h2 className="text-2xl text-gray-400 mt-2 font-medium font-mono">{selectedAnime.japaneseTitle}</h2>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-300 font-bold tracking-wide">
                            <span className="text-brand-orange flex items-center gap-2"><Star size={20} fill="currentColor" /> {selectedAnime.rating}</span>
                            <span className="flex items-center gap-2"><Clock size={20} /> 24m</span>
                            <span className="flex items-center gap-2"><Calendar size={20} /> {selectedAnime.year}</span>
                            <span className="px-4 py-1 border border-brand-green/50 text-brand-green rounded-full text-xs uppercase shadow-neon-green">{selectedAnime.type}</span>
                        </div>

                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                            {selectedAnime.watchOrder[0] && (
                                <button
                                    onClick={() => handlePlayClick(selectedAnime.watchOrder[0])}
                                    className="group bg-brand-green text-black px-12 py-5 rounded-sm font-bold text-xl transition-all hover:scale-105 hover:shadow-neon-green flex items-center gap-3 font-mono tracking-widest skew-x-[-5deg]"
                                >
                                    <PlayCircle size={28} fill="black" className="skew-x-[5deg]" />
                                    <span className="skew-x-[5deg]">PLAY EPISODE 1</span>
                                </button>
                            )}
                            <button
                                onClick={onWatchlistToggle}
                                className={`glass-panel text-white px-8 py-5 rounded-sm font-bold transition-all hover:bg-white/10 flex items-center gap-3 skew-x-[-5deg] ${isAdded ? 'border border-brand-green text-brand-green' : 'hover:border-brand-green'}`}
                            >
                                <Layers size={24} className="skew-x-[5deg]" />
                                <span className="skew-x-[5deg]">{isAdded ? 'IN LIBRARY' : 'ADD TO LIST'}</span>
                            </button>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-4xl line-clamp-3 font-light">
                            {selectedAnime.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
                <div className="glass-panel rounded-2xl overflow-hidden border-t-4 border-t-brand-green">
                    <div className="flex items-center justify-between p-8 border-b border-white/5 bg-black/40">
                        <h3 className="text-2xl font-black text-white flex items-center gap-3 italic">
                            <List className="text-brand-green" size={28} /> EPISODE LIST
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 font-mono">
                            <span className="px-4 py-1 bg-white/5 rounded-full border border-white/5 text-brand-green">{selectedAnime.watchOrder.length} ITEMS</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                        {selectedAnime.watchOrder.map((item: WatchOrderItem) => (
                            <div
                                key={item.id}
                                onClick={() => handlePlayClick(item)}
                                className={`
                       relative group overflow-hidden rounded-xl cursor-pointer transition-all border
                       ${item.type === ContentType.MOVIE ? 'bg-brand-green/5 border-brand-green/30 hover:shadow-neon-green' : 'bg-black/40 border-white/10 hover:border-brand-green/50 hover:bg-white/5'}
                    `}
                            >
                                <div className="aspect-video w-full overflow-hidden relative">
                                    <img src={item.thumbnail} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={item.title} />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-brand-green/90 p-3 rounded-full shadow-lg">
                                            <PlayCircle size={24} className="text-black" fill="black" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                                        {item.duration}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-brand-green font-mono">EPISODE {item.orderIndex}</span>
                                    </div>
                                    <p className={`text-sm font-bold truncate ${item.type === ContentType.MOVIE ? 'text-brand-green' : 'text-gray-200'} group-hover:text-white transition-colors`}>
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;
