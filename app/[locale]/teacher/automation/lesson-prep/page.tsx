'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, Calendar, CheckCircle, ChevronDown, Wand2, ArrowLeft, Clock, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { nexusBridge, SchoolSubject, SchoolClass } from '@/lib/nexusDataBridge';

interface LessonPlanItem {
  id: number;
  title: string;
  date: string;
  time: string;
  objectives: string;
  strategies: string;
  activities: string;
  homework: string;
  isCustomized?: boolean;
}

const WEEKS = [
  { id: 'w1', name: 'الأسبوع الأول — (الفصل الدراسي الحالي)' },
  { id: 'w2', name: 'الأسبوع الثاني — (الفصل الدراسي الحالي)' },
  { id: 'w3', name: 'الأسبوع الثالث — (الفصل الدراسي الحالي)' },
  { id: 'w4', name: 'الأسبوع الرابع — (الفصل الدراسي الحالي)' },
];

export default function LessonPrepAutomation() {
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string; category: string }>>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('w1');
  const [isPreparing, setIsPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPrepared, setIsPrepared] = useState(false);
  const [lessons, setLessons] = useState<LessonPlanItem[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load teacher subject & school subjects
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('nexus_user');
      const teacherObj = rawUser ? JSON.parse(rawUser) : null;
      const schoolSubjects = nexusBridge.getSubjects();

      const list: Array<{ id: string; name: string; category: string }> = [];

      if (teacherObj?.subject) {
        list.push({
          id: 'tch_primary',
          name: `${teacherObj.subject} (تخصصك المعتمد)`,
          category: teacherObj.subject,
        });
      }

      schoolSubjects.forEach((s) => {
        if (!list.some((item) => item.name.includes(s.name))) {
          list.push({
            id: s.id,
            name: `${s.name} — الصف ${s.gradeLevel}`,
            category: s.name,
          });
        }
      });

      if (list.length === 0) {
        list.push(
          { id: 'sub_arb', name: 'لغتي الجميلة والتربية الإسلامية — الصف 1', category: 'اللغة العربية' },
          { id: 'sub_math', name: 'الرياضيات — الصف 1', category: 'الرياضيات' }
        );
      }

      setSubjects(list);
      setSelectedSubject(list[0].id);
    } catch {}
  }, []);

  // Check if this subject & week was already prepared and saved
  useEffect(() => {
    if (!selectedSubject || !selectedWeek) return;

    const storageKey = `nexus_prep_${selectedSubject}_${selectedWeek}`;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLessons(parsed);
          setIsPrepared(true);
          return;
        }
      }
    } catch {}

    setIsPrepared(false);
    setLessons([]);
  }, [selectedSubject, selectedWeek]);

  const generateCurriculumLessons = (subjectId: string): LessonPlanItem[] => {
    const sel = subjects.find((s) => s.id === subjectId);
    const cat = sel?.category || 'عام';

    if (cat.includes('عربي') || cat.includes('إسلام') || cat.includes('لغتي')) {
      return [
        {
          id: 1,
          title: 'مد الألف والواو والياء وتطبيقاتها',
          date: 'الأحد',
          time: '08:00 ص',
          objectives: 'أن يميز الطالب بين الحركات القصيرة والمدود الطويلة، وأن ينطق كلمات المد نطقاً صحيحاً خالياً من اللحن.',
          strategies: 'التعلم باللعب، العصف الذهني، النمذجة الصوتية والقراءة الجهرية النموذجية',
          activities: 'استخراج حروف المد من النص القرائي ص 34، بطاقات الكلمات الملونة، منافسة فرسان القراءة',
          homework: 'كتابة خمس كلمات تحتوي على مد الألف في دفتر الواجبات الصفية ص 36',
        },
        {
          id: 2,
          title: 'التاء المفتوحة والتاء المربوطة',
          date: 'الاثنين',
          time: '08:45 ص',
          objectives: 'أن يفرق الطالب كتابةً ونطقاً بين التاء المربوطة والتاء المفتوحة عند الوقف والوصل.',
          strategies: 'الاستقصاء الموجّه، التعلم التعاوني، التمييز بالسكون والحركة',
          activities: 'تصنيف بطاقات الكلمات في جدول التاءين على السبورة الذكية، ورقة عمل تفاعلية',
          homework: 'حل تدريبات كتاب النشاط ص 38 وتدوين 4 جمل من سورة الفلق',
        },
        {
          id: 3,
          title: 'الجملة الاسمية وأركانها الأساسية',
          date: 'الثلاثاء',
          time: '09:45 ص',
          objectives: 'أن يحدد الطالب ركني الجملة الاسمية (المبتدأ والخبر) وأن يضبط أواخرهما بالضمة.',
          strategies: 'خرائط المفاهيم، المناقشة والحوار، التمثيل ولعب الأدوار',
          activities: 'تكوين جمل اسمية مفيدة من كلمات مبعثرة، لعبة تركيب الجمل في مجموعات ثنائية',
          homework: 'تحديد المبتدأ والخبر في النص المقروء ص 42 ورسم دائرة حول الضمة',
        },
        {
          id: 4,
          title: 'الهمزة المتوسطة على الواو والألف',
          date: 'الأربعاء',
          time: '10:30 ص',
          objectives: 'أن يستنتج الطالب قاعدة قوة الحركات في كتابة الهمزة المتوسطة ويطبقها بدقة.',
          strategies: 'سلم قوة الحركات (الكسرة > الضمة > الفتحة > السكون)، التعلم بالاكتشاف',
          activities: 'رسم سلم الحركات على السبورة، إملاء اختباري قصير لـ 4 كلمات تحتوي همزة متوسطة',
          homework: 'كتابة فقرة من 3 أسطر تشتمل على كلمات مهموزة ص 45',
        },
        {
          id: 5,
          title: 'التعبير الكتابي والقراءة الإثرائية',
          date: 'الخميس',
          time: '11:15 ص',
          objectives: 'أن يعبر الطالب بأسلوبه عن فضل بر الوالدين في فقرة مترابطة بجمل سليمة البناء.',
          strategies: 'الكتابة الإبداعية، العصف الذهني، التقييم الذاتي وتقييم الأقران',
          activities: 'ورشة عمل كتابية مع بطاقات التغذية الراجعة، إلقاء خطابي أمام الفصل',
          homework: 'قراءة قصة أسبوعية من منصة نكسس وتلخيصها في ثلاثة أسطر',
        },
      ];
    } else {
      return [
        {
          id: 1,
          title: 'المعادلات الجبرية والخطية',
          date: 'الأحد',
          time: '08:00 ص',
          objectives: 'أن يفهم الطالب مفهوم المتغير والمعادلة الخطية ويطبق خطوات حل المعادلة من الدرجة الأولى بدقة.',
          strategies: 'الاستنتاج الرياضي، التعلم التعاوني، حل المشكلات خطوة بخطوة',
          activities: 'حل مسائل تطبيقية باستخدام الميزان التخيلي، مناقشة أمثلة الكتاب ص 40',
          homework: 'حل التمارين الفردية من 1 إلى 5 ص 44',
        },
        {
          id: 2,
          title: 'العمليات الحسابية والنسب المئوية',
          date: 'الاثنين',
          time: '09:00 ص',
          objectives: 'أن يحسب الطالب النسبة المئوية لكميات معلومة ويوظفها في حساب الخصومات والأرباح الحياتية.',
          strategies: 'ربط الرياضيات بالحياة اليومية، العصف الذهني، التعلم بالنمذجة',
          activities: 'محاكاة متجر افتراضي وحساب قيمة التخفيضات بالفصل، أوراق عمل تفاعلية',
          homework: 'حل التدريبات ص 48 في كراسة التمارين',
        },
        {
          id: 3,
          title: 'الهندسة الإحداثية وخصائص المثلثات',
          date: 'الثلاثاء',
          time: '10:00 ص',
          objectives: 'أن يحدد الطالب أنواع المثلثات حسب قياسات زواياها وأطوال أضلاعها ويحسب مجموع الزوايا الداخلية.',
          strategies: 'الاستكشاف البصري بالبرمجيات الهندسية، العمل الجماعي في مجموعات',
          activities: 'قياس زوايا مثلثات مختلفة بالمنقلة، إثبات أن مجموع زوايا المثلث 180 درجة عملياً',
          homework: 'رسم وتصنيف 3 مثلثات في الدفتر الهندسي مع قياس الزوايا',
        },
        {
          id: 4,
          title: 'المتباينات وتمثيلها على خط الأعداد',
          date: 'الأربعاء',
          time: '11:00 ص',
          objectives: 'أن يحل الطالب المتباينة الخطية ويمثل مجموعة الحل بيانياً على خط الأعداد بنجاح.',
          strategies: 'المقارنة والتباين، التعليم المتمايز، حل المشكلات',
          activities: 'تمثيل المتباينات على شريط الأعداد الرقمي، منافسة أسرع حل بين المجموعات',
          homework: 'حل المسائل 7 و 8 و 9 ص 52',
        },
        {
          id: 5,
          title: 'مراجعة وتطبيقات إثرائية أسبوعية',
          date: 'الخميس',
          time: '11:45 ص',
          objectives: 'أن يربط الطالب المفاهيم الرياضية المدروسة خلال الأسبوع ويحل أسئلة ذات مهارات تفكير عليا.',
          strategies: 'الاختبار الذاتي، التلعيب (Gamification) عبر مسابقة نكسس، التعزيز الإيجابي',
          activities: 'مسابقة المليون التعليمية على المنصة لحل أسئلة الأسبوع وحصد النقاط',
          homework: 'مراجعة المفاهيم والاستعداد للتقويم الأسبوعي القادم',
        },
      ];
    }
  };

  const handleBulkPrepare = () => {
    setIsPreparing(true);
    setProgress(0);

    const generated = generateCurriculumLessons(selectedSubject);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPreparing(false);
          setIsPrepared(true);
          setLessons(generated);
          setExpandedLesson(1);

          // Save to localStorage
          const storageKey = `nexus_prep_${selectedSubject}_${selectedWeek}`;
          localStorage.setItem(storageKey, JSON.stringify(generated));

          showToast('تم إعداد وتحضير دروس الأسبوع كاملة وحفظها بنجاح!');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const updateLessonField = (lessonId: number, field: keyof LessonPlanItem, value: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, [field]: value, isCustomized: true } : l))
    );
  };

  const handleSaveLessonEdits = (lessonId: number) => {
    const storageKey = `nexus_prep_${selectedSubject}_${selectedWeek}`;
    localStorage.setItem(storageKey, JSON.stringify(lessons));
    showToast(`تم حفظ التعديلات للدرس رقم ${lessonId} في السجل بنجاح!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold text-sm border border-border"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
            <h1 className="text-2xl font-bold text-foreground">التحضير الشامل بالذكاء الاصطناعي</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 mr-14">
            حضّر دروس الأسبوع المعتمدة بضغطة زر واحدة مع توليد فوري للأهداف والاستراتيجيات والأنشطة والواجبات.
          </p>
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
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
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
                  {WEEKS.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prepare Button Section */}
      {selectedSubject && selectedWeek && !isPrepared && !isPreparing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-10 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">جاهز لأتمتة تحضير دروس الأسبوع؟</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md text-center">
            سيقوم المحرك الذكي ببناء وتخصيص الأهداف السلوكية، الاستراتيجيات، والأنشطة الصفية والواجبات المتوافقة مع المنهج الوزاري المعتمد.
          </p>

          <Button
            onClick={handleBulkPrepare}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base h-12 px-8 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Sparkles className="ml-2 h-5 w-5 text-amber-300" />
            تحضير كافة الدروس بضغطة زر
          </Button>
        </motion.div>
      )}

      {/* Loading Progress */}
      {isPreparing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-card rounded-2xl border border-border shadow-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <Zap className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">جاري التحضير الذكي للدروس...</h3>
          <p className="text-muted-foreground text-sm mb-6">يتم بناء استراتيجيات وأنشطة تعليمية مخصصة لكل حصة</p>

          <div className="w-full max-w-md mx-auto h-3 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-4 font-bold text-primary text-sm">{progress}%</p>
        </motion.div>
      )}

      {/* Results Display */}
      {isPrepared && lessons.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900/50 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 flex items-center justify-center rounded-full flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-green-900 dark:text-green-300">
                  تم تحضير {lessons.length} دروس بنجاح وحفظها!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400 mt-0.5">
                  جميع الدروس معتمدة ومحفوظة في ملف التحضير، ويمكنك تعديل أي جزء وحفظه.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 font-medium whitespace-nowrap"
              onClick={() => {
                setIsPrepared(false);
                setIsPreparing(false);
              }}
            >
              إعادة التحضير
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              خطة دروس الأسبوع المحضّرة
            </h3>

            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                className={`border ${
                  expandedLesson === lesson.id ? 'border-primary shadow-md' : 'border-border shadow-sm'
                } transition-all duration-200 overflow-hidden bg-card`}
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                      <span className="font-bold text-sm text-primary">{lesson.id}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base">{lesson.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {lesson.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {lesson.time}
                        </span>
                        {lesson.isCustomized && (
                          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">
                            مُعدل ومحفوظ
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0 hidden sm:inline-flex">
                      تم التحضير ✔
                    </Badge>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedLesson === lesson.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {expandedLesson === lesson.id && (
                  <div className="bg-muted/30 p-5 border-t border-border space-y-4">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>الأهداف السلوكية والتعليمية</span>
                          <span className="text-[10px] text-muted-foreground">قابلة للتعديل</span>
                        </label>
                        <textarea
                          className="w-full h-24 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none text-sm text-foreground leading-relaxed shadow-inner"
                          value={lesson.objectives}
                          onChange={(e) => updateLessonField(lesson.id, 'objectives', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>استراتيجيات التدريس الحديثة</span>
                          <span className="text-[10px] text-muted-foreground">قابلة للتعديل</span>
                        </label>
                        <textarea
                          className="w-full h-24 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none text-sm text-foreground leading-relaxed shadow-inner"
                          value={lesson.strategies}
                          onChange={(e) => updateLessonField(lesson.id, 'strategies', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>الأنشطة الصفية والوسائل التعليمية</span>
                          <span className="text-[10px] text-muted-foreground">قابلة للتعديل</span>
                        </label>
                        <textarea
                          className="w-full h-24 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none text-sm text-foreground leading-relaxed shadow-inner"
                          value={lesson.activities}
                          onChange={(e) => updateLessonField(lesson.id, 'activities', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                          <span>الواجبات وأدوات التقويم</span>
                          <span className="text-[10px] text-muted-foreground">قابلة للتعديل</span>
                        </label>
                        <textarea
                          className="w-full h-24 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none resize-none text-sm text-foreground leading-relaxed shadow-inner"
                          value={lesson.homework}
                          onChange={(e) => updateLessonField(lesson.id, 'homework', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        onClick={() => handleSaveLessonEdits(lesson.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 rounded-lg shadow-sm"
                      >
                        <Save className="w-4 h-4 ml-1.5" />
                        حفظ تعديلات الدرس
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
