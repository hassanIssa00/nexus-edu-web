'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface QuickStatItemProps {
    icon: ReactNode
    label: string
    value: string | number
    color?: string
    highlight?: boolean
}

export function QuickStatsRow({ items }: { items: QuickStatItemProps[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                    className={`relative overflow-hidden rounded-[16px] p-4 border ${item.highlight
                        ? 'bg-gradient-to-br from-primary-500 to-secondary-500 border-transparent text-white shadow-lg'
                        : 'bg-white border-slate-200 hover:border-primary-200 hover:shadow-md transition-all'
                        }`}
                >
                    {item.highlight && (
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '16px 16px'
                            }}
                        />
                    )}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.highlight ? 'bg-white/20' : 'bg-slate-100'}`}>
                            <span className="text-lg">{item.icon}</span>
                        </div>
                        <div>
                            <p className={`font-black text-xl leading-none ${item.highlight ? 'text-white' : 'text-slate-900'}`}>
                                {item.value}
                            </p>
                            <p className={`text-xs mt-0.5 font-medium ${item.highlight ? 'text-white/70' : 'text-slate-500'}`}>
                                {item.label}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
