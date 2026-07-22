import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Plus, 
  Info, 
  Bell, 
  Users, 
  Hash, 
  User, 
  CheckCheck, 
  MoreVertical, 
  Phone, 
  Video, 
  Volume2, 
  VolumeX,
  X,
  Megaphone,
  Sparkles,
  FileText,
  Filter,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import './MessagingHub.css';

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  role: 'Parent' | 'Staff' | 'Teacher' | 'Student' | 'Group';
  avatar: string;
  unread: boolean;
  online?: boolean;
  category: 'direct' | 'group';
  messages: Message[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: string;
  priority: 'Normal' | 'High' | 'Urgent';
  time: string;
  author: string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: '1', 
    name: 'Sarah Jenkins', 
    role: 'Parent', 
    avatar: 'SJ', 
    unread: true,
    online: true,
    category: 'direct',
    messages: [
      { id: 'm1', sender: 'Sarah Jenkins', text: 'Hi, I had a question about the upcoming STEM Innovation Fair field trip.', time: '09:12 AM', isSelf: false },
      { id: 'm2', sender: 'Me', text: 'Sure, what would you like to know?', time: '09:15 AM', isSelf: true },
      { id: 'm3', sender: 'Sarah Jenkins', text: 'Will campus transportation be provided for students leaving from classroom Block B?', time: '09:16 AM', isSelf: false }
    ]
  },
  {
    id: '2', 
    name: 'Math Dept Faculty', 
    role: 'Group', 
    avatar: '#', 
    unread: false,
    online: false,
    category: 'group',
    messages: [
      { id: 'm4', sender: 'Dr. Jones', text: 'Please review the updated Q3 syllabus draft before our department sync.', time: 'Yesterday 04:30 PM', isSelf: false },
      { id: 'm5', sender: 'Me', text: 'Looks great! I added my notes to Section 4 on advanced calculus modules.', time: 'Yesterday 05:10 PM', isSelf: true }
    ]
  },
  {
    id: '3', 
    name: 'Principal Miller', 
    role: 'Staff', 
    avatar: 'PM', 
    unread: true,
    online: true,
    category: 'direct',
    messages: [
      { id: 'm6', sender: 'Principal Miller', text: 'Can we meet at 3 PM today to review the annual campus safety audit?', time: 'Tuesday 11:20 AM', isSelf: false }
    ]
  },
  {
    id: '4', 
    name: 'Grade 10 Parent Association', 
    role: 'Group', 
    avatar: '#', 
    unread: false,
    online: false,
    category: 'group',
    messages: [
      { id: 'm7', sender: 'Marcus Chen', text: 'Reminder: Parent-Teacher conference signups close this Friday at 5:00 PM.', time: 'Monday 02:15 PM', isSelf: false }
    ]
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'STEM Innovation Fair Schedule Released',
    body: 'The complete program schedule, venue locations, and exhibition hall map for the 2026 Annual STEM Fair are now published on the campus portal.',
    audience: 'All Students & Parents',
    priority: 'High',
    time: 'Today at 08:30 AM',
    author: 'Faculty of Science & Technology'
  },
  {
    id: 'a2',
    title: 'Q3 Parent-Teacher Consultation Bookings',
    body: 'Online appointment scheduling for quarterly parent-teacher conferences is now live. Please log in to select your preferred consultation time slots.',
    audience: 'All Parents',
    priority: 'Urgent',
    time: 'Yesterday at 02:00 PM',
    author: 'Academic Advisory Board'
  }
];

