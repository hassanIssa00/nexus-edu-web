'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, BookOpen, Calendar, CheckCircle, ChevronDown, Wand2, ArrowLeft, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock Data
const subjects = [
    { id: 'math-10', name: 'الرياضيات - الصف 10' },
    { id: 'physics-11', name: 'الفيزياء - الصف 11' },
    { id: 'math-11', name: 'الرياضيات - الصف 11' },
]

const weeks = [
    { id: 'w1', name: 'الأسبوع الأول (1 - 5 سبتمبر)' },
    { id: 'w2', name: 'الأسبوع الثاني (8 - 12 سبتمبر)' },
    { id: 'w3', name: 'الأسبوع الثالث (15 - 19 سبتمبر)' },
]

const upcomingLessons = [
    { id: 1, title: 'المعادلات الخطية', date: 'الأحد، 8 سبتمبر', time: '08:00 ص', status: 'pending' },
    { id: 2, title: 'المعادلات التربيعية', date: 'الاثنين، 9 سبتمبر', time: '09:30 ص', status: 'pending' },
    { id: 3, title: 'تطبيقات على المعادلات', date: 'الثلاثاء، 10 سبتمبر', time: '11:00 ص', status: 'pending' },
    { id: 4, title: 'المتباينات', date: 'الأربعاء، 11 سبتمبر', time: '08:00 ص', status: 'pending' },
    { id: 5, title: 'مراجعة أسبوعية', date: 'الخميس، 12 سبتمبر', time: '12:30 م', status: 'pending' },
]

const mockPreparedData = {
    objectives: 'أن يفهم الطالب المفهوم الأساسي ويطبقه في حل المسائل الحياتية. التعرف على خصائص المعادلات وأنواعها المختلفة.',
    strategies: 'التعلم التعاوني، العصف الذهني، الاستنتاج، التعلم باللعب',
    activities: 'حل ورقة العمل رقم 3، مناقشة جماعية للأمثلة في الكتاب المدرسي ص 45',
    homework: 'حل التمارين من 1 إلى 5 صفحة 48 في الكتاب المدرسي'
}

export default function LessonPrepAutomation() {
    const [selectedSubject, setSelectedSubject] = useState<string>('')
    const [selectedWeek, setSelectedWeek] = useState<string>('')
    const [isPreparing, setIsPreparing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isPrepared, setIsPrepared] = useState(false)
    const [expandedLesson, setExpandedLesson] = useState<number | null>(null)

    const handleBulkPrepare = () => {
        setIsPreparing(true)
        setProgress(0)

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsPreparing(false)
                    setIsPrepared(true)
                    return 100
                }
                return prev + 25
            })
        }, 500)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/teacher/automation">
                    <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">التحضير الشامل</h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1 mr-14">حضّر دروس الأسبوع كاملة بضغطة زر واحدة باستخدام الذكاء الاصطناعي.</p>
                </div>
            </div>

            {/* Selection Controls */}
            <Card className="border-border shadow-sm bg-card">
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">المادة الدراسية والفصل</label>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-primary">
                                    <SelectValue placeholder="اختر المادة والفصل..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">الأسبوع الدراسي</label>
                            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-primary">
                                    <SelectValue placeholder="اختر الأسبوع..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {weeks.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Magic Button Section */}
            {selectedSubject && selectedWeek && !isPrepared && !isPreparing && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center p-10 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Wand2 className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">جاهز لتحضير {upcomingLessons.length} دروس؟</h2>
                    <p className="text-muted-foreground text-sm mb-8 max-w-md text-center">سيقوم النظام بتوليد الأهداف، الاستراتيجيات، الأنشطة، والواجبات تلقائياً بما يتوافق مع خطة توزيع المنهج.</p>
                    
                    <Button 
                        onClick={handleBulkPrepare}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base h-12 px-8 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Zap className="mr-2 h-5 w-5" />
                        تحضير الكل بضغطة زر
                    </Button>
                </motion.div>
            )}

            {/* Loading/Progress State */}
            {isPreparing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 bg-card rounded-2xl border border-border shadow-md text-center"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <Zap className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">جاري أتمتة التحضير...</h3>
                    <p className="text-muted-foreground text-sm mb-6">يتم الآن إنشاء محتوى تفاعلي وملائم لكل درس</p>
                    
                    <div className="w-full max-w-md mx-auto h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="mt-4 font-bold text-primary text-sm">{progress}%</p>
                </motion.div>
            )}

            {/* Results Display */}
            {isPrepared && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900/50 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 flex items-center justify-center rounded-full flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-green-900 dark:text-green-300">تم تحضير {upcomingLessons.length} دروس بنجاح!</h3>
                                <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">جميع الدروس الآن جاهزة ومربوطة في سجلاتك.</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 font-medium whitespace-nowrap" onClick={() => {setIsPrepared(false); setIsPreparing(false)}}>
                            إلغاء التحضير
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            دروس الأسبوع المجدولة
                        </h3>
                        
                        {upcomingLessons.map((lesson) => (
                            <Card 
                                key={lesson.id} 
                                className={`border ${expandedLesson === lesson.id ? 'border-primary shadow-sm' : 'border-border shadow-sm'} transition-all duration-200 overflow-hidden`}
                            >
                                <div 
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                                    onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                                            <span className="font-bold text-sm text-primary">{lesson.id}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground text-base">{lesson.title}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {lesson.date}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 border-0 hidden sm:inline-flex">تم التحضير ✔</Badge>
                                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedLesson === lesson.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                                
                                {expandedLesson === lesson.id && (
                                    <div className="bg-muted/30 p-5 border-t border-border">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-foreground">الأهداف السلوكية</label>
                                                <textarea className="w-full h-24 p-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none resize-none text-sm text-muted-foreground leading-relaxed" defaultValue={mockPreparedData.objectives} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-foreground">استراتيجيات التدريس</label>
                                                <textarea className="w-full h-24 p-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none resize-none text-sm text-muted-foreground leading-relaxed" defaultValue={mockPreparedData.strategies} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-foreground">الأنشطة الصفية</label>
                                                <textarea className="w-full h-24 p-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none resize-none text-sm text-muted-foreground leading-relaxed" defaultValue={mockPreparedData.activities} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-foreground">الواجبات والتقييمات</label>
                                                <textarea className="w-full h-24 p-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none resize-none text-sm text-muted-foreground leading-relaxed" defaultValue={mockPreparedData.homework} />
                                            </div>
                                        </div>
                                        <div className="mt-5 flex justify-end gap-2 text-sm">
                                            <Button variant="outline" size="sm" className="font-medium">إلغاء</Button>
                                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">حفظ التعديلات</Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
