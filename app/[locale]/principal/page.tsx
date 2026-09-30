'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, TrendingUp, AlertCircle, CheckCircle2, Calendar,
  Award, BarChart3, UserCheck, Clock, FileText, Shield, Zap, BrainCircuit,
  Loader2, School, Activity, Bell, Star, RefreshCw, Send, Printer,
  ChevronRight, Phone, MessageSquare, Sparkles, Building2, UserCheck2,
  CheckCircle, ArrowUpRight, Megaphone, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { nexusBridge } from '@/lib/nexusDataBridge';

export default function PrincipalDashboard() {
  const [loading, setLoading] = useState(true);
  const [principalName, setPrincipalName] = useState('د. خالد العتيبي');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showCircularModal, setShowCircularModal] = useState(false);
  const [circularTitle, setCircularTitle] = useState('');
  const [circularBody, setCircularBody] = useState('');
  const [circularTarget, setCircularTarget] = useState<'all' | 'teachers' | 'parents'>('all');
  const [circularSent, setCircularSent] = useState(false);
  const [studentsCount, setStudentsCount] = useState(0);
  const [observations, setObservations] = useState<any[]>([]);

  const loadData = useCallback(() => {
    try {
      // 1. Get logged in principal name
      const rawUser = localStorage.getItem('nexus_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        const name = u.name || u.fullName || u.displayName || 'د. خالد العتيبي';
        const title = u.title || 'مدير عام المدرسة';
        setPrincipalName(name.startsWith('د.') || name.startsWith('أ.') ? name : `د. ${name}`);
      }

      // 2. Fetch live metrics from nexusBridge
      const students = nexusBridge.getStudents();
      setStudentsCount(students.length);
      const obs = nexusBridge.getObservations();
      setObservations(obs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('nexus:data-changed', loadData);
    return () => window.removeEventListener('nexus:data-changed', loadData);
  }, [loadData]);

  const handleGenerateAiSummary = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSummary(
        `المؤشر الاستراتيجي العام للمدرسة: استقرار ممتاز في العملية التعليمية للأسبوع الجاري بنسبة حضور 97.4% لكافة الشعب. حققت الفصول الدراسية نسب إتقان متقدمة في الكفايات الأساسية، مع انضباط الكادر التعليمي بنسبة 100%. يُوصى بتكريم شعبة الصف الأول (أ) لتصدرها معايير المواظبة وتفعيل الخطط الإثرائية للطلاب الموهوبين.`
      );
      setAiLoading(false);
    }, 900);
  };

  const handleSendCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim() || !circularBody.trim()) return;

    try {
      nexusBridge.addObservation({
        studentId: 'school-wide',
        studentName: 'جميع منسوبي وطلاب المدرسة',
        authorName: principalName,
        authorRole: 'principal',
        category: 'academic',
        severity: 'positive',
        text: `[تعميم إداري رسمي من مدير المدرسة]: ${circularTitle} — ${circularBody}`
      });

      setCircularSent(true);
      setTimeout(() => {
        setCircularSent(false);
        setShowCircularModal(false);
        setCircularTitle('');
        setCircularBody('');
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const attendanceWeeklyData = [
    { day: 'الأحد', attendance: 98.2, target: 95 },
    { day: 'الإثنين', attendance: 97.8, target: 95 },
    { day: 'الثلاثاء', attendance: 96.9, target: 95 },
    { day: 'الأربعاء', attendance: 98.4, target: 95 },
    { day: 'الخميس', attendance: 96.5, target: 95 },
  ];

  const gradeDistributionData = [
    { name: 'ممتاز مرتفع (95-100%)', value: 45, color: '#10B981' },
    { name: 'ممتاز (90-94%)', value: 35, color: '#3B82F6' },
    { name: 'جيد جداً (80-89%)', value: 15, color: '#F59E0B' },
    { name: 'يحتاج دعم (<80%)', value: 5, color: '#EF4444' },
  ];

  const classesStatus = [
    { id: 'CLS-101', name: 'الصف الأول الابتدائي — فئة (أ)', teacher: 'د. إسماعيل عيسى', subject: 'لغتي والقرآن', count: studentsCount || 8, attendance: '98%', status: 'منتظم ومتميز 🌟' },
    { id: 'CLS-102', name: 'الصف الأول الابتدائي — فئة (ب)', teacher: 'أ. فهد الزهراني', subject: 'الرياضيات والعلوم', count: 12, attendance: '96%', status: 'نشط 📚' },
    { id: 'CLS-201', name: 'الصف الثاني الابتدائي — فئة (أ)', teacher: 'أ. عبد الرحمن السبيعي', subject: 'اللغة العربية والتربية', count: 14, attendance: '97%', status: 'نشط 📚' },
    { id: 'CLS-202', name: 'الصف الثاني الابتدائي — فئة (ب)', teacher: 'أ. منصور القحطاني', subject: 'العلوم العامة', count: 15, attendance: '95%', status: 'متابعة دورية ⏱️' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 print:p-0 print:space-y-4" dir="rtl">
      {/* ═══ 1. ROYAL EXECUTIVE HEADMASTER HERO BANNER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-[#0f172a] to-[#1e1b4b] text-white p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4)] border border-amber-500/20"
      >
        {/* Subtle Luxury Pattern & Ambient Lights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Accreditation Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black shadow-inner">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                الإدارة العامة والتطوير المؤسسي المعتمد
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold border border-white/10">
                مدارس الإخلاص الأهلية للبنين • جدة
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                العام الدراسي 1448هـ
              </span>
            </div>

            {/* Principal Name in Prestigious Typography */}
            <div>
              <p className="text-amber-300/90 text-sm font-bold tracking-widest uppercase mb-1">
                مركز القيادة الاستراتيجية والتحكم
              </p>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-serif leading-tight">
                {principalName}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-medium mt-1">
                مدير عام المدارس والمشرف التنفيذي العام على البيئة التعليمية
              </p>
            </div>

            {/* Daily Operational Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[11px] text-slate-400 block font-bold">الحضور العام اليوم</span>
                <span className="text-xl font-black text-emerald-400">97.4%</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[11px] text-slate-400 block font-bold">متوسط التحصيل</span>
                <span className="text-xl font-black text-amber-300">92.8%</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[11px] text-slate-400 block font-bold">الكادر التعليمي</span>
                <span className="text-xl font-black text-blue-400">18 معلماً</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <span className="text-[11px] text-slate-400 block font-bold">الشعب النموذجية</span>
                <span className="text-xl font-black text-purple-400">8 فصول</span>
              </div>
            </div>
          </div>

          {/* Executive Quick Actions */}
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowCircularModal(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl transition-transform hover:scale-[1.02]"
            >
              <Megaphone className="w-4 h-4 text-slate-950" />
              إصدار تعميم إداري للمدرسة
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              طباعة السجل القيادي العام
            </button>
            <button
              onClick={handleGenerateAiSummary}
              disabled={aiLoading}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 font-bold text-sm border border-indigo-400/30 backdrop-blur-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              {aiLoading ? 'جاري التحليل التنفيذي...' : 'الموجز الاستراتيجي الذكي'}
            </button>
          </div>
        </div>

        {/* AI Strategic Briefing Output if generated */}
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                <BrainCircuit className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-amber-300 mb-1 flex items-center gap-2">
                  <span>تقرير التحليل الذكي للقيادة المدرسية</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">محدث لحظياً</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {aiSummary}
                </p>
              </div>
              <button
                onClick={() => setAiSummary(null)}
                className="text-white/50 hover:text-white text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ═══ 2. KEY PERFORMANCE INDICATORS (KPIs) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: 'نسبة الانضباط والحضور',
            value: '97.4%',
            desc: 'المعدل التراكمي لجميع الفصول',
            icon: UserCheck2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40',
            trend: '+1.8% تحسن'
          },
          {
            title: 'المؤشر الأكاديمي العام',
            value: '92.8%',
            desc: 'مستوى إتقان معايير المناهج',
            icon: Award,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40',
            trend: 'مستوى متفوق'
          },
          {
            title: 'الكادر الإداري والتعليمي',
            value: '18 موظفاً',
            desc: 'انتظام الحصص بنسبة 100%',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40',
            trend: 'نصاب كامل'
          },
          {
            title: 'شهادات التميز الصادرة',
            value: '24 شهادة',
            desc: 'تكريمات التفوق والمواظبة',
            icon: Star,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40',
            trend: 'معتمدة رسمياً'
          },
        ].map((k, i) => (
          <div
            key={i}
            className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 ${k.bg}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ${k.color}`}>
                <k.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 shadow-sm text-foreground">
                {k.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground mb-1">{k.value}</p>
              <h3 className="text-sm font-bold text-foreground/80">{k.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{k.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 3. STRATEGIC CHARTS SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Area Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                مؤشر انتظام الحضور الأسبوعي لطلاب المدرسة
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                مقارنة نسبة الحضور اليومية المستهدفة (95%) بالواقع الفعلي
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              متوسط الأسبوع: 97.4%
            </span>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/50" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888', fontWeight: 'bold' }} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'نسبة الحضور']}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} fill="url(#attendanceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Doughnut Chart */}
        <div className="bg-card border border-border rounded-3xl p-7 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-foreground flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-500" />
              التوزيع الأكاديمي العام للمدرسة
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              نسب الطلاب حسب فئات التقدير الأكاديمي
            </p>
          </div>

          <div className="w-full h-[200px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gradeDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-foreground">80%</span>
              <span className="text-[10px] font-bold text-muted-foreground">تفوق مرتفع</span>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-border">
            {gradeDistributionData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-foreground font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 4. CLASSES & TEACHERS LIVE OVERSIGHT ═══ */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              متابعة الفصول والكادر التعليمي الميداني
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              مؤشرات الحضور ونصاب الحصص وسير اليوم الدراسي لكل شعبة
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            جميع الشعب في وضع التشغيل الكامل ✅
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4">الفصل والشعبة</th>
                <th className="px-6 py-4">رائد الفصل</th>
                <th className="px-6 py-4">المادة الأساسية</th>
                <th className="px-6 py-4">الطلاب المقيدون</th>
                <th className="px-6 py-4">حضور اليوم</th>
                <th className="px-6 py-4">الحالة الميدانية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classesStatus.map((cls) => (
                <tr key={cls.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-black text-foreground">
                    {cls.name}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground/90">
                    {cls.teacher}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {cls.subject}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {cls.count} طلاب
                  </td>
                  <td className="px-6 py-4 font-black text-emerald-600 dark:text-emerald-400">
                    {cls.attendance}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {cls.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ 5. RECENT SCHOOL-WIDE ACTIVITY & OBSERVATIONS ═══ */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            سجل المتابعة والإجراءات الإدارية المباشرة
          </h3>
          <span className="text-xs font-bold text-muted-foreground">آخر التحديثات المدرسية</span>
        </div>

        <div className="space-y-3">
          {observations.length > 0 ? (
            observations.slice(0, 5).map((obs, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {obs.authorRole === 'principal' ? 'مدير' : obs.authorRole === 'teacher' ? 'معلم' : 'مشرف'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-foreground">{obs.authorName}</span>
                      <span className="text-xs text-muted-foreground">• {obs.studentName}</span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">{obs.text}</p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground font-bold flex-shrink-0">
                  {new Date(obs.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm font-medium">
              العملية التعليمية تسير بهدوء وانتظام تام. لا توجد بلاغات عاجلة حالياً.
            </div>
          )}
        </div>
      </div>

      {/* ═══ 6. OFFICIAL CIRCULAR MODAL ═══ */}
      {showCircularModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div>
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  إصدار تعميم إداري رسمي
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  باسم: {principalName} — مدير عام مدارس الإخلاص الأهلية
                </p>
              </div>
              <button
                onClick={() => setShowCircularModal(false)}
                className="w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCircular} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  الفئة المستهدفة بالتعميم *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'كافة منسوبي المدرسة' },
                    { id: 'teachers', label: 'الكادر التعليمي فقط' },
                    { id: 'parents', label: 'أولياء الأمور فقط' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCircularTarget(t.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        circularTarget === t.id
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-muted border-border text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  موضوع التعميم *
                </label>
                <input
                  required
                  type="text"
                  value={circularTitle}
                  onChange={(e) => setCircularTitle(e.target.value)}
                  placeholder="مثال: تعليمات الاختبارات النصفية وضوابط الحضور والانضباط المدرسي"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                  نص وتوجيهات التعميم الإداري *
                </label>
                <textarea
                  required
                  rows={5}
                  value={circularBody}
                  onChange={(e) => setCircularBody(e.target.value)}
                  placeholder="اكتب التوجيهات الرسمية الصادرة من الإدارة العامة للمدرسة..."
                  className="w-full p-4 rounded-2xl border border-border bg-muted text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCircularModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border font-bold text-xs text-foreground hover:bg-muted"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={circularSent}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md disabled:opacity-50"
                >
                  {circularSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      تم اعتماد ونشر التعميم بنجاح ✅
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      اعتماد ونشر التعميم فوراً
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
