'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { apiClient } from '@/lib/api/client';
import type { Socket } from 'socket.io-client';

// Types (Mirrors backend mostly)
export interface User {
    id: string;
    name: string;
    avatar?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string; // was messageText in backend request, assuming mapper maps it or we adjust
    type: 'text' | 'image' | 'voice';
    createdAt: string;
    sender?: User;
}

export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    title?: string;
    participants: { user: User }[];
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string;
}

interface ChatContextType {
    socket: Socket | null;
    isConnected: boolean;
    conversations: Conversation[];
    activeConversationId: string | null;
    activeConversation: Conversation | null;
    messages: Message[];
    isLoadingMessages: boolean;
    setActiveConversationId: (id: string | null) => void;
    sendMessage: (content: string, type?: 'text' | 'image' | 'voice') => Promise<void>;
    refreshConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { socket, isConnected } = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Fetch conversations on mount
    const fetchConversations = async () => {
        try {
            const res = await apiClient.get('/api/chat/conversations');
            if (res.data.success) {
                setConversations(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations', error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Listen for socket events
    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: any) => {
            // Update messages if in active conversation
            if (activeConversationId && message.conversationId === activeConversationId) {
                setMessages(prev => [message, ...prev]);
            }
            // Refresh conversation list to show new last message/unread count
            fetchConversations();
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket, activeConversationId]);

    // Fetch messages when active conversation changes
    useEffect(() => {
        if (!activeConversationId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const res = await apiClient.get(`/api/chat/conversations/${activeConversationId}/messages`);
                if (res.data.success) {
                    setMessages(res.data.data.messages || []); // Backend returns paginated { messages: [] }
                }
            } catch (error) {
                console.error('Failed to fetch messages', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchMessages();

        // Join room
        if (socket && isConnected) {
            socket.emit('joinConversation', { conversationId: activeConversationId });
        }

    }, [activeConversationId, socket, isConnected]);

    const sendMessage = async (content: string, type: 'text' | 'image' | 'voice' = 'text') => {
        if (!activeConversationId || !socket) return;

        // Optimistic update? Maybe later. For now rely on socket ack or emit.
        // We use REST API or Socket. Using Socket is faster.
        
        socket.emit('sendMessage', {
            conversationId: activeConversationId,
            content,
            type
        }, (response: any) => {
            // Callback if needed
        });
        
        // Also simpler to just use REST if socket is complex to handle ACK
        // await apiClient.post('/api/chat/messages', { conversationId: activeConversationId, messageText: content });
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

    return (
        <ChatContext.Provider value={{
            socket,
            isConnected,
            conversations,
            activeConversationId,
            activeConversation,
            messages,
            isLoadingMessages,
            setActiveConversationId,
            sendMessage,
            refreshConversations: fetchConversations
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};
