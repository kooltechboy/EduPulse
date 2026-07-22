import React, { useState, useEffect } from 'react';
import { 
  X, Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, Hand, 
  MessageSquare, Users, Send, ShieldAlert, Radio, PhoneOff, Award
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import './LiveClassroomModal.css';

interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  handRaised: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface LiveClassroomModalProps {
  isOpen: boolean;
  courseTitle?: string;
  onClose: () => void;
}

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 'p-1', name: 'Dr. Sarah Smith (Teacher)', role: 'teacher', avatar: 'SS', isMuted: false, isVideoOff: false, handRaised: false },
  { id: 'p-2', name: 'Alex Johnson', role: 'student', avatar: 'AJ', isMuted: true, isVideoOff: false, handRaised: true },
  { id: 'p-3', name: 'Emily Davis', role: 'student', avatar: 'ED', isMuted: true, isVideoOff: false, handRaised: false },
  { id: 'p-4', name: 'Michael Brown', role: 'student', avatar: 'MB', isMuted: false, isVideoOff: true, handRaised: false },
  { id: 'p-5', name: 'Sophia Martinez', role: 'student', avatar: 'SM', isMuted: true, isVideoOff: false, handRaised: true },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm-1', sender: 'Dr. Sarah Smith', text: 'Welcome everyone! Today we are covering advanced matrix transformations.', time: '10:00 AM' },
  { id: 'm-2', sender: 'Alex Johnson', text: 'Will slides be uploaded to EduVerse afterwards?', time: '10:02 AM' },
];

