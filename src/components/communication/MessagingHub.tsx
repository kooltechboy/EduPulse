import React, { useState } from 'react';
import { Search, Send, Paperclip, Plus, Info, AlertTriangle, Radio, CheckCircle, ShieldAlert, Users, Bell, FileText } from 'lucide-react';
import './MessagingHub.css';

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  unread: boolean;
  time: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

interface BroadcastLog {
  id: string;
  title: string;
  severity: 'red' | 'amber' | 'blue';
  target: string;
  channels: string[];
  sentAt: string;
  deliveredCount: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Mrs. Robinson (Parent)', role: 'Parent', lastMessage: 'Thank you for the update on Alex!', unread: true, time: '10:30 AM' },
  { id: '2', name: 'Math Faculty Department', role: 'Group', lastMessage: 'Don\'t forget the department sync tomorrow.', unread: false, time: 'Yesterday' },
  { id: '3', name: 'Principal Skinner', role: 'Admin', lastMessage: 'Please review the Q3 academic policy doc.', unread: false, time: 'Mon' },
];

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Hi Dr. Smith, I wanted to ask about Alex\'s recent progress in Advanced Mathematics.', sender: 'them', time: '10:15 AM' },
  { id: '2', text: 'Hello Mrs. Robinson! Alex is doing exceptionally well. Scored 95% on the latest Midterm exam.', sender: 'me', time: '10:20 AM' },
  { id: '3', text: 'That is wonderful news! Thank you for the update on Alex!', sender: 'them', time: '10:30 AM' },
];

const INITIAL_BROADCASTS: BroadcastLog[] = [
  { id: 'b1', title: 'Campus Weather Advisory: 2-Hour Early Dismissal', severity: 'amber', target: 'All Parents & Guardians', channels: ['SMS', 'Email', 'Push'], sentAt: 'Today 7:30 AM', deliveredCount: 1420 },
  { id: 'b2', title: 'Parent-Teacher Conference Registration Open', severity: 'blue', target: 'Grade 9-12 Parents', channels: ['Email', 'Push'], sentAt: 'Yesterday 2:15 PM', deliveredCount: 850 },
];

