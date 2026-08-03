'use client';

import { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCheck, AlertTriangle, Info, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    title: string;
    body: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

const TYPE_STYLES: Record<string, { bg: string; icon: typeof Bell; badge: string }> = {
    ABSENCE: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: AlertTriangle, badge: 'غياب' },
    GRADE:   { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', icon: CheckCheck, badge: 'درجة' },
    EXAM:    { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: Calendar, badge: 'اختبار' },
    INFO:    { bg: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700', icon: Info, badge: 'إشعار' },
};

export default function ParentNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = () => {
        setLoading(true);
        apiClient.get('/api/notifications')
            .then(res => setNotifications(res.data?.data || res.data || []))
            .catch(() => setNotifications([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchNotifications(); }, []);

    const markAllRead = async () => {
        try {
            await apiClient.post('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch {}
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">🔔 الإشعارات والتنبيهات</h1>
                    <p className="text-muted-foreground mt-1">كل ما يخص أبنائك وأخبار المدرسة</p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">{unreadCount} جديد</Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={fetchNotifications} disabled={loading} className="gap-1">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1">
                            <CheckCheck className="w-4 h-4" />
                            قراءة الكل
                        </Button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                    <Bell className="w-16 h-16 text-muted-foreground/30" />
                    <p className="text-muted-foreground">لا توجد إشعارات حالياً</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {notifications.map((notif, i) => {
                            const style = TYPE_STYLES[notif.type] || TYPE_STYLES.INFO;
                            const Icon = style.icon;
                            return (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Card className={`overflow-hidden border transition-all ${style.bg} ${!notif.isRead ? 'ring-2 ring-primary/20' : 'opacity-80'}`}>
                                        <div className="flex items-start p-4 gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                                        {!notif.isRead && <span className="inline-block w-2 h-2 rounded-full bg-primary mr-1 ml-0" />}
                                                        {notif.title}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {new Date(notif.createdAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{notif.body}</p>
                                                <Badge variant="secondary" className="mt-2 text-xs">{style.badge}</Badge>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
