import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ScanFace, Command, User as UserIcon, Loader2, PlayCircle, Fingerprint, Lock } from 'lucide-react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passkeys do not match mismatch');
        }
        if (formData.password.length < 6) {
            return setError('Passkey sequence too short (min 6)');
        }

        setLoading(true);
        try {
            const { email, password, confirmPassword, ...additionalData } = formData;
            await signup(email, password, additionalData);
            navigate('/');
        } catch (err: any) {
            console.error('Signup error:', err);
            // Map Firebase errors to "Cyber" errors
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Neural ID already registered in database');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid Neural ID format');
                    break;
                case 'auth/weak-password':
                    setError('Security protocol too weak');
                    break;
                default:
                    setError('Initialization failed. Check system logs.');
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
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white tracking-tight italic text-3d-logo">INITIALIZE IDENTITY</h2>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-mono rounded w-3/4 text-center">
                            ERROR: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full px-8 space-y-5">
                        <div className="group">
                            <label className="text-[9px] font-mono text-gray-500 tracking-widest ml-1 mb-1 block group-focus-within:text-brand-green transition-colors">DESIGNATION (NAME)</label>
                            <div className="relative">
                                <UserIcon className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-brand-green transition-colors" size={16} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-gray-800 text-white pl-8 py-2 font-mono text-sm tracking-wider focus:outline-none focus:border-brand-green transition-colors placeholder-gray-800 input-phantom"
                                    placeholder="OPERATOR NAME..."
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[9px] font-mono text-gray-500 tracking-widest ml-1 mb-1 block group-focus-within:text-brand-green transition-colors">NEURAL ID (EMAIL)</label>
                            <div className="relative">
                                <ScanFace className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-brand-green transition-colors" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-gray-800 text-white pl-8 py-2 font-mono text-sm tracking-wider focus:outline-none focus:border-brand-green transition-colors placeholder-gray-800 input-phantom"
                                    placeholder="ENTER ID..."
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[9px] font-mono text-gray-500 tracking-widest ml-1 mb-1 block group-focus-within:text-brand-green transition-colors">PASSKEY (PASSWORD)</label>
                            <div className="relative">
                                <Command className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-brand-green transition-colors" size={16} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full bg-transparent border-b border-gray-800 text-white pl-8 py-2 font-mono text-sm tracking-wider focus:outline-none focus:border-brand-green transition-colors placeholder-gray-800 input-phantom"
                                    placeholder="CREATE KEY..."
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[9px] font-mono text-gray-500 tracking-widest ml-1 mb-1 block group-focus-within:text-brand-green transition-colors">CONFIRM PASSKEY</label>
                            <div className="relative">
                                <Lock className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-brand-green transition-colors" size={16} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-gray-800 text-white pl-8 py-2 font-mono text-sm tracking-wider focus:outline-none focus:border-brand-green transition-colors placeholder-gray-800 input-phantom"
                                    placeholder="CONFIRM KEY..."
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
                                    {loading ? 'PROCESSING SCANS...' : 'REGISTER IDENTITY'}
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-center items-center pt-4">
                        <Link to="/login" className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors underline decoration-gray-800 hover:decoration-white">
                            RETURN TO IDENTIFICATION
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