export const MessagingHub: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [filterCategory, setFilterCategory] = useState<'all' | 'direct' | 'group' | 'announcements'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('1');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  const [showThreadModal, setShowThreadModal] = useState(false);
  const [threadForm, setThreadForm] = useState({ recipient: '', role: 'Parent', subject: '', message: '' });

  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: '', body: '', audience: 'All Parents', priority: 'Normal' });

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const safeAddToast = (opts: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => {
    if (typeof addToast === 'function') addToast(opts);
  };

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConv) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, messages: [...c.messages, newMessage] } : c));
    setInputText('');
    safeAddToast({ type: 'success', title: 'Message Sent', message: `Delivered to ${activeConv.name}.` });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = () => {
    safeAddToast({ type: 'info', title: 'Attachment Selected', message: 'File preview attached to draft.' });
  };

  const handleThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadForm.recipient.trim()) return;
    const initials = threadForm.recipient.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
    const newConv: Conversation = {
      id: Date.now().toString(),
      name: threadForm.recipient,
      role: threadForm.role as any,
      avatar: initials,
      unread: false,
      online: true,
      category: threadForm.role === 'Group' ? 'group' : 'direct',
      messages: [{ id: Date.now().toString(), sender: 'Me', text: threadForm.message, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), isSelf: true }]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
    setShowThreadModal(false);
    setThreadForm({ recipient: '', role: 'Parent', subject: '', message: '' });
    safeAddToast({ type: 'success', title: 'Thread Started', message: `Conversation with ${newConv.name} initiated.` });
  };

  const handleAnnounceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceForm.title.trim()) return;
    const newAnnounce: Announcement = {
      id: Date.now().toString(),
      title: announceForm.title,
      body: announceForm.body,
      audience: announceForm.audience,
      priority: announceForm.priority as any,
      time: 'Just now',
      author: 'Campus Administration'
    };
    setAnnouncements([newAnnounce, ...announcements]);
    setShowAnnounceModal(false);
    setAnnounceForm({ title: '', body: '', audience: 'All Parents', priority: 'Normal' });
    safeAddToast({ type: 'success', title: 'Announcement Published', message: `Posted to ${newAnnounce.audience}.` });
  };

  const filteredConversations = conversations.filter(c => {
    const matchesCat = filterCategory === 'all' || 
                       (filterCategory === 'direct' && c.category === 'direct') || 
                       (filterCategory === 'group' && c.category === 'group');
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.messages.some(m => m.text.toLowerCase().includes(q))
    );
    return matchesCat && matchesSearch;
  });

  return (
    <div className="ep-comm-container">
      {/* Sidebar List */}
      <aside className="ep-comm-sidebar">
        {/* Sidebar Header */}
        <div className="ep-comm-sidebar__header">
          <div>
            <h2 className="ep-comm-sidebar__title">Communication Hub</h2>
            <span className="ep-comm-sidebar__subtitle">Direct messages, department chats & announcements</span>
          </div>
          <div className="ep-comm-sidebar__actions">
            <button className="ep-btn ep-btn--secondary ep-btn--sm" title="Post Campus Announcement" onClick={() => setShowAnnounceModal(true)}>
              <Megaphone size={14} /> Announce
            </button>
            <button className="ep-btn ep-btn--primary ep-btn--sm" title="New Message Thread" onClick={() => setShowThreadModal(true)}>
              <Plus size={14} /> New
            </button>
          </div>
        </div>

        {/* Search Bar & Category Tabs */}
        <div className="ep-comm-sidebar__toolbar">
          <div className="ep-comm-search-box">
            <Search size={14} className="ep-comm-search-icon" />
            <input 
              type="text" 
              placeholder="Search conversations & messages..." 
              className="ep-comm-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="ep-comm-search-clear" onClick={() => setSearchQuery('')}>
                <X size={12} />
              </button>
            )}
          </div>

          <div className="ep-comm-nav-tabs">
            <button 
              className={`ep-comm-nav-tab ${filterCategory === 'all' ? 'ep-comm-nav-tab--active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All ({conversations.length})
            </button>
            <button 
              className={`ep-comm-nav-tab ${filterCategory === 'direct' ? 'ep-comm-nav-tab--active' : ''}`}
              onClick={() => setFilterCategory('direct')}
            >
              Direct
            </button>
            <button 
              className={`ep-comm-nav-tab ${filterCategory === 'group' ? 'ep-comm-nav-tab--active' : ''}`}
              onClick={() => setFilterCategory('group')}
            >
              Channels
            </button>
            <button 
              className={`ep-comm-nav-tab ${filterCategory === 'announcements' ? 'ep-comm-nav-tab--active' : ''}`}
              onClick={() => setFilterCategory('announcements')}
            >
              Announcements ({announcements.length})
            </button>
          </div>
        </div>

        {/* Conversation List */}
        {filterCategory !== 'announcements' && (
          <div className="ep-comm-list">
            {filteredConversations.length === 0 ? (
              <div className="ep-comm-empty-state">
                <Info size={28} color="var(--color-text-tertiary)" />
                <p>No conversations found.</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isActive = activeConvId === conv.id;
                return (
                  <div 
                    key={conv.id} 
                    className={`ep-comm-item ${isActive ? 'ep-comm-item--active' : ''}`}
                    onClick={() => selectConversation(conv.id)}
                  >
                    <div className="ep-comm-avatar-box">
                      <div className={`ep-comm-avatar ${conv.role === 'Group' ? 'ep-comm-avatar--group' : ''}`}>
                        {conv.avatar}
                      </div>
                      {conv.online && <div className="ep-comm-status-dot" />}
                    </div>

                    <div className="ep-comm-item__body">
                      <div className="ep-comm-item__top">
                        <span className="ep-comm-item__name">{conv.name}</span>
                        {lastMsg && <span className="ep-comm-item__time">{lastMsg.time}</span>}
                      </div>

                      <div className="ep-comm-item__bottom">
                        <span className="ep-comm-item__snippet">
                          {lastMsg ? `${lastMsg.isSelf ? 'You: ' : ''}${lastMsg.text}` : 'No messages yet'}
                        </span>
                        {conv.unread && <span className="ep-comm-unread-pill" />}
                      </div>

                      <div className="ep-comm-item__badges">
                        <span className="ep-badge ep-badge--neutral" style={{ fontSize: 10, padding: '1px 6px' }}>{conv.role}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {filterCategory === 'announcements' && (
          <div className="ep-comm-list">
            {announcements.map(a => (
              <div key={a.id} className="ep-comm-item" style={{ flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{a.title}</h4>
                  <span className={`ep-badge ${a.priority === 'Urgent' ? 'ep-badge--danger' : a.priority === 'High' ? 'ep-badge--warning' : 'ep-badge--primary'}`} style={{ fontSize: 10 }}>
                    {a.priority}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.body}
                </p>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{a.time} • {a.audience}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="ep-comm-main">
        {filterCategory === 'announcements' ? (
          <div className="ep-comm-announcements-view">
            <div className="ep-comm-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Megaphone size={20} color="var(--color-primary-400)" />
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Institutional Broadcasts</h3>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Campus-wide announcements and advisory updates</span>
                </div>
              </div>
              <button className="ep-btn ep-btn--primary ep-btn--sm" onClick={() => setShowAnnounceModal(true)}>
                <Plus size={14} /> New Announcement
              </button>
            </div>

            <div className="ep-comm-announcements-list">
              {announcements.map(a => (
                <div key={a.id} className="ep-comm-announcement-card">
                  <div className="ep-comm-announcement-card__top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="ep-comm-avatar" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-400)' }}>
                        <Megaphone size={16} />
                      </div>
                      <div>
                        <h3 className="ep-comm-announcement-title">{a.title}</h3>
                        <span className="ep-comm-announcement-meta">Posted by {a.author} • {a.time}</span>
                      </div>
                    </div>
                    <span className={`ep-badge ${a.priority === 'Urgent' ? 'ep-badge--danger' : a.priority === 'High' ? 'ep-badge--warning' : 'ep-badge--primary'}`}>
                      {a.priority} Priority
                    </span>
                  </div>

                  <div className="ep-comm-announcement-body">
                    {a.body}
                  </div>

                  <div className="ep-comm-announcement-footer">
                    <span className="ep-badge ep-badge--neutral">Target Audience: {a.audience}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} color="var(--color-success-500)" /> Published to Portal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeConv ? (
          <div className="ep-comm-chat-view">
            {/* Active Chat Header */}
            <div className="ep-comm-chat-header">
              <div className="ep-comm-chat-header__user">
                <div className="ep-comm-avatar-box">
                  <div className={`ep-comm-avatar ${activeConv.role === 'Group' ? 'ep-comm-avatar--group' : ''}`}>
                    {activeConv.avatar}
                  </div>
                  {activeConv.online && <div className="ep-comm-status-dot" />}
                </div>
                <div>
                  <h3 className="ep-comm-chat-title">{activeConv.name}</h3>
                  <span className="ep-comm-chat-status">
                    {activeConv.role} {activeConv.online ? '• Active Now' : '• Offline'}
                  </span>
                </div>
              </div>

              <div className="ep-comm-chat-header__actions">
                <button className="ep-comm-icon-btn" title="Start Voice Call" onClick={() => safeAddToast({ type: 'info', title: 'Voice Call', message: 'Connecting audio line...' })}>
                  <Phone size={16} />
                </button>
                <button className="ep-comm-icon-btn" title="Start Video Call" onClick={() => safeAddToast({ type: 'info', title: 'Video Call', message: 'Initializing video room...' })}>
                  <Video size={16} />
                </button>
                <button className="ep-comm-icon-btn" title="Mute Notifications" onClick={() => safeAddToast({ type: 'info', title: 'Notifications', message: 'Thread muted.' })}>
                  <VolumeX size={16} />
                </button>
              </div>
            </div>

            {/* Message History Feed */}
            <div className="ep-comm-chat-history">
              <div className="ep-comm-date-divider">
                <span>Today</span>
              </div>

              {activeConv.messages.map(m => (
                <div 
                  key={m.id} 
                  className={`ep-chat-message ${m.isSelf ? 'ep-chat-message--self' : 'ep-chat-message--other'}`}
                >
                  {!m.isSelf && (
                    <div className="ep-comm-avatar ep-comm-avatar--sm">
                      {activeConv.avatar}
                    </div>
                  )}
                  <div className="ep-chat-message__content">
                    {!m.isSelf && <span className="ep-chat-message__sender">{m.sender}</span>}
                    <div className="ep-chat-message__bubble">
                      {m.text}
                    </div>
                    <div className="ep-chat-message__meta">
                      <span>{m.time}</span>
                      {m.isSelf && <CheckCheck size={13} color="var(--color-primary-400)" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="ep-comm-chat-input-bar">
              <button className="ep-comm-icon-btn" title="Attach Document / Photo" onClick={handleAttachment}>
                <Paperclip size={18} />
              </button>
              <input 
                type="text" 
                placeholder={`Type a message to ${activeConv.name}...`}
                className="ep-comm-chat-input"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                className="ep-btn ep-btn--primary" 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}
              >
                <Send size={15} /> Send
              </button>
            </div>
          </div>
        ) : (
          <div className="ep-comm-empty-main">
            <MessageSquare size={48} color="var(--color-text-tertiary)" />
            <h3>Select a Conversation</h3>
            <p>Choose a contact or channel from the left sidebar to start messaging.</p>
          </div>
        )}
      </main>

      {/* NEW THREAD MODAL */}
      {showThreadModal && (
        <div className="ep-events__modal-overlay" onClick={() => setShowThreadModal(false)}>
          <div className="ep-events__modal ep-events__form-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-events__modal-header">
              <h3 className="ep-events__modal-title">New Conversation Thread</h3>
              <button className="ep-events__close-btn" onClick={() => setShowThreadModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleThreadSubmit}>
              <div className="ep-events__form-grid">
                <div className="ep-events__form-group ep-events__form-group--full">
                  <label className="ep-events__form-label">Recipient Name / Contact *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe, Prof. Davis" 
                    required 
                    className="ep-events__form-input" 
                    value={threadForm.recipient} 
                    onChange={e => setThreadForm({...threadForm, recipient: e.target.value})} 
                  />
                </div>

                <div className="ep-events__form-group">
                  <label className="ep-events__form-label">Role / Category</label>
                  <select 
                    className="ep-events__form-input" 
                    value={threadForm.role} 
                    onChange={e => setThreadForm({...threadForm, role: e.target.value as any})}
                  >
                    <option value="Parent">Parent</option>
                    <option value="Staff">Staff / Admin</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                    <option value="Group">Group Channel</option>
                  </select>
                </div>

                <div className="ep-events__form-group">
                  <label className="ep-events__form-label">Subject (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Academic Review" 
                    className="ep-events__form-input" 
                    value={threadForm.subject} 
                    onChange={e => setThreadForm({...threadForm, subject: e.target.value})} 
                  />
                </div>

                <div className="ep-events__form-group ep-events__form-group--full">
                  <label className="ep-events__form-label">Initial Message *</label>
                  <textarea 
                    rows={4}
                    placeholder="Write your starting message..." 
                    required 
                    className="ep-events__form-input" 
                    value={threadForm.message} 
                    onChange={e => setThreadForm({...threadForm, message: e.target.value})} 
                  />
                </div>
              </div>

              <div className="ep-events__modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowThreadModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Start Conversation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST ANNOUNCEMENT MODAL */}
      {showAnnounceModal && (
        <div className="ep-events__modal-overlay" onClick={() => setShowAnnounceModal(false)}>
          <div className="ep-events__modal ep-events__form-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-events__modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Megaphone size={20} color="var(--color-primary-400)" />
                <h3 className="ep-events__modal-title">Post Institutional Announcement</h3>
              </div>
              <button className="ep-events__close-btn" onClick={() => setShowAnnounceModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAnnounceSubmit}>
              <div className="ep-events__form-grid">
                <div className="ep-events__form-group ep-events__form-group--full">
                  <label className="ep-events__form-label">Announcement Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. STEM Innovation Fair Schedule" 
                    required 
                    className="ep-events__form-input" 
                    value={announceForm.title} 
                    onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} 
                  />
                </div>

                <div className="ep-events__form-group">
                  <label className="ep-events__form-label">Target Audience</label>
                  <select 
                    className="ep-events__form-input" 
                    value={announceForm.audience} 
                    onChange={e => setAnnounceForm({...announceForm, audience: e.target.value})}
                  >
                    <option value="All Parents">All Parents</option>
                    <option value="All Students">All Students</option>
                    <option value="All Staff">All Staff</option>
                    <option value="Everyone">Everyone (Campus-wide)</option>
                  </select>
                </div>

                <div className="ep-events__form-group">
                  <label className="ep-events__form-label">Priority Level</label>
                  <select 
                    className="ep-events__form-input" 
                    value={announceForm.priority} 
                    onChange={e => setAnnounceForm({...announceForm, priority: e.target.value})}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div className="ep-events__form-group ep-events__form-group--full">
                  <label className="ep-events__form-label">Announcement Body *</label>
                  <textarea 
                    rows={5}
                    placeholder="Write detailed announcement content..." 
                    required 
                    className="ep-events__form-input" 
                    value={announceForm.body} 
                    onChange={e => setAnnounceForm({...announceForm, body: e.target.value})} 
                  />
                </div>
              </div>

              <div className="ep-events__modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowAnnounceModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">
                  <Megaphone size={14} /> Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingHub;
