import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Plus, Info, AlertTriangle, Radio, CheckCircle, ShieldAlert, Users, Bell, FileText } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import './MessagingHub.css';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread: boolean;
  messages: Message[];
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: string;
  priority: string;
  time: string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: '1', name: 'Sarah Jenkins', role: 'Parent', avatar: 'SJ', unread: true,
    messages: [
      { id: 'm1', sender: 'Sarah Jenkins', text: 'Hi, I had a question about the upcoming field trip.', time: '09:12 AM', isSelf: false },
      { id: 'm2', sender: 'Me', text: 'Sure, what would you like to know?', time: '09:15 AM', isSelf: true }
    ]
  },
  {
    id: '2', name: 'Math Dept', role: 'Group', avatar: '#', unread: false,
    messages: [
      { id: 'm3', sender: 'Dr. Jones', text: 'Please review the new syllabus draft.', time: 'Yesterday', isSelf: false }
    ]
  },
  {
    id: '3', name: 'Principal Miller', role: 'Staff', avatar: 'PM', unread: true,
    messages: [
      { id: 'm4', sender: 'Principal Miller', text: 'Can we meet at 3 PM?', time: 'Tuesday', isSelf: false }
    ]
  }
];

export const MessagingHub: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [tab, setTab] = useState<'direct' | 'groups' | 'announcements'>('direct');
  
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('1');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [showThreadModal, setShowThreadModal] = useState(false);
  const [threadForm, setThreadForm] = useState({ recipient: '', subject: '', message: '' });

  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: '', body: '', audience: 'All Parents', priority: 'Normal' });

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

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
    addToast({ type: 'success', title: 'Sent', message: 'Message delivered.' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachment = () => {
    addToast({ type: 'info', title: 'Attachment', message: 'Attachment functionality is coming soon.' });
  };

  const handleThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newConv: Conversation = {
      id: Date.now().toString(),
      name: threadForm.recipient,
      role: 'Staff',
      avatar: threadForm.recipient.charAt(0).toUpperCase(),
      unread: false,
      messages: [{ id: Date.now().toString(), sender: 'Me', text: threadForm.message, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), isSelf: true }]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
    setShowThreadModal(false);
    addToast({ type: 'success', title: 'Thread Created', message: 'New message thread started.' });
  };

  const handleAnnounceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnounce: Announcement = {
      id: Date.now().toString(),
      title: announceForm.title,
      body: announceForm.body,
      audience: announceForm.audience,
      priority: announceForm.priority,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    };
    setAnnouncements([newAnnounce, ...announcements]);
    setShowAnnounceModal(false);
    addToast({ type: 'success', title: 'Announcement Posted', message: 'Your announcement has been published.' });
  };

  return (
    <div className="ep-messaging__layout">
      {/* Sidebar */}
      <div className="ep-messaging__sidebar">
        <div style={{ display: 'flex', gap: '8px', padding: '16px 16px 0 16px' }}>
          <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowAnnounceModal(true)} style={{ flex: 1 }}>
            <Bell size={14} style={{ marginRight: 4 }} /> Announce
          </button>
          <button className="ep-btn ep-btn--primary ep-btn--sm" onClick={() => setShowThreadModal(true)} style={{ flex: 1 }}>
            <Search size={14} style={{ marginRight: 4 }} /> New
          </button>
        </div>
        <div className="ep-messaging__search" style={{ padding: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} className="ep-messaging__search-icon" style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-text-tertiary)' }} />
            <input type="text" placeholder="Search messages..." className="ep-input" style={{ width: '100%', paddingLeft: '36px' }} />
          </div>
        </div>
        
        <div className="ep-messaging__list">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`ep-messaging__item ${activeConvId === conv.id ? 'ep-messaging__item--active' : ''}`}
              onClick={() => selectConversation(conv.id)}
            >
              <div className="ep-messaging__avatar" style={{ background: conv.role === 'Group' ? 'var(--color-surface-200)' : 'var(--color-primary-100)' }}>
                {conv.avatar}
                {conv.unread && <div className="ep-messaging__unread-dot" />}
              </div>
              <div className="ep-messaging__item-content">
                <div className="ep-messaging__item-header">
                  <span className="ep-messaging__item-name">{conv.name}</span>
                  <span className="ep-messaging__item-time">{conv.messages[conv.messages.length - 1]?.time}</span>
                </div>
                <div className="ep-messaging__item-message">{conv.messages[conv.messages.length - 1]?.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {tab !== 'announcements' && activeConv ? (
        <div className="ep-messaging__main" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="ep-messaging__chat-header" style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="ep-messaging__avatar" style={{ background: activeConv.role === 'Group' ? 'var(--color-surface-200)' : 'var(--color-primary-100)' }}>
                {activeConv.avatar}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{activeConv.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{activeConv.role}</p>
              </div>
            </div>
          </div>
          
          <div className="ep-messaging__chat-history" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeConv.messages.map(m => (
              <div key={m.id} className={`ep-chat-message ${m.isSelf ? 'ep-chat-message--self' : 'ep-chat-message--other'}`}>
                <div className="ep-chat-message__bubble">{m.text}</div>
                <div className="ep-chat-message__meta">{m.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="ep-messaging__chat-input" style={{ padding: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '8px' }}>
            <button className="ep-btn ep-btn--ghost" onClick={handleAttachment}><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="ep-input" 
              style={{ flex: 1 }}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="ep-btn ep-btn--primary" onClick={handleSendMessage}><Send size={16} /></button>
          </div>
        </div>
      ) : tab === 'announcements' ? (
        <div className="ep-messaging__main" style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>Announcements</h2>
          {announcements.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No recent announcements.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {announcements.map(a => (
                <div key={a.id} className="ep-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>{a.title}</h3>
                    <span className="ep-badge ep-badge--primary">{a.priority}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '16px' }}>
                    Audience: {a.audience} • {a.time}
                  </div>
                  <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{a.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="ep-messaging__main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <p style={{ color: 'var(--color-text-tertiary)' }}>Select a conversation</p>
        </div>
      )}

      {showThreadModal && (
        <div className="ep-modal-overlay" onClick={() => setShowThreadModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>New Thread</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowThreadModal(false)}>✕</button>
            </div>
            <form onSubmit={handleThreadSubmit}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Recipient Name (e.g. John Doe)" required className="ep-input" value={threadForm.recipient} onChange={e => setThreadForm({...threadForm, recipient: e.target.value})} />
                <input type="text" placeholder="Subject" className="ep-input" value={threadForm.subject} onChange={e => setThreadForm({...threadForm, subject: e.target.value})} />
                <textarea placeholder="Initial Message" required className="ep-input" value={threadForm.message} onChange={e => setThreadForm({...threadForm, message: e.target.value})}></textarea>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowThreadModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Start Conversation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnnounceModal && (
        <div className="ep-modal-overlay" onClick={() => setShowAnnounceModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Post Announcement</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowAnnounceModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAnnounceSubmit}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Announcement Title" required className="ep-input" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} />
                <select className="ep-input" value={announceForm.audience} onChange={e => setAnnounceForm({...announceForm, audience: e.target.value})}>
                  <option value="All Parents">All Parents</option>
                  <option value="All Students">All Students</option>
                  <option value="All Staff">All Staff</option>
                  <option value="Everyone">Everyone</option>
                </select>
                <select className="ep-input" value={announceForm.priority} onChange={e => setAnnounceForm({...announceForm, priority: e.target.value})}>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <textarea placeholder="Announcement Body" required className="ep-input" style={{ minHeight: '100px' }} value={announceForm.body} onChange={e => setAnnounceForm({...announceForm, body: e.target.value})}></textarea>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowAnnounceModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Post Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingHub;
