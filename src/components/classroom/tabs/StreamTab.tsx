import React, { useState } from 'react';
import { Send, Image, Link as LinkIcon, MoreVertical } from 'lucide-react';

interface Post {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  timestamp: string;
}

export const StreamTab: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: { name: 'Dr. Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
      content: 'Welcome to Advanced Mathematics! Please make sure to review the syllabus before our first class on Monday.',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      author: { name: 'Dr. Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
      content: 'I have uploaded the first set of practice problems to the Resources tab.',
      timestamp: '1 day ago'
    }
  ]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: { name: 'Dr. Smith', avatar: 'https://i.pravatar.cc/150?u=1' },
      content: newPost,
      timestamp: 'Just now'
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="ep-stream-tab" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div className="ep-post-composer" style={{ background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Announce something to your class..."
          style={{ width: '100%', minHeight: '100px', padding: 'var(--spacing-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-base)', color: 'var(--color-text-primary)', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-3)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <button className="ep-btn-icon"><Image size={18} /></button>
            <button className="ep-btn-icon"><LinkIcon size={18} /></button>
          </div>
          <button className="ep-btn ep-btn--primary" onClick={handlePost}>
            <Send size={16} /> Post
          </button>
        </div>
      </div>

      <div className="ep-feed" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {posts.map(post => (
          <div key={post.id} className="ep-post" style={{ background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                <img src={post.author.avatar} alt={post.author.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{post.author.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{post.timestamp}</div>
                </div>
              </div>
              <button className="ep-btn-icon"><MoreVertical size={18} /></button>
            </div>
            <div style={{ color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {post.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
