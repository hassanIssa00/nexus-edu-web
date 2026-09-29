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

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [];

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
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
