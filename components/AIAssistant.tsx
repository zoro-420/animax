import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Lock, Cpu } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { Anime } from '../types';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  catalog: Anime[];
  currentAnime?: Anime;
  isGuest: boolean;
  onLoginRequest: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ catalog, currentAnime, isGuest, onLoginRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "System Online. I am ANIMAX AI. How can I optimize your viewing experience?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await generateAIResponse(userMsg, catalog, currentAnime);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-neon-green z-40 transition-all duration-300 hover:scale-110 group ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'scale-100 bg-brand-green'}`}
      >
        <div className="absolute inset-0 bg-brand-green blur-md opacity-50 animate-pulse"></div>
        <Bot size={32} className="text-black relative z-10" />
      </button>

      <div 
        className={`fixed bottom-8 right-8 w-[400px] max-w-[90vw] glass-panel border border-brand-green/30 rounded-2xl shadow-3d-float z-40 flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-20 pointer-events-none'}`}
        style={{ height: '600px' }}
      >
        {/* Holographic Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/60 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 via-transparent to-brand-green/5 animate-pulse"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2 bg-brand-green/20 border border-brand-green/50 rounded-lg shadow-neon-green">
                <Cpu size={20} className="text-brand-green" />
            </div>
            <div>
                <h3 className="font-black text-white text-lg tracking-wider italic text-3d-logo">ANIMAX <span className="text-brand-green">AI</span></h3>
                <p className="text-[10px] text-brand-green font-mono uppercase tracking-[0.2em]">Neural Interface v9.0</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/40 backdrop-blur-md">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div 
                className={`max-w-[85%] p-4 rounded-xl text-sm font-medium leading-relaxed shadow-lg border relative ${
                  msg.role === 'user' 
                    ? 'bg-brand-green text-black rounded-br-none border-brand-green shadow-neon-green font-mono' 
                    : 'bg-[#0a0a0a] border-white/10 text-gray-200 rounded-bl-none border-l-2 border-l-brand-green'
                }`}
              >
                {msg.text}
                {msg.role === 'ai' && <div className="absolute -left-2 -bottom-2 w-2 h-2 bg-brand-green rounded-full shadow-neon-green"></div>}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-[#0a0a0a] border border-white/10 border-l-2 border-l-brand-green p-4 rounded-xl rounded-bl-none flex gap-2 items-center">
                 <span className="text-brand-green text-xs font-mono animate-pulse">PROCESSING</span>
                 <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" />
                 <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-75" />
                 <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce delay-150" />
               </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/10 bg-black/80 rounded-b-2xl backdrop-blur-xl">
          {isGuest ? (
            <div className="text-center py-2">
              <button 
                onClick={onLoginRequest}
                className="flex items-center gap-3 mx-auto bg-white/5 hover:bg-brand-green hover:text-black hover:shadow-neon-green text-gray-300 border border-white/10 px-6 py-3 rounded-sm text-xs font-bold transition-all font-mono tracking-widest uppercase"
              >
                <Lock size={14} /> Initialize Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-black/60 rounded-xl px-4 py-3 border border-white/10 focus-within:border-brand-green focus-within:shadow-neon-green transition-all">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="INPUT QUERY..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600 font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="text-brand-green hover:text-white disabled:opacity-30 transition hover:scale-110"
              >
                <Send size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIAssistant;