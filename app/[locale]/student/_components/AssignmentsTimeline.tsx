'use client'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { BookOpen, FileText, Calendar, ChevronLeft, Clock } from 'lucide-react'

const URGENCY: Record<string, { label: string; color: string }> = {
  high:   { label: 'عاجل',  color: '#ef4444' },
  medium: { label: 'قريب',  color: '#f59e0b' },
  low:    { label: 'متاح',  color: '#10b981' },
}

function getUrgency(due?: string | null) {
  if (!due) return 'low'
  const diff = (new Date(due).getTime() - Date.now()) / 86400000
  return diff < 1 ? 'high' : diff < 3 ? 'medium' : 'low'
}

export function AssignmentsTimeline({ assignments, liveCount }: { assignments: any[]; liveCount: number }) {
  return (
    <div className="bg-white dark:bg-[#1e1e2d] border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
        <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> الواجبات والمهام القادمة
          {liveCount > 0 && <span className="text-[9px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">+{liveCount} جديدة</span>}
        </h3>
        <Link href="/student/assignments" className="text-xs text-violet-600 dark:text-violet-400 font-bold flex items-center gap-1 hover:gap-2 transition-all px-3 py-1.5 rounded-full hover:bg-violet-50 dark:hover:bg-violet-500/10">
          عرض الكل <ChevronLeft className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/5 flex-1 overflow-y-auto min-h-[280px]">
        {assignments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-3xl">🎉</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">أنجزت جميع مهامك!</p>
            <p className="text-xs text-gray-500 mt-1">لا توجد واجبات معلقة الآن.</p>
          </div>
        )}
        {assignments.slice(0, 7).map((a: any, i) => {
          const urgency = getUrgency(a.dueDate)
          const { color } = URGENCY[urgency]
          return (
            <motion.div key={a.id || i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-7 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: `${color}10` }}>
                <FileText className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">{a.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium mt-0.5">
                  <BookOpen className="w-3 h-3" /> {a.subject?.name || a.subject}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${color}15`, color }}>
                  {URGENCY[urgency].label}
                </span>
                <p className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  {a.dueDate ? new Date(a.dueDate).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : 'غير محدد'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
