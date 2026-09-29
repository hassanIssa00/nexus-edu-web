'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Bell, Award, FileText, Calendar, MessageSquare, BrainCircuit, CheckCircle2, X, Trash2, CheckCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    getStoredNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    type AppNotification,
} from '@/lib/notifications';

function NotifIcon({ type }: { type: string }) {
    const map: Record<string, { icon: any; color: string; bg: string }> = {
        ASSIGNMENT_LATE: { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        GRADE_POSTED:    { icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        STUDENT_ABSENT:  { icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ANNOUNCEMENT:    { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        EXAM_REMINDER:   { icon: BrainCircuit, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
        new_assignment:  { icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        grade_updated:   { icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        message:         { icon: MessageSquare, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    };
    const found = map[type] ?? { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' };
    const Icon = found.icon;
    return (
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm', found.bg)}>
            <Icon className={cn('w-5 h-5', found.color)} />
        </div>
    );
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    const load = useCallback(() => {
        setNotifications(getStoredNotifications());
    }, []);

    useEffect(() => {
        load();
        const handleSync = () => load();
        window.addEventListener('nexus_notifications_updated', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('nexus_notifications_updated', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, [load]);

    const markRead = (id: string) => {
        markNotificationAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const dismiss = (id: string) => {
        dismissNotification(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAll = () => {
        markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearAll = () => {
        localStorage.removeItem('nexus_notifications_v1');
        setNotifications([]);
    };

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-16" dir="rtl">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-violet-500/20"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black">الإشعارات</h1>
                            <p className="text-violet-200 text-sm">
                                {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'لا توجد إشعارات جديدة'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={load}
                            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                            title="تحديث"
                        >
                            <RefreshCw className="w-4 h-4 text-white" />
                        </button>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAll}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-bold"
                            >
                                <CheckCheck className="w-4 h-4" />
                                تحديد الكل كمقروء
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/30 hover:bg-red-500/50 transition-colors text-sm font-bold"
                            >
                                <Trash2 className="w-4 h-4" />
                                مسح الكل
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e2d] rounded-2xl p-1.5 border border-gray-100 dark:border-white/5 shadow-sm">
                {[
                    { key: 'all', label: 'الكل', count: notifications.length },
                    { key: 'unread', label: 'غير مقروء', count: notifications.filter(n => !n.isRead).length },
                    { key: 'read', label: 'مقروء', count: notifications.filter(n => n.isRead).length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all',
                            filter === tab.key
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                        )}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={cn(
                                'text-[11px] px-1.5 py-0.5 rounded-full font-black',
                                filter === tab.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                            )}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-[#1e1e2d] rounded-3xl border border-gray-100 dark:border-white/5 p-16 flex flex-col items-center gap-4 shadow-sm"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-violet-400" />
                            </div>
                            <div className="text-center">
                                <p className="font-black text-lg text-gray-900 dark:text-white">لا توجد إشعارات</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {filter === 'unread' ? 'قرأت جميع الإشعارات ✅' : 'ستظهر هنا الإشعارات الجديدة فور وصولها'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        filtered.map((n, idx) => {
                            const timeAgo = (() => {
                                try { return formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: arSA }); }
                                catch { return ''; }
                            })();

                            return (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0 }}
                                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                                    onClick={() => { markRead(n.id); if (n.actionUrl) window.location.href = n.actionUrl; }}
                                    className={cn(
                                        'group flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md',
                                        n.isRead
                                            ? 'bg-white dark:bg-[#1e1e2d] border-gray-100 dark:border-white/5'
                                            : 'bg-violet-50/60 dark:bg-violet-900/10 border-violet-200/60 dark:border-violet-700/30 shadow-sm'
                                    )}
                                >
                                    <NotifIcon type={n.type} />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className={cn(
                                                'text-sm leading-snug',
                                                n.isRead ? 'font-medium text-gray-700 dark:text-gray-300' : 'font-black text-gray-900 dark:text-white'
                                            )}>
                                                {n.title}
                                            </p>
                                            {!n.isRead && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0 mt-1 shadow-sm shadow-violet-400" />
                                            )}
                                        </div>
                                        {n.body && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                                                {n.body}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 font-medium">{timeAgo}</p>
                                    </div>

                                    <button
                                        onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 flex-shrink-0"
                                        title="حذف الإشعار"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
