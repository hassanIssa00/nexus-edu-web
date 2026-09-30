'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Trophy, InboxIcon } from 'lucide-react'

export default function ParentGradesPage() {
  const [student, setStudent] = useState<any>(null)
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [childName, setChildName] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        // Get the linked student from logged-in parent account
        const raw = localStorage.getItem('nexus_user')
        let linkedStudentId = ''
        if (raw) {
          const acc = JSON.parse(raw)
          linkedStudentId = acc.linkedStudentId || (acc.linkedStudentIds?.[0] ?? '')
        }

        if (!linkedStudentId) {
          setLoading(false)
          return
        }

        const { nexusBridge } = await import('@/lib/nexusDataBridge')
        const s = nexusBridge.getStudentById(linkedStudentId)
        const certs = nexusBridge.getCertificates(linkedStudentId)
        setStudent(s)
        setCertificates(certs)
        setChildName(s?.fullName || s?.name || '')
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
      </div>
    )
  }

  // No subjects data — grades come from real student records
  const subjects: any[] = student?.grades || []

  return (
    <div className="space-y-8 pb-16" dir="rtl">
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span className="text-xs font-bold text-amber-100">مدارس الإخلاص الأهلية</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">كشف الدرجات والشهادات 🏆</h1>
          {childName && (
            <p className="text-amber-100 text-sm max-w-xl font-medium">
              السجل الأكاديمي للطالب <span className="font-bold underline">{childName}</span> في الفصل الدراسي الحالي
            </p>
          )}
        </div>
      </motion.div>

      {/* NO DATA STATE */}
      {subjects.length === 0 && certificates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <InboxIcon className="w-12 h-12 text-amber-400" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">لا توجد درجات بعد</h3>
          <p className="text-sm text-gray-500 font-medium max-w-xs">
            ستظهر هنا درجات الطالب فور تسجيلها من قِبل المعلم
          </p>
        </motion.div>
      )}

      {/* SUBJECTS TRANSCRIPT — only shown if real data exists */}
      {subjects.length > 0 && (
        <div className="bg-white/80 dark:bg-[#1e1e2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm">
          <h3 className="font-black text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            درجات المواد المقررة
          </h3>
          <div className="space-y-4">
            {subjects.map((sub: any, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-black text-sm text-gray-900 dark:text-white">{sub.subject || sub.name}</h4>
                    {sub.teacher && <p className="text-xs text-gray-400">معلم المادة: {sub.teacher}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-emerald-600">{sub.grade ?? sub.score} / 100</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-black">
                      {sub.grade >= 90 ? 'ممتاز' : sub.grade >= 75 ? 'جيد جداً' : sub.grade >= 60 ? 'جيد' : 'مقبول'}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${sub.grade ?? sub.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATES */}
      {certificates.length > 0 && (
        <div className="bg-white/80 dark:bg-[#1e1e2d]/80 backdrop-blur-xl border border-amber-200/60 dark:border-amber-500/20 rounded-3xl p-6 shadow-sm">
          <h3 className="font-black text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            شهادات التقدير والشرف الصادرة
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((c, i) => (
              <div key={c.id || i} className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-sm">
                  🏆
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">{c.programTitle}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{c.achievementText}</p>
                  <div className="flex items-center justify-between mt-3 text-[11px]">
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">كود: #{c.serialNumber || c.id}</span>
                    <span className="text-gray-400">{new Date(c.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
