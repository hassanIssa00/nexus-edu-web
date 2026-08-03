import { apiClient } from '../api/client';

export interface UserPreview {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ConversationParticipant {
  id: string;
  userId: string;
  role: string;
  lastReadAt: string;
  user: UserPreview;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  attachments?: string;
  createdAt: string;
  sender: UserPreview;
}

export interface Conversation {
  id: string;
  type: string;
  title?: string;
  description?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  messages: Message[];
}

export const messagingService = {
  getConversations: async (): Promise<Conversation[]> => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo') === 'true') {
      return [
        {
          id: 'chat-1',
          type: 'direct',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          participants: [
            { id: 'p1', userId: 'teacher-1', role: 'teacher', lastReadAt: new Date().toISOString(), user: { id: 'teacher-1', name: 'أ. فاطمة الزهراني', role: 'TEACHER' } },
            { id: 'p-me', userId: 'me', role: 'parent', lastReadAt: new Date().toISOString(), user: { id: 'me', name: 'فيصل الغامدي', role: 'PARENT' } }
          ],
          messages: [{ id: 'm1', conversationId: 'chat-1', senderId: 'teacher-1', content: 'السلام عليكم، أحمد مستواه ممتاز هذا الأسبوع في مادة الرياضيات.', type: 'text', createdAt: new Date().toISOString(), sender: { id: 'teacher-1', name: 'أ. فاطمة الزهراني', role: 'TEACHER' } }]
        },
        {
          id: 'chat-2',
          type: 'direct',
          createdAt: new Date().toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          participants: [
            { id: 'p2', userId: 'teacher-2', role: 'teacher', lastReadAt: new Date().toISOString(), user: { id: 'teacher-2', name: 'أ. محمد العتيبي', role: 'TEACHER' } },
            { id: 'p-me', userId: 'me', role: 'parent', lastReadAt: new Date().toISOString(), user: { id: 'me', name: 'فيصل الغامدي', role: 'PARENT' } }
          ],
          messages: [{ id: 'm2', conversationId: 'chat-2', senderId: 'teacher-2', content: 'الرجاء التأكد من حل الواجب لمادة العلوم.', type: 'text', createdAt: new Date(Date.now() - 86400000).toISOString(), sender: { id: 'teacher-2', name: 'أ. محمد العتيبي', role: 'TEACHER' } }]
        },
        {
          id: 'chat-3',
          type: 'direct',
          createdAt: new Date().toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          participants: [
            { id: 'p3', userId: 'teacher-3', role: 'teacher', lastReadAt: new Date().toISOString(), user: { id: 'teacher-3', name: 'أ. نورة الدوسري', role: 'TEACHER' } },
            { id: 'p-me', userId: 'me', role: 'parent', lastReadAt: new Date().toISOString(), user: { id: 'me', name: 'فيصل الغامدي', role: 'PARENT' } }
          ],
          messages: [{ id: 'm3', conversationId: 'chat-3', senderId: 'me', content: 'شكراً جزيلاً لجهودك.', type: 'text', createdAt: new Date(Date.now() - 172800000).toISOString(), sender: { id: 'me', name: 'فيصل الغامدي', role: 'PARENT' } }]
        },
        {
          id: 'chat-4',
          type: 'direct',
          createdAt: new Date().toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
          participants: [
            { id: 'p4', userId: 'teacher-4', role: 'teacher', lastReadAt: new Date().toISOString(), user: { id: 'teacher-4', name: 'أ. خالد الشمري', role: 'TEACHER' } },
            { id: 'p-me', userId: 'me', role: 'parent', lastReadAt: new Date().toISOString(), user: { id: 'me', name: 'فيصل الغامدي', role: 'PARENT' } }
          ],
          messages: []
        },
        {
          id: 'chat-5',
          type: 'direct',
          createdAt: new Date().toISOString(),
          updatedAt: new Date(Date.now() - 345600000).toISOString(),
          participants: [
            { id: 'p5', userId: 'teacher-5', role: 'teacher', lastReadAt: new Date().toISOString(), user: { id: 'teacher-5', name: 'أ. سارة المطيري', role: 'TEACHER' } },
            { id: 'p-me', userId: 'me', role: 'parent', lastReadAt: new Date().toISOString(), user: { id: 'me', name: 'فيصل الغامدي', role: 'PARENT' } }
          ],
          messages: []
        }
      ];
    }
    const res = await apiClient.get<Conversation[]>('/messages/conversations');
    // Extract actual data because of the global NestJS interceptor { data: ... }
    return (res.data as any)?.data || res.data || [];
  },

  startConversation: async (targetUserId: string): Promise<Conversation> => {
    const res = await apiClient.post<Conversation>('/messages/start', { targetUserId });
    return (res.data as any)?.data || res.data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo') === 'true') {
      const convs = await messagingService.getConversations();
      const conv = convs.find(c => c.id === conversationId);
      return conv?.messages || [];
    }
    const res = await apiClient.get<Message[]>(`/messages/${conversationId}`);
    return (res.data as any)?.data || res.data || [];
  },

  sendMessage: async (conversationId: string, content: string, attachments?: string): Promise<Message> => {
    const res = await apiClient.post<Message>(`/messages/${conversationId}/send`, {
      content,
      attachments,
    });
    return (res.data as any)?.data || res.data;
  },
};
