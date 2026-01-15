import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Plus, MoreVertical, Sparkles, 
  UserCheck, Heart, ShieldCheck, Clock, CheckCircle2, 
  MessageCircle, Trash2, Paperclip, Smile, Zap, 
  ChevronRight, ArrowLeft, Filter, Phone, Video,
  Info, Wand2, Activity, MessageSquareText,
  MessageCircleCode, Share, ExternalLink, ShieldAlert,
  Users, User
} from 'lucide-react';
import { User as UserType, UserRole, Message, Conversation } from '../../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'CONV-001',
    type: 'Direct',
    participants: [
      { id: 'TCH001', name: 'Professor Mitchell', role: UserRole.TEACHER, phoneNumber: '1234567890' },
      { id: 'PAR001', name: 'Mrs. Thompson', role: UserRole.PARENT, phoneNumber: '9876543210' }
    ],
    messages: [
      { id: 'M1', senderId: 'TCH001', senderName: 'Professor Mitchell', senderRole: UserRole.TEACHER, content: "Hello Mrs. Thompson, I'm reaching out to discuss Alex's recent progress in Advanced Calculus. He showed great intuition today.", timestamp: '2026-05-18T10:00:00Z', read: true, channel: 'Native' },
      { id: 'M2', senderId: 'PAR001', senderName: 'Mrs. Thompson', senderRole: UserRole.PARENT, content: "Thank you for the update, Professor. We will continue the practice sets tonight.", timestamp: '2026-05-18T10:15:00Z', read: true, channel: 'Native' }
    ]
  },
  {
    id: 'CONV-002',
    type: 'Institutional',
    participants: [
      { id: 'ADM001', name: 'Coordination Office', role: UserRole.ADMIN, phoneNumber: '0000000000' },
      { id: 'TCH001', name: 'Professor Mitchell', role: UserRole.TEACHER, phoneNumber: '1234567890' }
    ],
    messages: [
      { id: 'M3', senderId: 'ADM001', senderName: 'Coordination Office', senderRole: UserRole.ADMIN, content: "Reminder: The Secondary Tier faculty meeting is scheduled for tomorrow at 08:00 AM. Attendance is mandatory.", timestamp: '2026-05-18T09:00:00Z', read: false, channel: 'Native' }
    ]
  },
  {
    id: 'CONV-003',
    type: 'Institutional',
    participants: [
      { id: 'ADM001', name: 'Coordination Office', role: UserRole.ADMIN },
      { id: 'PAR001', name: 'Mrs. Thompson', role: UserRole.PARENT }
    ],
    messages: [
      { id: 'M4', senderId: 'ADM001', senderName: 'Coordination Office', senderRole: UserRole.ADMIN, content: "The Q3 Financial Statement for Alex is now ready in the Finance Dossier.", timestamp: '2026-05-17T14:20:00Z', read: true, channel: 'Native' }
    ]
  }
];

