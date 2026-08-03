'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useRouter } from 'next/navigation';
import { Loader2, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveClassRoomProps {
  roomName: string;
  userName: string;
  email?: string;
  title: string;
  onEnd?: () => void;
}

export function LiveClassRoom({ roomName, userName, email, title, onEnd }: LiveClassRoomProps) {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      {/* Header */}
      <div className="bg-background/90 text-foreground p-2 px-4 flex justify-between items-center border-b z-10">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {title}
        </h1>
        <Button variant="outline" size="sm" onClick={() => onEnd ? onEnd() : router.back()}>
          Leave Class
        </Button>
      </div>

      <div className="flex-1 w-full relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: true,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: false,
            toolbarButtons: [
               'camera',
               'chat',
               'closedcaptions',
               'desktop',
               'download',
               'embedmeeting',
               'etherpad',
               'feedback',
               'filmstrip',
               'fullscreen',
               'hangup',
               'help',
               'highlight',
               'invite',
               'linktosalesforce',
               'livestreaming',
               'microphone',
               'noisesuppression',
               'participants-pane',
               'profile',
               'raisehand',
               'recording',
               'security',
               'select-background',
               'settings',
               'shareaudio',
               'sharedvideo',
               'shortcuts',
               'stats',
               'tileview',
               'toggle-camera',
               'videoquality',
               'whiteboard',
            ]
          }}
          userInfo={{
            displayName: userName,
            email: email || ''
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
        />
      </div>
    </div>
  );
}
