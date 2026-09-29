'use client';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  isLive?: boolean;
}

const STORAGE_KEY = 'nexus_notifications_v1';

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'grade_updated',
    title: 'اعتماد درجة التميز (98%) — لغتي الجميلة 🌟',
    body: 'بارك الله فيك يا بني! اعتمد د. إسماعيل عيسى تقييمك بدرجة امتياز في مهارات القراءة والاستماع.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    actionUrl: '/student/grades',
  },
  {
    id: 'notif-2',
    type: 'new_assignment',
    title: 'واجب مدرسي جديد: تدريب حروف المد ✏️',
    body: 'أضاف د. إسماعيل عيسى واجباً تفاعلياً جديداً في مقرر لغتي. موعد التسليم غداً قبل الحصة الثالثة.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hrs ago
    actionUrl: '/student/assignments',
  },
  {
    id: 'notif-3',
    type: 'message',
    title: 'رسالة من رائد الفصل د. إسماعيل عيسى 💬',
    body: 'السلام عليكم يا بطل، سعدت بحضورك وتفاعلك المتميز في الفصل اليوم. واصل اجتهادك!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hrs ago
    actionUrl: '/student/messages',
  },
  {
    id: 'notif-4',
    type: 'STUDENT_ABSENT',
    title: 'توثيق الحضور المدرسي بالنطاق الجغرافي 📍',
    body: 'تم تسجيل وتوثيق حضورك الصباحي بنجاح داخل النطاق الجغرافي المعتمد لمدارس الإخلاص الأهلية للبنين بجدة.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hrs ago
    actionUrl: '/student/attendance',
  },
  {
    id: 'notif-5',
    type: 'EXAM_REMINDER',
    title: 'مسابقة تحدي المليون الكبرى متاحة الآن 🏆',
    body: 'تحدَّ معلوماتك في واحة الألعاب واحصد +500 نقطة خبرة والشهادة الذهبية المعتمدة!',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: '/student/games',
  },
  {
    id: 'notif-6',
    type: 'ANNOUNCEMENT',
    title: 'أهلاً بك في مدارس الإخلاص الأهلية للبنين بجدة 🏫',
    body: 'تم تفعيل حسابك الأكاديمي بنجاح للعام الدراسي 1447 / 1448هـ عبر منصة نكسس EDU الذكية.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    actionUrl: '/student/profile',
  },
];

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    return parsed;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(items: AppNotification[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('nexus_notifications_updated', { detail: items }));
  } catch {}
}

export function addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) {
  const current = getStoredNotifications();
  const newItem: AppNotification = {
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
    isLive: true,
    ...notif,
  };
  const updated = [newItem, ...current].slice(0, 30);
  saveStoredNotifications(updated);
  return newItem;
}

export function markNotificationAsRead(id: string) {
  const current = getStoredNotifications();
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveStoredNotifications(updated);
}

export function markAllNotificationsAsRead() {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  saveStoredNotifications(updated);
}

export function dismissNotification(id: string) {
  const current = getStoredNotifications();
  const updated = current.filter(n => n.id !== id);
  saveStoredNotifications(updated);
}
