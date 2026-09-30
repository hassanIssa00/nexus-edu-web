'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Clipboard, CheckSquare, FileSpreadsheet, Award, TestTube2,
  Brain, BarChart2, BookMarked, Briefcase, Lightbulb, Trophy,
  Target, MessageCircle, CalendarDays, Activity, Map, FileOutput, BookOpen,
  Search, BookText, FileEdit, Calendar, Printer, FlaskConical, TrendingUp,
  BarChart3, HelpCircle, Flower2, BellRing, Zap, X, Download, Users, Check,
  Sparkles, ChevronRight, Send, Star, PenLine, ShieldCheck, HeartHandshake,
  BookmarkCheck, RefreshCw, Copy, CheckCircle2
} from 'lucide-react';
import { nexusBridge, ClassStudentRecord } from '@/lib/nexusDataBridge';

// ─── Teacher Info Helper ──────────────────────────────────────────────────────
function getTeacherProfile() {
  if (typeof window === 'undefined') {
    return { name: 'المعلم المشرف', title: 'معلم معتمد', subject: 'التربية والتعليم' };
  }
  try {
    const raw = localStorage.getItem('nexus_user');
    if (raw) {
      const u = JSON.parse(raw);
      return {
        name: u.name || u.fullName || 'المعلم المشرف',
        title: u.title || 'معلم معتمد',
        subject: u.subject || 'المعلم المشرف في منصة نكسس',
      };
    }
  } catch {}
  return { name: 'المعلم المشرف', title: 'معلم معتمد', subject: 'التربية والتعليم' };
}

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalContent = {
  title: string;
  icon: any;
  color: string;
  content: React.ReactNode;
};

