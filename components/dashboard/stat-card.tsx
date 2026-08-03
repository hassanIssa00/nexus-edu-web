'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning'
    href?: string
}

function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        const duration = 1500
        const start = performance.now()
        const startVal = 0

        function step(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.round(startVal + (value - startVal) * eased))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [value])

    return <>{displayValue.toLocaleString()}</>
}

export function StatCard({ title, value, icon: Icon, trend, color = 'primary', href }: StatCardProps) {
    const colorClasses = {
        primary: 'bg-primary-100 text-primary-500 dark:bg-primary-900',
        secondary: 'bg-secondary-100 text-secondary-500 dark:bg-secondary-900',
        accent: 'bg-accent-100 text-accent-500 dark:bg-accent-900',
        success: 'bg-green-100 text-green-500 dark:bg-green-900',
        warning: 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900',
    }

    const gradientClasses = {
        primary: 'from-primary-500/5 to-primary-500/0',
        secondary: 'from-secondary-500/5 to-secondary-500/0',
        accent: 'from-accent-500/5 to-accent-500/0',
        success: 'from-green-500/5 to-green-500/0',
        warning: 'from-yellow-500/5 to-yellow-500/0',
    }

    const isNumeric = typeof value === 'number'

    const cardContent = (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Card className={`overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${gradientClasses[color]}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </CardTitle>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]} shadow-sm`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-black">
                        {isNumeric ? <AnimatedNumber value={value} /> : value}
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}%
                            </span>
                            <span className="text-xs text-gray-400">من الشهر الماضي</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )

    if (href) {
        return <Link href={href}>{cardContent}</Link>
    }

    return cardContent
}
