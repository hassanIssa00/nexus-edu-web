'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Target, Clock, Zap, CheckCircle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DailyChallengeProps {
    title?: string
    description?: string
    xpReward?: number
    expiresAt?: Date
    isCompleted?: boolean
    onAccept?: () => void
    className?: string
}

function useCountdown(target: Date) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const calc = () => {
            const now = new Date().getTime()
            const diff = target.getTime() - now
            if (diff <= 0) return
            setTimeLeft({
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            })
        }
        calc()
        const interval = setInterval(calc, 1000)
        return () => clearInterval(interval)
    }, [target])

    return timeLeft
}

export function DailyChallengeCard({
    title = 'حل 5 أسئلة في الرياضيات',
    description = 'أكمل 5 أسئلة من مجموعة التحديات اليومية في الجبر والهندسة لكسب نقاط XP مضاعفة!',
    xpReward = 150,
    expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000),
    isCompleted = false,
    onAccept,
    className = ''
}: DailyChallengeProps) {
    const timeLeft = useCountdown(expiresAt)
    const [justCompleted, setJustCompleted] = useState(false)

    const handleAccept = () => {
        onAccept?.()
    }

    return (
        <div className={`relative overflow-hidden rounded-[20px] ${className}`}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />

            {/* Animated background orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                            <Target className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs font-medium">تحدي اليوم</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-yellow-300 text-sm"
                                >
                                    ⚡
                                </motion.span>
                                <span className="text-yellow-300 font-bold text-sm">+{xpReward} XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-white/80" />
                        <span className="text-white text-xs font-mono font-bold">
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg mb-2 leading-tight">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-5">{description}</p>

                {/* Action */}
                <AnimatePresence mode="wait">
                    {isCompleted ? (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-2 bg-white/20 rounded-xl py-3 border border-white/30"
                        >
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span className="text-white font-bold">تم الإنجاز! 🎉</span>
                        </motion.div>
                    ) : (
                        <motion.div key="action">
                            <Button
                                onClick={handleAccept}
                                className="w-full bg-white text-indigo-700 hover:bg-white/90 font-bold h-11 rounded-xl shadow-lg"
                            >
                                <Zap className="w-4 h-4 ml-2 fill-yellow-400 text-yellow-400" />
                                ابدأ التحدي الآن
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
