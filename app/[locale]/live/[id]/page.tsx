'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { classSessionApi, ClassSession } from '@/lib/api/class-session';
import { LiveClassRoom } from '@/components/class/live-class-room';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LiveClassPage() {
  const params = useParams() as { id: string };
  const classId = params?.id || '';
  
  const { user, profile } = useAuth();
  const router = useRouter();
  
  const [session, setSession] = useState<ClassSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await classSessionApi.getActive(classId as string);
      setSession(res.data);
      
      // Mark attendance if session active and user is student
      if (res.data && user?.role === 'STUDENT') {
        classSessionApi.markAttendance(classId as string, res.data.id).catch(console.error);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchSession();
    }
  }, [classId]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Teacher functionality: Start Session if none active?
  const isTeacher = user?.role === 'TEACHER';

  const handleStartSession = async () => {
     try {
       setLoading(true);
       const res = await classSessionApi.start(classId as string, 'Live Class');
       setSession(res.data);
     } catch (err) {
       console.error("Failed to start", err);
     } finally {
       setLoading(false);
     }
  };

  if (!session) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-muted/20">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Active Live Class</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              There is currently no live session started for this class.
            </p>
            
            {isTeacher ? (
              <Button onClick={handleStartSession} className="w-full">
                Start Live Session Now
              </Button>
            ) : (
              <Button variant="outline" onClick={fetchSession} className="w-full gap-2">
                <RefreshCw className="h-4 w-4" />
                Check Again
              </Button>
            )}
            
            <Button variant="ghost" onClick={() => router.back()} className="mt-2 w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Session Found
  return (
    <LiveClassRoom
      roomName={`MillionPlatform-${classId}`}
      userName={profile?.full_name || 'Guest'}
      email={user?.email}
      title={session.title}
      onEnd={() => router.back()}
    />
  );
}
