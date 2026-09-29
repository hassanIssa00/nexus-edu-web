'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Shield, CheckCircle2, User, Phone, Sparkles,
  ArrowLeft, Search, School, AlertCircle, RefreshCw, ChevronLeft
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { nexusBridge, ClassStudentRecord } from '@/lib/nexusDataBridge';

export default function ParentWaitingPage() {
  const router = useRouter();
  const locale = useLocale();

  const [parentAccount, setParentAccount] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [matchedNow, setMatchedNow] = useState<ClassStudentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ClassStudentRecord[]>([]);
  const [manualLinked, setManualLinked] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const uStr = localStorage.getItem('nexus_user');
      if (uStr) {
        const u = JSON.parse(uStr);
        setParentAccount(u);
        if (u.targetChildName) {
          setSearchQuery(u.targetChildName);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Automatic live check on mount
  useEffect(() => {
    checkMatching(false);
  }, [parentAccount]);

  const checkMatching = (showFeedback = true) => {
    if (!parentAccount) return;
    setChecking(true);
    setNotice('');

    setTimeout(() => {
      try {
        const allStudents = nexusBridge.getStudents();
        const pPhone = (parentAccount.phone || '').trim().replace(/\D/g, '');
        const targetName = (parentAccount.targetChildName || '').trim().toLowerCase();
        const pName = (parentAccount.name || '').trim().toLowerCase();

        // 1. Match by phone or child name or parent name
        const found = allStudents.find((s) => {
          const sPhone = (s.parentPhone || '').replace(/\D/g, '');
          const phoneMatch = pPhone && sPhone && (sPhone.includes(pPhone) || pPhone.includes(sPhone));
          const nameMatch = targetName && s.fullName.toLowerCase().includes(targetName);
          const parentNameMatch = pName && s.parentName && s.parentName.toLowerCase().includes(pName);
          return phoneMatch || nameMatch || parentNameMatch;
        });

        if (found) {
          // Bind automatically!
          linkStudentToParent(found);
          setMatchedNow(found);
        } else if (showFeedback) {
          setNotice('لم يتم تسجيل الطالب حتى هذه اللحظة، سيستمر النظام في الفحص التلقائي.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    }, 600);
  };

  const linkStudentToParent = (student: ClassStudentRecord) => {
    try {
      const uStr = localStorage.getItem('nexus_user');
      const u = uStr ? JSON.parse(uStr) : parentAccount;
      if (u) {
        u.linkedStudentId = student.id;
        u.linkedStudentIds = [student.id];
        u.isWaitingForStudent = false;
        u.title = `ولي أمر الطالب ${student.fullName}`;
        localStorage.setItem('nexus_user', JSON.stringify(u));
        sessionStorage.setItem('nexus_user', JSON.stringify(u));
        nexusBridge.saveAccount(u);
        window.dispatchEvent(new CustomEvent('nexus:data-changed'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim().toLowerCase();
    const results = nexusBridge.getStudents().filter((s) =>
      s.fullName.toLowerCase().includes(clean) ||
      (s.nationalId && s.nationalId.includes(clean)) ||
      (s.parentPhone && s.parentPhone.includes(clean))
    );
    setSearchResults(results);
    if (results.length === 0) {
      setNotice('لا يوجد طالب مسجل يطابق هذا البحث حالياً.');
    } else {
      setNotice('');
    }
  };

  const handleSelectStudent = (student: ClassStudentRecord) => {
    linkStudentToParent(student);
    setMatchedNow(student);
    setManualLinked(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] flex flex-col justify-between p-4" dir="rtl">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo_new.webp" alt="Nexus EDU" className="w-10 h-10 rounded-2xl shadow-sm object-cover" />
          <div>
            <span className="font-black text-gray-900 dark:text-white text-base block leading-tight">Nexus EDU</span>
            <span className="text-[10px] text-gray-400 font-bold block">مدارس الإخلاص الأهلية للبنين بجدة</span>
          </div>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full mx-auto my-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-[#1e1e2d]/90 backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
        >
          {matchedNow ? (
            /* Matched State */
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center text-white text-4xl shadow-xl shadow-emerald-500/30 mb-5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تم التعرف والربط التلقائي بنجاح!</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                مرحباً بك! تم ربط حسابك بالطالب: {matchedNow.fullName}
              </h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                تم التحقق من بيانات الطالب في منظومة مدارس الإخلاص الأهلية ({matchedNow.grade} — فصل {matchedNow.classId || '101'}). يمكنك الآن استكمال الاستبيان التربوي ومتابعة الأداء.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-right">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">اسم الطالب</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{matchedNow.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">المرحلة الدراسية</span>
                  <span className="text-xs font-black text-gray-800 dark:text-gray-200">{matchedNow.grade}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.href = `/${locale}/survey?student=${matchedNow.id}&flow=parent`;
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <span>استكمال استبيان ولي الأمر وتفعيل الداشبورد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Waiting State */
            <div>
              {/* Header Badge */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black mb-3 shadow-sm">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>قائمة الانتظار المعتمدة — الربط الذكي للطلاب</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  حسابك قيد الانتظار لحين تسجيل الطالب
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                  تم تسجيل حسابك كولي أمر بنجاح. المنظومة تراقب عمليات التسجيل تلقائياً للتعرف على ابنك بمجرد تسجيله.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">اسم ولي الأمر:</span>
                  <span className="font-black text-gray-900 dark:text-white">{parentAccount?.name || 'ولي أمر'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">اسم الطالب المطلوب ربطه:</span>
                  <span className="font-black text-amber-600 dark:text-amber-400">
                    {parentAccount?.targetChildName || 'بانتظار تسجيل الطالب'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">رقم جوال الربط التلقائي:</span>
                  <span className="font-black text-gray-900 dark:text-white dir-ltr">{parentAccount?.phone || 'غير محدد'}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/50 dark:border-white/10">
                  <span className="text-gray-500 font-bold">حالة الربط الآلي:</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>مفعلة — فحص لحظي مستمر</span>
                  </span>
                </div>
              </div>

              {/* How it works info */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 mb-6 space-y-2.5">
                <h3 className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>كيف يعمل الربط التلقائي في منصة نكسس؟</span>
                </h3>
                <ul className="text-[11px] text-gray-500 dark:text-gray-400 space-y-1.5 leading-relaxed pr-4 list-disc">
                  <li>
                    اطلب من ابنك/ابنتك تسجيل حساب جديد عبر خيار <strong>(طالب)</strong> باستخدام نفس رقم الجوال أو الاسم.
                  </li>
                  <li>
                    يقوم محرك نكسس فوراً بمطابقة الحسابين وربطهما تلقائياً دون أي حاجة لمراجعة إدارة المدرسة.
                  </li>
                  <li>
                    ستُفتح لك كافة الصلاحيات لمتابعة الحضور، الواجبات، تقارير المعلمين، واستبيان الشراكة الأسرية.
                  </li>
                </ul>
              </div>

              {/* Action: Check Now Button */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => checkMatching(true)}
                  disabled={checking}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                  <span>{checking ? 'جارٍ الفحص والمطابقة في سجلات الطلاب...' : 'التحقق من تسجيل الطالب الآن 🔄'}</span>
                </button>

                {notice && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{notice}</span>
                  </motion.div>
                )}
              </div>

              {/* Manual Search Section */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                <p className="text-[11px] font-black text-gray-600 dark:text-gray-400 mb-2">
                  هل سجل الطالب بالفعل باسم مختلف أو رقم آخر؟ ابحث عنه بالاسم:
                </p>
                <form onSubmit={handleSearchManual} className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="اكتب اسم الطالب للبحث..."
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs hover:opacity-90 transition-all"
                  >
                    بحث
                  </button>
                </form>

                {searchResults.length > 0 && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {searchResults.map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white">{s.fullName}</p>
                          <p className="text-[10px] text-gray-400">{s.grade} — رقم الهوية: {s.nationalId || 'مكتمل'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectStudent(s)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm"
                        >
                          ربط هذا الطالب
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Link to Dashboard as Guest/Waiting */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <Link
                  href={`/${locale}/parent`}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>تخطي إلى لوحة ولي الأمر (وضع الانتظار)</span>
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  تسجيل حساب جديد
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center py-2 text-[11px] text-gray-400 font-medium">
        منظومة مدارس الإخلاص الأهلية للبنين بجدة © 1448هـ — جميع الحقوق محفوظة
      </div>
    </div>
  );
}
