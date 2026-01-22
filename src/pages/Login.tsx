import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Mail, Lock, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, isDevMode, switchRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { error } = await login(email, password);

        if (error) {
            setError(error);
            setIsLoading(false);
        } else {
            navigate(from, { replace: true });
        }
    };

    // Dev mode: quick role selection
    const handleDevLogin = (role: string) => {
        switchRole(role as any);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px] opacity-50"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                        <GraduationCap className="text-indigo-600" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">EduPulse</h1>
                    <p className="text-slate-500 text-sm mt-2">Unified Digital Campus</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/50">
                    <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">Welcome Back</h2>

                    {isDevMode && (
                        <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="flex items-center gap-3 text-amber-700 mb-4">
                                <Sparkles size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Development Mode</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => handleDevLogin(role)}
                                        className="px-4 py-3 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white transition-all border border-slate-100"
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl text-rose-600 text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="educator@edupulse.edu"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-none font-medium focus:ring-4 focus:ring-indigo-100 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl border-none font-medium focus:ring-4 focus:ring-indigo-100 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In to Campus'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-xs mt-8">
                        Contact IT department for account assistance
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
