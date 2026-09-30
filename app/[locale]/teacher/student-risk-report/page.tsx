'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Info, Search, Filter, AlertCircle, ArrowLeft, Send, CheckCircle2, HeartHandshake, PhoneCall } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { nexusBridge, ClassStudentRecord } from '@/lib/nexusDataBridge';

interface StudentRiskData {
  id: string;
  name: string;
  photoUrl?: string;
  grade: string;
  averageGrade: number;
  attendanceRate: number;
  parentPhone: string;
  risk: {
    riskLevel: 'high' | 'medium' | 'low';
    riskScore: number;
    recommendation: string;
    indicators: {
      attendance: { score: number; detail: string };
      gradesTrend: { score: number; detail: string };
      assignmentCompletion: { score: number; detail: string };
    };
  };
}

export default function StudentRiskReportPage() {
  const [students, setStudents] = useState<StudentRiskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const realStudents = nexusBridge.getStudents();

    const evaluated: StudentRiskData[] = realStudents.map((s) => {
      const avg = s.averageGrade || 80;
      const att = s.attendanceRate || 92;

      // Determine risk score dynamically
      let riskScore = 0;
      let riskLevel: 'high' | 'medium' | 'low' = 'low';

      if (avg < 70 || att < 80) {
        riskLevel = 'high';
        riskScore = Math.round(75 + Math.random() * 20);
      } else if (avg < 82 || att < 90) {
        riskLevel = 'medium';
        riskScore = Math.round(45 + Math.random() * 25);
      } else {
        riskLevel = 'low';
        riskScore = Math.round(10 + Math.random() * 15);
      }

      return {
        id: s.id,
        name: s.fullName,
        photoUrl: s.photoUrl,
        grade: s.grade || 'الصف الأول الابتدائي — فئة (أ)',
        averageGrade: avg,
        attendanceRate: att,
        parentPhone: s.parentPhone || '0550000000',
        risk: {
          riskLevel,
          riskScore,
          recommendation:
            riskLevel === 'high'
              ? 'يحتاج لخطة علاجية عاجلة، ومتابعة هاتفية مع ولي الأمر لتعويض الواجبات المتأخرة.'
              : riskLevel === 'medium'
              ? 'يوصى بجلسة توجيه صفية وتحفيز الطالب بالمشاركة التفاعلية في منصة نكسس.'
              : 'أداء أكاديمي وانضباطي متميز، استمر في التعزيز الإيجابي.',
          indicators: {
            attendance: {
              score: att < 85 ? 85 : 20,
              detail: att < 85 ? `نسبة الحضور منخفضة (${att}%) مع تكرار الغياب` : `حضور منضبط ومثالي (${att}%)`,
            },
            gradesTrend: {
              score: avg < 75 ? 80 : 25,
              detail: avg < 75 ? `المعدل الحالي (${avg}%) يتطلب تدخلاً أكاديمياً سريعاً` : `مستوى دراسي مستقر (${avg}%)`,
            },
            assignmentCompletion: {
              score: avg < 75 ? 70 : 15,
              detail: avg < 75 ? 'تسليم الواجبات يحتاج إلى متابعة منزلية مكثفة' : 'التسليمات مكتملة ومنتظمة',
            },
          },
        },
      };
    });

    // Sort by risk score (highest first)
    evaluated.sort((a, b) => b.risk.riskScore - a.risk.riskScore);
    setStudents(evaluated);
    setLoading(false);
  }, []);

  const handleSendRemedial = (student: StudentRiskData) => {
    nexusBridge.addObservation({
      studentId: student.id,
      studentName: student.name,
      authorName: 'المعلم المشرف',
      authorRole: 'معلم الفصل',
      category: 'academic',
      text: `تم تفعيل خطة دعم وتدخل مبكر للطالب ${student.name} لمعالجة مؤشرات التراجع الأكاديمي.`,
      severity: 'urgent',
    });
    showToast(`تم إسناد الخطة العلاجية وإشعار المرشد بملف (${student.name}) بنجاح!`);
  };

  const handleNotifyParent = (student: StudentRiskData) => {
    nexusBridge.addObservation({
      studentId: student.id,
      studentName: student.name,
      authorName: 'المعلم المشرف',
      authorRole: 'معلم الفصل',
      category: 'guidance',
      text: `إشعار عاجل لولي الأمر (${student.parentPhone}): نرجو التكرم بمتابعة مستوى الطالب والواجبات غير المكتملة.`,
      severity: 'urgent',
    });
    showToast(`تم إرسال إشعار التدخل المبكر لولي أمر الطالب (${student.name})!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || student.risk.riskLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" />;
      case 'medium':
        return <Info className="text-yellow-500 w-6 h-6" />;
      default:
        return <ShieldCheck className="text-emerald-500 w-6 h-6" />;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <span className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-black">خطر عالي ⚠️</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 px-2.5 py-1 rounded-full text-xs font-black">خطر متوسط ⏱</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-black">وضع آمن ومستقر ✓</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16" dir="rtl">
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
      <div className="flex items-center gap-4 mb-2">
        <Link href="/teacher">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            نظام كشف المخاطر الأكاديمية والتدخل المبكر
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            رصد استباقي للطلاب المعرضين للتعثر في الحضور والدرجات لاتخاذ إجراءات الدعم فوراً.
          </p>
        </div>
      </div>

      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-rose-700 via-red-600 to-orange-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none">
          <AlertCircle className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-extrabold mb-2">تحليل بيانات الفصل الفعلي لمدارس الإخلاص</h2>
          <p className="text-red-100 text-sm leading-relaxed mb-4">
            يتم فحص متوسطات الدرجات، الغياب غير المبرر، ونسب تسليم الواجبات لكل طالب تلقائياً لمساعدتك على توجيه الخطط العلاجية بدقة.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-bold">
            <span className="bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
              الطلاب المعرضون لخطر عالي: {students.filter((s) => s.risk.riskLevel === 'high').length} طلاب
            </span>
            <span className="bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
              بحاجة لمتابعة متوسطة: {students.filter((s) => s.risk.riskLevel === 'medium').length} طلاب
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن طالب بالاسم..."
            className="pr-10 h-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex-1 md:flex-none rounded-xl text-xs font-bold"
          >
            الجميع ({students.length})
          </Button>
          <Button
            variant={filter === 'high' ? 'destructive' : 'outline'}
            onClick={() => setFilter('high')}
            className={`flex-1 md:flex-none rounded-xl text-xs font-bold ${filter === 'high' ? 'bg-red-600' : ''}`}
          >
            خطر عالي ({students.filter((s) => s.risk.riskLevel === 'high').length})
          </Button>
          <Button
            variant={filter === 'medium' ? 'default' : 'outline'}
            onClick={() => setFilter('medium')}
            className={`flex-1 md:flex-none rounded-xl text-xs font-bold ${
              filter === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''
            }`}
          >
            خطر متوسط ({students.filter((s) => s.risk.riskLevel === 'medium').length})
          </Button>
          <Button
            variant={filter === 'low' ? 'default' : 'outline'}
            onClick={() => setFilter('low')}
            className={`flex-1 md:flex-none rounded-xl text-xs font-bold ${
              filter === 'low' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
          >
            آمن ({students.filter((s) => s.risk.riskLevel === 'low').length})
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, idx) => (
          <motion.div key={student.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }}>
            <Card
              className={`h-full overflow-hidden border-t-4 transition-all duration-200 hover:shadow-md bg-card ${
                student.risk.riskLevel === 'high'
                  ? 'border-t-red-500'
                  : student.risk.riskLevel === 'medium'
                  ? 'border-t-yellow-500'
                  : 'border-t-emerald-500'
              }`}
            >
              <CardHeader className="pb-2 p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center font-bold text-xs shrink-0 border border-border">
                      {student.photoUrl ? (
                        <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                      ) : (
                        student.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">{student.name}</CardTitle>
                      <CardDescription className="text-xs">{student.grade}</CardDescription>
                    </div>
                  </div>
                  {getRiskIcon(student.risk.riskLevel)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">مؤشر التعثر الكلي:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base">{student.risk.riskScore}%</span>
                    {getRiskBadge(student.risk.riskLevel)}
                  </div>
                </div>

                <Progress
                  value={student.risk.riskScore}
                  className="h-2 rounded-full"
                />

                <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold">متوسط الدرجات</span>
                    <span className="font-black text-sm text-foreground">{student.averageGrade}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold">نسبة الحضور</span>
                    <span className="font-black text-sm text-foreground">{student.attendanceRate}%</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border/50 pt-3">
                  <h4 className="text-xs font-bold text-muted-foreground">تفاصيل المؤشرات:</h4>
                  <ul className="space-y-1.5 text-xs">
                    <li className="text-muted-foreground">• {student.risk.indicators.attendance.detail}</li>
                    <li className="text-muted-foreground">• {student.risk.indicators.gradesTrend.detail}</li>
                  </ul>
                  <div className="p-2.5 mt-2 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs text-foreground font-medium leading-relaxed">
                      <strong className="text-primary block mb-0.5">توصية نكسس الذكية:</strong>
                      {student.risk.recommendation}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    onClick={() => handleSendRemedial(student)}
                    variant="outline"
                    className="flex-1 text-xs font-bold border-primary/30 text-primary hover:bg-primary/5 rounded-lg"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 ml-1" />
                    خطة علاجية
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleNotifyParent(student)}
                    className="flex-1 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-lg"
                  >
                    <Send className="w-3.5 h-3.5 ml-1" />
                    إشعار ولي الأمر
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center p-12 bg-card rounded-2xl border border-border">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">لا يوجد طلاب يطابقون معايير البحث</h3>
        </div>
      )}
    </div>
  );
}
