import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const UpgradePrompt: React.FC<{
    featureName?: string;
    requiredPlan?: string;
}> = ({ featureName = "This Feature", requiredPlan = "Premium" }) => {

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-20 rounded-full"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[32px] flex items-center justify-center shadow-2xl mb-8 border border-white/10">
                    <Sparkles className="text-yellow-400" size={48} />
                </div>
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Unlock {featureName}
            </h2>

            <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
                This advanced capability is available exclusively on the <span className="font-bold text-blue-600 uppercase tracking-wider text-sm">{requiredPlan}</span> plan. Upgrade your institution's tier to gain immediate access.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full mb-10 text-left">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <ShieldCheck className="text-emerald-500 mt-1" size={20} />
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Enterprise Security</h4>
                        <p className="text-xs text-slate-400 mt-1">Advanced RLS and audit logs.</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                    <Zap className="text-amber-500 mt-1" size={20} />
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">AI Processing</h4>
                        <p className="text-xs text-slate-400 mt-1">Unlimited usage of Nexus.</p>
                    </div>
                </div>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                Upgrade Plan <ArrowRight size={18} />
            </button>

            <p className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Contact your Super Admin for authorization
            </p>
        </div>
    );
};

export default UpgradePrompt;
