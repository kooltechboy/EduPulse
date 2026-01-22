
import { supabase } from '@/lib/supabase';
import { Conversation, Message, User } from '@/types';

export const messagingService = {
    async fetchConversations(userId: string): Promise<Conversation[]> {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
        *,
        conversation_participants!inner(user_id),
        messages(*)
      `)
            .eq('conversation_participants.user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching conversations:', error);
            return [];
        }

        // Need to fetch details for other participants
        // For now, returning formatted data
        return await Promise.all(data.map(async (c: any) => {
            const { data: participants } = await supabase
                .from('conversation_participants')
                .select('user:users(*)')
                .eq('conversation_id', c.id);

            const formattedParticipants = participants?.map((p: any) => p.user) || [];

            return {
                id: c.id,
                type: c.type,
                participants: formattedParticipants,
                messages: (c.messages || []).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            };
        }));
    },

    async sendMessage(conversationId: string, content: string, senderId: string, channel: 'Native' | 'WhatsApp' = 'Native') {
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                conversation_id: conversationId,
                sender_id: senderId,
                content,
                channel,
                read: false
            }])
            .select()
            .single();

        return { data, error };
    },

    async createConversation(type: string, participantIds: string[]) {
        // 1. Create conversation
        const { data: conv, error: convError } = await supabase
            .from('conversations')
            .insert([{ type }])
            .select()
            .single();

        if (convError) throw convError;

        // 2. Add participants
        const participants = participantIds.map(uid => ({
            conversation_id: conv.id,
            user_id: uid
        }));

        const { error: partError } = await supabase
            .from('conversation_participants')
            .insert(participants);

        if (partError) throw partError;

        return conv;
    },

    async searchUsers(query: string, schoolId: string): Promise<User[]> {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('school_id', schoolId)
            .ilike('name', `%${query}%`)
            .limit(20);

        return data || [];
    }
};
