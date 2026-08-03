'use client'
import { motion } from 'framer-motion'

export function StatChip({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
      className="flex flex-col gap-3 bg-white/80 dark:bg-[#1e1e2d]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group cursor-default">
      <div className="absolute -top-6 -left-6 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl rounded-full" style={{ backgroundColor: color }} />
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="font-black text-2xl tracking-tight text-gray-900 dark:text-white leading-none mt-0.5">{value}</p>
          {sub && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sub}</p>}
        </div>
      </div>
    </motion.div>
  )
}
