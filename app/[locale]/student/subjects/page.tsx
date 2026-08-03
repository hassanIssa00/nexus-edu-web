'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { BookOpen, Clock, User, Loader2, AlertCircle, Hash } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { motion } from 'framer-motion';

interface Subject {
    id: string;
    name: string;
    code?: string;
    className?: string;
    teacher?: { name?: string; email?: string };
    _count?: { lessons: number; assignments: number };
}

const SUBJECT_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-violet-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-sky-600',
];

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.get('/subjects/my')
            .then(res => setSubjects(res.data?.data || res.data || []))
            .catch(() => setError('تعذر تحميل المواد الدراسية'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center" dir="rtl">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">📚 المواد الدراسية</h1>
                    <p className="text-muted-foreground mt-1">جميع موادك الدراسية في الفصل الحالي</p>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    {subjects.length} مادة
                </Badge>
            </div>

            {subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <BookOpen className="w-16 h-16 text-muted-foreground/40" />
                    <p className="text-muted-foreground text-lg">لا توجد مواد دراسية مسجلة بعد</p>
                    <p className="text-sm text-muted-foreground">تواصل مع الإدارة لتسجيلك في الفصل</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, index) => (
                        <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                        >
                            <Link href={`/student/content?subjectId=${subject.id}`}>
                                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full group">
                                    {/* Color Header */}
                                    <div className={`h-2 bg-gradient-to-r ${SUBJECT_COLORS[index % SUBJECT_COLORS.length]}`} />

                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                                    {subject.name}
                                                </CardTitle>
                                                {subject.className && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        📋 {subject.className}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${SUBJECT_COLORS[index % SUBJECT_COLORS.length]} flex items-center justify-center flex-shrink-0 shadow`}>
                                                <BookOpen className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        {subject.teacher && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{subject.teacher.name || subject.teacher.email}</span>
                                            </div>
                                        )}

                                        {subject.code && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Hash className="h-4 w-4 flex-shrink-0" />
                                                <span>{subject.code}</span>
                                            </div>
                                        )}

                                        {subject._count && (
                                            <div className="flex gap-3 pt-2 border-t">
                                                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                                                    📖 {subject._count.lessons} درس
                                                </span>
                                                <span className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                                                    📝 {subject._count.assignments} واجب
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-1">
                                            <Badge variant="default" className="text-xs">نشط</Badge>
                                            <span className="text-xs font-medium text-primary group-hover:underline">
                                                عرض المحتوى ←
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
