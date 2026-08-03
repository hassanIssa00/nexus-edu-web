'use client';

import { useEffect, useState } from 'react';
import { DrawerPanel } from '../sidebar/DrawerPanel';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'grade';
    read: boolean;
    createdAt: Date;
}

export function NotificationsDrawer() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data
        setTimeout(() => {
            setNotifications([
                {
                    id: '1',
                    title: 'واجب جديد',
                    body: 'تم إضافة واجب جديد في مادة الرياضيات',
                    type: 'assignment',
                    read: false,
                    createdAt: new Date('2024-12-03T10:30:00')
                },
                {
                    id: '2',
                    title: 'تم تصحيح الاختبار',
                    body: 'تم تصحيح اختبار العلوم. درجتك: 92/100',
                    type: 'grade',
                    read: false,
                    createdAt: new Date('2024-12-02T14:00:00')
                },
                {
                    id: '3',
                    title: 'موعد تسليم قريب',
                    body: 'موعد تسليم بحث العلوم بعد يومين',
                    type: 'warning',
                    read: true,
                    createdAt: new Date('2024-12-01T09:00:00')
                },
                {
                    id: '4',
                    title: 'إعلان مهم',
                    body: 'سيكون هناك اختبار نصفي الأسبوع القادم',
                    type: 'info',
                    read: true,
                    createdAt: new Date('2024-11-30T11:00:00')
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'warning':
                return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'error':
                return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'assignment':
                return 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
            case 'grade':
                return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            default:
                return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
        if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
        if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
        return 'الآن';
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DrawerPanel drawerId="notifications" title="الإشعارات">
            <div className="space-y-4">
                {/* Header Actions */}
                {unreadCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                            لديك {unreadCount} إشعار{unreadCount > 1 ? 'ات' : ''} غير مقروء{unreadCount > 1 ? 'ة' : ''}
                        </span>
                        <Button
                            onClick={markAllAsRead}
                            variant="ghost"
                            size="sm"
                            className="text-blue-700 dark:text-blue-300"
                        >
                            تحديد الكل كمقروء
                        </Button>
                    </div>
                )}

                {/* Notifications List */}
                {loading ? (
                    <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p>لا توجد إشعارات</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    'p-4 rounded-lg border-2 transition-all',
                                    getTypeColor(notification.type),
                                    !notification.read && 'ring-2 ring-blue-500 ring-opacity-50'
                                )}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold">{notification.title}</h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                            {notification.body}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {getRelativeTime(notification.createdAt)}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                        variant="ghost"
                                        size="icon"
                                        className="flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DrawerPanel>
    );
}

export default NotificationsDrawer;
