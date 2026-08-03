'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

const dayNames: Record<number, string> = {
    0: 'الأحد',
    1: 'الإثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة',
    6: 'السبت',
};

export default function SchedulePage() {
    const [schedule, setSchedule] = useState<Record<number, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await apiClient.get('/schedule/my');
                if (res.data?.success) {
                    setSchedule(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching schedule:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Class Schedule</h1>
                <p className="text-muted-foreground mt-2">Your weekly class timetable</p>
            </div>

            <div className="space-y-6">
                {Object.entries(schedule).map(([day, classes]) => {
                    const dayName = dayNames[Number(day)] || day;
                    return (
                    <Card key={day}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {dayName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {classes.map((classItem, idx) => {
                                    const timeStr = classItem.startTime 
                                        ? `${new Date(classItem.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(classItem.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        : classItem.time;
                                    const subjectStr = classItem.subject?.name || classItem.subject || 'مادة';
                                    const teacherStr = classItem.teacher?.name || classItem.teacher || 'معلم غير محدد';
                                    const roomStr = classItem.room || 'لم يحدد';

                                    return (
                                        <div
                                            key={classItem.id || idx}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[130px]">
                                                    <Clock className="w-4 h-4" />
                                                    {timeStr}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{subjectStr}</h3>
                                                    <p className="text-sm text-muted-foreground">{teacherStr}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                {roomStr}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )})}
            </div>
        </div>
    );
}
