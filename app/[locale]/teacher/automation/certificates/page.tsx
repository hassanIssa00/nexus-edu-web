'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  ArrowLeft,
  Printer,
  CheckCircle2,
  UserCheck,
  Star,
  Sparkles,
  Send,
  Users,
  ShieldCheck,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  OfficialCertificateDesign,
  type CertData,
} from '@/components/certificates/OfficialCertificateDesign';

/* ── Suggested Achievement Presets ── */
const SUGGESTED_ACHIEVEMENTS = [
  'التفوق الدراسي والأكاديمي العام',
  'التميز في القراءة والوعي الصوتي',
  'التقدم الملحوظ في مهارات التعلم الذكي',
  'التفوق والتميز في الرياضيات والحساب الذهني',
  'مهارات التواصل والانضباط الصفي الرفيع',
  'الالتزام والمداومة والتفوق المستمر',
];

const GRADE_PRESETS = [
  'الصف الأول الابتدائي — فئة (أ)',
  'الصف الأول الابتدائي — فئة (ب)',
  'الصف الثاني الابتدائي',
  'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي',
  'الصف الخامس الابتدائي',
  'الصف السادس الابتدائي',
];

const THEMES = [
  { id: 'emerald', name: 'الزمردي المدرسي (الإخلاص)', color: 'bg-emerald-600', border: 'border-emerald-600' },
  { id: 'gold', name: 'الكلاسيكي الذهبي الفاخر', color: 'bg-amber-500', border: 'border-amber-500' },
  { id: 'blue', name: 'العصري الأزرق الملكي', color: 'bg-blue-600', border: 'border-blue-600' },
];

