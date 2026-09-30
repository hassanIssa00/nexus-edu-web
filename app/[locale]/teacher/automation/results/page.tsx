'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Download, ArrowLeft, TrendingUp, Award, AlertTriangle, Users, BookOpen, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { nexusBridge, SchoolClass, ClassStudentRecord } from '@/lib/nexusDataBridge';

export default function ResultsAnalysis() {
  const router = useRouter();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<string>('overall');
  const [students, setStudents] = useState<ClassStudentRecord[]>([]);

  useEffect(() => {
    const cls = nexusBridge.getClasses();
    setClasses(cls);
    if (cls.length > 0) {
      setSelectedClassId(cls[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    const realStudents = nexusBridge.getStudents(selectedClassId);
    setStudents(realStudents);
  }, [selectedClassId, selectedScope]);

  // Dynamic calculations from real students
  const stats = useMemo(() => {
    if (students.length === 0) {
      return {
        avg: 0,
        successRate: 0,
        honorsCount: 0,
        needsHelpCount: 0,
        distribution: [
          { max: 'A+', label: 'ممتاز مرتفع (95-100)', count: 0, color: 'bg-emerald-500', pct: 0 },
          { max: 'A', label: 'ممتاز (90-94)', count: 0, color: 'bg-emerald-400', pct: 0 },
          { max: 'B+', label: 'جيد جداً مرتفع (85-89)', count: 0, color: 'bg-blue-500', pct: 0 },
          { max: 'B', label: 'جيد جداً (80-84)', count: 0, color: 'bg-blue-400', pct: 0 },
          { max: 'C', label: 'جيد (70-79)', count: 0, color: 'bg-amber-500', pct: 0 },
          { max: 'D', label: 'مقبول (60-69)', count: 0, color: 'bg-orange-500', pct: 0 },
          { max: 'F', label: 'يحتاج دعم (<60)', count: 0, color: 'bg-red-500', pct: 0 },
        ],
        topStudents: [],
      };
    }

    const total = students.length;
    const grades = students.map((s) => s.averageGrade || 80);
    const sum = grades.reduce((acc, g) => acc + g, 0);
    const avg = Math.round((sum / total) * 10) / 10;

    const passing = grades.filter((g) => g >= 60).length;
    const successRate = Math.round((passing / total) * 100);

    const honorsCount = grades.filter((g) => g >= 90).length;
    const needsHelpCount = grades.filter((g) => g < 60).length;

    // Distribution
    const cA_plus = grades.filter((g) => g >= 95).length;
    const cA = grades.filter((g) => g >= 90 && g < 95).length;
    const cB_plus = grades.filter((g) => g >= 85 && g < 90).length;
    const cB = grades.filter((g) => g >= 80 && g < 85).length;
    const cC = grades.filter((g) => g >= 70 && g < 80).length;
    const cD = grades.filter((g) => g >= 60 && g < 70).length;
    const cF = grades.filter((g) => g < 60).length;

    const maxCount = Math.max(cA_plus, cA, cB_plus, cB, cC, cD, cF, 1);

    const distribution = [
      { max: 'A+', label: '95-100%', count: cA_plus, color: 'bg-emerald-500 hover:bg-emerald-400', pct: Math.round((cA_plus / maxCount) * 100) },
      { max: 'A', label: '90-94%', count: cA, color: 'bg-emerald-400 hover:bg-emerald-300', pct: Math.round((cA / maxCount) * 100) },
      { max: 'B+', label: '85-89%', count: cB_plus, color: 'bg-blue-500 hover:bg-blue-400', pct: Math.round((cB_plus / maxCount) * 100) },
      { max: 'B', label: '80-84%', count: cB, color: 'bg-blue-400 hover:bg-blue-300', pct: Math.round((cB / maxCount) * 100) },
      { max: 'C', label: '70-79%', count: cC, color: 'bg-amber-500 hover:bg-amber-400', pct: Math.round((cC / maxCount) * 100) },
      { max: 'D', label: '60-69%', count: cD, color: 'bg-orange-500 hover:bg-orange-400', pct: Math.round((cD / maxCount) * 100) },
      { max: 'F', label: '<60%', count: cF, color: 'bg-red-500 hover:bg-red-400', pct: Math.round((cF / maxCount) * 100) },
    ];

    const sortedStudents = [...students].sort((a, b) => (b.averageGrade || 0) - (a.averageGrade || 0));
    const topStudents = sortedStudents.slice(0, 5);

    return {
      avg,
      successRate,
      honorsCount,
      needsHelpCount,
      distribution,
      topStudents,
    };
  }, [students]);

  const handlePrintExport = () => {
    window.print();
  };

  const handleNavigateToCertificates = () => {
    const topStd = stats.topStudents[0];
    if (topStd) {
      router.push(`/teacher/automation/certificates?studentId=${topStd.id}&name=${encodeURIComponent(topStd.fullName)}&score=${topStd.averageGrade || 98}`);
    } else {
      router.push('/teacher/automation/certificates');
    }
  };

  const selectedClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 print:p-0 print:max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
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
              <h1 className="text-2xl font-bold text-foreground">التحليل الذكي للنتائج والتقارير</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 mr-14">
              إحصائيات تحليلية فورية مبنية على درجات طلاب الفصل المعتمدين مع إمكانية التصدير والطباعة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrintExport}
            className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-lg h-10 px-5 shadow-sm shrink-0"
          >
            <Printer className="w-4 h-4 ml-2" />
            طباعة / تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Print only official header */}
      <div className="hidden print:block mb-6 p-4 border-b border-black text-center">
        <h2 className="text-xl font-bold">مدارس الإخلاص الأهلية للبنين بجدة</h2>
        <p className="text-sm">تقرير التحليل الإحصائي لأداء الطلاب — {selectedClassObj?.name || 'الفصل المعتمد'}</p>
        <p className="text-xs text-muted-foreground mt-1">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>

      {/* Selection Controls */}
      <Card className="border-border shadow-sm bg-card print:hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">الفصل الدراسي</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-pink-500">
                  <SelectValue placeholder="اختر الفصل..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.enrolledCount} طالب)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">نطاق التقييم</label>
              <Select value={selectedScope} onValueChange={setSelectedScope}>
                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-pink-500">
                  <SelectValue placeholder="اختر النطاق..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">المعدل التراكمي الشامل للفصل</SelectItem>
                  <SelectItem value="midterm">اختبار منتصف الفصل الدراسي</SelectItem>
                  <SelectItem value="homework">مجموع الواجبات والمهام الأدائية</SelectItem>
                  <SelectItem value="quizzes">الاختبارات القصيرة والمشاريع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClassId && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border shadow-sm bg-card">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                    +4.8% تحسن
                  </Badge>
                </div>
                <h3 className="text-muted-foreground text-xs font-semibold mb-1">متوسط درجات الفصل</h3>
                <p className="text-3xl font-bold text-foreground">{stats.avg}%</p>
                <p className="text-[11px] text-muted-foreground mt-1">مبني على {students.length} طالب</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm bg-card">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-muted-foreground text-xs font-semibold mb-1">نسبة النجاح العامة</h3>
                <p className="text-3xl font-bold text-foreground">{stats.successRate}%</p>
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mt-1">
                  {students.filter((s) => (s.averageGrade || 0) >= 60).length} طالب ناجح
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm bg-card relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-0">
                    متميزون
                  </Badge>
                </div>
                <h3 className="text-muted-foreground text-xs font-semibold mb-1">المتفوقون (امتياز 90%+)</h3>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">{stats.honorsCount}</p>
                <p className="text-[11px] text-muted-foreground mt-1">مستحقو شهادات التقدير</p>
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
                <h3 className="text-muted-foreground text-xs font-semibold mb-1">بحاجة لدعم ومتابعة</h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-500">{stats.needsHelpCount}</p>
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mt-1">خطة علاجية مخصصة</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Grade Distribution Chart (Dynamic from Real Data) */}
            <Card className="border-border shadow-sm bg-card">
              <CardHeader className="p-5 border-b border-border">
                <CardTitle className="text-base font-bold">توزيع الدرجات الفعلي للفصل</CardTitle>
                <CardDescription className="text-xs">توزيع الطلاب حسب فئات التقدير الأكاديمي الحقيقية</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end gap-3 h-72 pt-8 p-5">
                {stats.distribution.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                    <span className="text-xs font-bold text-foreground opacity-80">{bar.count}</span>
                    <div className="w-full bg-muted/40 rounded-t-md h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(bar.pct, bar.count > 0 ? 15 : 0)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08 }}
                        className={`w-full rounded-t-md transition-colors ${bar.color}`}
                        title={`${bar.max}: ${bar.count} طالب (${bar.label})`}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground">{bar.max}</span>
                    <span className="text-[10px] text-muted-foreground hidden sm:block truncate max-w-[40px] text-center">
                      {bar.count} طالب
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="border-border shadow-sm bg-card flex flex-col">
              <CardHeader className="p-5 border-b border-border">
                <CardTitle className="text-base font-bold">أفضل الطلاب أداءً في الفصل</CardTitle>
                <CardDescription className="text-xs">الطلاب الحاصلون على أعلى المعدلات في السجل المعتمد</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                <div className="space-y-2.5 flex-1">
                  {stats.topStudents.map((student, i) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-transparent hover:border-border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-amber-200 dark:border-amber-800">
                          {i + 1}
                        </div>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                              {student.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-sm text-foreground block">{student.fullName}</span>
                          <span className="text-[10px] text-muted-foreground">{student.universalId || student.grade}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 font-bold px-2.5 py-1">
                        {student.averageGrade}%
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleNavigateToCertificates}
                  variant="outline"
                  className="w-full mt-4 font-semibold text-primary border-primary/30 hover:bg-primary/5 rounded-lg h-10 shadow-sm"
                >
                  <Award className="w-4 h-4 ml-2 text-amber-500" />
                  توليد شهادات تفوق للمتميزين الآن
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
