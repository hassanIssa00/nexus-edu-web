'use client';

import { useChat } from './chat-provider';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function ChatSidebar({ className }: { className?: string }) {
  const { conversations, activeConversationId, setActiveConversationId } = useChat();

  return (
    <div className={cn("flex flex-col h-full border-l bg-gray-50/50 dark:bg-zinc-900/50", className)}>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">الرسائل</h2>
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث في المحادثات..." className="pr-9" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
                لا توجد محادثات
            </div>
        ) : (
            conversations.map((conv) => {
                const otherParticipant = conv.participants.find(p => p.user.id /* logic to exclude self if possible, but for now take first */);
                // In real app, filter out current user. For now, just take first participant's user.
                const displayUser = conv.participants[0]?.user;

                return (
                    <button
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-right",
                        activeConversationId === conv.id && "bg-blue-50 dark:bg-blue-900/20"
                        )}
                    >
                        <Avatar>
                        <AvatarImage src={displayUser?.avatar} />
                        <AvatarFallback>{displayUser?.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium truncate">{displayUser?.name || 'مستخدم'}</span>
                                {conv.updatedAt && (
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(conv.updatedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate dir-rtl">
                                {conv.lastMessage?.content || 'بدء المحادثة'}
                            </p>
                        </div>
                    </button>
                 );
            })
        )}
      </div>
    </div>
  );
}
