'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, CheckCircle, Save, ArrowLeft, Search, Filter, AlertCircle, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock Data
const classes = [
    { id: '10-a', name: 'الصف 10 - أ' },
    { id: '10-b', name: 'الصف 10 - ب' },
    { id: '11-a', name: 'الصف 11 - أ' },
]

const assignments = [
    { id: 'exam-1', name: 'اختبار الفترة الأولى - رياضيات' },
    { id: 'hw-5', name: 'واجب الفصل الثالث' },
    { id: 'project-1', name: 'المشروع الفصلي' },
]

const initialStudents = [
    { id: 1, name: 'أحمد سعيد المولد', status: 'pending', grade: '', participation: '', behavior: '' },
    { id: 2, name: 'سالم عبدالله الشهري', status: 'pending', grade: '', participation: '', behavior: '' },
    { id: 3, name: 'فهد محمد الدوسري', status: 'pending', grade: '', participation: '', behavior: '' },
    { id: 4, name: 'خالد عبدالعزيز الغامدي', status: 'pending', grade: '', participation: '', behavior: '' },
    { id: 5, name: 'عبدالرحمن طارق الزهراني', status: 'pending', grade: '', participation: '', behavior: '' },
    { id: 6, name: 'عمر حسن المالكي', status: 'pending', grade: '', participation: '', behavior: '' },
]

export default function BulkGradingAutomation() {
    const [selectedClass, setSelectedClass] = useState<string>('')
    const [selectedAssignment, setSelectedAssignment] = useState<string>('')
    const [students, setStudents] = useState(initialStudents)
    const [defaultGrade, setDefaultGrade] = useState('10')
    const [defaultParticipation, setDefaultParticipation] = useState('متاز')
    const [defaultBehavior, setDefaultBehavior] = useState('ممتاز')
    const [isSaving, setIsSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    // Bulk action handler
    const applyBulkGrades = () => {
        setStudents(students.map(s => ({
            ...s,
            grade: s.grade || defaultGrade,
            participation: s.participation || defaultParticipation,
            behavior: s.behavior || defaultBehavior,
            status: 'graded'
        })))
    }

    const updateStudent = (id: number, field: string, value: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, [field]: value, status: 'graded' } : s))
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 3000)
        }, 1500)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/teacher/automation">
                    <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">الرصد الجماعي السريع</h1>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1 mr-14">أتمتة رصد الدرجات والمهارات للفصل كاملاً بضغطة زر وتصديرها مباشرة للأنظمة الرسمية.</p>
                </div>
            </div>

            {/* Selection Controls */}
            <Card className="border-border shadow-sm bg-card">
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">الفصل الدراسي</label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-emerald-500">
                                    <SelectValue placeholder="اختر الفصل..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">الاختبار أو الواجب</label>
                            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-emerald-500">
                                    <SelectValue placeholder="اختر الاختبار أو الواجب..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {assignments.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedClass && selectedAssignment && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Automation Toolbar */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">الدرجة الافتراضية:</span>
                                <Input type="number" className="w-20 font-bold bg-background" value={defaultGrade} onChange={(e) => setDefaultGrade(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">المشاركة:</span>
                                <Select value={defaultParticipation} onValueChange={setDefaultParticipation}>
                                    <SelectTrigger className="w-28 bg-background font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ممتاز">ممتاز</SelectItem>
                                        <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                                        <SelectItem value="جيد">جيد</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">السلوك:</span>
                                <Select value={defaultBehavior} onValueChange={setDefaultBehavior}>
                                    <SelectTrigger className="w-28 bg-background font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ممتاز">ممتاز</SelectItem>
                                        <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                                        <SelectItem value="جيد">جيد</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button 
                            onClick={applyBulkGrades}
                            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-10 px-6 rounded-md shrink-0 transition-transform active:scale-95"
                        >
                            <Sparkles className="w-4 h-4 ml-2" />
                            رصد للكل بضغطة
                        </Button>
                    </div>

                    {/* Students List */}
                    <Card className="border-border shadow-sm overflow-hidden bg-card">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-muted-foreground w-12 text-center">#</th>
                                        <th className="p-4 text-sm font-semibold text-muted-foreground">اسم الطالب</th>
                                        <th className="p-4 text-sm font-semibold text-muted-foreground w-32">الدرجة (من 10)</th>
                                        <th className="p-4 text-sm font-semibold text-muted-foreground w-40">المشاركة</th>
                                        <th className="p-4 text-sm font-semibold text-muted-foreground w-40">السلوك</th>
                                        <th className="p-4 text-sm font-semibold text-muted-foreground w-28">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {students.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-muted-foreground text-center text-sm">{index + 1}</td>
                                            <td className="p-4 font-semibold text-foreground flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="text-sm">{student.name}</span>
                                            </td>
                                            <td className="p-4">
                                                <Input 
                                                    type="number" 
                                                    value={student.grade} 
                                                    onChange={(e) => updateStudent(student.id, 'grade', e.target.value)}
                                                    className={`w-full font-bold text-center h-9 ${student.grade ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Select value={student.participation} onValueChange={(v) => updateStudent(student.id, 'participation', v)}>
                                                    <SelectTrigger className={`h-9 ${student.participation ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 font-semibold' : ''}`}>
                                                        <SelectValue placeholder="اختر..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ممتاز">ممتاز</SelectItem>
                                                        <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                                                        <SelectItem value="جيد">جيد</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="p-4">
                                                <Select value={student.behavior} onValueChange={(v) => updateStudent(student.id, 'behavior', v)}>
                                                    <SelectTrigger className={`h-9 ${student.behavior ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 font-semibold' : ''}`}>
                                                        <SelectValue placeholder="اختر..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ممتاز">ممتاز</SelectItem>
                                                        <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                                                        <SelectItem value="جيد">جيد</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="p-4">
                                                {student.status === 'pending' ? (
                                                    <Badge variant="secondary" className="text-muted-foreground border-border font-medium">قيد الانتظار</Badge>
                                                ) : (
                                                    <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 border-none font-medium">تم الرصد ✓</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Floating Save Action */}
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                        <AnimatePresence>
                            {(students.some(s => s.status === 'graded') && !isSaved) && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    className="bg-foreground text-background p-3 pl-4 pr-5 rounded-full shadow-2xl flex items-center gap-5 border border-border"
                                >
                                    <div className="font-semibold text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-emerald-400" />
                                        لديك تغييرات غير محفوظة ({students.filter(s => s.status === 'graded').length} طلاب)
                                    </div>
                                    <Button 
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full h-9 px-6 min-w-[120px]"
                                    >
                                        {isSaving ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 ml-1.5" />
                                                حفظ النظام
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}

                            {isSaved && (
                                <motion.div
                                    initial={{ y: 100, scale: 0.9, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    exit={{ y: 100, scale: 0.9, opacity: 0 }}
                                    className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-semibold border-2 border-emerald-500"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    تم الرصد والحفظ بنجاح!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
