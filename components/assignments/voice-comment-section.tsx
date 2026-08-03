'use client';

import { useState } from 'react';
import { VoiceRecorder } from '@/components/ui/voice-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Trash2, Volume2 } from 'lucide-react';

interface VoiceCommentSectionProps {
  existingAudioUrl?: string | null;
  onSave: (audioUrl: string | null) => void;
  readOnly?: boolean;
}

export function VoiceCommentSection({
  existingAudioUrl,
  onSave,
  readOnly = false,
}: VoiceCommentSectionProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(existingAudioUrl || null);
  const [isRecording, setIsRecording] = useState(false);

  const handleUploadComplete = (url: string) => {
    setCurrentUrl(url);
    setIsRecording(false);
    onSave(url);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف التعليق الصوتي؟')) {
      setCurrentUrl(null);
      onSave(null);
    }
  };

  if (readOnly && !currentUrl) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          ملاحظات صوتية
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentUrl ? (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <audio controls src={currentUrl} className="w-full h-8" />
            
            {!readOnly && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                onClick={handleDelete}
                title="حذف التعليق"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          !readOnly && (
            isRecording ? (
              <div className="flex flex-col items-center">
                <VoiceRecorder 
                  onRecordingComplete={handleUploadComplete}
                  className="w-full"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsRecording(false)}
                  className="mt-2"
                >
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full gap-2 border-dashed h-20"
                onClick={() => setIsRecording(true)}
              >
                <Mic className="w-5 h-5 text-blue-500" />
                <span>إضافة تعليق صوتي</span>
              </Button>
            )
          )
        )}
      </CardContent>
    </Card>
  );
}