const MessagingHub: React.FC<{ user: UserType }> = ({ user }) => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeConvId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const otherParticipant = activeConv?.participants.find(p => p.id !== user.id);

  const handleSendMessage = (channel: 'Native' | 'WhatsApp' = 'Native') => {
    if (!messageInput.trim() || !activeConvId) return;

    if (channel === 'WhatsApp' && otherParticipant?.phoneNumber) {
      // Use the standard wa.me link for WhatsApp Bridge
      const url = `https://wa.me/${otherParticipant.phoneNumber}?text=${encodeURIComponent(messageInput)}`;
      window.open(url, '_blank');
      // Logging the transmission internally for institutional accountability
    }

    const newMessage: Message = {
      id: `M-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: true,
      channel
    };

    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, newMessage] } : c));
    setMessageInput('');
  };

  const handleAIDraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsAIGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Draft a professional yet warm school message for a digital campus. 
        Context: "${aiPrompt}". 
        Sender Role: ${user.role}, Receiver Role: ${otherParticipant?.role}. 
        Constraint: Keep it under 3 sentences. Professional tone suitable for school-parent or faculty communication.`,
        config: { systemInstruction: "Institutional Communication Architect mode. Output clean text only." }
      });
      setMessageInput(response.text || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIGenerating(false);
      setAiPrompt('');
    }
  };

  // Filter conversations based on roles - usually institutional logic
  const accessibleConversations = conversations.filter(conv => {
    // Basic filter: only show if searching
    if (searchQuery) {
        const partner = conv.participants.find(p => p.id !== user.id);
        return partner?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               conv.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* SIDEBAR: COMMUNICATION NODES */}
      <aside className={`
        ${activeConvId && isMobileView ? 'hidden' : 'flex'} 
        lg:flex flex-col w-full lg:w-[420px] glass-card rounded-[48px] bg-white shadow-2xl overflow-hidden border-none
      `}>
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global Inbox</h2>
            <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[24px] font-bold text-sm shadow-inner focus:ring-4 focus:ring-blue-100 transition-all" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 bg-white/40">
          {accessibleConversations.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const partner = conv.participants.find(p => p.id !== user.id);
            return (
              <button 
                key={conv.id}
                onClick={() => { setActiveConvId(conv.id); setIsMobileView(true); }}
                className={`w-full text-left p-6 rounded-[36px] transition-all flex items-center gap-5 group relative overflow-hidden ${activeConvId === conv.id ? 'bg-slate-900 text-white shadow-2xl scale-[1.02] z-10' : 'hover:bg-blue-50 text-slate-600'}`}
              >
                <div className="relative">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.name}`} className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-lg tracking-tight truncate uppercase leading-none">{partner?.name}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${activeConvId === conv.id ? 'text-blue-300' : 'text-slate-400'}`}>
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-xs font-bold truncate opacity-60`}>{lastMsg?.content || 'Establishing link...'}</p>
                </div>
                {!lastMsg?.read && lastMsg?.senderId !== user.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN: ACTIVE GRID TRANSMISSION */}
      <main className={`
        ${!activeConvId && isMobileView ? 'hidden' : 'flex'}
        flex-1 flex flex-col glass-card rounded-[48px] bg-white shadow-2xl border-none overflow-hidden relative
      `}>
        {activeConv ? (
          <>
            <header className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-6">
                <button onClick={() => { setActiveConvId(null); setIsMobileView(false); }} className="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><ArrowLeft size={20} /></button>
                <div className="relative">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.name}`} className="w-16 h-16 rounded-[24px] border-4 border-slate-50 shadow-xl" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-glow-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{otherParticipant?.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">{otherParticipant?.role} Node</span>
                    {otherParticipant?.phoneNumber && (
                       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                          <MessageCircleCode size={12} /> WhatsApp Bridge Active
                       </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-4 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Phone size={22} /></button>
                <button className="p-4 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Video size={22} /></button>
                <button className="p-4 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical size={22} /></button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 p-8 md:p-14 overflow-y-auto space-y-10 scrollbar-hide bg-slate-50/20">
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                      <div className={`
                        p-6 md:p-8 rounded-[36px] font-bold text-base md:text-lg leading-relaxed shadow-lg relative group
                        ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
                      `}>
                        {msg.content}
                        {msg.channel === 'WhatsApp' && (
                           <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 opacity-60">
                              <MessageCircleCode size={14} className="text-emerald-400" />
                              <span className="text-[8px] uppercase font-black tracking-widest">Dispatched via WhatsApp Bridge</span>
                           </div>
                        )}
                        <div className={`absolute top-0 ${isMe ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 cursor-pointer`}><Trash2 size={16} /></div>
                      </div>
                      <div className="mt-3 flex items-center gap-3 px-4">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                           {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         {isMe && (
                            <div className="flex items-center">
                               <CheckCircle2 size={12} className="text-blue-500" />
                               <CheckCircle2 size={12} className="text-blue-500 -ml-1" />
                            </div>
                         )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="p-8 md:p-12 border-t border-slate-100 bg-white z-20 space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                 <div className="flex-1 relative group w-full">
                   <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Compose advisory or use neural synthesis..." 
                    className="w-full pl-8 pr-48 py-6 bg-slate-50 border-none rounded-[32px] font-bold text-lg outline-none focus:ring-[12px] focus:ring-blue-100/50 transition-all shadow-inner" 
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <button 
                        onClick={() => handleSendMessage('WhatsApp')}
                        title="Bridge to WhatsApp"
                        className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 active:scale-90"
                     >
                        <MessageCircleCode size={22} />
                     </button>
                     <button 
                        onClick={() => handleSendMessage('Native')} 
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-90"
                     >
                        <Send size={22} />
                     </button>
                   </div>
                 </div>
              </div>
              
              {/* GEMINI NEURAL ASSISTANT DECK */}
              <div className="p-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[40px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12"><Wand2 size={120} /></div>
                 <div className="flex flex-col xl:flex-row items-center gap-6 relative z-10">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xl border border-white/10"><Sparkles className="text-blue-400 animate-pulse" /></div>
                    <div className="flex-1 text-center xl:text-left">
                       <h5 className="text-white font-black text-sm uppercase tracking-tighter">Correspondence Neural Synthesis</h5>
                       <p className="text-blue-200 text-[9px] font-bold uppercase tracking-widest mt-1">Transform raw observations into polished advisories</p>
                    </div>
                    <div className="w-full xl:w-auto flex flex-col md:flex-row gap-3">
                       <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Draft for: 'Aiden excelled in lab today'..." 
                        className="flex-1 md:w-80 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-400 transition-all" 
                       />
                       <button 
                        onClick={handleAIDraft}
                        disabled={isAIGenerating || !aiPrompt.trim()}
                        className="px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                       >
                         {isAIGenerating ? <Activity className="animate-spin" size={14} /> : <Zap size={14} className="text-blue-600" />} Synthesize Draft
                       </button>
                    </div>
                 </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-slate-50/50">
             <div className="w-32 h-32 bg-white rounded-[48px] shadow-2xl flex items-center justify-center mb-10 transform -rotate-6">
                <MessageSquareText size={64} className="text-slate-200" />
             </div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Neural Grid Idle</h3>
             <p className="text-lg text-slate-400 font-bold max-w-md mx-auto leading-relaxed italic">Select an institutional communication link from the sidebar to establish transmission.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagingHub;