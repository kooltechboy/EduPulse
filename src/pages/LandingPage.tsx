import React, { useEffect } from 'react';
import Hero from '@/components/Marketing/Hero';
import FeatureShowcase from '@/components/Marketing/FeatureShowcase';
import Pricing from '@/components/Marketing/Pricing';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // If user is already logged in, show 'Go to Dashboard' in nav

    return (
        <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform -rotate-3">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">EduPulse</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-white hover:text-indigo-400 font-bold text-sm transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                        >
                            Start Free Trial
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                <Hero />
                <FeatureShowcase />
                <Pricing />
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 py-12 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm">© 2026 EduPulse Inc. secure-node-v4. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