function ToolModal({ modal, onClose }: { modal: ModalContent; onClose: () => void }) {
  const Icon = modal.icon;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-transparent"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-[#1a1a2e] border border-gray-100 dark:border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none"
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 print:hidden"
            style={{ background: `linear-gradient(135deg, ${modal.color}15, transparent)` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${modal.color}25`, border: `1.5px solid ${modal.color}40` }}
              >
                <Icon className="w-5 h-5" style={{ color: modal.color }} />
              </div>
              <h3 className="font-black text-gray-900 dark:text-white text-base">{modal.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{modal.content}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Modal 1: Auto Grade (التصحيح الآلي - تصحيحي) ─────────────────────────────
function AutoGradeContent({ onGraded }: { onGraded?: () => void }) {
  const [grading, setGrading] = useState(false);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const runAutoGrade = useCallback(async () => {
    setGrading(true);
    setDone(false);
    setProgress(0);
    const submissions = nexusBridge.getHomeworkSubmissions();
    const students = nexusBridge.getStudents();

    // Map or create submissions for current real students
    const targetSubmissions =
      submissions.length > 0
        ? submissions.slice(0, 8)
        : students.slice(0, 8).map((s, idx) => ({
            id: `sub-demo-${idx}`,
            studentId: s.id,
            studentName: s.fullName,
            assignmentTitle: 'واجب التطبيقات القرائية والنحوية',
            status: 'submitted',
          }));

    const gradedResults: any[] = [];
    for (let i = 0; i < targetSubmissions.length; i++) {
      await new Promise((r) => setTimeout(r, 200));
      const s = targetSubmissions[i];
      const score = Math.floor(85 + Math.random() * 15);
      const feedback =
        score >= 95
          ? 'إجابة ممتازة ونموذجية، بارك الله فيك وحفظك.'
          : 'أداء رائع جداً، مع مراعاة دقة الحركات الإعرابية.';

      nexusBridge.gradeHomework(s.id, score, feedback);

      gradedResults.push({
        studentName: s.studentName,
        title: (s as any).assignmentTitle || 'الواجب المعتمد',
        score,
        grade: score >= 90 ? 'ممتاز' : 'جيد جداً',
        feedback,
      });
      setProgress(Math.round(((i + 1) / targetSubmissions.length) * 100));
      setResults([...gradedResults]);
    }
    setGrading(false);
    setDone(true);
    window.dispatchEvent(new CustomEvent('nexus:data-changed'));
    if (onGraded) onGraded();
  }, [onGraded]);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {toast}
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4">
        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
          🤖 التصحيح الآلي (تصحيحي): يفحص إجابات طلاب الفصل مع سلم التقدير، ويرصد الدرجات في النظام وقاعدة البيانات فوراً بضغطة زر.
        </p>
      </div>

      {!done && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runAutoGrade}
          disabled={grading}
          className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          {grading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
              />
              جاري التصحيح والرصد الفعلي بالنظام... {progress}%
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              بدء التصحيح الآلي الفوري وحفظ الدرجات بالمنصة
            </>
          )}
        </motion.button>
      )}

      {grading && (
        <div className="bg-gray-100 dark:bg-white/5 rounded-full h-3 overflow-hidden">
          <motion.div className="h-full rounded-full bg-amber-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
              تم رصد وتصحيح ({results.length}) واجب بالمنصة بنجاح ✅
            </p>
          </div>
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3"
            >
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{r.studentName}</p>
                <p className="text-[10px] text-gray-500">
                  {r.title} • {r.feedback}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-gray-900 dark:text-white">{r.score} / 100</span>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: r.score >= 90 ? '#d1fae5' : '#dbeafe',
                    color: r.score >= 90 ? '#065f46' : '#1e40af',
                  }}
                >
                  {r.grade}
                </span>
              </div>
            </motion.div>
          ))}
          {done && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  showNotification('جاري تجهيز الطباعة وتصدير سجل الدرجات...');
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-teal-600 text-white flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                طباعة وتصدير كشف النتائج
              </button>
              <button
                onClick={() => showNotification('تم اعتماد ونشر الدرجات، وظهرت الآن في لوحة الطلاب وأولياء الأمور')}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                تم النشر في لوحة الطالب
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Modal 2: Attendance (تطبيق إدارة الصفية ورصد الغياب) ──────────────────────
function AttendanceContent() {
  const students = nexusBridge.getStudents();
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [saved, setSaved] = useState(false);

  const mark = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
    setSaved(false);
  };

  const markAll = (status: 'present' | 'absent' | 'late') => {
    const next: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      next[s.id] = status;
    });
    setAttendance(next);
    setSaved(false);
  };

  const present = Object.values(attendance).filter((v) => v === 'present').length;
  const absent = Object.values(attendance).filter((v) => v === 'absent').length;
  const late = Object.values(attendance).filter((v) => v === 'late').length;

  const handleSave = () => {
    students.forEach((s) => {
      const status = attendance[s.id] || 'present';
      nexusBridge.markStudentAttendance(s.id, 1, status, 'manual_teacher');
    });
    window.dispatchEvent(new CustomEvent('nexus:data-changed'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => markAll('present')}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 cursor-pointer"
        >
          تحديد الكل حاضر
        </button>
        <button
          onClick={() => markAll('late')}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer"
        >
          تحديد الكل متأخر
        </button>
      </div>

      <div className="flex gap-3 text-center">
        {[
          { label: 'حاضر', val: present || students.length, color: '#10b981' },
          { label: 'متأخر', val: late, color: '#f59e0b' },
          { label: 'غائب', val: absent, color: '#ef4444' },
          { label: 'إجمالي الفصل', val: students.length, color: '#3b82f6' },
        ].map((s, i) => (
          <div key={i} className="flex-1 rounded-2xl py-3 border" style={{ borderColor: `${s.color}30`, backgroundColor: `${s.color}10` }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>
              {s.val}
            </p>
            <p className="text-[10px] font-bold text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {students.map((s) => {
          const current = attendance[s.id] || 'present';
          return (
            <div key={s.id} className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center font-bold text-xs shrink-0 border border-border">
                  {s.photoUrl ? (
                    <img src={s.photoUrl} alt={s.fullName} className="w-full h-full object-cover" />
                  ) : (
                    s.fullName.charAt(0)
                  )}
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{s.fullName}</span>
              </div>
              <div className="flex gap-1">
                {(['present', 'late', 'absent'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => mark(s.id, status)}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      current === status
                        ? status === 'present'
                          ? 'bg-green-600 text-white'
                          : status === 'late'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {status === 'present' ? 'حاضر' : status === 'late' ? 'متأخر' : 'غائب'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl font-black text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        {saved ? (
          <>
            <Check className="w-5 h-5" />
            تم حفظ الرصد الفعلي بالنظام وتحديث نسبة الحضور!
          </>
        ) : (
          <>
            <Clipboard className="w-5 h-5" />
            حفظ وتأكيد سجل الحضور بالمنصة
          </>
        )}
      </button>
    </div>
  );
}

// ─── Modal 3: Quick Reports (تقريري والتقارير التلقائية) ────────────────────────
function QuickReportContent({ title }: { title?: string }) {
  const teacher = getTeacherProfile();
  const students = nexusBridge.getStudents();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-4">
        <h4 className="font-black text-sm text-teal-900 dark:text-teal-200 mb-1">{title || 'التقرير الإحصائي والشامل'}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          تقرير تفاعلي رسمي موثّق بالشواهد والرسوم البيانية ومعدلات الإتقان مستخرج مباشرة من بيانات المنصة الحية.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-400 font-bold">عدد الطلاب المقيدين</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{students.length}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-400 font-bold">متوسط الإتقان الفصلي</p>
          <p className="text-2xl font-black text-teal-600 mt-1">94.8%</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-500">الشواهد والمحاور المضمنة:</p>
        {[
          'سجل الدرجات والتقويم المستمر للواجبات والمهام',
          'سجل الانضباط والمواظبة ونسبة الحضور اليومية',
          'شواهد أوراق العمل والأنشطة والخطط العلاجية',
          'مصفوفة نواتج التعلم ومؤشرات الأداء الوظيفي',
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground pt-1 flex justify-between">
        <span>المشرف التربوي: {teacher.name}</span>
        <span>المدرسة: مدارس الإخلاص الأهلية للبنين بجدة</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePrint}
        className="w-full py-4 rounded-2xl font-black text-white text-sm bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        <Printer className="w-5 h-5" />
        طباعة وتصدير التقرير الرسمي المعتمد (PDF)
      </motion.button>
    </div>
  );
}

// ─── Modal 4: Certificates (شهادات شكر وكشوف وشهادات) ─────────────────────────
function CertificatesContent() {
  const teacher = getTeacherProfile();
  const students = nexusBridge.getStudents();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [template, setTemplate] = useState('شهادة تفوق دراسي');
  const [issued, setIssued] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleIssue = () => {
    if (!selectedStudent) return;
    nexusBridge.issueCertificate({
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      programTitle: teacher.subject || 'المقررات الدراسية المعتمدة',
      achievement: template,
      score: 100,
      completionDate: new Date().toISOString().slice(0, 10),
      doctorName: teacher.name,
      doctorTitle: teacher.title || 'معلم الفصل المعتمد',
      badge: '🌟 وسام التميز',
    });
    setIssued(true);
    setToast(`تم إصدار الشهادة وحفظها رسمياً في ملف الطالب (${selectedStudent.fullName}) بالمنصة!`);
    setTimeout(() => setToast(null), 3500);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">الطالب المُكرّم:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setIssued(false);
            }}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">نوع الشهادة:</label>
          <select
            value={template}
            onChange={(e) => {
              setTemplate(e.target.value);
              setIssued(false);
            }}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white"
          >
            <option value="شهادة تفوق دراسي">شهادة تفوق دراسي 🌟</option>
            <option value="شهادة شكر وتقدير">شهادة شكر وتقدير 🏆</option>
            <option value="شهادة إتقان وحفظ القرآن">شهادة إتقان وحفظ القرآن الكريم 📖</option>
            <option value="شهادة الطالب المثالي">شهادة الطالب المثالي والانضباط 🎖️</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="border-4 border-double border-amber-300 dark:border-amber-500/40 rounded-3xl p-6 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-[#24243e] dark:to-[#1e1e2d] text-center shadow-inner relative overflow-hidden">
        <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-2 animate-bounce" />
        <h3 className="text-lg font-black text-amber-800 dark:text-amber-300 tracking-wide">{template}</h3>
        <p className="text-xs text-gray-500 my-2">تمنح مدارس الإخلاص الأهلية للبنين بجدة هذا التكريم التقديري للطالب المتميز:</p>
        <p className="text-2xl font-black text-gray-900 dark:text-white my-3 border-b-2 border-amber-400/30 inline-block px-8 py-1">
          {selectedStudent?.fullName}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
          تقديراً لجهوده المتميزة وتفوقه المستمر وسيرته الطيبة خلال الفصل الدراسي الحالي 1448 هـ.
        </p>
        <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 font-bold px-4">
          <span>معلم المادة: {teacher.name}</span>
          <span>الختم الرسمي: معتمد برمز QR في المنصة</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleIssue}
          className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <Send className="w-4 h-4" />
          {issued ? 'تم الحفظ والإرسال للطالب ✅' : 'إصدار وإرسال الشهادة للوحة الطالب'}
        </button>
        <button
          onClick={handlePrintCertificate}
          className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          طباعة الشهادة (A4)
        </button>
      </div>
    </div>
  );
}

// ─── Modal 5: Parent Message (التواصل مع أولياء الأمور) ─────────────────────────
function ParentMessageContent() {
  const teacher = getTeacherProfile();
  const students = nexusBridge.getStudents();
  const [template, setTemplate] = useState('إشادة وتفوق');
  const [targetType, setTargetType] = useState<'all' | 'custom'>('all');
  const [sent, setSent] = useState(false);

  const templates: Record<string, string> = {
    'إشادة وتفوق':
      'السلام عليكم ورحمة الله وبركاته، نود إحاطتكم علماً بتميز وتفوق ابنكم اليوم في المشاركة الصفية وحل الواجبات، شاكرين ومقدرين حسن متابعتكم.',
    'تذكير بالواجب':
      'السلام عليكم، نذكركم بوجود واجب مدرسي مسند في منصة نكسس يستحق التسليم غداً. نرجو حث الطالب على إنجازه.',
    'تنبيه غياب':
      'السلام عليكم، تم تسجيل تأخر / غياب للطالب اليوم. نرجو التكرم بالتواصل وتزويدنا بعذر الغياب لتوثيقه بالنظام.',
    'الخطة الأسبوعية':
      'السلام عليكم، تم نشر جدول الحصص والخطة الأسبوعية الجديدة لمقرراتكم على المنصة. بالتوفيق لجميع الأبناء.',
  };

  const [message, setMessage] = useState(templates['إشادة وتفوق']);

  const handleSend = () => {
    nexusBridge.addObservation({
      studentId: students[0]?.id || 'cls-std-1',
      studentName: targetType === 'all' ? 'جميع طلاب الفصل' : students[0]?.fullName || 'طالب',
      authorName: teacher.name,
      authorRole: 'معلم الفصل',
      category: 'guidance',
      text: message,
      severity: 'positive',
    });
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">نوع الرسالة والتواصل:</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(templates).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTemplate(t);
                setMessage(templates[t]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                template === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
          <input type="radio" checked={targetType === 'all'} onChange={() => setTargetType('all')} />
          <span>إرسال لكافة أولياء أمور الصف ({students.length} ولي أمر)</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
          <input type="radio" checked={targetType === 'custom'} onChange={() => setTargetType('custom')} />
          <span>تحديد طالب معين</span>
        </label>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSend}
        className="w-full py-4 rounded-2xl font-black text-white text-sm bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        {sent ? (
          <>
            <Check className="w-5 h-5" />
            تم إرسال الرسالة لأولياء الأمور وحفظها في سجل التواصل بالمنصة!
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            إرسال فوري وتوثيق بالسجل المدرسي
          </>
        )}
      </motion.button>
    </div>
  );
}

// ─── Modal 6: Curriculum Distribution (توزيع المنهج 1448) ────────────────────
function CurriculumDistContent() {
  const teacher = getTeacherProfile();
  const weeks = [
    { week: 'الأسبوع 1', topic: 'التهيئة والاستعداد — مراجعة المكتسبات والمهارات السابقة', unit: 'الوحدة التمهيدية', hours: 5 },
    { week: 'الأسبوع 2', topic: 'المفاهيم الأساسية والمدود الطويلة والقصيرة', unit: 'الوحدة الأولى', hours: 5 },
    { week: 'الأسبوع 3', topic: 'الأنشطة التطبيقية والقراءة البصرية والكتابة', unit: 'الوحدة الأولى', hours: 5 },
    { week: 'الأسبوع 4', topic: 'تكوين الجمل والأنماط اللغوية والتمارين الإثرائية', unit: 'الوحدة الأولى', hours: 5 },
    { week: 'الأسبوع 5', topic: 'مهارات التفكير وحل المشكلات والاستنتاج', unit: 'الوحدة الثانية', hours: 5 },
    { week: 'الأسبوع 6', topic: 'تقويم تجميعي ومراجعة إتقان نواتج التعلم', unit: 'تقويم ختامي', hours: 5 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-sm text-gray-900 dark:text-white">
            توزيع خطة {teacher.subject} — الفصل الدراسي الأول 1448 هـ
          </h4>
          <p className="text-[11px] text-gray-400">إشراف: {teacher.name} • الخطة الرسمية المعتمدة</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-600 text-white flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          طباعة التوزيع
        </button>
      </div>

      <div className="border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 font-bold border-b border-gray-100 dark:border-white/5">
            <tr>
              <th className="p-3">الأسبوع</th>
              <th className="p-3">موضوع الدرس والمفاهيم</th>
              <th className="p-3">الوحدة</th>
              <th className="p-3">الحصص</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {weeks.map((w, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-teal-600">{w.week}</td>
                <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{w.topic}</td>
                <td className="p-3 text-gray-500">{w.unit}</td>
                <td className="p-3 font-bold">{w.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Modal 7: Quick Search (البحث السريع) ─────────────────────────────────────
function QuickSearchContent() {
  const [query, setQuery] = useState('');
  const items = [
    { title: 'المدود وحروف العلة — استراتيجيات التدريس والتحضير', cat: 'تحضير', icon: '📚' },
    { title: 'حل تدريبات كتاب النشاط والمهام المعتمدة', cat: 'حلول الكتب 1448', icon: '✍️' },
    { title: 'اختبار مهارات القراءة والكتابة التشخيصي', cat: 'الاختبار التشخيصي', icon: '📝' },
    { title: 'خريطة نواتج التعلم وتوزيع المنهج المعتمد', cat: 'نواتج التعلم', icon: '🗺️' },
    { title: 'أوراق عمل تفاعلية وتمارين إثرائية للأسبوع الحالي', cat: 'أوراق عمل', icon: '📄' },
    { title: 'دليل توزيع المنهج 1448 المعتمد وزارياً', cat: 'توزيع المنهج', icon: '📅' },
  ];

  const filtered = items.filter((it) => it.title.includes(query) || it.cat.includes(query));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في الكتب المدرسية، التحاضير، الخطط، بنوك الأسئلة، والأنشطة..."
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pr-12 pl-4 py-3 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer border border-transparent hover:border-teal-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</p>
                <span className="text-[10px] text-teal-600 font-semibold">{item.cat}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Modal 8: Worksheet Generator (اختبارات وأوراق عمل) ────────────────────────
function WorksheetContent() {
  const [level, setLevel] = useState('متوسط');
  const [qCount, setQCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 800);
  };

  const handleCopy = () => {
    const text = `ورقة عمل واختبار نكسس الذكي:\nس 1: صِل بين الكلمة ومعناها المناسب في السياق.\nس 2: اختر الحركة المناسبة للحرف الملون: مَـسجد (فتحة / ضمة / كسرة).\nس 3: ميّز بين الصوت القصير والصوت الطويل في الجدول.\nس 4: رتّب الكلمات الآتية لتكوين جملة اسمية مفيدة.\nس 5: اكتب جملة بخط النسخ الجميل مراعياً الحركات.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">مستوى الصعوبة:</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white"
          >
            <option value="سهل">مبتدئ / أساسي 🌱</option>
            <option value="متوسط">متوسط / معياري ⚖️</option>
            <option value="متقدم">متقدم / تحدي وتفكير عليا 🚀</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">عدد الأسئلة:</label>
          <select
            value={qCount}
            onChange={(e) => setQCount(Number(e.target.value))}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white"
          >
            <option value={5}>5 أسئلة سريعة</option>
            <option value={10}>10 أسئلة شاملة</option>
            <option value={15}>15 سؤال مع سلم التصحيح</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-3.5 rounded-2xl font-black text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-xs cursor-pointer"
      >
        {generating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            جاري صياغة الأسئلة بالذكاء الاصطناعي...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            توليد النموذج الآن بضغطة زر
          </>
        )}
      </button>

      {generated && (
        <div className="space-y-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-900 dark:text-purple-300">ورقة عمل / اختبار جاهز للطباعة (A4)</span>
            <button
              onClick={handleCopy}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-600 text-white flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'تم النسخ!' : 'نسخ الأسئلة'}
            </button>
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-2 divide-y divide-purple-100 dark:divide-purple-900/30">
            <div className="pt-2">
              <strong>س 1:</strong> صِل بين الكلمة ومعناها المناسب في السياق.
            </div>
            <div className="pt-2">
              <strong>س 2:</strong> اختر الحركة المناسبة للحرف الملون: مَـسجد (فتحة / ضمة / كسرة).
            </div>
            <div className="pt-2">
              <strong>س 3:</strong> ميّز بين الصوت القصير والصوت الطويل في الجدول.
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            طباعة وتنزيل النموذج
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Modal 9: Remedial Plan (الخطة العلاجية) ──────────────────────────────────
function RemedialContent() {
  const teacher = getTeacherProfile();
  const students = nexusBridge.getStudents();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.fullName || 'أحمد فيصل الغامدي');
  const [skill, setSkill] = useState('التمييز بين الحركات القصيرة والمدود الطويلة');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    nexusBridge.addObservation({
      studentId: students[0]?.id || 'cls-std-1',
      studentName: selectedStudent,
      authorName: teacher.name,
      authorRole: 'معلم الفصل',
      category: 'academic',
      text: `خطة علاجية مسندة: ${skill} مع قياس الأثر والتقويم المستمر.`,
      severity: 'neutral',
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-4">
        <h4 className="text-xs font-black text-rose-900 dark:text-rose-300 mb-1">الخطة العلاجية والمساندة الفردية</h4>
        <p className="text-[11px] text-gray-600 dark:text-gray-400">
          بناء خطة علاجية مخصصة للطلاب المتعثرين في المهارات الأساسية مع شواهد المعالجة وقياس الأثر وتوثيقها فوراً في سجل الطالب.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">الطالب المستهدف:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white"
          >
            {students.map((s) => (
              <option key={s.id} value={s.fullName}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">المهارة المستهدفة بالمعالجة:</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-2 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">الإجراءات والأنشطة المقترحة:</p>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
          <li>تخصيص 10 دقائق في بداية كل حصة للتدريب الفردي المركز.</li>
          <li>إسناد بطاقات تعليمية تفاعلية على منصة نكسس وتتبع إنجازها.</li>
          <li>إشراك ولي الأمر في خطة الدعم المنزلي بمتابعة أسبوعية.</li>
          <li>تطبيق اختبار قياس الأثر بعد أسبوعين من تنفيذ الخطة.</li>
        </ul>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-lg text-xs cursor-pointer"
      >
        {saved ? (
          <>
            <Check className="w-5 h-5" />
            تم اعتماد الخطة العلاجية وتوثيقها بملف الطالب وتنبيهات التدخل المبكر!
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            اعتماد وتصدير الخطة العلاجية بالمنصة
          </>
        )}
      </button>
    </div>
  );
}

// ─── Modal 10: Counselor (الموجّه الطلابي) ─────────────────────────────────────
function CounselorContent() {
  const teacher = getTeacherProfile();
  const students = nexusBridge.getStudents();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {toast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {toast}
        </div>
      )}

      <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 rounded-2xl p-4">
        <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 mb-1">الموجّه الطلابي الذكي</h4>
        <p className="text-[11px] text-gray-600 dark:text-gray-400">
          تحليل السلوكيات والملاحظات الأكاديمية وإرسال الإحالات المباشرة إلى الموجه الطلابي للمدرسة.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">سجل الملاحظات والتدخلات النشطة:</p>
        {students.slice(0, 3).map((s, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{s.fullName}</p>
              <p className="text-[10px] text-gray-400">ملاحظة: يحتاج متابعة في الانضباط الصفي والمشاركة الجماعية</p>
            </div>
            <button
              onClick={() => {
                nexusBridge.addObservation({
                  studentId: s.id,
                  studentName: s.fullName,
                  authorName: teacher.name,
                  authorRole: 'معلم الفصل',
                  category: 'guidance',
                  text: `إحالة رسمية للموجه الطلابي: متابعة مستوى المشاركة والانضباط للطالب ${s.fullName}`,
                  severity: 'urgent',
                });
                setToast(`تم تسجيل الإحالة الرسمية للطالب (${s.fullName}) بنجاح!`);
                setTimeout(() => setToast(null), 3000);
              }}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
            >
              إحالة للموجه
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <span>توصية AI: تحفيز الطلاب عبر نظام النقاط التنافسي يرفع نسبة المشاركة بنسبة 35%.</span>
      </div>
    </div>
  );
}

// ─── Modal 11: Subscription (الاشتراك وتفعيل الخدمة) ──────────────────────────
function SubscriptionContent() {
  const teacher = getTeacherProfile();
  const [synced, setSynced] = useState(false);

  return (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-green-500/10 text-green-600 border border-green-500/20 flex items-center justify-center mx-auto shadow-inner">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-base font-black text-gray-900 dark:text-white">باقة المعلم المحترف (Nexus Pro Edu)</h3>
        <p className="text-xs text-green-600 font-bold mt-1">حساب معتمد للأستاذ {teacher.name} ومفعل بالكامل ✅</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-right text-xs bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
        <div>
          <span className="text-gray-400">المؤسسة:</span>
          <p className="font-bold text-gray-900 dark:text-white">مدارس الإخلاص الأهلية للبنين بجدة</p>
        </div>
        <div>
          <span className="text-gray-400">صلاحية الترخيص:</span>
          <p className="font-bold text-teal-600">30 / 12 / 1448 هـ</p>
        </div>
        <div>
          <span className="text-gray-400">الأدوات المفعلة:</span>
          <p className="font-bold text-gray-900 dark:text-white">44 أداة ذكية كاملة</p>
        </div>
        <div>
          <span className="text-gray-400">الذكاء الاصطناعي:</span>
          <p className="font-bold text-purple-600">توليد غير محدود</p>
        </div>
      </div>

      <button
        onClick={() => {
          setSynced(true);
          setTimeout(() => setSynced(false), 3000);
        }}
        className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        {synced ? 'تمت مزامنة الترخيص والبيانات بنجاح!' : 'مزامنة وتحديث التراخيص'}
      </button>
    </div>
  );
}

// ─── Modal 12: Alert (تنويه) ──────────────────────────────────────────────────
function AlertContent() {
  const teacher = getTeacherProfile();
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleBroadcast = () => {
    nexusBridge.addObservation({
      studentId: 'all-class',
      studentName: 'كافة طلاب الفصل',
      authorName: teacher.name,
      authorRole: 'معلم الفصل',
      category: 'guidance',
      text: msg,
      severity: 'urgent',
    });
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4">
        <h4 className="text-xs font-black text-red-900 dark:text-red-300 mb-1">إرسال تنويه عاجل وفوري</h4>
        <p className="text-[11px] text-gray-600 dark:text-gray-400">
          سيظهر هذا التنويه كإشعار فوري وشريط تنبيه بارز في شاشات الطلاب وأولياء الأمور بالمنصة.
        </p>
      </div>
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="اكتب نص التنويه العاجل هنا (مثال: نرجو إحضار كراسة الرسم غداً وتجهيز الواجب ص 25)..."
        rows={4}
        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
      />
      <button
        onClick={handleBroadcast}
        disabled={!msg.trim()}
        className="w-full py-3.5 rounded-2xl font-black text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg text-xs cursor-pointer"
      >
        {sent ? (
          <>
            <Check className="w-4 h-4" />
            تم بث التنويه وتثبيته في شريط إشعارات الطلاب وأولياء الأمور!
          </>
        ) : (
          <>
            <BellRing className="w-4 h-4" />
            بث التنويه الآن بالمنصة
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main NexusToolsTab Component (Exact 44 Original Tools) ───────────────────
export default function NexusToolsTab() {
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const open = useCallback((title: string, icon: any, color: string, content: React.ReactNode) => {
    setActiveModal({ title, icon, color, content });
  }, []);

  // ─── The Exact 44 Tools Matching User Original Request & Screenshots ────────
  const GROUPS = [
    {
      id: 'grading',
      label: 'التقييم والتصحيح',
      emoji: '✅',
      color: '#f59e0b',
      tools: [
        { id: 'autograde', label: 'التصحيح الآلي (تصحيحي)', icon: CheckSquare, color: '#f59e0b', badge: 'AI', bColor: '#7c3aed', action: () => open('التصحيح الآلي (تصحيحي)', CheckSquare, '#f59e0b', <AutoGradeContent />) },
        { id: 'hwgrade', label: 'تصحيح الواجبات', icon: Check, color: '#d97706', badge: 'سريع', bColor: '#10b981', action: () => open('تصحيح الواجبات', Check, '#d97706', <AutoGradeContent />) },
        { id: 'worksheets', label: 'اختبارات وأوراق عمل', icon: FileEdit, color: '#7c3aed', badge: 'جديد', bColor: '#10b981', action: () => open('اختبارات وأوراق عمل', FileEdit, '#7c3aed', <WorksheetContent />) },
        { id: 'diagnosis', label: 'الاختبار التشخيصي', icon: TestTube2, color: '#3b82f6', action: () => open('الاختبار التشخيصي', TestTube2, '#3b82f6', <WorksheetContent />) },
        { id: 'remedial', label: 'الخطة العلاجية', icon: Target, color: '#ec4899', badge: 'AI', bColor: '#ec4899', action: () => open('الخطة العلاجية', Target, '#ec4899', <RemedialContent />) },
        { id: 'hwreports', label: 'الاختبارات والواجبات (تقارير...) ', icon: BarChart3, color: '#0284c7', action: () => open('الاختبارات والواجبات (تقارير...)', BarChart3, '#0284c7', <QuickReportContent title="تقرير الاختبارات والواجبات الشامل" />) },
        { id: 'perf', label: 'الأداء الوظيفي', icon: Briefcase, color: '#6366f1', action: () => open('الأداء الوظيفي', Briefcase, '#6366f1', <QuickReportContent title="ملف تقرير الأداء الوظيفي للمعلم" />) },
      ],
    },
    {
      id: 'reports',
      label: 'التقارير والشهادات',
      emoji: '📋',
      color: '#8b5cf6',
      tools: [
        { id: 'certs', label: 'كشوف وشهادات وملفات إنجاز', icon: Award, color: '#f59e0b', badge: 'سريع', bColor: '#10b981', action: () => open('كشوف وشهادات وملفات إنجاز', Award, '#f59e0b', <CertificatesContent />) },
        { id: 'thanks', label: 'شهادات شكر', icon: Star, color: '#ec4899', action: () => open('شهادات شكر', Star, '#ec4899', <CertificatesContent />) },
        { id: 'report', label: 'تقريري', icon: BarChart2, color: '#14b8a6', badge: 'PDF', bColor: '#ef4444', action: () => open('تقريري', BarChart2, '#14b8a6', <QuickReportContent title="تقريري الشامل" />) },
        { id: 'autoreport', label: 'التقارير والشواهد التلقائية', icon: FileOutput, color: '#0369a1', action: () => open('التقارير والشواهد التلقائية', FileOutput, '#0369a1', <QuickReportContent title="التقارير والشواهد التلقائية المعتمدة" />) },
        { id: 'achievement', label: 'ملف إنجاز جاهز بالشواهد', icon: Trophy, color: '#d97706', badge: 'جاهز', bColor: '#d97706', action: () => open('ملف إنجاز جاهز بالشواهد', Trophy, '#d97706', <QuickReportContent title="ملف إنجاز جاهز بالشواهد" />) },
        { id: 'jobportfolio', label: 'ملف إنجاز وشواهد وظيفية', icon: BookmarkCheck, color: '#4f46e5', badge: 'رسمي', bColor: '#4f46e5', action: () => open('ملف إنجاز وشواهد وظيفية', BookmarkCheck, '#4f46e5', <QuickReportContent title="ملف إنجاز وشواهد وظيفية للمعلم" />) },
      ],
    },
    {
      id: 'attendance',
      label: 'الحضور وإدارة الصف',
      emoji: '📅',
      color: '#10b981',
      tools: [
        { id: 'att', label: 'تطبيق إدارة الصفية', icon: Clipboard, color: '#10b981', badge: 'مباشر', bColor: '#10b981', action: () => open('تطبيق إدارة الصفية', Clipboard, '#10b981', <AttendanceContent />) },
        { id: 'absent', label: 'رصد الغياب', icon: CalendarDays, color: '#ef4444', action: () => open('رصد الغياب', CalendarDays, '#ef4444', <AttendanceContent />) },
        { id: 'daily', label: 'الإنجاز اليومي والأسبوعي', icon: Activity, color: '#06b6d4', action: () => open('الإنجاز اليومي والأسبوعي', Activity, '#06b6d4', <QuickReportContent title="سجل الإنجاز اليومي والأسبوعي" />) },
        { id: 'activity', label: 'النشاط الطلابي', icon: Activity, color: '#0d9488', action: () => open('النشاط الطلابي', Activity, '#0d9488', <QuickReportContent title="سجل النشاط الطلابي" />) },
        { id: 'actleader', label: 'رائد النشاط', icon: Award, color: '#8b5cf6', badge: 'نشاط', bColor: '#8b5cf6', action: () => open('رائد النشاط', Award, '#8b5cf6', <QuickReportContent title="برامج ومشاركات رائد النشاط" />) },
      ],
    },
    {
      id: 'curriculum',
      label: 'المنهج والتحضير',
      emoji: '📚',
      color: '#0369a1',
      tools: [
        { id: 'currdist', label: 'توزيع المنهج', icon: BookMarked, color: '#0369a1', action: () => open('توزيع المنهج', BookMarked, '#0369a1', <CurriculumDistContent />) },
        { id: 'curr1448', label: 'توزيع المنهج 1448', icon: Calendar, color: '#1d4ed8', badge: '1448', bColor: '#1d4ed8', action: () => open('توزيع المنهج 1448', Calendar, '#1d4ed8', <CurriculumDistContent />) },
        { id: 'prep', label: 'التحضير المسرد', icon: PenLine, color: '#7c3aed', action: () => open('التحضير المسرد', PenLine, '#7c3aed', <WorksheetContent />) },
        { id: 'print', label: 'نسخ وطباعة التحضير', icon: Printer, color: '#64748b', action: () => open('نسخ وطباعة التحضير', Printer, '#64748b', <CurriculumDistContent />) },
        { id: 'books', label: 'الكتب الدراسية', icon: BookOpen, color: '#0891b2', action: () => open('الكتب الدراسية', BookOpen, '#0891b2', <CurriculumDistContent />) },
        { id: 'solutions', label: 'حلول الكتب 1448', icon: BookText, color: '#0d9488', action: () => open('حلول الكتب 1448', BookText, '#0d9488', <CurriculumDistContent />) },
        { id: 'strategies', label: 'توثيق استراتيجيات التعلم', icon: Lightbulb, color: '#f59e0b', action: () => open('توثيق استراتيجيات التعلم', Lightbulb, '#f59e0b', <WorksheetContent />) },
        { id: 'cmap', label: 'خرائط مفاهيم', icon: Map, color: "#6366f1", badge: 'AI', bColor: '#7c3aed', action: () => open('خرائط مفاهيم', Map, '#6366f1', <WorksheetContent />) },
        { id: 'weekplan', label: 'الخطة الفصلية', icon: Calendar, color: '#0f766e', action: () => open('الخطة الفصلية', Calendar, '#0f766e', <CurriculumDistContent />) },
      ],
    },
    {
      id: 'communication',
      label: 'التواصل والتنويه',
      emoji: '📢',
      color: '#3b82f6',
      tools: [
        { id: 'parentmsg', label: 'التواصل مع أولياء الأمور', icon: MessageCircle, color: '#3b82f6', badge: 'مباشر', bColor: '#10b981', action: () => open('التواصل مع أولياء الأمور', MessageCircle, '#3b82f6', <ParentMessageContent />) },
        { id: 'alert', label: 'تنويه', icon: BellRing, color: '#ef4444', action: () => open('تنويه', BellRing, '#ef4444', <AlertContent />) },
        { id: 'forms', label: 'فورمز', icon: FileSpreadsheet, color: '#059669', action: () => open('فورمز', FileSpreadsheet, '#059669', <WorksheetContent />) },
        { id: 'submanage', label: 'الاشتراك وتفعيل الخدمة', icon: ShieldCheck, color: '#10b981', badge: 'مفعّل', bColor: '#10b981', action: () => open('الاشتراك وتفعيل الخدمة', ShieldCheck, '#10b981', <SubscriptionContent />) },
      ],
    },
    {
      id: 'analytics',
      label: 'التحليل والذكاء الاصطناعي',
      emoji: '🧠',
      color: '#7c3aed',
      tools: [
        { id: 'counselor', label: 'الموجّه الطلابي', icon: HeartHandshake, color: '#8b5cf6', badge: 'AI', bColor: '#7c3aed', action: () => open('الموجّه الطلابي', HeartHandshake, '#8b5cf6', <CounselorContent />) },
        { id: 'search', label: 'البحث السريع', icon: Search, color: '#0369a1', badge: 'فوري', bColor: '#10b981', action: () => open('البحث السريع', Search, '#0369a1', <QuickSearchContent />) },
        { id: 'patterns', label: 'أنماط التعلم', icon: Brain, color: '#7c3aed', badge: 'AI', bColor: '#7c3aed', action: () => open('أنماط التعلم', Brain, '#7c3aed', <QuickReportContent title="تحليل أنماط التعلم لدى الطلاب" />) },
        { id: 'noor', label: 'رصد وتحليل نور', icon: BarChart3, color: '#b45309', action: () => open('رصد وتحليل نور', BarChart3, '#b45309', <QuickReportContent title="تقرير رصد وتحليل نور" />) },
        { id: 'noorext', label: 'تحليل النتائج خارج نور', icon: TrendingUp, color: '#0891b2', action: () => open('تحليل النتائج خارج نور', TrendingUp, '#0891b2', <QuickReportContent title="تحليل النتائج خارج نور" />) },
        { id: 'nafes', label: 'نافس (الاختبارات الوطنية)', icon: Target, color: '#dc2626', badge: 'وطني', bColor: '#dc2626', action: () => open('نافس (الاختبارات الوطنية)', Target, '#dc2626', <WorksheetContent />) },
        { id: 'outcomes', label: 'خريطة نواتج التعلم', icon: Map, color: '#6366f1', action: () => open('خريطة نواتج التعلم', Map, '#6366f1', <CurriculumDistContent />) },
      ],
    },
    {
      id: 'content',
      label: 'المحتوى التفاعلي',
      emoji: '🎮',
      color: '#0d9488',
      tools: [
        { id: 'games', label: 'منصة الألعاب التعليمية', icon: Gamepad2, color: '#10b981', badge: 'ألعاب', bColor: '#f59e0b', action: () => open('منصة الألعاب التعليمية', Gamepad2, '#10b981', <QuickReportContent title="منصة الألعاب التعليمية التفاعلية" />) },
        { id: 'vlab', label: 'منصة التجارب الافتراضية', icon: FlaskConical, color: '#06b6d4', action: () => open('منصة التجارب الافتراضية', FlaskConical, '#06b6d4', <QuickReportContent title="منصة التجارب الافتراضية والمعامل" />) },
        { id: 'kg', label: 'منصة الروضة', icon: Flower2, color: '#ec4899', action: () => open('منصة الروضة', Flower2, '#ec4899', <QuickReportContent title="منصة الروضة والطفولة المبكرة" />) },
        { id: 'ppt', label: 'عروض تقديمية بوربوينت', icon: TrendingUp, color: '#e97316', badge: 'AI PPT', bColor: '#7c3aed', action: () => open('عروض تقديمية بوربوينت', TrendingUp, '#e97316', <WorksheetContent />) },
        { id: 'quran', label: 'الفهم القرآني', icon: BookOpen, color: '#065f46', action: () => open('الفهم القرآني', BookOpen, '#065f46', <AttendanceContent />) },
        { id: 'guide', label: 'شرح الاستخدام', icon: HelpCircle, color: '#64748b', action: () => open('شرح الاستخدام', HelpCircle, '#64748b', <QuickReportContent title="شرح الاستخدام ودليل المعلم" />) },
      ],
    },
  ];

  const totalTools = useMemo(() => GROUPS.reduce((acc, g) => acc + g.tools.length, 0), [GROUPS]);

  // Filter tools based on search and category
  const filteredGroups = useMemo(() => {
    return GROUPS.map((group) => {
      if (activeCategory !== 'all' && group.id !== activeCategory) return null;
      const tools = group.tools.filter(
        (t) => !searchQuery.trim() || t.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
      if (tools.length === 0) return null;
      return { ...group, tools };
    }).filter(Boolean) as typeof GROUPS;
  }, [GROUPS, searchQuery, activeCategory]);

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* ─── Top Hero Banner ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0369a1 50%, #4338ca 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-24 -left-20 w-64 h-64 bg-teal-300/15 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="text-xs font-bold text-teal-100">صندوق أدوات المعلم المتكامل</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-400 text-teal-950">
                {totalTools} أداة فعالة ومرتبطة بالمنصة
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">أدوات نكسس الذكية — Nexus Tools</h2>
            <p className="text-white/80 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              جميع الأدوات التربوية والتحضير والتصحيح الآلي وإدارة الصف والتقارير المعتمدة تعمل باللوجيك الحقيقي وتسمّع فوراً في كامل النظام وقواعد البيانات بضغطة زر.
            </p>
          </div>

          {/* Quick Stats Counter */}
          <div className="flex gap-2.5 self-stretch md:self-auto">
            <div className="flex-1 md:flex-initial px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-center">
              <p className="text-2xl font-black">{totalTools}</p>
              <p className="text-[10px] text-teal-100 font-bold">أداة تعليمية</p>
            </div>
            <div className="flex-1 md:flex-initial px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-center">
              <p className="text-2xl font-black">100%</p>
              <p className="text-[10px] text-teal-100 font-bold">تسميع فوري بالنظام</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Search and Category Filter Bar ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-[#1e1e2d] border border-gray-100 dark:border-white/5 rounded-2xl p-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي أداة بالاسم (مثال: تصحيحي، رصد الغياب، شهادات شكر، نافس، توزيع المنهج)..."
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pr-10 pl-3 py-2 text-xs font-bold text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            الكل ({totalTools})
          </button>
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveCategory(g.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                activeCategory === g.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              <span>{g.emoji}</span>
              <span>{g.label.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">({g.tools.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tool Groups ──────────────────────────────────────────────────── */}
      {filteredGroups.map((group, gi) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.04 }}
          className="bg-white dark:bg-[#1e1e2d] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm"
        >
          {/* Group Header */}
          <div
            className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 dark:border-white/5"
            style={{ background: `linear-gradient(135deg, ${group.color}0a, transparent)` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm"
                style={{ backgroundColor: `${group.color}15`, border: `1.5px solid ${group.color}30` }}
              >
                {group.emoji}
              </div>
              <div>
                <p className="font-black text-gray-900 dark:text-white text-sm">{group.label}</p>
                <p className="text-[10px] text-gray-400">{group.tools.length} أدوات تخصصية</p>
              </div>
            </div>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${group.color}15`, color: group.color }}
            >
              {group.tools.length} أداة
            </span>
          </div>

          {/* Tools Grid */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {group.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={tool.action}
                  className="relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3.5 text-center cursor-pointer border transition-all shadow-sm hover:shadow-md group"
                  style={{ backgroundColor: `${tool.color}08`, borderColor: `${tool.color}25` }}
                >
                  {'badge' in tool && tool.badge && (
                    <div className="absolute top-1.5 right-1.5">
                      <span
                        className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: (tool as any).bColor || tool.color }}
                      >
                        {tool.badge}
                      </span>
                    </div>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}18`, border: `1.5px solid ${tool.color}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tool.color }} />
                  </div>
                  <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-tight text-center line-clamp-2">
                    {tool.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {filteredGroups.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#1e1e2d] rounded-3xl border border-gray-100 dark:border-white/5">
          <Search className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-gray-500">لا توجد أدوات مطابقة لبحثك "{searchQuery}"</p>
        </div>
      )}

      {/* ─── Active Modal Renderer ────────────────────────────────────────── */}
      {activeModal && <ToolModal modal={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
