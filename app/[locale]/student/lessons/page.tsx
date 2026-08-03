'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { lessonService, Lesson } from '@/lib/services/lesson.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, FileText, Paperclip, X, Brain, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function StudentLessonsPage() {
    const t = useTranslations('teacher');
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const data = await lessonService.getAll();
            setLessons(data);
        } catch (error) {
            console.error('Failed to fetch lessons', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">
                    {t('lessons')}
                </h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        جاري التحميل...
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16">
                            <BookOpen className="w-12 h-12 text-text-muted mb-4" />
                            <p className="text-text-secondary">{t('noLessons')}</p>
                        </div>
                    ) : (
                        lessons.map((lesson, index) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <Card
                                    className="cursor-pointer group hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => setSelectedLesson(lesson)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-lg group-hover:text-primary-500 transition-colors">
                                                {lesson.title}
                                            </CardTitle>
                                            <span className="badge-nexus text-[10px] whitespace-nowrap">
                                                {lesson.subject?.name}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {lesson.content && (
                                            <p className="text-sm text-text-secondary mb-4 line-clamp-3 leading-relaxed">
                                                {lesson.content}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                                            {lesson.videoUrl && (
                                                <div className="flex items-center gap-1">
                                                    <Play className="w-3 h-3 text-primary-500" />
                                                    <span>فيديو</span>
                                                </div>
                                            )}
                                            {lesson.attachments && lesson.attachments.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Paperclip className="w-3 h-3 text-secondary-400" />
                                                    <span>{lesson.attachments.length} ملفات</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4 border-t border-nexus-border">
                                            <Button
                                                size="sm"
                                                className="flex-1 h-9 text-xs"
                                                onClick={(e) => { e.stopPropagation(); setSelectedLesson(lesson); }}
                                            >
                                                <Play className="w-3 h-3 ml-1" />
                                                مشاهدة
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-9 text-xs"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Brain className="w-3 h-3 ml-1" />
                                                ملخص AI
                                            </Button>
                                        </div>

                                        <div className="mt-3 text-xs text-text-muted">
                                            {lesson.author?.name || lesson.author?.email}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* ═══ Lesson Detail Modal ═══ */}
            {selectedLesson && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedLesson(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-nexus-card border border-nexus-border rounded-[16px] p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {selectedLesson.title}
                                </h2>
                                <span className="badge-nexus">{selectedLesson.subject?.name}</span>
                            </div>
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="w-8 h-8 rounded-[8px] bg-nexus-bg border border-nexus-border flex items-center justify-center text-text-muted hover:text-white hover:border-primary-500/50 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Video Player Area */}
                        {selectedLesson.videoUrl && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
                                    <Play className="w-4 h-4 text-primary-500" />
                                    الفيديو التعليمي
                                </h3>
                                <div className="relative rounded-[12px] overflow-hidden bg-nexus-bg border border-nexus-border aspect-video flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto rounded-full nexus-gradient flex items-center justify-center mb-3">
                                            <Play className="w-7 h-7 text-white ml-1" />
                                        </div>
                                        <a
                                            href={selectedLesson.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors"
                                        >
                                            فتح الفيديو
                                        </a>
                                    </div>
                                </div>

                                {/* Progress Tracking */}
                                <div className="mt-3 p-3 bg-nexus-bg rounded-[12px] border border-nexus-border">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-text-secondary flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            تقدم المشاهدة
                                        </span>
                                        <span className="text-primary-500 font-semibold">0%</span>
                                    </div>
                                    <div className="h-1.5 bg-nexus-border rounded-full overflow-hidden">
                                        <div className="h-full nexus-gradient rounded-full w-0"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content / Notes */}
                        {selectedLesson.content && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-secondary-400" />
                                    محتوى الدرس
                                </h3>
                                <div className="p-4 bg-nexus-bg rounded-[12px] border border-nexus-border">
                                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                                        {selectedLesson.content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* AI Summary Section */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-primary-500" />
                                ملخص الذكاء الاصطناعي
                            </h3>
                            <div className="relative p-4 rounded-[12px] overflow-hidden">
                                <div className="absolute inset-0 nexus-gradient opacity-10"></div>
                                <div className="relative z-10 border border-primary-500/20 rounded-[12px] p-4">
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        اضغط لتوليد ملخص ذكي لمحتوى هذا الدرس باستخدام الذكاء الاصطناعي.
                                    </p>
                                    <Button size="sm" className="mt-3">
                                        <Brain className="w-3 h-3 ml-1" />
                                        توليد الملخص
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {selectedLesson.attachments && selectedLesson.attachments.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-yellow-400" />
                                    المرفقات
                                </h3>
                                <div className="space-y-2">
                                    {selectedLesson.attachments.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-nexus-bg rounded-[12px] border border-nexus-border hover:border-primary-500/30 transition-all group"
                                        >
                                            <FileText className="w-4 h-4 text-text-muted group-hover:text-primary-500 transition-colors" />
                                            <span className="text-sm text-text-secondary group-hover:text-primary-500 transition-colors">
                                                {url.split('/').pop()}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Teacher info */}
                        <div className="pt-4 border-t border-nexus-border text-sm text-text-muted">
                            المعلم: {selectedLesson.author?.name || selectedLesson.author?.email}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