export default function CertificatesAutomation() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [themeColor, setThemeColor] = useState<'emerald' | 'gold' | 'blue'>('emerald');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [statusAlert, setStatusAlert] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Initial Certificate Form State with Dynamic Teacher Fallback
  const [form, setForm] = useState<CertData>({
    certTitle: 'شـهـادة شـكـر وتـقـديـر',
    subTitle: 'تمنحها منصة نِكْسَس التعليمية الذكية بالتعاون مع مدارس الإخلاص الأهلية للبنين بجدة',
    teacherName: 'المعلم المشرف',
    teacherTitle: 'معلم الفصل والمشرف الأكاديمي',
    studentPrefix: 'يُسعدنا أن نتقدم بخالص الشكر والتقدير للطالب المتميز',
    studentName: 'علي إبراهيم سيد أحمد',
    gradeLabel: 'الصف الأول الابتدائي — فئة (أ)',
    achievementIntro: 'وذلك لتميزه الدراسي وتفوقه وجدارة الأداء العالي في:',
    achievement: 'التفوق والتميز في مهارات القراءة والحساب الذهني',
    score: 98,
    ratingText: 'ممتاز مع مرتبة الشرف 🏆',
    date: new Date().toLocaleDateString('ar-SA'),
    note: 'طالب متميز ومتفوق أظهر التزاماً استثنائياً ومهارات أكاديمية ملهمة.',
    certNumber: `NEXUS-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    themeColor: 'emerald',
  });

  // Load teacher from localStorage and real class students
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load logged in teacher info
        let teacherName = 'المعلم المشرف';
        let teacherTitle = 'معلم الفصل والمشرف الأكاديمي';
        const userJson = localStorage.getItem('nexus_user');
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user.name) {
            teacherName = user.name;
          }
          if (user.specialization) {
            teacherTitle = `معلم مادة ${user.specialization} والمشرف الأكاديمي`;
          } else if (user.title) {
            teacherTitle = user.title;
          }
        }

        // 2. Load real students from nexusBridge
        const { nexusBridge } = await import('@/lib/nexusDataBridge');
        const stList = nexusBridge.getStudents();
        setStudents(stList);

        if (stList.length > 0) {
          const first = stList[0];
          setSelectedStudentId(first.id);
          setForm((prev) => ({
            ...prev,
            teacherName,
            teacherTitle,
            studentName: first.fullName,
            gradeLabel: first.grade || prev.gradeLabel,
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            teacherName,
            teacherTitle,
          }));
        }
      } catch (err) {
        console.error('Error loading certificate page data:', err);
      }
    };

    loadData();
  }, []);

  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id);
    const st = students.find((s) => s.id === id);
    if (st) {
      setForm((prev) => ({
        ...prev,
        studentName: st.fullName,
        gradeLabel: st.grade || prev.gradeLabel,
        certNumber: `NEXUS-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      }));
    }
  };

  const generateNewSerial = () => {
    setForm((prev) => ({
      ...prev,
      certNumber: `NEXUS-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    }));
  };

  // Direct print modal function with A4 landscape standard
  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML)
      .join('\n');

    const content = document.getElementById('printable-certificate')?.outerHTML;
    if (!content) return;

    win.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <title>شهادة تفوق - ${form.studentName} - مدارس الإخلاص الأهلية ومنصة نكسس</title>
  ${styles}
  <style>
    @page { size: 297mm 210mm; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body {
      width: 297mm;
      height: 210mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #ffffff;
      font-family: 'Cairo', 'Amiri', Arial, sans-serif;
    }
    .cert-print-container {
      width: 297mm;
      height: 210mm;
      padding: 7mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div class="cert-print-container">
    <div style="width: 100%; height: 100%;">${content}</div>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 400);
    });
  </script>
</body>
</html>`);
    win.document.close();
  };

  // Send certificate directly to Student & Parent Portal
  const handleSendToPortal = async () => {
    setIsGenerating(true);
    try {
      const { nexusBridge } = await import('@/lib/nexusDataBridge');
      nexusBridge.issueCertificate({
        studentId: selectedStudentId || `std-${Date.now()}`,
        studentName: form.studentName,
        programTitle: form.certTitle,
        achievement: form.achievement,
        score: form.score,
        completionDate: form.date,
        doctorName: form.teacherName,
        doctorTitle: form.teacherTitle,
        badge: form.ratingText,
      });

      setStatusAlert(`تم إصدار الشهادة واعتمادها رسمياً للطالب (${form.studentName}) وإرسالها لبوابة الطالب وولي الأمر! 🚀`);
      setTimeout(() => setStatusAlert(null), 5000);
    } catch (e) {
      console.error(e);
      setStatusAlert('حدث خطأ أثناء اعتماد الشهادة.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Send WhatsApp notification to Parent
  const handleSendWhatsApp = () => {
    const student = students.find((s) => s.id === selectedStudentId);
    const parentPhone = student?.parentPhone ? student.parentPhone.replace(/\+/g, '') : '966500000000';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexus.masarplatform.org';
    const verifyUrl = `${origin}/verify/${form.certNumber}?name=${encodeURIComponent(form.studentName)}&prog=${encodeURIComponent(form.achievement)}&score=${form.score}&date=${encodeURIComponent(form.date)}`;

    const text =
      `🎖️ *شهادة تفوق وتكريم رقمية معتمدة — مدارس الإخلاص الأهلية ومنصة نِكْسَس*%0A%0A` +
      `👨‍👧‍👦 *المكرم ولي أمر الطالب البطل:* ${encodeURIComponent(student?.parentName || `ولي أمر ${form.studentName}`)}%0A` +
      `👤 *الطالب المتميز:* ${encodeURIComponent(form.studentName)}%0A` +
      `🏆 *الشهادة:* ${encodeURIComponent(form.certTitle)}%0A` +
      `🎯 *مجال التميز:* ${encodeURIComponent(form.achievement)}%0A` +
      `🌟 *التقدير المستحق:* ${encodeURIComponent(form.ratingText)} (بنسبة %${form.score})%0A` +
      `👨‍🏫 *المعلم المعتمد:* ${encodeURIComponent(form.teacherName)}%0A` +
      `✍️ *رقم التوثيق الرقمي:* ${form.certNumber}%0A%0A` +
      `💬 *ملاحظة المعلم:*%0A"${encodeURIComponent(form.note)}"%0A%0A` +
      `🔗 *رابط فحص واستعراض الشهادة الرقمية المعتمدة:*%0A${encodeURIComponent(verifyUrl)}`;

    window.open(`https://wa.me/${parentPhone}?text=${text}`, '_blank');
  };

  // Broadcast certificates to ALL students in the class
  const handleBroadcastAll = async () => {
    if (students.length === 0) return;
    setIsBroadcasting(true);
    try {
      const { nexusBridge } = await import('@/lib/nexusDataBridge');
      students.forEach((st, idx) => {
        nexusBridge.issueCertificate({
          studentId: st.id,
          studentName: st.fullName,
          programTitle: form.certTitle,
          achievement: form.achievement,
          score: st.averageGrade || form.score,
          completionDate: form.date,
          doctorName: form.teacherName,
          doctorTitle: form.teacherTitle,
          badge: form.ratingText,
        });
      });
      setStatusAlert(`تم إصدار الشهادات المعتمدة بنجاح لجميع طلاب الفصل (${students.length} طالب) مع التوثيق الرقمي! 🎓`);
      setTimeout(() => setStatusAlert(null), 5000);
    } catch (e) {
      console.error(e);
      setStatusAlert('حدث خطأ أثناء إصدار الشهادات.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Link href="/teacher/automation">
            <Button variant="outline" size="icon" className="rounded-2xl border-gray-200 dark:border-white/10">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
                <Award className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">شهادات التقدير والاعتماد الرقمية</h1>
            </div>
            <p className="text-gray-500 text-xs mt-1 mr-14 font-medium">
              نظام إصدار وطباعة شهادات التميز المعتمدة بشعار مدارس الإخلاص ومنصة نِكْسَس وتوقيع المعلم.
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBroadcastAll}
            disabled={isBroadcasting || students.length === 0}
            className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs h-10 px-4 shadow-sm"
          >
            {isBroadcasting ? (
              <Sparkles className="w-4 h-4 ml-1.5 animate-spin" />
            ) : (
              <Users className="w-4 h-4 ml-1.5" />
            )}
            منح الشهادة لجميع طلاب الفصل ({students.length})
          </Button>
        </div>
      </div>

      {statusAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{statusAlert}</span>
        </motion.div>
      )}

      {/* Main Studio Grid: Form (5 Cols) + Live Preview (7 Cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls & Customization */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Student Selection */}
          <Card className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#1e1e2d]/80 shadow-sm backdrop-blur-xl">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  اختيار الطالب المكرم
                </span>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                  {students.length} طلاب مسجلين
                </span>
              </div>

              <div>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#252538] px-3.5 py-2.5 text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- اضغط لاختيار الطالب --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      👨‍🎓 {st.fullName} — (المعدل: {st.averageGrade || 98}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Name Manual Override */}
              <div>
                <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                  اسم الطالب بالشهادة (يمكنك تعديله يدوياً):
                </label>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3.5 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                  الصف والمرحلة الدراسية:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.gradeLabel}
                    onChange={(e) => setForm((p) => ({ ...p, gradeLabel: e.target.value }))}
                    className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3.5 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    onChange={(e) => e.target.value && setForm((p) => ({ ...p, gradeLabel: e.target.value }))}
                    className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#252538] px-2 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none"
                  >
                    <option value="">اقتراحات...</option>
                    {GRADE_PRESETS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Teacher & Signature Info */}
          <Card className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#1e1e2d]/80 shadow-sm backdrop-blur-xl">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  بيانات المعلم والاعتماد (تظهر في الختم والتوقيع)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                    اسم المعلم المعتمد:
                  </label>
                  <input
                    type="text"
                    value={form.teacherName}
                    onChange={(e) => setForm((p) => ({ ...p, teacherName: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3 py-2 text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                    الصفة والمسمى الوظيفي:
                  </label>
                  <input
                    type="text"
                    value={form.teacherTitle}
                    onChange={(e) => setForm((p) => ({ ...p, teacherTitle: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                    تاريخ الإصدار:
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-black text-gray-600 dark:text-gray-300">الرقم التسلسلي:</label>
                    <button
                      onClick={generateNewSerial}
                      className="text-[10px] text-amber-600 hover:underline flex items-center gap-0.5 font-bold"
                    >
                      <RefreshCw size={10} /> جديد
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.certNumber}
                    onChange={(e) => setForm((p) => ({ ...p, certNumber: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3 py-2 text-xs font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Achievement, Rating & Color Theme */}
          <Card className="rounded-3xl border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#1e1e2d]/80 shadow-sm backdrop-blur-xl">
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                  مجال التفوق والتميز (حر أو اختيارات):
                </label>
                <textarea
                  value={form.achievement}
                  onChange={(e) => setForm((p) => ({ ...p, achievement: e.target.value }))}
                  rows={2}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3.5 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGGESTED_ACHIEVEMENTS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setForm((p) => ({ ...p, achievement: item }))}
                      className="rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 border border-gray-200/80 dark:border-white/10 px-2.5 py-1 text-[10px] font-bold text-gray-600 dark:text-gray-300 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score Slider & Rating Select */}
              <div className="space-y-3 rounded-2xl bg-gray-50 dark:bg-white/5 p-3.5 border border-gray-200/60 dark:border-white/5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-gray-700 dark:text-gray-200">نسبة التميز والتفوق</label>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono bg-white dark:bg-[#1e1e2d] px-2.5 py-0.5 rounded-lg border border-gray-200 dark:border-white/10">
                      %{form.score}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="100"
                    value={form.score}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      const rating =
                        s >= 95
                          ? 'ممتاز مع مرتبة الشرف 🏆'
                          : s >= 90
                          ? 'ممتاز مرتفع ⭐'
                          : s >= 80
                          ? 'جيد جداً مرتفع 🌟'
                          : 'جيد مرتفع ✨';
                      setForm((p) => ({ ...p, score: s, ratingText: rating }));
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                    نص التقدير الشرفي:
                  </label>
                  <select
                    value={form.ratingText}
                    onChange={(e) => setForm((p) => ({ ...p, ratingText: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="ممتاز مع مرتبة الشرف 🏆">ممتاز مع مرتبة الشرف 🏆</option>
                    <option value="ممتاز مرتفع ⭐">ممتاز مرتفع ⭐</option>
                    <option value="جيد جداً مرتفع 🌟">جيد جداً مرتفع 🌟</option>
                    <option value="تفوق وجدارة استثنائية 🎖️">تفوق وجدارة استثنائية 🎖️</option>
                  </select>
                </div>
              </div>

              {/* Theme Colors */}
              <div>
                <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1.5">
                  طابع ولون الشهادة:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemeColor(t.id as any);
                        setForm((p) => ({ ...p, themeColor: t.id as any }));
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 transition ${
                        themeColor === t.id
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                          : 'border-transparent bg-gray-50 dark:bg-white/5 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${t.color} shrink-0`} />
                      <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Encouragement Note */}
              <div>
                <label className="block text-[11px] font-black text-gray-600 dark:text-gray-300 mb-1">
                  ملاحظة تشجيعية من المعلم:
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                  rows={2}
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#252538] px-3.5 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* Dispatch Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleSendToPortal}
                  disabled={isGenerating || !form.studentName.trim()}
                  className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 ml-1.5" />
                  اعتماد وإرسال لبوابة الطالب وولي الأمر 🚀
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleSendWhatsApp}
                    variant="outline"
                    className="rounded-2xl border-gray-200 dark:border-white/10 text-xs font-black h-10 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                  >
                    <Send className="w-3.5 h-3.5 ml-1.5" />
                    إشعار WhatsApp 📱
                  </Button>
                  <Button
                    onClick={handlePrint}
                    className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black h-10 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 ml-1.5" />
                    طباعة PDF 🖨️
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Certificate Canvas Preview */}
        <div className="lg:col-span-7 space-y-3 sticky top-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              معاينة حية للشهادة المعتمدة بشعار نِكْسَس ومدارس الإخلاص
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="rounded-xl h-8 text-xs font-black border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <Printer className="w-3.5 h-3.5 ml-1" />
                استخراج وطباعة
              </Button>
            </div>
          </div>

          {/* Master Certificate Preview Component */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-slate-950 p-2 sm:p-3 shadow-2xl overflow-x-auto">
            <div className="min-w-[650px]" ref={printContainerRef}>
              <OfficialCertificateDesign form={form} isPrintTarget={false} />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center font-bold">
            💡 يتم استخراج الشهادة بدقة عالية A4 Landscape مع كود التحقق الرقمي وختم المعلم وشعارات المنصة والمدرسة.
          </p>
        </div>
      </div>

      {/* Hidden container for print rendering */}
      <div style={{ display: 'none' }}>
        <div id="printable-certificate">
          <OfficialCertificateDesign form={form} isPrintTarget={true} />
        </div>
      </div>
    </div>
  );
}
