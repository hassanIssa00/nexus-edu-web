'use client'

import { motion } from 'framer-motion'
import { BookOpen, BarChart3, ClipboardCheck, FileCheck, PieChart, ScrollText, Award, FolderOpen, Zap, ArrowLeft, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const automationModules = [
    {
        icon: BookOpen,
        label: 'التحضير الشامل',
        desc: 'تحضير جميع الدروس الأسبوعية بضغطة زر واحدة. يتم ملء الأهداف والاستراتيجيات والأنشطة والواجبات تلقائياً.',
        bg: 'bg-primary',
        href: '/teacher/automation/lesson-prep',
        stats: { total: 24, done: 18 },
        status: 'متاح',
    },
    {
        icon: BarChart3,
        label: 'رصد الدرجات الجماعي',
        desc: 'رصد درجات ومهارات الفصل كامل بضغطة واحدة بدلاً من الرصد طالب بطالب.',
        bg: 'bg-emerald-600',
        href: '/teacher/automation/bulk-grading',
        stats: { total: 120, done: 85 },
        status: 'متاح',
    },
    {
        icon: ClipboardCheck,
        label: 'رصد الحضور بضغطة زر',
        desc: 'تحضير الفصل كامل حاضر ثم تحديد الغائبين فقط. توفير 90% من الوقت.',
        bg: 'bg-violet-600',
        href: '/teacher/automation/attendance',
        stats: { total: 5, done: 3 },
        status: 'متاح',
    },
    {
        icon: FileCheck,
        label: 'تصحيح الواجبات الجماعي',
        desc: 'تصحيح جميع واجبات الفصل دفعة واحدة مع إمكانية تعديل الدرجات الفردية.',
        bg: 'bg-orange-600',
        href: '/teacher/automation/bulk-grading',
        stats: { total: 45, done: 30 },
        status: 'متاح',
    },
    {
        icon: PieChart,
        label: 'تحليل النتائج والتقارير',
        desc: 'تقارير إحصائية فورية مع رسوم بيانية لتوزيع الدرجات ومقارنة الأداء.',
        bg: 'bg-pink-600',
        href: '/teacher/automation/results',
        stats: { total: 8, done: 8 },
        status: 'متاح',
    },
    {
        icon: ScrollText,
        label: 'كشوف المتابعة',
        desc: 'إنشاء كشوف متابعة جاهزة للطباعة مع أسماء الطلاب وأعمدة التقييم.',
        bg: 'bg-teal-600',
        href: '/teacher/automation/results',
        stats: { total: 5, done: 5 },
        status: 'متاح',
    },
    {
        icon: Award,
        label: 'شهادات التقدير',
        desc: 'إنشاء شهادات تقدير وشكر للطلاب المتميزين بتصاميم احترافية جاهزة.',
        bg: 'bg-amber-600',
        href: '/teacher/automation/certificates',
        stats: { total: 15, done: 0 },
        status: 'متاح',
    },
    {
        icon: Zap,
        label: 'محرك القواعد الذكية (IF-THEN)',
        desc: 'أتمتة المهام الشرطية (مثال: إذا غاب الطالب 3 مرات، أرسل إشعاراً لولي الأمر تلقائياً).',
        bg: 'bg-blue-600',
        href: '/teacher/automation/rules',
        stats: { total: 5, done: 0 },
        status: 'متاح',
    },
    {
        icon: FolderOpen,
        label: 'ملف الإنجاز',
        desc: 'ملف إنجاز المعلم جاهز بالشواهد والوثائق — بورتفوليو يدعم التقييم الوظيفي.',
        bg: 'bg-indigo-600',
        href: '/teacher/automation',
        stats: { total: 12, done: 7 },
        status: 'قريباً',
    },
]

export default function AutomationHubPage() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl p-8 text-white relative overflow-hidden shadow-lg"
            >
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">أدوات الأتمتة</h1>
                            <p className="text-amber-50 text-base mt-1 font-medium">بضغطة زر واحدة — وفّر وقتك وركّز على التدريس</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl">
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center border border-white/10">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xl font-bold">85%</span>
                            </div>
                            <p className="text-sm text-amber-50">توفير الوقت</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center border border-white/10">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xl font-bold">156</span>
                            </div>
                            <p className="text-sm text-amber-50">عملية مؤتمتة</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center border border-white/10">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xl font-bold">8</span>
                            </div>
                            <p className="text-sm text-amber-50">أدوات متاحة</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {automationModules.map((mod, i) => (
                    <motion.div
                        key={mod.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="h-full"
                    >
                        <Card className="h-full bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden group flex flex-col">
                            <div className={`h-1.5 w-full ${mod.bg}`}></div>
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-10 h-10 rounded-lg ${mod.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 shadow-sm transition-transform`}>
                                        <mod.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-base font-bold text-foreground leading-tight">{mod.label}</h3>
                                            <Badge variant="secondary" className={mod.status === 'متاح' ? 'bg-primary/10 text-primary hover:bg-primary/20 border-0' : 'bg-muted text-muted-foreground border-0'}>
                                                {mod.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">{mod.desc}</p>
                                
                                <div className="mt-auto space-y-4">
                                    {/* Progress bar */}
                                    <div>
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                                            <span>نسبة الإنجاز</span>
                                            <span>{Math.round((mod.stats.done / mod.stats.total) * 100)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(mod.stats.done / mod.stats.total) * 100}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className={`h-full rounded-full ${mod.bg}`}
                                            />
                                        </div>
                                    </div>

                                    <Link href={mod.href} className="block mt-4">
                                        <Button 
                                            variant={mod.status === 'متاح' ? "default" : "secondary"}
                                            className={`w-full font-medium ${mod.status === 'متاح' ? mod.bg + ' text-white hover:opacity-90 shadow-sm' : ''}`} 
                                            disabled={mod.status !== 'متاح'}
                                        >
                                            {mod.status === 'متاح' ? 'ابدأ الآن' : 'قريباً'}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
