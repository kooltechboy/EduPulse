import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 isolate">
            {/* Cinematic Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-slate-900/50 backdrop-blur-3xl z-10"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                {/* Floating Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Sparkles className="text-indigo-400 w-4 h-4" />
                    <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Next-Gen Digital Campus</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 max-w-4xl mx-auto">
                    The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">Future Schools</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    EduPulse unifies LMS, SIS, and AI-powered learning into one stunning, cinematic interface. Transform your institution into a digital powerhouse today.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button
                        onClick={() => navigate('/login')}
                        className="group relative px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center gap-3 overflow-hidden"
                    >
                        <span className="relative z-10">Launch Demo Campus</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-white opacity-0 group-hover:opacity-50 transition-opacity transform -skew-x-12 translate-x-full group-hover:translate-x-0 duration-500"></div>
                    </button>

                    <button className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold text-lg hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all flex items-center gap-3">
                        <Play className="w-5 h-5 fill-current" />
                        Watch Product Tour
                    </button>
                </div>

                {/* Feature Ticks */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400 text-sm font-medium animate-in fade-in zoom-in duration-1000 delay-500">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-indigo-500 w-5 h-5" />
                        <span>AI-Powered Grading</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-indigo-500 w-5 h-5" />
                        <span>Real-time Collaboration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-indigo-500 w-5 h-5" />
                        <span>Enterprise Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