export const MessagingHub: React.FC = () => {
  const [activeChat, setActiveChat] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>(INITIAL_BROADCASTS);
  
  const [bTitle, setBTitle] = useState('');
  const [bBody, setBBody] = useState('');
  const [bSeverity, setBSeverity] = useState<'red' | 'amber' | 'blue'>('red');
  const [bTarget, setBTarget] = useState('All Parents & Guardians');
  const [bSms, setBSms] = useState(true);
  const [bEmail, setBEmail] = useState(true);
  const [bPush, setBPush] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setMessage('');
  };

  const handleDispatchBroadcast = () => {
    if (!bTitle.trim() || !bBody.trim()) {
      alert('Please fill out the alert subject and broadcast message body.');
      return;
    }

    setIsDispatching(true);
    setTimeout(() => {
      const selectedChannels: string[] = [];
      if (bSms) selectedChannels.push('SMS');
      if (bEmail) selectedChannels.push('Email');
      if (bPush) selectedChannels.push('Push');

      const newLog: BroadcastLog = {
        id: `b-${Date.now()}`,
        title: bTitle,
        severity: bSeverity,
        target: bTarget,
        channels: selectedChannels,
        sentAt: 'Just now',
        deliveredCount: bTarget.includes('All') ? 1540 : 420
      };

      setBroadcasts([newLog, ...broadcasts]);
      setIsDispatching(false);
      setIsBroadcastOpen(false);
      setBTitle('');
      setBBody('');
      alert(`Emergency Broadcast successfully dispatched via ${selectedChannels.join(', ')} to ${newLog.deliveredCount} recipients!`);
    }, 1000);
  };

  return (
    <div className="ep-comm">
      <div className="ep-comm__sidebar">
        <div className="ep-comm__sidebar-header">
          <h2>Campus Messages</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="ep-btn ep-btn--danger ep-btn--sm" 
              onClick={() => setIsBroadcastOpen(true)}
              title="Emergency Multi-Channel Broadcast Alert"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <AlertTriangle size={14} style={{ marginRight: 4 }} /> Broadcast Alert
            </button>
            <button className="ep-btn ep-btn--primary ep-btn--sm"><Plus size={14} /></button>
          </div>
        </div>

        <div style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface-100)', padding: '6px 12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <Search size={14} color="var(--color-text-tertiary)" />
            <input type="text" placeholder="Search conversations..." style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', width: '100%', fontSize: '13px' }} />
          </div>
        </div>

        <div className="ep-comm__list">
          {MOCK_CONVERSATIONS.map(conv => (
            <div 
              key={conv.id} 
              className={`ep-comm__item ${activeChat.id === conv.id ? 'ep-comm__item--active' : ''}`}
              onClick={() => setActiveChat(conv)}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                {conv.name.charAt(0)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{conv.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{conv.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ep-comm__main">
        <div className="ep-comm__chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{activeChat.name}</h3>
            <span className="ep-badge ep-badge--primary">{activeChat.role}</span>
          </div>
          <button className="ep-btn ep-btn--ghost ep-btn--sm"><Info size={16} /></button>
        </div>

        {/* Broadcast History Summary Strip */}
        {broadcasts.length > 0 && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 600 }}>
              <Radio size={14} className="ep-pulse" />
              <span>Latest Broadcast: {broadcasts[0].title}</span>
            </div>
            <div style={{ color: 'var(--color-text-tertiary)' }}>
              Dispatched to {broadcasts[0].deliveredCount} recipients via {broadcasts[0].channels.join(', ')} ({broadcasts[0].sentAt})
            </div>
          </div>
        )}

        <div className="ep-comm__chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`ep-comm__message ep-comm__message--${msg.sender}`}>
              <div className="ep-comm__bubble">
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.4 }}>{msg.text}</p>
                <span style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px', display: 'block', textAlign: 'right' }}>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ep-comm__chat-input-area">
          <button className="ep-btn ep-btn--ghost ep-btn--sm"><Paperclip size={18} /></button>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ flex: 1, padding: '10px 16px', background: 'var(--color-surface-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', color: 'var(--color-text-primary)', outline: 'none' }}
          />
          <button className="ep-btn ep-btn--primary" onClick={handleSendMessage}><Send size={16} /></button>
        </div>
      </div>

      {/* Emergency Multi-Channel Broadcast Dispatcher Modal */}
      {isBroadcastOpen && (
        <div className="ep-modal-overlay" onClick={() => setIsBroadcastOpen(false)}>
          <div className="ep-card" style={{ width: '100%', maxWidth: '650px', padding: '24px', background: 'var(--color-surface-200, #17123b)', border: '1px solid var(--color-border)', borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px', borderRadius: '10px' }}>
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Emergency Broadcast Dispatcher</h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Multi-channel notification engine (SMS, Email, Push Alerts)</p>
                </div>
              </div>
              <button className="ep-btn ep-btn--ghost" onClick={() => setIsBroadcastOpen(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Alert Severity Tier</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <button 
                    type="button"
                    className="ep-btn" 
                    style={{ background: bSeverity === 'red' ? 'rgba(239, 68, 68, 0.3)' : 'var(--color-surface-100)', border: bSeverity === 'red' ? '2px solid #ef4444' : '1px solid var(--color-border)', color: '#ffffff' }}
                    onClick={() => setBSeverity('red')}
                  >
                    🔴 RED - Emergency
                  </button>
                  <button 
                    type="button"
                    className="ep-btn" 
                    style={{ background: bSeverity === 'amber' ? 'rgba(245, 158, 11, 0.3)' : 'var(--color-surface-100)', border: bSeverity === 'amber' ? '2px solid #f59e0b' : '1px solid var(--color-border)', color: '#ffffff' }}
                    onClick={() => setBSeverity('amber')}
                  >
                    🟠 AMBER - Advisory
                  </button>
                  <button 
                    type="button"
                    className="ep-btn" 
                    style={{ background: bSeverity === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 'var(--color-surface-100)', border: bSeverity === 'blue' ? '2px solid #3b82f6' : '1px solid var(--color-border)', color: '#ffffff' }}
                    onClick={() => setBSeverity('blue')}
                  >
                    🔵 BLUE - Notice
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Target Audience</label>
                  <select value={bTarget} onChange={e => setBTarget(e.target.value)} className="ep-input">
                    <option value="All Parents & Guardians">All Parents & Guardians (1,540)</option>
                    <option value="Grade 9-12 Students">Grade 9-12 Students (820)</option>
                    <option value="Bus Route 4 Commuters">Bus Route 4 Commuters (140)</option>
                    <option value="Faculty & Campus Staff">Faculty & Campus Staff (110)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Delivery Channels</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '8px' }}>
                    <label style={{ fontSize: '13px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="checkbox" checked={bSms} onChange={e => setBSms(e.target.checked)} /> SMS Text
                    </label>
                    <label style={{ fontSize: '13px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="checkbox" checked={bEmail} onChange={e => setBEmail(e.target.checked)} /> Email
                    </label>
                    <label style={{ fontSize: '13px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="checkbox" checked={bPush} onChange={e => setBPush(e.target.checked)} /> App Push
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Alert Subject</label>
                <input 
                  type="text" 
                  className="ep-input" 
                  placeholder="e.g., Immediate Campus Lockdown Notice / Severe Weather Early Dismissal"
                  value={bTitle}
                  onChange={e => setBTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Broadcast Message Content</label>
                <textarea 
                  className="ep-input" 
                  rows={4} 
                  placeholder="Provide precise details and instructions for students, parents, and staff..."
                  value={bBody}
                  onChange={e => setBBody(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button className="ep-btn ep-btn--secondary" onClick={() => setIsBroadcastOpen(false)}>Cancel</button>
              <button 
                className="ep-btn ep-btn--danger" 
                onClick={handleDispatchBroadcast}
                disabled={isDispatching}
              >
                {isDispatching ? 'Dispatching...' : '🚨 Confirm & Dispatch Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingHub;
