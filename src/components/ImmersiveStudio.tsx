import React, { useState } from 'react';
import {
    Sparkles, Wand2, Image as ImageIcon, Video,
    BookOpen, Brain, Download, RefreshCw,
    ChevronRight, Play, Info, AlertCircle
} from 'lucide-react';
import { generateAILessonPlan, generateConceptualVisual, generateLessonRecapVideo } from '@/services/geminiService';

const ImmersiveStudio: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("University");
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [progressMsg, setProgressMsg] = useState("");

    const [lessonPlan, setLessonPlan] = useState<string | null>(null);
    const [visualUrl, setVisualUrl] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleSynthesize = async () => {
        if (!topic.trim()) return;
        setIsSynthesizing(true);
        setLessonPlan(null);
        setVisualUrl(null);
        setVideoUrl(null);

        try {
            // 1. Generate Lesson Plan
            setProgressMsg("Architecting pedagogical flow...");
            const plan = await generateAILessonPlan(topic, "Experimental", `${level} Honors Curriculum`);
            setLessonPlan(plan);

            // 2. Generate Visual Aid
            setProgressMsg("Rendering conceptual imagery via Imagen 4.0...");
            const visual = await generateConceptualVisual(topic);
            setVisualUrl(visual);

            // 3. Generate Video Recap
            setProgressMsg("Synthesizing cinematic recap via Veo 3.1...");
            const video = await generateLessonRecapVideo(topic, plan, (msg) => setProgressMsg(msg));
            setVideoUrl(video);

        } catch (error) {
            console.error("Synthesis failed", error);
        } finally {
            setIsSynthesizing(false);
            setProgressMsg("");
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">

            {/* Hero Header */}
            <div className="relative p-12 bg-slate-900 rounded-[48px] overflow-hidden text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-40 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Wand2 size={24} /></div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Immersive Learning Studio</h2>
                        </div>
                        <p className="text-slate-400 font-medium max-w-xl text-sm leading-relaxed">
                            Synthesize multi-modal instructional materials in seconds. Leverage Imagen 4.0 for conceptual diagrams and Veo 3.1 for cinematic lesson recaps.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Compute Status</p>
                            <p className="text-sm font-black uppercase">Nexus High-Load</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

                {/* Input & Controller */}
                <div className="space-y-8">
                    <div className="academic-card p-10 bg-white border-blue-100">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                            <Brain size={18} className="text-blue-600" /> Synthesis Configuration
                        </h3>

                        <div className="space-y-8">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Core Pedagogical Topic</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Quantum Entanglement or Micro-Economics"
                                    className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[24px] text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Academic Tier</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['High School', 'University', 'Post-Grad', 'Professional'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setLevel(t)}
                                            className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${level === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSynthesize}
                                disabled={!topic || isSynthesizing}
                                className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-4"
                            >
                                {isSynthesizing ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                Synthesize Hub
                            </button>
                        </div>
                    </div>

                    {isSynthesizing && (
                        <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 flex flex-col items-center text-center animate-pulse">
                            <div className="flex gap-2 mb-6">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                            <p className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">{progressMsg}</p>
                        </div>
                    )}
                </div>

                {/* Output Area */}
                <div className="xl:col-span-2 space-y-10">

                    {!lessonPlan && !isSynthesizing && (
                        <div className="h-96 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[64px] text-slate-300">
                            <BookOpen size={64} className="mb-6 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-[0.5em] opacity-50">Awaiting Instructional Input</p>
                        </div>
                    )}

                    {lessonPlan && (
                        <div className="space-y-10 animate-fade-in-up">

                            {/* Lesson Plan Card */}
                            <div className="academic-card p-12 bg-white">
                                <div className="flex justify-between items-center mb-10 pb-10 border-b border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen size={20} /></div>
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Synthesized Roadmap</h4>
                                    </div>
                                    <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors"><Download size={20} /></button>
                                </div>
                                <div className="prose prose-slate max-w-none prose-xs font-medium text-slate-600 leading-relaxed italic">
                                    {lessonPlan}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Visual Aid */}
                                <div className="academic-card p-8 group">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <ImageIcon size={14} className="text-emerald-500" /> Conceptual Diagram
                                    </h5>
                                    <div className="aspect-video bg-slate-100 rounded-[32px] overflow-hidden relative shadow-inner">
                                        {visualUrl ? (
                                            <img src={visualUrl} alt="Conceptual aid" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full animate-pulse">
                                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <button className="p-4 bg-white text-slate-900 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform"><Download size={20} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Recap Video */}
                                <div className="academic-card p-8 group">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <Video size={14} className="text-rose-500" /> Cinematic Recap
                                    </h5>
                                    <div className="aspect-video bg-slate-900 rounded-[32px] overflow-hidden relative shadow-2xl flex items-center justify-center">
                                        {videoUrl ? (
                                            <video src={videoUrl} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Veo Engine Synthesis...</p>
                                        )}
                                        {!videoUrl && <Play className="text-white/10 absolute" size={48} />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-8 bg-emerald-50 rounded-[40px] border border-emerald-100">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Info size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-emerald-900">Multimodal Materials Exportable</p>
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Ready for Google Classroom & Canvas Integration</p>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ImmersiveStudio;
