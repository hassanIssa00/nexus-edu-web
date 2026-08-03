'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Download, ArrowLeft, TrendingUp, TrendingDown, Award, AlertTriangle, Users, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock Data
const exams = [
    { id: 'math-mid', name: 'اختبار نصف الفصل - رياضيات' },
    { id: 'physics-mid', name: 'اختبار نصف الفصل - فيزياء' },
]

export default function ResultsAnalysis() {
    const [selectedExam, setSelectedExam] = useState<string>('')
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => setIsExporting(false), 2000)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/teacher/automation">
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                                <PieChart className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">التحليل الذكي للنتائج</h1>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1 mr-14">تقارير إحصائية فورية ومقارنات مع الاختبارات السابقة.</p>
                    </div>
                </div>
                {selectedExam && (
                    <Button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-lg h-10 px-6 shadow-sm shrink-0"
                    >
                        {isExporting ? (
                            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Download className="w-4 h-4 ml-2" />
                                تصدير كـ PDF
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Selection Controls */}
            <Card className="border-border shadow-sm bg-card">
                <CardContent className="p-6">
                    <div className="space-y-2 max-w-md">
                        <label className="text-sm font-semibold text-foreground">الاختبار أو التقييم</label>
                        <Select value={selectedExam} onValueChange={setSelectedExam}>
                            <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-pink-500">
                                <SelectValue placeholder="اختر الاختبار لتحليل نتائجه..." />
                            </SelectTrigger>
                            <SelectContent>
                                {exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedExam && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-border shadow-sm bg-card">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">+5.2%</Badge>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-semibold mb-1">متوسط الدرجات</h3>
                                <p className="text-3xl font-bold text-foreground">84.5%</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border shadow-sm bg-card">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-semibold mb-1">نسبة النجاح</h3>
                                <p className="text-3xl font-bold text-foreground">92%</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border shadow-sm bg-card relative overflow-hidden flex flex-col justify-end">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <CardContent className="p-5 relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                        <Award className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-semibold mb-1">المتفوقون (امتياز)</h3>
                                <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">12</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border shadow-sm bg-card relative overflow-hidden flex flex-col justify-end">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <CardContent className="p-5 relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-semibold mb-1">يحتاجون دعم (رسوب)</h3>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-500">4</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Grade Distribution Chart (Mock) */}
                        <Card className="border-border shadow-md bg-card">
                            <CardHeader className="p-5 border-b border-border">
                                <CardTitle className="text-base font-bold">توزيع الدرجات</CardTitle>
                                <CardDescription className="text-xs">عدد الطلاب في كل فئة تقييم</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-end gap-2 h-64 pt-6 p-5">
                                {[
                                    { max: 'A+', count: 8, color: 'bg-emerald-500 hover:bg-emerald-400', h: 'h-[95%]' },
                                    { max: 'A', count: 12, color: 'bg-emerald-400 hover:bg-emerald-300', h: 'h-4/5' },
                                    { max: 'B+', count: 15, color: 'bg-blue-500 hover:bg-blue-400', h: 'h-[90%]' },
                                    { max: 'B', count: 10, color: 'bg-blue-400 hover:bg-blue-300', h: 'h-[70%]' },
                                    { max: 'C', count: 5, color: 'bg-amber-500 hover:bg-amber-400', h: 'h-[40%]' },
                                    { max: 'D', count: 2, color: 'bg-orange-500 hover:bg-orange-400', h: 'h-[20%]' },
                                    { max: 'F', count: 1, color: 'bg-red-500 hover:bg-red-400', h: 'h-[10%]' },
                                ].map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                                        <span className="text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{bar.count}</span>
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: '100%' }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className={`w-full rounded-t-md transition-colors ${bar.color} ${bar.h}`} 
                                        />
                                        <span className="text-xs font-bold text-foreground">{bar.max}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Top Performers */}
                        <Card className="border-border shadow-md bg-card flex flex-col">
                            <CardHeader className="p-5 border-b border-border">
                                <CardTitle className="text-base font-bold">أفضل الطلاب أداءً</CardTitle>
                                <CardDescription className="text-xs">الحاصلون على أعلى الدرجات في هذا الاختبار</CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                                <div className="space-y-3 flex-1">
                                    {[
                                        { name: 'أحمد سعيد المولد', score: 100 },
                                        { name: 'يوسف جمال العتيبي', score: 98 },
                                        { name: 'سالم عبدالله الشهري', score: 97 },
                                        { name: 'فهد محمد الدوسري', score: 95 },
                                    ].map((student, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-transparent hover:border-border transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-amber-200 dark:border-amber-800">
                                                    {i + 1}
                                                </div>
                                                <span className="font-semibold text-sm text-foreground">{student.name}</span>
                                            </div>
                                            <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 font-bold px-2">{student.score}%</Badge>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4 font-semibold text-muted-foreground border-dashed border-border rounded-lg h-10 hover:text-foreground hover:bg-muted/50">
                                    توليد شهادات تفوق
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
