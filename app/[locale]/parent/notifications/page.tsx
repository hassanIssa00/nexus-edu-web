'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCheck, Sparkles, InboxIcon } from 'lucide-react'

interface Notification {
  id: string
  title: string
  body: string
  time: string
  isRead: boolean
  type: string
}

export default function ParentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nexus_parent_notifications')
      if (raw) {
        setNotifications(JSON.parse(raw))
      }
    } catch {}
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }))
    setNotifications(updated)
    try {
      localStorage.setItem('nexus_parent_notifications', JSON.stringify(updated))
    } catch {}
  }

  const toggleRead = (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    setNotifications(updated)
    try {
      localStorage.setItem('nexus_parent_notifications', JSON.stringify(updated))
    } catch {}
  }

  return (
    <div className="space-y-8 pb-16" dir="rtl">
      {/* ── HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#b45309] via-[#d97706] to-[#F59E0B] p-8 md:p-10 text-white shadow-[0_24px_70px_rgba(245,158,11,0.32)]"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md mb-3 shadow-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
              <span className="text-xs font-bold text-amber-100">مركز التنبيهات المباشرة</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">الإشعارات والتنبيهات 🔔</h1>
            <p className="text-amber-100 text-sm md:text-base max-w-xl font-medium">
              متابعة فورية ومباشرة لكافة مستجدات الحضور والواجبات والتوجيهات.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center">
              <p className="text-[10px] text-amber-200 font-bold uppercase">غير مقروء</p>
              <p className="text-2xl font-black">{unreadCount}</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-4 py-3 rounded-2xl bg-white text-amber-800 font-black text-xs shadow-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── EMPTY STATE ── */}
      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <InboxIcon className="w-12 h-12 text-amber-400" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">لا توجد إشعارات</h3>
          <p className="text-sm text-gray-500 font-medium max-w-xs">
            ستظهر هنا إشعارات الحضور والواجبات والدرجات فور وصولها
          </p>
        </motion.div>
      )}

      {/* ── NOTIFICATIONS LIST ── */}
      {notifications.length > 0 && (
        <div className="space-y-3.5">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => toggleRead(notif.id)}
              className={`p-5 rounded-[2rem] border backdrop-blur-xl transition-all cursor-pointer flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white/60 dark:bg-[#1e1e2d]/60 border-gray-100 dark:border-white/5 opacity-80'
                  : 'bg-white/95 dark:bg-[#1e1e2d]/95 border-amber-200 dark:border-amber-500/30 shadow-md ring-1 ring-amber-500/10'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-500">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`font-black text-sm ${notif.isRead ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{notif.body}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-2 shadow-sm" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
