'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Bell, Shield, Lock, Camera, Save, Check,
  Eye, EyeOff, Phone, Mail, Sparkles, AlertCircle
} from 'lucide-react'

export default function TeacherSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const [notifSubmissions, setNotifSubmissions] = useState(true)
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(true)
  const [notifGrading, setNotifGrading] = useState(false)

  const [savedProfile, setSavedProfile] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nexus_user')
      if (raw) {
        const u = JSON.parse(raw)
        setName(u.name || '')
        setEmail(u.email || '')
        setPhone(u.phone || '')
        if (u.photoUrl) setPhotoUrl(u.photoUrl)
      }
      const notifRaw = localStorage.getItem('nexus_teacher_notifications_prefs')
      if (notifRaw) {
        const n = JSON.parse(notifRaw)
        setNotifSubmissions(n.submissions ?? true)
        setNotifWeeklyReport(n.weeklyReport ?? true)
        setNotifGrading(n.grading ?? false)
      }
    } catch {}
  }, [])

  const handleSaveProfile = () => {
    try {
      const raw = localStorage.getItem('nexus_user')
      const u = raw ? JSON.parse(raw) : {}
      const updated = { ...u, name, phone }
      if (photoUrl) updated.photoUrl = photoUrl
      localStorage.setItem('nexus_user', JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('nexus:data-changed'))
      setSavedProfile(true)
      setTimeout(() => setSavedProfile(false), 2500)
    } catch {}
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setPhotoUrl(dataUrl)
      try {
        const raw = localStorage.getItem('nexus_user')
        if (raw) {
          const u = JSON.parse(raw)
          u.photoUrl = dataUrl
          localStorage.setItem('nexus_user', JSON.stringify(u))
        }
        window.dispatchEvent(new CustomEvent('nexus:data-changed'))
      } catch {}
    }
    reader.readAsDataURL(file)
  }

  const handleChangePassword = () => {
    setPwError('')
    setPwSuccess(false)
    try {
      const raw = localStorage.getItem('nexus_user')
      const u = raw ? JSON.parse(raw) : {}
      const stored = u.password || '123456'
      if (currentPw !== stored) {
        setPwError('كلمة المرور الحالية غير صحيحة')
        return
      }
      if (newPw.length < 6) {
        setPwError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
        return
      }
      if (newPw !== confirmPw) {
        setPwError('كلمة المرور الجديدة وتأكيدها غير متطابقتان')
        return
      }
      u.password = newPw
      localStorage.setItem('nexus_user', JSON.stringify(u))
      setPwSuccess(true)
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => setPwSuccess(false), 3000)
    } catch {
      setPwError('حدث خطأ أثناء تغيير كلمة المرور')
    }
  }

  const saveNotifPref = (key: string, value: boolean) => {
    try {
      const raw = localStorage.getItem('nexus_teacher_notifications_prefs')
      const n = raw ? JSON.parse(raw) : {}
      n[key] = value
      localStorage.setItem('nexus_teacher_notifications_prefs', JSON.stringify(n))
    } catch {}
  }

  const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'م'

  const tabs = [
    { id: 'profile' as const, label: 'الملف الشخصي', icon: User },
    { id: 'password' as const, label: 'كلمة المرور', icon: Shield },
    { id: 'notifications' as const, label: 'الإشعارات', icon: Bell },
  ]

  return (
    <div className="space-y-6 pb-16 max-w-2xl" dir="rtl">
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a1a3e] via-[#2d1b69] to-[#4c1d95] p-7 text-white shadow-[0_20px_60px_rgba(76,29,149,0.35)]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-8 w-48 h-48 rounded-full bg-violet-400/15 blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="relative">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border-2 border-white/30 shadow-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              {photoUrl
                ? <img src={photoUrl} alt="صورتك" className="w-full h-full object-cover" />
                : <span className="text-2xl font-black text-white">{initials}</span>
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <Camera className="w-3.5 h-3.5 text-purple-700" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 mb-1.5">
              <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
              <span className="text-[10px] font-bold text-purple-200">إعدادات حسابك في نكسس EDU</span>
            </div>
            <h1 className="text-2xl font-black">{name || 'المعلم'}</h1>
            <p className="text-purple-200 text-xs mt-0.5">{email}</p>
          </div>
        </div>
      </motion.div>

      {/* ── TABS ── */}
      <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === t.id
                ? 'bg-white dark:bg-[#1e1e2d] shadow-sm text-purple-700 dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white/80 dark:bg-[#1e1e2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2rem] p-7 shadow-sm space-y-5"
          >
            <h2 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              البيانات الشخصية
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-600 dark:text-gray-400">الاسم الكامل</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="أدخل اسمك الكامل"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> البريد الإلكتروني (غير قابل للتعديل)
                </label>
                <input value={email} disabled
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> رقم الهاتف
                </label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="05XXXXXXXX" dir="ltr"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <button onClick={handleSaveProfile}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
                savedProfile ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-purple-600 to-violet-600 text-white hover:opacity-90'
              }`}>
              {savedProfile ? <><Check className="w-4 h-4" /> تم الحفظ بنجاح ✅</> : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
            </button>
          </motion.div>
        )}

        {activeTab === 'password' && (
          <motion.div key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white/80 dark:bg-[#1e1e2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2rem] p-7 shadow-sm space-y-5"
          >
            <h2 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" /> تغيير كلمة المرور
            </h2>
            <div className="space-y-4">
              {[
                { label: 'كلمة المرور الحالية', val: currentPw, set: setCurrentPw, show: showCurrent, setShow: setShowCurrent, placeholder: 'أدخل كلمة المرور الحالية' },
                { label: 'كلمة المرور الجديدة', val: newPw, set: setNewPw, show: showNew, setShow: setShowNew, placeholder: '6 أحرف على الأقل' },
                { label: 'تأكيد كلمة المرور', val: confirmPw, set: setConfirmPw, show: showConfirm, setShow: setShowConfirm, placeholder: 'أعد كتابة كلمة المرور الجديدة' },
              ].map(field => (
                <div key={field.label} className="space-y-2">
                  <label className="text-xs font-black text-gray-600 dark:text-gray-400">{field.label}</label>
                  <div className="relative">
                    <input type={field.show ? 'text' : 'password'} value={field.val} onChange={e => field.set(e.target.value)} placeholder={field.placeholder}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 pr-10 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <button onClick={() => field.setShow(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pwError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs font-bold text-red-600">{pwError}</p>
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="text-xs font-bold text-emerald-600">تم تغيير كلمة المرور بنجاح! 🎉</p>
              </div>
            )}
            <button onClick={handleChangePassword} disabled={!currentPw || !newPw || !confirmPw}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-gradient-to-l from-purple-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <Lock className="w-4 h-4" /> تغيير كلمة المرور
            </button>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white/80 dark:bg-[#1e1e2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2rem] p-7 shadow-sm space-y-4"
          >
            <h2 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" /> إعدادات الإشعارات
            </h2>
            {[
              { key: 'submissions', label: 'إشعارات تسليم الواجبات', desc: 'تنبيه عند قيام طالب بتسليم واجب', val: notifSubmissions, set: setNotifSubmissions },
              { key: 'weeklyReport', label: 'تقارير الأداء الأسبوعية', desc: 'ملخص أداء الطلاب كل أسبوع', val: notifWeeklyReport, set: setNotifWeeklyReport },
              { key: 'grading', label: 'التصحيح التلقائي', desc: 'تنبيه عند اكتمال التصحيح بالذكاء الاصطناعي', val: notifGrading, set: setNotifGrading },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{item.desc}</p>
                </div>
                <button onClick={() => { item.set(!item.val); saveNotifPref(item.key, !item.val) }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${item.val ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${item.val ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
            <p className="text-[11px] text-gray-400 text-center pt-2 font-medium">
              يتم حفظ تفضيلات الإشعارات تلقائياً على جهازك
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
