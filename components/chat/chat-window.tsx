'use client';

import { useChat } from './chat-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Image as ImageIcon, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VoiceRecorder } from '@/components/ui/voice-recorder';

export function ChatWindow() {
  const { activeConversation, messages, sendMessage, isLoadingMessages, activeConversationId } = useChat();
  const [inputText, setInputText] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await sendMessage(inputText, 'text');
    setInputText('');
  };

  const handleVoiceUpload = async (url: string) => {
      await sendMessage(url, 'voice');
      setShowVoiceRecorder(false);
  }

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/30 dark:bg-zinc-900/30">
        <div className="text-center text-muted-foreground">
          <p>اختر محادثة للبدء</p>
        </div>
      </div>
    );
  }

  // Get display user (first participant for now)
  const displayUser = activeConversation?.participants[0]?.user;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <Avatar>
          <AvatarImage src={displayUser?.avatar} />
          <AvatarFallback>{displayUser?.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{displayUser?.name}</h3>
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            متصل
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {isLoadingMessages ? (
            <div className="text-center py-4">جاري التحميل...</div>
        ) : (
            messages.slice().reverse().map((msg) => { // Messages come new->old, reverse for display
                const isMe = false; // TODO: Check sender ID against current user from AuthContext
                // We need current User ID context. For now assuming not me for styling demo, or check senderId
                
                return (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>{msg.sender?.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-lg ${
                                isMe 
                                ? 'bg-blue-600 text-white rounded-tl-none' 
                                : 'bg-gray-100 dark:bg-zinc-800 rounded-tr-none'
                            }`}>
                                {msg.type === 'voice' ? (
                                    <audio controls src={msg.content} className="h-8 w-48" />
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString('ar-EG', { hour:'2-digit', minute:'2-digit' })}
                            </span>
                        </div>
                    </div>
                );
            })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-zinc-900">
        {showVoiceRecorder ? (
            <div className="mb-2">
                <VoiceRecorder onRecordingComplete={handleVoiceUpload} />
                <Button variant="ghost" size="sm" onClick={() => setShowVoiceRecorder(false)} className="mt-1 w-full text-xs">إلغاء</Button>
            </div>
        ) : (
            <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowVoiceRecorder(true)}>
                <Mic className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </Button>
            <div className="flex-1 relative">
                <Input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="اكتب رسالة..." 
                    className="resize-none"
                    autoComplete="off"
                />
            </div>
            <Button onClick={handleSend} disabled={!inputText.trim()}>
                <Send className="w-5 h-5" />
            </Button>
            </div>
        )}
      </div>
    </div>
  );
}
