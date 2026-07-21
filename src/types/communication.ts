import { UserRole } from './auth';
import { Tier } from './academic';

export interface Participant {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
}

export type ConversationType = 'direct' | 'group' | 'broadcast' | 'announcement';

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: string;
  unreadCount: number;
  updatedAt: string;
  type: ConversationType;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments: string[];
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'action';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetRoles: UserRole[];
  targetTiers: Tier[];
  priority: AnnouncementPriority;
  publishedAt: string;
  expiresAt?: string;
}
