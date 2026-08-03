'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, PlayCircle, Clock, CheckCircle, Sparkles, BrainCircuit, ListChecks, Wand2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { aiApi } from '@/lib/api/ai';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectDetailsPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const [takingQuiz, setTakingQuiz] = useState(false);
    const [summaries, setSummaries] = useState<Record<number, any>>({});
    const [loadingSummary, setLoadingSummary] = useState<number | null>(null);

    const handleStartQuiz = () => {
        setTakingQuiz(true);
        toast({
            title: 'بدء الاختبار',
            description: 'بالتوفيق! لديك 30 دقيقة للإجابة.',
        });
    };

    const handleGenerateSummary = async (lessonId: number) => {
        setLoadingSummary(lessonId);
        try {
            // In real app, lessonId would be a string UUID
            const res = await aiApi.ask(`قم بتلخيص الدرس رقم ${lessonId} بأسلوب تعليمي مبسط مع ذكر أهم النقاط والمفاهيم.`);
            if (res.data.success) {
                setSummaries(prev => ({
                    ...prev,
                    [lessonId]: {
                        text: res.data.data.answer,
                        keyPoints: ["تحليل القوى", "قوانين نيوتن", "التطبيقات العملية"],
                        concepts: ["الكتلة والوزن", "الاحتكاك", "التسارع"]
                    }
                }));
                toast({
                    title: "تم توليد التلخيص الذكي ✨",
                    description: "يمكنك الآن مراجعة أهم نقاط الدرس بسرعة.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "خطأ",
                description: "فشل المساعد في توليد التلخيص حالياً.",
            });
        } finally {
            setLoadingSummary(null);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            {/* Header Section - Premium Design */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-600 to-indigo-700 p-10 rounded-[2rem] shadow-2xl text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-right">
                        <Badge className="bg-white/20 text-white border-none px-4 py-1 rounded-full mb-4 backdrop-blur-md">
                            الفصل الدراسي الأول
                        </Badge>
                        <h1 className="text-5xl font-black mb-4 tracking-tight">الرياضيات</h1>
                        <p className="text-primary-100 text-xl font-medium opacity-90">الصف الثالث الابتدائي • أ. أحمد علي</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 flex flex-col items-center">
                        <div className="text-6xl font-black mb-1">92%</div>
                        <div className="text-primary-50 text-sm font-bold uppercase tracking-wider">المعدل الحالي</div>
                        <div className="mt-4 flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-6 bg-white/30 rounded-full overflow-hidden"><div className="w-full bg-white rounded-full" style={{ height: i <= 4 ? '100%' : '60%' }}></div></div>)}
                        </div>
                    </div>
                </div>
            </motion.div>

            <Tabs defaultValue="lessons" className="w-full">
                <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-full max-w-md mx-auto grid grid-cols-3">
                    <TabsTrigger value="lessons" className="rounded-xl font-bold py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 shadow-sm transition-all">الدروس</TabsTrigger>
                    <TabsTrigger value="assignments" className="rounded-xl font-bold py-3 transition-all">الواجبات</TabsTrigger>
                    <TabsTrigger value="quizzes" className="rounded-xl font-bold py-3 transition-all">الاختبارات</TabsTrigger>
                </TabsList>

                {/* Lessons Tab */}
                <TabsContent value="lessons" className="mt-10 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {lessons.map((lesson, idx) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group bg-white/70 backdrop-blur-sm">
                                    <CardContent className="p-0">
                                        <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="p-5 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                                                        <PlayCircle className="w-8 h-8" />
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-4 border-white">
                                                        <CheckCircle className="w-3 h-3" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-gray-900 mb-1">{lesson.title}</h3>
                                                    <div className="flex items-center gap-3 text-gray-500 font-bold">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{lesson.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl px-6 h-12 font-bold flex gap-2 border-none shadow-sm"
                                                    onClick={() => handleGenerateSummary(lesson.id)}
                                                    disabled={loadingSummary === lesson.id}
                                                >
                                                    {loadingSummary === lesson.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Sparkles className="w-5 h-5" />
                                                    )}
                                                    {summaries[lesson.id] ? "تحديث التلخيص" : "تلخيص ذكي"}
                                                </Button>
                                                <Button variant="default" className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-8 h-12 font-black shadow-lg shadow-primary-100">مشاهدة</Button>
                                            </div>
                                        </div>

                                        {/* AI Summary Section */}
                                        <AnimatePresence>
                                            {summaries[lesson.id] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-indigo-50 bg-gradient-to-b from-indigo-50/30 to-white p-8 md:p-10"
                                                >
                                                    <div className="flex items-start gap-3 mb-6">
                                                        <div className="p-2 bg-primary-600 rounded-lg text-white">
                                                            <BrainCircuit className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black text-indigo-900">تلخيص NEXUS الذكي</h4>
                                                            <p className="text-sm text-gray-500">تم توليد هذا التلخيص آلياً لمساعدتك على المراجعة</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100/50">
                                                            <h5 className="font-bold text-lg mb-4 text-indigo-700 flex items-center gap-2">
                                                                <ListChecks className="w-5 h-5" />
                                                                النقاط الرئيسية
                                                            </h5>
                                                            <ul className="space-y-3">
                                                                {summaries[lesson.id].keyPoints.map((p: string, i: number) => (
                                                                    <li key={i} className="flex items-center gap-3 text-gray-700">
                                                                        <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                                                        {p}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100/50">
                                                            <h5 className="font-bold text-lg mb-4 text-primary-700 flex items-center gap-2">
                                                                <span className="w-5 h-5 inline-flex items-center justify-center font-black">?</span>
                                                                مفاهيم هامة
                                                            </h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {summaries[lesson.id].concepts.map((c: string, i: number) => (
                                                                    <Badge key={i} className="bg-primary-50 text-primary-700 border-none px-4 py-2 text-sm font-bold rounded-xl mt-1">
                                                                        {c}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-8 p-6 bg-primary-600 text-white rounded-3xl relative overflow-hidden">
                                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                                                            <p className="text-lg font-bold">هل أنت مستعد لاختبار معلوماتك؟</p>
                                                            <Button className="bg-white text-primary-700 hover:bg-primary-50 font-black px-10 h-12 rounded-xl border-none">ابدأ اختبار سريع الآن</Button>
                                                        </div>
                                                        <Sparkles className="absolute -top-6 -right-6 w-32 h-32 opacity-10 pointer-events-none" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Assignments Tab */}
                <TabsContent value="assignments" className="mt-10 space-y-6">
                    {assignments.map((assignment) => (
                        <Card key={assignment.id} className="border-none shadow-lg rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="p-5 bg-orange-50 rounded-2xl text-orange-600">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">{assignment.title}</h3>
                                        <p className="text-sm text-gray-500 font-bold mt-1">الموعد النهائي: {assignment.dueDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={cn(
                                        "px-6 py-2 rounded-xl text-sm font-black border-none",
                                        assignment.status === 'completed' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                    )}>
                                        {assignment.status === 'completed' ? 'تم التسليم' : 'قيد الانتظار'}
                                    </Badge>
                                    <Button variant="outline" className="rounded-xl font-bold h-12 px-6">تفاصيل الواجب</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="mt-10 space-y-6">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="border-none shadow-lg rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8 flex items-center justify-between font-bold">
                                <div className="flex items-center gap-6">
                                    <div className="p-5 bg-purple-50 rounded-2xl text-purple-600">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">{quiz.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">{quiz.questions} سؤال</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>{quiz.time} دقيقة</span>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={handleStartQuiz} disabled={takingQuiz} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-14 px-10 text-lg font-black shadow-lg shadow-purple-100">
                                    {takingQuiz ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري الاختبار...
                                        </div>
                                    ) : 'بدء الاختبار الآن'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

const lessons = [
    { id: 1, title: 'القسمة والضرب', duration: '45 دقيقة' },
    { id: 2, title: 'الكسور الاعتيادية', duration: '50 دقيقة' },
    { id: 3, title: 'الهندسة والقياس', duration: '60 دقيقة' },
];

const assignments = [
    { id: 1, title: 'واجب القسمة المطولة', dueDate: '2024-12-10', status: 'pending' },
    { id: 2, title: 'حل مسائل الكسور', dueDate: '2024-12-15', status: 'pending' },
];

const quizzes = [
    { id: 1, title: 'اختبار دوري - الوحدة الأولى', questions: 10, time: 15 },
    { id: 2, title: 'اختبار منتصف الفصل الدراسي', questions: 25, time: 45 },
];
