'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { lessonService, Lesson, CreateLessonDto } from '@/lib/services/lesson.service';
import { subjectService } from '@/lib/services/subject.service';
import { UploadResponse } from '@/lib/services/upload.service';
import FileUpload from '@/components/FileUpload';
import {
  BookOpen, Plus, Search, Video, FileText, Trash2, Edit3,
  ExternalLink, Sparkles, CheckCircle2, Filter, Layers, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Subject {
  id: string;
  name: string;
  code?: string;
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-arabic', name: 'لغتي العربية' },
  { id: 'sub-quran', name: 'القرآن الكريم والدراسات الإسلامية' },
  { id: 'sub-math', name: 'الرياضيات' },
  { id: 'sub-science', name: 'العلوم' },
  { id: 'sub-english', name: 'اللغة الإنجليزية' },
];

const DEFAULT_LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'مهارات قراءة الحروف الهجائية بالحركات الثلاث والمدود',
    content: 'شرح تفاعلي للحروف الهجائية، أصوات الحركات القصيرة (الفتحة والضمة والكسرة) مقابل المدود الطويلة (الألف والواو والياء) مع أمثلة تطبيقية وأنشطة تدريبية.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    subjectId: 'sub-arabic',
    subject: { id: 'sub-arabic', name: 'لغتي العربية' },
    attachments: ['/docs/arabic_alphabets_worksheet.pdf'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'les-2',
    title: 'سورة الفاتحة — التلاوة العطرة ومفاهيم الآيات',
    content: 'تلاوة سورة الفاتحة وترديدها بصوت نقي، شرح معاني الاستعانة والحمد، وتطبيق أحكام النون الساكنة والتنوين المبسطة في جو إيماني هادف.',
    videoUrl: '',
    subjectId: 'sub-quran',
    subject: { id: 'sub-quran', name: 'القرآن الكريم والدراسات الإسلامية' },
    attachments: ['/audio/fatiha_recitation.mp3'],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'les-3',
    title: 'الجمع باستخدام خط الأعداد والمسائل المصورة',
    content: 'تمثيل عمليات الجمع البسيطة حتى 20 باستخدام خط الأعداد، ومسائل لفظية مبسطة من واقع الحياة اليومية لتنمية مهارات التفكير الرياضي لدى الطلاب.',
    videoUrl: '',
    subjectId: 'sub-math',
    subject: { id: 'sub-math', name: 'الرياضيات' },
    attachments: ['/docs/math_addition_grid.pdf'],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'les-4',
    title: 'أجزاء النبات ودورة حياة البذرة',
    content: 'استكشاف الجذور والساق والأوراق، والتعرف على احتياجات النبات الأساسية (الماء، الهواء، ضوء الشمس، التربة) عبر تجربة عملية صفية تفاعلية.',
    videoUrl: '',
    subjectId: 'sub-science',
    subject: { id: 'sub-science', name: 'العلوم' },
    attachments: ['/docs/plant_life_cycle_activity.pdf'],
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function LessonsPage() {
  const t = useTranslations('teacher');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    subjectId: '',
    attachments: [] as string[],
  });

  useEffect(() => {
    fetchLessons();
    fetchSubjects();
  }, []);

  const getStoredLessons = (): Lesson[] => {
    try {
      const stored = localStorage.getItem('nexus_teacher_lessons');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_LESSONS;
  };

  const persistLessons = (updated: Lesson[]) => {
    setLessons(updated);
    try {
      localStorage.setItem('nexus_teacher_lessons', JSON.stringify(updated));
    } catch {}
  };

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const data = await lessonService.getMyLessons();
      if (Array.isArray(data) && data.length > 0) {
        setLessons(data);
      } else {
        const local = getStoredLessons();
        setLessons(local);
      }
    } catch (error) {
      const local = getStoredLessons();
      setLessons(local);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setSubjects(data);
      } else {
        setSubjects(DEFAULT_SUBJECTS);
      }
    } catch (error) {
      setSubjects(DEFAULT_SUBJECTS);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subjectId) return;

    const matchedSubject = subjects.find((s) => s.id === formData.subjectId) || {
      id: formData.subjectId,
      name: 'عام',
    };

    if (selectedLesson) {
      // Update
      const updatedList = lessons.map((l) =>
        l.id === selectedLesson.id
          ? {
              ...l,
              title: formData.title,
              content: formData.content,
              videoUrl: formData.videoUrl,
              subjectId: formData.subjectId,
              subject: { id: matchedSubject.id, name: matchedSubject.name },
              attachments: formData.attachments,
              updatedAt: new Date().toISOString(),
            }
          : l
      );
      persistLessons(updatedList);
      try {
        await lessonService.update(selectedLesson.id, formData);
      } catch {}
    } else {
      // Create new
      const newLessonItem: Lesson = {
        id: `les-${Date.now()}`,
        title: formData.title,
        content: formData.content,
        videoUrl: formData.videoUrl,
        subjectId: formData.subjectId,
        subject: { id: matchedSubject.id, name: matchedSubject.name },
        attachments: formData.attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedList = [newLessonItem, ...lessons];
      persistLessons(updatedList);
      try {
        await lessonService.create(formData as CreateLessonDto);
      } catch {}
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDelete') || 'هل أنت متأكد من حذف هذا الدرس؟')) {
      const updatedList = lessons.filter((l) => l.id !== id);
      persistLessons(updatedList);
      try {
        await lessonService.delete(id);
      } catch {}
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setFormData({
      title: lesson.title,
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      subjectId: lesson.subjectId,
      attachments: lesson.attachments || [],
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setSelectedLesson(null);
    setFormData({
      title: '',
      content: '',
      videoUrl: '',
      subjectId: subjects[0]?.id || '',
      attachments: [],
    });
  };

  const handleFilesUploaded = (files: UploadResponse[]) => {
    const urls = files.map((f) => f.url);
    setFormData({ ...formData, attachments: [...formData.attachments, ...urls] });
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  // Filtered list
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubjectFilter === 'all' || lesson.subjectId === selectedSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6 pb-16" dir="rtl">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-blue-950 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-300/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="text-xs font-bold text-blue-100">المكتبة الرقمية للدروس</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
              دروسي وشروحاتي الرقمية 📚
            </h1>
            <p className="text-blue-100 text-sm font-medium max-w-xl leading-relaxed">
              إعداد المحتوى الدراسي الرقمي، الفيديوهات التوضيحية، وأوراق العمل المصاحبة للفصل
            </p>
            <div className="flex gap-3 mt-4 text-xs">
              <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl font-bold">
                إجمالي الدروس: {lessons.length}
              </div>
              <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl font-bold">
                المواد النشطة: {subjects.length}
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            إضافة درس جديد
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث في عنوان أو محتوى الدرس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          />
        </div>

        {/* Subjects Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedSubjectFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            الكل ({lessons.length})
          </button>
          {subjects.map((s) => {
            const count = lessons.filter((l) => l.subjectId === s.id).length;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedSubjectFilter === s.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {s.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-card border border-border rounded-3xl text-center p-8">
          <BookOpen className="w-16 h-16 text-muted-foreground/40" />
          <div>
            <h3 className="text-lg font-bold text-foreground">لا توجد دروس مسجلة حالياً</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? 'لم يتم العثور على نتائج تطابق بحثك' : 'ابدأ بإضافة أول درس تعليمي لطلابك الآن'}
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="rounded-xl font-bold mt-2"
          >
            <Plus className="w-4 h-4 ml-1" /> إضافة درس
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => (
            <Card
              key={lesson.id}
              className="group border-border bg-card hover:border-primary/40 transition-all rounded-3xl overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs">
                    {lesson.subject?.name || 'مادة عامة'}
                  </Badge>
                  {lesson.videoUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                      <Video className="w-3 h-3" /> فيديو مرفق
                    </span>
                  )}
                </div>

                <h3 className="font-black text-lg text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {lesson.title}
                </h3>

                {lesson.content && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 font-medium">
                    {lesson.content}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60">
                  {lesson.attachments && lesson.attachments.length > 0 && (
                    <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                      <FileText className="w-3.5 h-3.5" />
                      {lesson.attachments.length} ملفات مرفقة
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-medium mr-auto">
                    <Clock className="w-3 h-3" />
                    {new Date(lesson.createdAt).toLocaleDateString('ar-SA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>

              {/* Action Toolbar */}
              <div className="bg-muted/40 p-3 px-6 border-t border-border flex items-center justify-between">
                {lesson.videoUrl ? (
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    مشاهدة الشرح
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">درس نصي تفاعلي</span>
                )}

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(lesson)}
                    className="h-8 px-2 text-xs font-bold text-foreground hover:text-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(lesson.id)}
                    className="h-8 px-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-black mb-1 text-foreground">
              {selectedLesson ? 'تعديل الدرس التعليمي' : 'إضافة درس تعليمي جديد'}
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              املأ بيانات الدرس وسيتم إتاحته لجميع طلاب الفصل المسجلين بالمادة
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  عنوان الدرس *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: مهارات التمييز بين اللام الشمسية واللام القمرية"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  المادة الدراسية *
                </label>
                <select
                  required
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">اختر المادة...</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  شرح ومحتوى الدرس
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="اكتب نقاط الدرس، الشرح، الأهداف التعليمية، والأنشطة المقترحة..."
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  رابط فيديو توضيحي (YouTube / Vimeo / Google Drive)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="https://youtube.com/watch?v=..."
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">
                  الملفات المرفقة وأوراق العمل
                </label>
                <FileUpload onUploadComplete={handleFilesUploaded} />
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 bg-muted rounded-xl text-xs font-bold"
                      >
                        <span className="truncate max-w-xs">{url.split('/').pop()}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 px-2 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl font-bold"
                >
                  إلغاء
                </Button>
                <Button type="submit" className="rounded-xl font-bold bg-primary text-white">
                  {selectedLesson ? 'حفظ التعديلات' : 'نشر الدرس للطلاب'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
