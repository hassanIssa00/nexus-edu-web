import { apiClient } from './client';

export interface ClassSession {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  isActive: boolean;
  meetingUrl: string;
  startTime: string;
  teacher?: {
    name: string | null;
  };
}

export const classSessionApi = {
  start: (classId: string, title?: string) => 
    apiClient.post<ClassSession>(`/classes/${classId}/sessions/start`, { title }),
    
  end: (classId: string, sessionId: string) => 
    apiClient.post(`/classes/${classId}/sessions/${sessionId}/end`),
    
  getActive: (classId: string) => 
    apiClient.get<ClassSession | null>(`/classes/${classId}/sessions/active`),
    
  markAttendance: (classId: string, sessionId: string) => 
    apiClient.post(`/classes/${classId}/sessions/${sessionId}/attendance`),
};
