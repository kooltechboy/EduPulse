import React, { useState, useEffect, useRef } from 'react';
import {
    Mic, MicOff, Volume2, Sparkles, X,
    MessageSquare, Brain, GraduationCap,
    Zap, Info, Clock, Play
} from 'lucide-react';
import { connectToLiveTutor } from '@/services/geminiService';

const LiveTutor: React.FC = () => {
    const [isLive, setIsLive] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello! I'm Zephyr, your EduPulse AI Tutor. Ready to dive into some learning together? You can speak or type your questions." }
    ]);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    const handleToggleLive = () => {
        setIsLive(!isLive);
        if (!isLive) {
            // In a real implementation, we would call connectToLiveTutor here
            // and handle the audio streams. For this demonstration, we'll simulate the UI flow.
            setIsListening(true);
        } else {
            setIsListening(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transcript.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: transcript }]);
        setTranscript("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: "That's a fascinating question! Based on our curriculum data, we can analyze that from three perspectives..." }]);
        }, 1000);
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">

            {/* Immersive Header */}
            <div className="relative h-[300px] bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[64px] overflow-hidden flex items-center justify-center text-white shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-950/50 to-transparent"></div>

                <div className="relative z-10 text-center space-y-6">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-full mx-auto flex items-center justify-center border border-white/20 animate-pulse">
                        <Brain size={48} className="text-blue-200" />
                    </div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic">Zephyr Live Tutor</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-300">Advanced Neural Interaction Core v2.5</p>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
                    <div className="px-6 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-3">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[8px] font-black uppercase tracking-widest">Real-time Latency: 42ms</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">

                {/* Sidebar: Context & Progress */}
                <div className="space-y-8">
                    <div className="academic-card p-10 bg-white border-blue-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Current Session Context</h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2">Subject Node</p>
                                <p className="text-sm font-black text-slate-900">Advanced Quantum Theory</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2">Next Milestone</p>
                                <p className="text-sm font-black text-slate-900 uppercase">Entropy Calculus</p>
                            </div>
                        </div>
                    </div>

                    <div className="academic-card p-10 bg-slate-900 text-white border-none">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Learning Velocity</h4>
                        <div className="flex items-end gap-2 h-32 mb-8">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group">
                                    <div className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span className="text-slate-500">Stability</span>
                            <span className="text-emerald-400">Optimal (94%)</span>
                        </div>
                    </div>
                </div>

                {/* Center: Interaction Hub */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="academic-card h-[600px] flex flex-col bg-white border-none shadow-2xl overflow-hidden rounded-[56px]">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                    <div className={`max-w-[80%] p-8 rounded-[40px] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                                        <p className={`text-sm font-semibold leading-relaxed ${msg.role === 'assistant' ? 'italic' : ''}`}>
                                            {msg.role === 'assistant' && <Sparkles className="inline-block mr-3 text-blue-500" size={16} />}
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interaction Controls */}
                        <div className="p-10 bg-slate-50 border-t border-slate-100">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    placeholder={isLive ? "Speak now or type your query..." : "Initialize Zephyr to start voice tutoring..."}
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    className="w-full bg-white border border-slate-200 px-10 py-6 rounded-[32px] text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:italic"
                                    disabled={!isLive}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleToggleLive}
                                        className={`p-4 rounded-2xl transition-all active:scale-90 ${isLive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
                                    >
                                        {isLive ? <Mic size={20} /> : <Play size={20} />}
                                    </button>
                                </div>
                            </form>
                            <div className="mt-6 flex justify-center gap-10">
                                <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Volume2 size={12} /> HD Audio Active</span>
                                <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Info size={12} /> Encrypted Node</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600"><Clock size={20} /></div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase leading-none mb-1.5">Session Timer</p>
                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Remaining: 14m 22s</p>
                            </div>
                        </div>
                        <button className="secondary-button px-8 py-4 text-[10px]">End Session</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LiveTutor;
