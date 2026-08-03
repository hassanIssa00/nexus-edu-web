'use client';

import { ChatProvider } from '@/components/chat/chat-provider';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatWindow } from '@/components/chat/chat-window';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ChatProvider>
        <div className="flex h-full border rounded-lg overflow-hidden bg-white dark:bg-zinc-950 shadow-sm m-4">
            {/* Sidebar - Hidden on mobile if chat active (TODO) */}
            <div className="w-80 border-l hidden md:block">
                <ChatSidebar />
            </div>
            
            {/* Main Window */}
            <div className="flex-1 h-full">
                <ChatWindow />
            </div>
        </div>
      </ChatProvider>
    </div>
  );
}
