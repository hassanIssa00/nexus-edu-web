'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, FileText, Award, Calendar, CheckCircle2, X, Zap, BrainCircuit, MessageSquare, CheckCheck, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import { useRealtimeNotifications } from '@/lib/providers/socket-provider';
import {
    getStoredNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    saveStoredNotifications,
    type AppNotification,
} from '@/lib/notifications';
import Link from 'next/link';
import { useLocale } from 'next-intl';

// ── Icon map ───────────────────────────────────────────────
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
    const found = map[type] ?? { icon: Bell, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' };
    const Icon = found.icon;
    return (
        <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs', found.bg)}>
            <Icon className={cn('w-4 h-4', found.color)} />
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────
export function EnhancedNotifications() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const [pulse, setPulse] = useState(false);
    const locale = useLocale();

    const unread = notifications.filter(n => !n.isRead).length;

    // Load from local store + API sync
    const loadNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const local = getStoredNotifications();
            setNotifications(local);

            // Attempt to fetch from API if available
            try {
                const res = await apiClient.get('/notifications/my');
                const items: AppNotification[] = (res.data?.data || res.data || []).map((n: any) => ({
                    id: n.id,
                    type: n.type || 'ANNOUNCEMENT',
                    title: n.titleAr || n.title || 'إشعار جديد',
                    body: n.bodyAr || n.body || n.message,
                    isRead: n.isRead ?? false,
                    createdAt: n.createdAt,
                    actionUrl: n.data ? JSON.parse(n.data)?.actionUrl : undefined,
                }));
                if (items.length > 0) {
                    setNotifications(items);
                    saveStoredNotifications(items);
                }
            } catch {
                // Keep local
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
        const handleSync = () => {
            const fresh = getStoredNotifications();
            setNotifications(fresh);
        };
        window.addEventListener('nexus_notifications_updated', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('nexus_notifications_updated', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, [loadNotifications]);

    // Real-time push: prepend incoming notification
    const handleLiveNotif = useCallback((n: any) => {
        const item: AppNotification = {
            id: n.id || `live-${Date.now()}`,
            type: n.type || 'ANNOUNCEMENT',
            title: n.title || 'إشعار جديد',
            body: n.body,
            isRead: false,
            createdAt: n.createdAt || new Date().toISOString(),
            actionUrl: n.actionUrl,
            isLive: true,
        };
        setNotifications(prev => {
            const updated = [item, ...prev];
            saveStoredNotifications(updated);
            return updated;
        });
        setPulse(true);
        setTimeout(() => setPulse(false), 3000);
    }, []);

    useRealtimeNotifications(handleLiveNotif);

    // Mark all read
    const markAllRead = async () => {
        markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await apiClient.patch('/notifications/mark-all-read');
        } catch { /* ignore */ }
    };

    // Mark single read
    const markRead = async (id: string) => {
        markNotificationAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            await apiClient.patch(`/notifications/${id}/read`);
        } catch { /* ignore */ }
    };

    // Remove
    const dismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        dismissNotification(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const recent   = notifications.slice(0, 20);
    const unreadNs = recent.filter(n => !n.isRead);
    const readNs   = recent.filter(n => n.isRead);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Bell className={cn('h-4 w-4 transition-all text-slate-600 dark:text-slate-300', pulse && 'text-violet-600 scale-110')} />
                    <AnimatePresence>
                        {unread > 0 && (
                            <motion.span
                                key="badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md border-2 border-white dark:border-slate-900">
                                {unread > 99 ? '99+' : unread}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {pulse && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-violet-400/40" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={10}
                className="w-[380px] max-w-[calc(100vw-2rem)] p-0 shadow-2xl border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden bg-white dark:bg-[#1a1a2e]"
                dir="rtl"
            >
                {/* ═══ CLEAN HEADER ═══ */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white select-none">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Bell className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-sm text-white">الإشعارات</h3>
                                {unread > 0 && (
                                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                        {unread} جديد
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {unread > 0 && (
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="text-[11px] font-black bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl transition-all border border-white/20 outline-none focus:outline-none focus:ring-0 active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            تحديد الكل
                        </button>
                    )}
                </div>

                {/* ═══ NOTIFICATIONS LIST ═══ */}
                <ScrollArea className="max-h-[380px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : recent.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-500">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-black text-gray-900 dark:text-white">لا توجد إشعارات حالياً</p>
                            <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                                ستصلك الإشعارات فور تسجيل الحضور، أو تسليم الواجبات، أو التفاعل الصفي.
                            </p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {/* Unread Section */}
                            {unreadNs.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 px-3 py-1.5 uppercase tracking-wider">
                                        غير مقروء ({unreadNs.length})
                                    </p>
                                    <div className="space-y-1">
                                        <AnimatePresence initial={false}>
                                            {unreadNs.map(n => (
                                                <NotifRow key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {/* Read Section */}
                            {readNs.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 px-3 py-1.5 uppercase tracking-wider">
                                        سابق ({readNs.length})
                                    </p>
                                    <div className="space-y-1 opacity-70">
                                        {readNs.slice(0, 5).map(n => (
                                            <NotifRow key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* ═══ FOOTER ═══ */}
                <div className="p-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/80 dark:bg-white/[0.02]">
                    <button
                        type="button"
                        onClick={loadNotifications}
                        className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-bold transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 border-0 outline-none focus:outline-none focus:ring-0 active:scale-95 cursor-pointer"
                    >
                        <Zap className="w-3.5 h-3.5 text-violet-500" />
                        <span>تحديث</span>
                    </button>

                    <Link
                        href={`/${locale}/student/notifications`}
                        onClick={() => setOpen(false)}
                        className="text-xs font-black text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    >
                        <span>عرض جميع الإشعارات</span>
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ── Row Component ──────────────────────────────────────────
function NotifRow({ n, onRead, onDismiss }: {
    n: AppNotification;
    onRead: (id: string) => void;
    onDismiss: (id: string, e: React.MouseEvent) => void;
}) {
    const timeAgo = (() => {
        try {
            return formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: arSA });
        } catch { return ''; }
    })();

    return (
        <motion.div
            initial={n.isLive ? { backgroundColor: '#8b5cf615', scale: 0.98 } : { opacity: 0 }}
            animate={{ backgroundColor: 'transparent', scale: 1, opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => { onRead(n.id); if (n.actionUrl) window.location.href = n.actionUrl; }}
            className={cn(
                'flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all relative group',
                !n.isRead 
                    ? 'bg-violet-50/70 dark:bg-violet-950/20 border border-violet-100/80 dark:border-violet-800/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'
            )}
        >
            <NotifIcon type={n.type} />

            <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                    <p className={cn('text-xs leading-snug truncate', !n.isRead ? 'font-black text-gray-900 dark:text-white' : 'font-semibold text-gray-600 dark:text-gray-300')}>
                        {n.title}
                    </p>
                    {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-violet-600 flex-shrink-0 animate-pulse" />
                    )}
                </div>
                {n.body && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {n.body}
                    </p>
                )}
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">{timeAgo}</p>
            </div>

            <button
                type="button"
                onClick={e => onDismiss(n.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 flex-shrink-0"
                title="حذف"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}
