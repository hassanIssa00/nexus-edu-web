'use client'
import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, Star, Award, TrendingUp, Shield, BookOpen } from 'lucide-react'

const ACHIEVEMENTS = [
  { icon: Flame, label: 'ملتزم', desc: 'حضرت 7 أيام متواصلة', color: '#f97316', unlocked: true },
  { icon: Trophy, label: 'متميز', desc: 'حصلت على معدل 90%+', color: '#f59e0b', unlocked: true },
  { icon: Star, label: 'نجم الفصل', desc: 'أفضل طالب هذا الشهر', color: '#8b5cf6', unlocked: true },
  { icon: Zap, label: 'سريع الإنجاز', desc: 'سلّمت 10 واجبات قبل موعدها', color: '#06b6d4', unlocked: false },
  { icon: Shield, label: 'المحارب', desc: 'أكملت 30 تحدياً ذكياً', color: '#10b981', unlocked: false },
  { icon: BookOpen, label: 'قارئ نهم', desc: 'أكملت 5 كتب في المكتبة', color: '#ec4899', unlocked: false },
]

export function AchievementsShowcase({ count }: { count: number }) {
  return (
    <div className="bg-white dark:bg-[#1e1e2d] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">أوسمة الإنجاز</h3>
            <p className="text-[10px] text-gray-500">{count} وسام مفتوح</p>
          </div>
        </div>
        <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full font-bold">
          {Math.round((count / ACHIEVEMENTS.length) * 100)}% مكتمل
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={a.unlocked ? { scale: 1.08, y: -2 } : {}}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center transition-all relative overflow-hidden ${a.unlocked ? 'cursor-pointer' : 'opacity-40 grayscale'}`}
            style={a.unlocked ? { backgroundColor: `${a.color}10`, border: `1px solid ${a.color}25` } : { backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
            {a.unlocked && <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]" />}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={a.unlocked ? { backgroundColor: `${a.color}20` } : { backgroundColor: '#e5e7eb' }}>
              <a.icon className="w-4 h-4" style={{ color: a.unlocked ? a.color : '#9ca3af' }} />
            </div>
            <p className="text-[10px] font-black text-gray-900 dark:text-white leading-tight">{a.label}</p>
            <p className="text-[9px] text-gray-400 leading-tight hidden group-hover:block">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
