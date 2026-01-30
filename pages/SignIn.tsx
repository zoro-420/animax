import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ScanFace, Command, Loader2, Fingerprint } from 'lucide-react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('Identity not found');
                    break;
                case 'auth/wrong-password':
                    setError('Invalid Passkey');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid Neural ID format');
                    break;
                case 'auth/too-many-requests':
                    setError('System lockout. Try again later.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid Identity or Passkey');
                    break;
                default:
                    setError('Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black bg-lux-gradient overflow-hidden relative">
            {/* Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-brand-green/40 rounded-full animate-particle-rise"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-[420px] card-3d z-10 mx-4">
                <div className="glass-luxury rounded-3xl overflow-hidden shadow-3d-float border border-white/5 flex flex-col items-center pb-8 pt-12 relative">

                    {/* --- 3D NEURAL HALO (Static Version) --- */}
                    <div className="h-40 w-full flex items-center justify-center mb-6 preserve-3d">
                        <div className="halo-wrapper halo-focused">
                            <div className="halo-core"></div>
                            <div className="halo-ring ring-orbital animate-spin-slow"></div>
                            <div className="halo-ring ring-signal animate-spin-reverse"></div>
                            <div className="halo-ring ring-data animate-spin-medium opacity-30"></div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white tracking-tight italic text-3d-logo">IDENTIFY</h2>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-mono rounded w-3/4 text-center">
                            ACCESS DENIED: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full px-8 space-y-5">
                        <div className="group">
                            <label className="text-[9px] font-mono text-gray-500 tracking-widest ml-1 mb-1 block group-focus-within:text-brand-green transition-colors">NEURAL ID (EMAIL)</label>
                            <div className="relative">
                                <ScanFace className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-brand-green transition-colors" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-transparent border-b border-gray-800 text-white pl-8 py-2 font-mono text-sm tracking-wider focus:outline-none focus:border-brand-green transition-colors placeholder-gray-800 input-phantom"
                                    placeholder="ENTER ID..."
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[9px] font-mono text-gray-500 tracking-widest ml-1 mb-1 block group-focus-within:text-brand-green transition-colors">PASSKEY</label>
                            <div className="relative">
                                <Command className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-brand-green transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-transparent border-b border-gray-800 text-white pl-8 py-2 font-mono text-sm tracking-wider focus:outline-none focus:border-brand-green transition-colors placeholder-gray-800 input-phantom"
                                    placeholder="ENTER KEY..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-4 rounded-sm font-bold text-xs font-mono tracking-[0.2em] transition-all duration-500 relative overflow-hidden group
                                    ${loading ? 'bg-brand-orange text-black' : 'bg-white text-black hover:bg-brand-green hover:shadow-neon-green'}
                                `}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Fingerprint size={16} />}
                                    {loading ? 'VERIFYING...' : 'AUTHENTICATE'}
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-center items-center pt-4">
                        <Link to="/signup" className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors underline decoration-gray-800 hover:decoration-white">
                            CREATE NEW IDENTITY
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