export const LiveClassroomModal: React.FC<LiveClassroomModalProps> = ({ 
  isOpen, 
  courseTitle = 'Advanced Mathematics (MATH401)', 
  onClose 
}) => {
  const { addToast } = useUIStore();
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');

  if (!isOpen) return null;

  const handleToggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    addToast({ 
      type: isAudioMuted ? 'success' : 'warning', 
      title: isAudioMuted ? 'Microphone On' : 'Microphone Muted', 
      message: isAudioMuted ? 'Your microphone is active.' : 'Your audio is now muted.' 
    });
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    addToast({ 
      type: isVideoOff ? 'success' : 'warning', 
      title: isVideoOff ? 'Camera On' : 'Camera Muted', 
      message: isVideoOff ? 'Your video stream is live.' : 'Your camera feed is turned off.' 
    });
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    addToast({ 
      type: !isScreenSharing ? 'success' : 'info', 
      title: !isScreenSharing ? 'Screen Share Active' : 'Screen Share Stopped', 
      message: !isScreenSharing ? 'Sharing your screen with the virtual classroom.' : 'Screen sharing ended.' 
    });
  };

  const handleToggleHand = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    setParticipants(prev => prev.map(p => p.role === 'teacher' ? { ...p, handRaised: next } : p));
    addToast({ 
      type: next ? 'info' : 'success', 
      title: next ? 'Hand Raised ✋' : 'Hand Lowered', 
      message: next ? 'Teacher notified that you raised your hand.' : 'Your hand was lowered.' 
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Me',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
  };

  const handleLowerHand = (participantId: string) => {
    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, handRaised: false } : p));
    addToast({ type: 'info', title: 'Hand Lowered', message: 'Lowered student hand.' });
  };

  return (
    <div className="ep-video__overlay">
      <div className="ep-video__container">
        {/* Top Bar */}
        <header className="ep-video__header">
          <div className="ep-video__header-info">
            <span className="ep-video__live-indicator">
              <Radio size={14} className="ep-pulse" /> LIVE WEBRTC
            </span>
            <h3>{courseTitle}</h3>
          </div>

          <div className="ep-video__header-meta">
            <span className="ep-video__meta-badge">
              <Users size={14} style={{ marginRight: 4 }} /> {participants.length} Attending
            </span>
            <button className="ep-video__icon-btn" onClick={onClose} title="Leave Class">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Main Stage & Sidebar */}
        <div className="ep-video__body">
          {/* Main Stage Grid */}
          <div className="ep-video__stage">
            {isScreenSharing ? (
              <div className="ep-video__screen-share-view">
                <div className="ep-video__screen-placeholder">
                  <Monitor size={48} style={{ color: '#818cf8', marginBottom: 12 }} />
                  <h4>Screen Share Presentation Stream Active</h4>
                  <p>Displaying HD Desktop Buffer • 1080p @ 60FPS</p>
                </div>
              </div>
            ) : (
              <div className="ep-video__grid">
                {participants.map((p) => (
                  <div key={p.id} className={`ep-video__tile ${p.role === 'teacher' ? 'ep-video__tile--speaker' : ''}`}>
                    {p.isVideoOff || (p.role === 'teacher' && isVideoOff) ? (
                      <div className="ep-video__avatar-fallback">
                        <div className="ep-video__avatar-circle">{p.avatar}</div>
                        <span>{p.name}</span>
                      </div>
                    ) : (
                      <div className="ep-video__feed-placeholder">
                        <div className="ep-video__feed-overlay">
                          <span className="ep-video__feed-name">{p.name}</span>
                          {p.isMuted && <MicOff size={14} style={{ color: '#ef4444' }} />}
                        </div>
                      </div>
                    )}

                    {p.handRaised && (
                      <div className="ep-video__hand-badge">
                        ✋ Hand Raised
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar: Chat / Participants */}
          <div className="ep-video__sidebar">
            <div className="ep-video__sidebar-tabs">
              <button 
                className={`ep-video__sidebar-tab ${activeTab === 'chat' ? 'ep-video__sidebar-tab--active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare size={14} style={{ marginRight: 4 }} /> Live Chat
              </button>
              <button 
                className={`ep-video__sidebar-tab ${activeTab === 'participants' ? 'ep-video__sidebar-tab--active' : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                <Users size={14} style={{ marginRight: 4 }} /> Roster ({participants.length})
              </button>
            </div>

            <div className="ep-video__sidebar-content">
              {activeTab === 'chat' ? (
                <div className="ep-video__chat-container">
                  <div className="ep-video__chat-messages">
                    {messages.map(m => (
                      <div key={m.id} className={`ep-video__chat-msg ${m.sender === 'Me' ? 'ep-video__chat-msg--self' : ''}`}>
                        <div className="ep-video__chat-meta">
                          <strong>{m.sender}</strong> <span>{m.time}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form className="ep-video__chat-form" onSubmit={handleSendMessage}>
                    <input 
                      type="text" 
                      placeholder="Type a message to class..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="ep-btn ep-btn--primary">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="ep-video__roster-list">
                  {participants.map(p => (
                    <div key={p.id} className="ep-video__roster-item">
                      <div className="ep-video__roster-user">
                        <div className="ep-video__roster-avatar">{p.avatar}</div>
                        <div>
                          <div className="ep-video__roster-name">{p.name}</div>
                          <div className="ep-video__roster-role">{p.role}</div>
                        </div>
                      </div>

                      <div className="ep-video__roster-status">
                        {p.handRaised && (
                          <button 
                            className="ep-video__hand-action"
                            onClick={() => handleLowerHand(p.id)}
                            title="Lower Hand"
                          >
                            ✋
                          </button>
                        )}
                        {p.isMuted ? <MicOff size={14} style={{ color: '#ef4444' }} /> : <Mic size={14} style={{ color: '#22c55e' }} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <footer className="ep-video__footer">
          <div className="ep-video__controls">
            <button 
              className={`ep-video__control-btn ${isAudioMuted ? 'ep-video__control-btn--off' : ''}`}
              onClick={handleToggleAudio}
              title={isAudioMuted ? 'Unmute' : 'Mute'}
            >
              {isAudioMuted ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{isAudioMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button 
              className={`ep-video__control-btn ${isVideoOff ? 'ep-video__control-btn--off' : ''}`}
              onClick={handleToggleVideo}
              title={isVideoOff ? 'Start Video' : 'Stop Video'}
            >
              {isVideoOff ? <VideoOff size={18} /> : <VideoIcon size={18} />}
              <span>{isVideoOff ? 'Start Camera' : 'Stop Camera'}</span>
            </button>

            <button 
              className={`ep-video__control-btn ${isScreenSharing ? 'ep-video__control-btn--active' : ''}`}
              onClick={handleToggleScreenShare}
              title="Share Screen"
            >
              <Monitor size={18} />
              <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
            </button>

            <button 
              className={`ep-video__control-btn ${isHandRaised ? 'ep-video__control-btn--active' : ''}`}
              onClick={handleToggleHand}
              title="Raise Hand"
            >
              <Hand size={18} />
              <span>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
            </button>

            <button className="ep-video__control-btn ep-video__control-btn--danger" onClick={onClose}>
              <PhoneOff size={18} />
              <span>Leave Class</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
