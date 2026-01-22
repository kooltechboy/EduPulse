import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, Send, Plus, MoreVertical, Sparkles,
  UserCheck, ShieldCheck, MessageCircle, Trash2,
  Zap, ChevronRight, ArrowLeft, Filter, Phone, Video,
  Activity, MessageCircleCode, Users, User, X, Loader2, Mic,
  PhoneCall, VideoIcon, Globe, Layers, Megaphone, Bell,
  Briefcase, Mail, CheckCircle2, Clock, Fingerprint,
  Circle, Dot
} from 'lucide-react';
import { User as UserType, UserRole, Message, Conversation, GradeLevel } from '@/types';
import { GoogleGenAI } from "@google/genai";


import { getAI } from "@/services/geminiService";




// Comprehensive 2026 Campus Identity Repository
const CAMPUS_DIRECTORY = {
  STAFF: [
    { id: 'ADM-001', name: 'Principal Anderson', role: UserRole.ADMIN, dept: 'Leadership', avatar: 'Anderson' },
    { id: 'COORD-01', name: 'Dr. Sarah (Secondary Coord)', role: UserRole.ADMIN, dept: 'Coordination', avatar: 'Sarah' },
    { id: 'COORD-02', name: 'Mr. Julian (Elem Coord)', role: UserRole.ADMIN, dept: 'Coordination', avatar: 'Julian' },
    { id: 'TCH-001', name: 'Professor Mitchell', role: UserRole.TEACHER, dept: 'Mathematics', avatar: 'Mitchell' },
    { id: 'TCH-002', name: 'Ms. Clara Humanities', role: UserRole.TEACHER, dept: 'History', avatar: 'Clara' },
    { id: 'FIN-01', name: 'Finance Office', role: UserRole.ADMIN, dept: 'Finance', avatar: 'Finance' },
  ],
  PARENT_GROUPS: [
    { id: 'GRP-G10', name: 'Grade 10 Parent Body', type: 'Grade', scope: GradeLevel.SENIOR_HIGH },
    { id: 'GRP-G12', name: 'Grade 12 Parent Body', type: 'Grade', scope: GradeLevel.SENIOR_HIGH },
    { id: 'GRP-C10A', name: 'Class 10-A Parents', type: 'Class', scope: '10-A' },
  ],
  TIERS: [
    { id: 'TIER-EC', name: 'Early Childhood Tier', type: 'Tier', icon: <Layers size={20} /> },
    { id: 'TIER-EL', name: 'Elementary Tier', type: 'Tier', icon: <Layers size={20} /> },
    { id: 'TIER-SEC', name: 'Secondary Tier', type: 'Tier', icon: <Layers size={20} /> },
    { id: 'TIER-GLOBAL', name: 'Global Campus Broadcast', type: 'Global', icon: <Globe size={20} /> },
  ],
  PARENTS: [
    { id: 'PAR-001', name: 'Mrs. Thompson', role: UserRole.PARENT, child: 'Alex Thompson', avatar: 'Thompson' },
    { id: 'PAR-002', name: 'Mr. Sterling', role: UserRole.PARENT, child: 'Leo Sterling', avatar: 'Sterling' },
  ]
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'CONV-GLOBAL-01',
    type: 'Institutional',
    participants: [{ id: 'SYS-GLOBAL', name: 'Global Campus', role: UserRole.ADMIN }],
    messages: [
      { id: 'B1', senderId: 'ADM-001', senderName: 'Principal Anderson', senderRole: UserRole.ADMIN, content: "Institutional Alert: The 2026 Academic Gala schedule is now live. Please review.", timestamp: '2026-05-18T08:00:00Z', read: true, channel: 'Native' }
    ]
  },
  {
    id: 'CONV-001',
    type: 'Direct',
    participants: [
      { id: 'TCH-001', name: 'Professor Mitchell', role: UserRole.TEACHER },
      { id: 'PAR-001', name: 'Mrs. Thompson', role: UserRole.PARENT, phoneNumber: '9876543210' }
    ],
    messages: [
      { id: 'M1', senderId: 'TCH-001', senderName: 'Professor Mitchell', senderRole: UserRole.TEACHER, content: "Mrs. Thompson, Alex has achieved a 98% mastery in today's calculus session.", timestamp: '2026-05-18T10:00:00Z', read: true, channel: 'Native' }
    ]
  }
];

