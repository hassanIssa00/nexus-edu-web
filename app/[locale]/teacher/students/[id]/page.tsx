'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Brain, TrendingUp, Target, BookOpen, AlertCircle, ArrowRight,
  Download, Printer, Phone, User, Calendar, Award, CheckCircle2,
  Sparkles, FileText, Send, Clock, ShieldCheck
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { nexusBridge, ClassStudentRecord } from '@/lib/nexusDataBridge';

interface SmartProfile {
  id: string;
  learningStyle: string;
  strengthSubjects: string[];
  weakSubjects: string[];
  performanceTrend: string;
}

interface SkillMastery {
  id: string;
  masteryLevel: 'MASTERED' | 'IN_PROGRESS' | 'NOT_STARTED';
  skillNode: {
    name: string;
    description: string;
    subject: {
      name: string;
    };
  };
}

export default function TeacherStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<ClassStudentRecord | null>(null);
  const [profile, setProfile] = useState<SmartProfile | null>(null);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState<'academic' | 'behavioral' | 'attendance'>('academic');
  const [noteSeverity, setNoteSeverity] = useState<'positive' | 'warning' | 'critical'>('positive');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    const loadData = async () => {
      try {
        const allStudents = nexusBridge.getStudents();
        const found = allStudents.find((s) => s.id === studentId || s.universalId === studentId) || allStudents[0] || null;
        setStudent(found);

        // Derive skills & competencies based on student performance
        const avg = found?.averageGrade || 88;
        const att = found?.attendanceRate || 95;

        const defaultSkills: SkillMastery[] = [
          {
            id: 'sk-1',
            masteryLevel: avg >= 85 ? 'MASTERED' : 'IN_PROGRESS',
            skillNode: {
              name: 'القراءة الجهرية بالحركات التامة',
              description: 'القدرة على نطق الجمل والفقرات بطلاقة مع مراعاة مخارج الحروف وحركات التشكيل',
              subject: { name: 'لغتي العربية' }
            }
          },
          {
            id: 'sk-2',
            masteryLevel: avg >= 80 ? 'MASTERED' : 'IN_PROGRESS',
            skillNode: {
              name: 'التمييز بين اللام الشمسية واللام القمرية',
              description: 'تطبيق القاعدة الإملائية عملياً وكتابة الكلمات بصورة صحيحة',
              subject: { name: 'لغتي العربية' }
            }
          },
          {
            id: 'sk-3',
            masteryLevel: avg >= 88 ? 'MASTERED' : 'IN_PROGRESS',
            skillNode: {
              name: 'الجمع والطرح ضمن العدد 20',
              description: 'حل المسائل الحسابية المباشرة والمسائل اللفظية المبسطة',
              subject: { name: 'الرياضيات' }
            }
          },
          {
            id: 'sk-4',
            masteryLevel: avg >= 92 ? 'MASTERED' : 'IN_PROGRESS',
            skillNode: {
              name: 'استكشاف الكائنات الحية ومواطنها',
              description: 'التعرف على صفات الحيوانات والنباتات واحتياجاتها البيئية الأساسية',
              subject: { name: 'العلوم' }
            }
          },
          {
            id: 'sk-5',
            masteryLevel: avg >= 85 ? 'MASTERED' : 'IN_PROGRESS',
            skillNode: {
              name: 'حفظ وتجويد قصار السور من جزء عم',
              description: 'التلاوة السليمة مع مراعاة الغنة والمدود الطبيعية',
              subject: { name: 'القرآن الكريم' }
            }
          },
          {
            id: 'sk-6',
            masteryLevel: att >= 90 ? 'MASTERED' : 'IN_PROGRESS',
            skillNode: {
              name: 'المشاركة الفعالة والعمل الجماعي',
              description: 'الالتزام بآداب الاستئماع والمشاركة البناءة مع الزملاء في الصف',
              subject: { name: 'المهارات الحياتية' }
            }
          }
        ];

        setSkills(defaultSkills);

        setProfile({
          id: `profile-${studentId}`,
          learningStyle: avg >= 90 ? 'LOGICAL' : avg >= 80 ? 'VISUAL' : 'SOCIAL',
          strengthSubjects: avg >= 85 ? ['لغتي العربية', 'الرياضيات', 'القرآن الكريم'] : ['التربية الفنية', 'التربية البدنية'],
          weakSubjects: avg < 80 ? ['القواعد النحوية', 'العلوم الطبيعية'] : ['السرعة في الإملاء فقط'],
          performanceTrend: avg >= 88 ? 'تصاعدي مستمر 📈' : 'مستقر 📊'
        });
      } catch (e) {
        console.error('Failed to load student profile data', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !student) return;

    try {
      const u = (() => {
        try {
          return JSON.parse(localStorage.getItem('nexus_user') || '{}');
        } catch {
          return {};
        }
      })();
      const teacherName = `${u.title || 'أ'}. ${u.name || 'المعلم'}`;

      nexusBridge.addObservation({
        studentId: student.id,
        studentName: student.fullName,
        authorName: teacherName,
        authorRole: 'teacher',
        category: noteCategory,
        severity: noteSeverity,
        text: noteText.trim()
      });

      setNoteSaved(true);
      setTimeout(() => {
        setNoteSaved(false);
        setShowNoteModal(false);
        setNoteText('');
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-primary font-bold">جاري تحميل الملف الذكي للطالب...</div>;
  }

  // Radar data
  const avg = student?.averageGrade || 88;
  const displayRadarData = [
    { subject: 'لغتي العربية', mastery: Math.min(100, Math.round(avg * 1.02)) },
    { subject: 'الرياضيات', mastery: Math.min(100, Math.round(avg * 0.98)) },
    { subject: 'العلوم', mastery: Math.min(100, Math.round(avg * 0.95)) },
    { subject: 'القرآن الكريم', mastery: Math.min(100, Math.round(avg * 1.04)) },
    { subject: 'اللغة الإنجليزية', mastery: Math.min(100, Math.round(avg * 0.92)) }
  ];

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4" dir="rtl">
      {/* Header Actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 print:hidden">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-2 text-gray-500 hover:text-foreground">
            <ArrowRight className="w-4 h-4 ml-2" /> العودة لقائمة الطلاب
          </Button>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            الملف الأكاديمي والمهاري الذكي
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            سجل تحليلي متكامل لمسار الطالب، مؤشرات الإتقان، وبطاقة التقييم التراكمية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowNoteModal(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl"
          >
            <Sparkles className="w-4 h-4" />
            رصد ملاحظة ذكية
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2 rounded-xl border-primary/30 font-bold">
            <Printer className="w-4 h-4" />
            طباعة الملف الشامل
          </Button>
        </div>
      </div>

      {/* Student Identity Hero Card */}
      {student && (
        <Card className="border-border bg-card/60 backdrop-blur-md overflow-hidden rounded-3xl shadow-sm">
          <div className="bg-gradient-to-l from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl ring-2 ring-blue-400/40">
                  <AvatarImage src={student.photoUrl} alt={student.fullName} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-black">
                    {student.fullName?.slice(0, 2) || 'ط'}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-2 -left-2 bg-amber-400 text-blue-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
                  #{student.rank} بالصف
                </span>
              </div>

              <div className="flex-1 text-center sm:text-right">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <h2 className="text-2xl font-black">{student.fullName}</h2>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                    حساب نشط ومفعّل
                  </Badge>
                </div>
                <p className="text-blue-200 text-sm font-medium mb-3">
                  {student.grade} • الرقم الأكاديمي: <span className="font-mono text-white">{student.universalId}</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-blue-300 block mb-0.5">رقم الهوية / الإقامة:</span>
                    <span className="font-mono font-bold">{student.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-blue-300 block mb-0.5">ولي الأمر:</span>
                    <span className="font-bold">{student.parentName}</span>
                  </div>
                  <div>
                    <span className="text-blue-300 block mb-0.5">هاتف التواصل:</span>
                    <span className="font-mono font-bold" dir="ltr">{student.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-blue-300 block mb-0.5">البرنامج المعتمد:</span>
                    <span className="font-bold text-amber-300">{student.assignedProgram}</span>
                  </div>
                </div>
              </div>

              {/* GPA & Attendance Quick Badges */}
              <div className="flex sm:flex-col gap-3 min-w-[140px] text-center">
                <div className="bg-white/10 border border-white/15 backdrop-blur-md p-3 rounded-2xl flex-1">
                  <p className="text-[11px] text-blue-200 font-bold">المعدل العام</p>
                  <p className="text-2xl font-black text-amber-300">{student.averageGrade}%</p>
                  <span className="text-[10px] text-emerald-300 font-bold">
                    {student.averageGrade >= 90 ? 'ممتاز مرتفع 🌟' : student.averageGrade >= 80 ? 'جيد جداً ✨' : 'يحتاج متابعة'}
                  </span>
                </div>
                <div className="bg-white/10 border border-white/15 backdrop-blur-md p-3 rounded-2xl flex-1">
                  <p className="text-[11px] text-blue-200 font-bold">نسبة الحضور</p>
                  <p className="text-2xl font-black text-emerald-400">{student.attendanceRate}%</p>
                  <span className="text-[10px] text-blue-200 font-bold">التزام ممتاز ⏱️</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Analytical Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Analysis Card */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              تحليل الذكاء الاصطناعي لأسلوب تعلم الطالب
            </CardTitle>
            <CardDescription>استنتاج النمط الإدراكي والتوصيات التربوية الفردية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-card border border-border p-4 rounded-2xl">
              <p className="text-xs font-bold text-muted-foreground mb-1.5">أسلوب التعلم الغالب والمفضل:</p>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-sm px-4 py-1.5 rounded-xl font-black bg-blue-600">
                  {profile?.learningStyle === 'LOGICAL' ? 'منطقي / استنتاجي (يستجيب جيداً للتسلسل والخطوات والمقارنة)' :
                   profile?.learningStyle === 'VISUAL' ? 'بصري / صوري (يستجيب للرسومات التوضيحية والخرائط الذهنية)' :
                   'اجتماعي / تفاعلي (يستجيب للمناقشات الثنائية والعمل الجماعي)'}
                </Badge>
                <span className="text-xs text-muted-foreground">معدل التطور: {profile?.performanceTrend}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-4 h-4" /> نقاط القوة والتميز الأكاديمي
                </p>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {profile?.strengthSubjects?.map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2.5">
                  <AlertCircle className="w-4 h-4" /> مجالات التركيز والدعم الموصى بها
                </p>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {profile?.weakSubjects?.map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {student?.notes && (
              <div className="bg-card border border-border p-4 rounded-2xl">
                <p className="text-xs font-bold text-muted-foreground mb-1">ملاحظة المعلم المعتمدة في ملف الفصل:</p>
                <p className="text-xs text-foreground font-medium leading-relaxed">{student.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visual Knowledge Map */}
        <Card className="flex flex-col items-center justify-center p-6 text-center rounded-3xl border-border">
          <CardTitle className="text-lg font-bold mb-4 w-full text-right flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            خريطة الكفايات المعرفية
          </CardTitle>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={displayRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="نسبة الإتقان" dataKey="mastery" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            توزيع نسبي لإتقان الطالب للمخرجات التعليمية الأساسية بكل مادة.
          </p>
        </Card>
      </div>

      {/* Detailed Skill Tree */}
      <Card className="rounded-3xl border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                شجرة المهارات والمعايير التفصيلية
              </CardTitle>
              <CardDescription>قائمة المهارات التأسيسية ومدى تحقيق معايير الإتقان المطلوبة</CardDescription>
            </div>
            <Badge variant="outline" className="font-bold border-primary/30">
              {skills.filter((s) => s.masteryLevel === 'MASTERED').length} من {skills.length} مهارات متقنة
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="border border-border rounded-2xl p-4 flex flex-col justify-between bg-card hover:border-primary/40 transition-colors shadow-sm"
              >
                <div>
                  <Badge variant="outline" className="mb-2 text-[11px] font-bold bg-muted">
                    {skill.skillNode.subject.name}
                  </Badge>
                  <h4 className="font-bold text-sm text-foreground mb-1">{skill.skillNode.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{skill.skillNode.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">درجة الإتقان:</span>
                  {skill.masteryLevel === 'MASTERED' ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40 font-bold">
                      متقن بتميز ✅
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300/40 font-bold">
                      قيد التعلم ⏳
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Observation Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-foreground mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              رصد ملاحظة ومتابعة للطالب: {student?.fullName}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              تسجل هذه الملاحظة وتصل فوراً في سجل الطالب وتقارير ولي الأمر
            </p>

            <form onSubmit={handleSaveObservation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">تصنيف الملاحظة:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'academic', label: 'تحصيل أكاديمي' },
                    { id: 'behavioral', label: 'سلوك ومواظبة' },
                    { id: 'attendance', label: 'انضباط وحضور' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNoteCategory(cat.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        noteCategory === cat.id ? 'bg-primary text-white border-primary' : 'bg-muted border-border'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">نوع الملاحظة:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'positive', label: 'إشادة وتميز ⭐' },
                    { id: 'warning', label: 'تنبيه ومتابعة ⚠️' },
                    { id: 'critical', label: 'إشعار عاجل 🚨' }
                  ].map((sev) => (
                    <button
                      key={sev.id}
                      type="button"
                      onClick={() => setNoteSeverity(sev.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        noteSeverity === sev.id ? 'bg-primary text-white border-primary' : 'bg-muted border-border'
                      }`}
                    >
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">نص الملاحظة والتوجيه:</label>
                <textarea
                  required
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="اكتب التوجيه أو الثناء أو الملاحظة الخاصة بهذا الطالب..."
                  className="w-full p-3 rounded-2xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNoteModal(false)}
                  className="rounded-xl font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={noteSaved}
                  className="rounded-xl font-bold bg-primary text-white"
                >
                  {noteSaved ? 'تم الحفظ بنجاح ✅' : 'حفظ الملاحظة وإرسالها'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
