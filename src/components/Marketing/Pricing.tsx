import React from 'react';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
    return (
        <div className="bg-slate-900 py-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-900/10 transform skew-x-12"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-400">Choose the perfect plan for your institution size.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Starter */}
                    <div className="p-8 rounded-[32px] bg-slate-800/50 border border-white/5 hover:border-white/10 transition-all">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Starter</div>
                        <div className="text-4xl font-black mb-6">$0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
                        <p className="text-slate-400 mb-8 min-h-[48px]">Perfect for single classrooms or small tutors.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> Up to 50 Students</li>
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> Basic LMS Features</li>
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> 1GB Storage</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm transition-all">Get Started</button>
                    </div>

                    {/* Pro */}
                    <div className="p-8 rounded-[32px] bg-indigo-600 border border-indigo-500 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-500/30">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-400 text-indigo-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
                        <div className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-4">Growth</div>
                        <div className="text-4xl font-black mb-6">$499<span className="text-lg text-indigo-200 font-medium">/mo</span></div>
                        <p className="text-indigo-100 mb-8 min-h-[48px]">For growing schools needing SIS & AI features.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-indigo-50"><Check className="text-white w-4 h-4" /> Up to 500 Students</li>
                            <li className="flex items-center gap-3 text-sm text-indigo-50"><Check className="text-white w-4 h-4" /> AI Grading Assistant</li>
                            <li className="flex items-center gap-3 text-sm text-indigo-50"><Check className="text-white w-4 h-4" /> Parent Portal Access</li>
                            <li className="flex items-center gap-3 text-sm text-indigo-50"><Check className="text-white w-4 h-4" /> 1TB Storage</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-sm transition-all shadow-lg">Start Free Trial</button>
                    </div>

                    {/* Enterprise */}
                    <div className="p-8 rounded-[32px] bg-slate-800/50 border border-white/5 hover:border-white/10 transition-all">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Enterprise</div>
                        <div className="text-4xl font-black mb-6">Custom</div>
                        <p className="text-slate-400 mb-8 min-h-[48px]">Full digital transformation for large districts.</p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> Unlimited Students</li>
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> Custom Domain & Branding</li>
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> Veo Cinematic Studio</li>
                            <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-indigo-400 w-4 h-4" /> 24/7 Priority Support</li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm transition-all">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
