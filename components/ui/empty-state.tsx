'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AlertCircle, FileSearch, Trophy, Inbox, BarChart3, BookOpen } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
    type?: 'default' | 'assignments' | 'grades' | 'leaderboard' | 'error' | 'search' | 'analytics'
    title?: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

const emptyStateConfig = {
    default: {
        icon: Inbox,
        iconColor: 'text-slate-400',
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        title: 'لا توجد بيانات',
        description: 'لم يتم العثور على أي محتوى في الوقت الحالي',
    },
    assignments: {
        icon: BookOpen,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        title: 'لا توجد واجبات',
        description: 'لا توجد واجبات مسندة إليك حالياً. استمتع بوقت الراحة! 🎉',
    },
    grades: {
        icon: Trophy,
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
        title: 'لا توجد درجات بعد',
        description: 'ستظهر درجاتك هنا بعد أن يقوم المعلم بتصحيح واجباتك',
    },
    leaderboard: {
        icon: Trophy,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50 dark:bg-purple-900/20',
        title: 'لوحة المتصدرين فارغة',
        description: 'كن أول من يتصدر القائمة! ابدأ بحل التحديات وكسب النقاط',
    },
    analytics: {
        icon: BarChart3,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        title: 'لا توجد بيانات تحليلية',
        description: 'ستظهر الإحصاءات والتحليلات هنا بعد تراكم البيانات الكافية',
    },
    search: {
        icon: FileSearch,
        iconColor: 'text-slate-400',
        iconBg: 'bg-slate-100 dark:bg-slate-800',
        title: 'لا توجد نتائج',
        description: 'جرب كلمات بحث مختلفة أو قلّل من الفلاتر المطبّقة',
    },
    error: {
        icon: AlertCircle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50 dark:bg-red-900/20',
        title: 'حدث خطأ',
        description: 'تعذّر تحميل البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً',
    },
}

export function EmptyState({
    type = 'default',
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    const config = emptyStateConfig[type]
    const Icon = config.icon
    const displayTitle = title ?? config.title
    const displayDescription = description ?? config.description

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                'flex flex-col items-center justify-center text-center py-16 px-6',
                className
            )}
            dir="rtl"
        >
            {/* Icon */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className={cn(
                    'w-20 h-20 rounded-[24px] flex items-center justify-center mb-6 shadow-sm',
                    config.iconBg
                )}
            >
                <Icon className={cn('w-10 h-10', config.iconColor)} />
            </motion.div>

            {/* Text */}
            <h3 className="text-lg font-bold text-foreground mb-2">{displayTitle}</h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
                {displayDescription}
            </p>

            {/* Action Button */}
            {action && (
                <Button onClick={action.onClick} variant="outline" size="sm">
                    {action.label}
                </Button>
            )}
        </motion.div>
    )
}