const MessagingHub: React.FC<{ user: UserType }> = ({ user }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxFilter, setInboxFilter] = useState<'All' | 'Unread' | 'Staff' | 'Parents' | 'Broadcasts'>('All');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [discoveryTab, setDiscoveryTab] = useState<'Staff' | 'Parents' | 'Groups' | 'Tiers'>('Staff');
  const [isCallActive, setIsCallActive] = useState<{ active: boolean; type: 'Audio' | 'Video' | null }>({ active: false, type: null });
  const [isMobileView, setIsMobileView] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<any[]>(CAMPUS_DIRECTORY.STAFF); // Fallback to mock for directory if DB empty

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const { messagingService } = await import('@/services/messagingService');
        const data = await messagingService.fetchConversations(user.id);
        setConversations(data);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.id) loadConversations();
  }, [user.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeConvId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const otherParticipant = activeConv?.participants.find(p => p.id !== user.id);

  const canBroadcast = user.role === UserRole.ADMIN || user.role === UserRole.TEACHER;

  const handleSendMessage = async (channel: 'Native' | 'WhatsApp' = 'Native') => {
    if (!messageInput.trim() || !activeConvId) return;

    if (channel === 'WhatsApp' && otherParticipant?.phoneNumber) {
      window.open(`https://wa.me/${otherParticipant.phoneNumber}?text=${encodeURIComponent(messageInput)}`, '_blank');
    }

    // Optimistic update
    const newMessage: Message = {
      id: `TEMP-${Date.now()}`,
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

    try {
      const { messagingService } = await import('@/services/messagingService');
      await messagingService.sendMessage(activeConvId, newMessage.content, user.id, channel);
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const deleteMessage = (msgId: string) => {
    // Implement delete via service if needed
    if (confirm("Permanently remove this transmission from your local ledger?")) {
      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: c.messages.filter(m => m.id !== msgId) } : c));
    }
  };

  const toggleUnread = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic to toggle read status in DB
  };

  const startNewConversation = async (node: any, type: 'Direct' | 'Broadcast') => {
    const existing = conversations.find(c => c.participants.some(p => p.id === node.id));
    if (existing) {
      setActiveConvId(existing.id);
    } else {
      try {
        const { messagingService } = await import('@/services/messagingService');
        // For demo, just creating local first or calling service
        // In real app: const newConv = await messagingService.createConversation(type, [user.id, node.id]);
        // For now, using mock structure to avoid blocking on empty DB
        const newConv: Conversation = {
          id: `CONV-${Date.now()}`,
          type,
          participants: [
            { id: user.id, name: user.name, role: user.role },
            { id: node.id, name: node.name, role: node.role || UserRole.ADMIN, avatar: node.avatar, phoneNumber: node.phoneNumber }
          ],
          messages: []
        };
        setConversations([newConv, ...conversations]);
        setActiveConvId(newConv.id);
      } catch (e) {
        console.error("Failed to start conversation", e);
      }
    }
    setIsDiscoveryOpen(false);
  };

  const handleAIDraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsAIGenerating(true);
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Draft a high-fidelity ${activeConv?.type === 'Broadcast' ? 'school broadcast' : 'direct message'}. 
        Context: "${aiPrompt}". 
        Sender Role: ${user.role}. Receiver: ${otherParticipant?.role || 'Parent Body'}.`,
        config: { systemInstruction: "Institutional Communication Expert Mode. Professional, futuristic, warm tone." }
      });
      setMessageInput(response.text || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIGenerating(false);
      setAiPrompt('');
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const partner = conv.participants.find(p => p.id !== user.id) || conv.participants[0];
      const lastMsg = conv.messages[conv.messages.length - 1];
      const search = searchQuery.toLowerCase();

      const matchesSearch = partner.name.toLowerCase().includes(search) ||
        conv.messages.some(m => m.content.toLowerCase().includes(search));

      let matchesFilter = true;
      if (inboxFilter === 'Unread') matchesFilter = lastMsg && !lastMsg.read;
      else if (inboxFilter === 'Staff') matchesFilter = partner.role !== UserRole.PARENT && conv.type === 'Direct';
      else if (inboxFilter === 'Parents') matchesFilter = partner.role === UserRole.PARENT;
      else if (inboxFilter === 'Broadcasts') matchesFilter = conv.type === 'Broadcast' || conv.type === 'Institutional';

      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchQuery, user.id, inboxFilter]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700">

      {/* SIDEBAR: NAVIGATION NODES */}
      <aside className={`
        ${activeConvId && isMobileView ? 'hidden' : 'flex'} 
        lg:flex flex-col w-full lg:w-[420px] glass-card rounded-[40px] bg-white/70 shadow-2xl overflow-hidden border border-white/40
      `}>
        <div className="p-8 border-b border-slate-100 bg-white/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Global Inbox</h2>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1.5">Neural Hub Sync V2.6</p>
            </div>
            <button
              onClick={() => setIsDiscoveryOpen(true)}
              className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search registry or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-[18px] font-bold text-xs shadow-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              {['All', 'Unread', 'Staff', 'Parents', 'Broadcasts'].map(f => (
                <button
                  key={f}
                  onClick={() => setInboxFilter(f as any)}
                  className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${inboxFilter === f ? 'bg-slate-900 text-white shadow-md' : 'bg-white/50 text-slate-400 hover:text-blue-600 border border-white/40'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2 bg-slate-50/30">
          {filteredConversations.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const partner = conv.participants.find(p => p.id !== user.id) || conv.participants[0];
            const isUnread = lastMsg && !lastMsg.read;
            const isBroadcast = conv.type === 'Broadcast' || conv.type === 'Institutional';

            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setIsMobileView(true);
                  // Mark as read when clicking unless explicitly already unread
                  if (isUnread) {
                    setConversations(prev => prev.map(c => {
                      if (c.id !== conv.id) return c;
                      const updated = [...c.messages];
                      updated[updated.length - 1] = { ...updated[updated.length - 1], read: true };
                      return { ...c, messages: updated };
                    }));
                  }
                }}
                className={`w-full text-left p-4 rounded-[28px] transition-all flex items-center gap-4 group relative overflow-hidden ${activeConvId === conv.id ? 'bg-slate-900 text-white shadow-xl scale-[1.01] z-10' : 'hover:bg-white text-slate-600 border border-transparent hover:border-slate-100'}`}
              >
                <div className="relative">
                  {isBroadcast ? (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border-2 border-white/20 ${activeConvId === conv.id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      {conv.type === 'Institutional' ? <Globe size={20} /> : <Megaphone size={20} />}
                    </div>
                  ) : (
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.avatar || partner.name}`} className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-md transition-transform group-hover:scale-110" alt="" />
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-white ${activeConvId === conv.id ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-black text-sm tracking-tight truncate uppercase leading-none">{partner.name}</h4>
                    <span className={`text-[7px] font-black uppercase tracking-widest opacity-60`}>
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready'}
                    </span>
                  </div>
                  <p className={`text-[10px] font-bold truncate opacity-50 ${isUnread ? 'text-blue-400 opacity-100' : ''}`}>
                    {lastMsg?.content || 'Communication link established.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleUnread(conv.id, e)}
                    className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isUnread ? 'text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50/10'}`}
                    title={isUnread ? "Mark as Read" : "Mark as Unread"}
                  >
                    {isUnread ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN: ACTIVE GRID TRANSMISSION */}
      <main className={`
        ${!activeConvId && isMobileView ? 'hidden' : 'flex'}
        flex-1 flex flex-col glass-card rounded-[40px] bg-white shadow-2xl border border-white/40 overflow-hidden relative
      `}>
        {activeConv ? (
          <>
            <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/60 backdrop-blur-xl z-20 sticky top-0 shadow-sm">
              <div className="flex items-center gap-5">
                <button onClick={() => { setActiveConvId(null); setIsMobileView(false); }} className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><ArrowLeft size={18} /></button>
                <div className="relative">
                  {activeConv.type === 'Broadcast' || activeConv.type === 'Institutional' ? (
                    <div className="w-12 h-12 rounded-[18px] bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white/20">
                      {activeConv.type === 'Institutional' ? <Globe size={22} /> : <Megaphone size={22} />}
                    </div>
                  ) : (
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.avatar || otherParticipant?.name}`} className="w-12 h-12 rounded-[18px] border-2 border-slate-50 shadow-md" alt="" />
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-md animate-glow-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{otherParticipant?.name || activeConv.participants[0].name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-blue-100">
                      {activeConv.type === 'Institutional' ? 'Global Node' : activeConv.type === 'Broadcast' ? 'Broadcasting Hub' : `${otherParticipant?.role} Link`}
                    </span>
                    {otherParticipant?.phoneNumber && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <MessageCircleCode size={10} /> WhatsApp Bridge
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsCallActive({ active: true, type: 'Audio' })} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-90"><Phone size={18} /></button>
                <button onClick={() => setIsCallActive({ active: true, type: 'Video' })} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm active:scale-90"><Video size={18} /></button>
                <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={18} /></button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-10 scrollbar-hide bg-slate-50/20">
              {activeConv.messages.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-24 h-24 bg-white rounded-[36px] shadow-2xl mx-auto flex items-center justify-center mb-6 transform rotate-6 hover:rotate-0 transition-transform">
                    <Fingerprint size={48} className="text-blue-100" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 uppercase">Initialize Transmission</h4>
                  <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2 text-xs leading-relaxed">Compose your advisory below. Secure 256-bit encryption is active for this session.</p>
                </div>
              )}
              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className={`
                        p-5 rounded-[28px] font-bold text-sm leading-relaxed shadow-lg relative group
                        ${isMe ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
                      `}>
                        {msg.content}
                        <button onClick={() => deleteMessage(msg.id)} className={`absolute top-0 ${isMe ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100 transition-all p-2 text-slate-300 hover:text-rose-500`}><Trash2 size={14} /></button>
                      </div>
                      <div className="mt-2 flex items-center gap-2 px-4">
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCircle2 size={10} className="text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="p-6 bg-white border-t border-slate-100 space-y-4 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={activeConv.type === 'Broadcast' ? "Enter institutional notice..." : "Compose transmission node..."}
                    className="w-full pl-6 pr-24 py-4 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-sm outline-none focus:ring-[12px] focus:ring-blue-100/30 transition-all shadow-inner placeholder:text-slate-200"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <button className="p-2.5 text-slate-300 hover:text-blue-500 transition-colors"><Mic size={18} /></button>
                    <button onClick={() => handleSendMessage()} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-90"><Send size={20} /></button>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 rounded-[28px] shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all rotate-12 scale-125"><Megaphone size={60} /></div>
                <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xl border border-white/10 group-hover:rotate-6 transition-transform shadow-inner"><Sparkles className="text-blue-400 animate-glow-pulse" size={18} /></div>
                  <div className="flex-1 text-center md:text-left">
                    <h5 className="text-white font-black text-[10px] uppercase tracking-widest leading-none">Neural Draft Synthesizer</h5>
                    <input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Context (e.g. Behavioral shift, Gala invite)..."
                      className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white placeholder:text-slate-700 outline-none focus:border-blue-400/50 transition-all font-medium"
                    />
                  </div>
                  <button onClick={handleAIDraft} disabled={isAIGenerating || !aiPrompt.trim()} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30">
                    {isAIGenerating ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} className="text-blue-600" />} Synthesize
                  </button>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-slate-50/20">
            <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center mb-8 transform -rotate-12 group hover:rotate-0 transition-transform duration-700">
              <Megaphone size={56} className="text-slate-100" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-none">Neural Link Idle</h3>
            <p className="text-sm text-slate-400 font-bold max-w-xs mx-auto leading-relaxed italic">"Select an institutional node or initialize a new global discovery cycle to begin campus communication."</p>
            <button onClick={() => setIsDiscoveryOpen(true)} className="mt-10 px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Launch Node Discovery</button>
          </div>
        )}
      </main>

      {/* DISCOVERY MODAL: ROLE-BASED HUB */}
      {isDiscoveryOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsDiscoveryOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-700 flex flex-col max-h-[90vh]">
            <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 sticky top-0 z-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Node Discovery</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Campus Identity Registry • 2026 Core</p>
              </div>
              <button onClick={() => setIsDiscoveryOpen(false)} className="p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all shadow-sm active:scale-90"><X size={20} /></button>
            </div>

            <div className="flex bg-slate-50 p-2 border-b border-slate-100 gap-1">
              {[
                { id: 'Staff', icon: <Briefcase size={14} /> },
                { id: 'Parents', icon: <User size={14} />, hide: !canBroadcast },
                { id: 'Groups', icon: <Users size={14} />, hide: !canBroadcast },
                { id: 'Tiers', icon: <Globe size={14} />, hide: !canBroadcast }
              ].map(tab => tab.hide ? null : (
                <button key={tab.id} onClick={() => setDiscoveryTab(tab.id as any)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${discoveryTab === tab.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-blue-600'}`}>
                  {tab.icon} {tab.id}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-3 scrollbar-hide bg-slate-50/20">
              {discoveryTab === 'Staff' && CAMPUS_DIRECTORY.STAFF.filter(s => s.id !== user.id).map(contact => (
                <button key={contact.id} onClick={() => startNewConversation(contact, 'Direct')} className="w-full flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[32px] hover:border-blue-400 hover:shadow-xl transition-all group text-left">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar}`} className="w-16 h-16 rounded-[22px] border-4 border-slate-50 shadow-md group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-slate-900 uppercase leading-none mb-1.5">{contact.name}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{contact.dept} • {contact.role}</p>
                  </div>
                  <ChevronRight size={22} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}

              {discoveryTab === 'Parents' && canBroadcast && CAMPUS_DIRECTORY.PARENTS.map(parent => (
                <button key={parent.id} onClick={() => startNewConversation(parent, 'Direct')} className="w-full flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[32px] hover:border-emerald-400 hover:shadow-xl transition-all group text-left">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.avatar}`} className="w-16 h-16 rounded-[22px] border-4 border-slate-50 shadow-md group-hover:scale-110 transition-transform" alt="" />
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-slate-900 uppercase leading-none mb-1.5">{parent.name}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guardian of {parent.child}</p>
                  </div>
                  <ChevronRight size={22} className="text-slate-200 group-hover:text-emerald-500" />
                </button>
              ))}

              {discoveryTab === 'Groups' && canBroadcast && CAMPUS_DIRECTORY.PARENT_GROUPS.map(group => (
                <button key={group.id} onClick={() => startNewConversation(group, 'Broadcast')} className="w-full flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[32px] hover:border-indigo-400 hover:shadow-xl transition-all group text-left">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700"><Users size={28} /></div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-slate-900 uppercase leading-none mb-1.5">{group.name}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Broadcasting Node • {group.type}</p>
                  </div>
                  <ChevronRight size={22} className="text-slate-200 group-hover:text-indigo-500" />
                </button>
              ))}

              {discoveryTab === 'Tiers' && canBroadcast && CAMPUS_DIRECTORY.TIERS.map(tier => (
                <button key={tier.id} onClick={() => startNewConversation(tier, 'Broadcast')} className="w-full flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[32px] hover:border-blue-400 hover:shadow-xl transition-all group text-left">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[22px] flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">{tier.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-slate-900 uppercase leading-none mb-1.5">{tier.name}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Broadcast Node</p>
                  </div>
                  <ChevronRight size={22} className="text-slate-200 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
            <div className="p-8 bg-white border-t border-slate-100 flex justify-center items-center gap-6">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="text-emerald-500" size={14} /> Data Encryption Standard V2.6
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Fingerprint className="text-blue-500" size={14} /> Verified Identity Nodes
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALL OVERLAY: PREMIUM HANDSHAKE SIMULATION */}
      {isCallActive.active && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 animate-in fade-in duration-700 backdrop-blur-[48px]"></div>
          <div className="relative w-full max-w-lg text-center space-y-12 animate-in zoom-in-95 duration-1000">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] animate-pulse scale-150"></div>
              {activeConv?.type === 'Broadcast' ? (
                <div className="w-56 h-56 rounded-[64px] bg-blue-600 flex items-center justify-center text-white shadow-2xl relative z-10 border-[8px] border-white/10"><Users size={64} /></div>
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.avatar || otherParticipant?.name}`} className="w-56 h-56 rounded-[64px] border-[8px] border-white/10 shadow-2xl relative z-10 object-cover" alt="" />
              )}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.4em] shadow-2xl z-20 animate-bounce border-2 border-slate-950">Secure Link</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">{otherParticipant?.name || activeConv?.participants[0].name}</h3>
              <div className="flex items-center justify-center gap-3">
                <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Establishing {isCallActive.type} Link...</p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-10">
              <button className="p-8 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95 shadow-inner"><Mic size={32} /></button>
              <button onClick={() => setIsCallActive({ active: false, type: null })} className="p-10 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all shadow-xl active:scale-90 border-4 border-slate-950 scale-125">
                <PhoneCall size={40} className="rotate-[135deg]" />
              </button>
              <button className="p-8 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95 shadow-inner"><VideoIcon size={32} /></button>
            </div>

            <div className="pt-8 flex flex-col items-center gap-4 opacity-40">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                <Fingerprint size={16} /> Biometric Handshake Verified
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingHub;