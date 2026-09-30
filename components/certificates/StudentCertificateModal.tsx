'use client';

import React, { useRef } from 'react';
import { Trophy, Printer, Share2, X, Award, ShieldCheck, Sparkles } from 'lucide-react';

export interface StudentCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    id?: string;
    studentName: string;
    studentPhoto?: string;
    grade?: string;
    trackTitle?: string;
    score?: number;
    ratingText?: string;
    date?: string;
    certNumber?: string;
    notes?: string;
    teacherName?: string;
    teacherRole?: string;
  };
}

export default function StudentCertificateModal({ isOpen, onClose, certificate }: StudentCertificateProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const {
    studentName = 'اسم الطالب',
    studentPhoto,
    grade = 'الصف الأول الابتدائي — فئة (أ)',
    trackTitle = 'التفوق والتميز الأكاديمي العام',
    score = 98,
    ratingText = 'ممتاز مع مرتبة الشرف 🏆',
    date = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
    certNumber = `NEXUS-CERT-2026-${Date.now().toString().slice(-5)}`,
    notes = 'تقديراً لاجتهاده المتميز وتفوقه المستمر وإتقانه المهارات المعتمدة بأعلى معايير التميز.',
    teacherName = 'معلم الفصل والمشرف الأكاديمي',
    teacherRole = 'المشرف الأكاديمي — مدارس الإخلاص الأهلية',
  } = certificate;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexus.masarplatform.org';
  const verifyUrl = `${origin}/verify/${certNumber}?student=${encodeURIComponent(studentName)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyUrl)}`;

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML)
      .join('\n');

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <title>شهادة تفوق - ${studentName} - منصة نكسس التعليمية</title>
  ${styles}
  <style>
    @page { size: A4 landscape; margin: 0; }
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
      padding: 8mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }
    .cert-frame {
      width: 100% !important;
      height: 100% !important;
      border: 3.5mm double #06392c !important;
      border-radius: 4mm !important;
      box-shadow: inset 0 0 0 1mm #b45309, inset 0 0 0 2.5mm #ffffff !important;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="cert-print-container">
    <div class="cert-frame">${content}</div>
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `شهادة تفوق الطالب: ${studentName}`,
          text: `يسرنا مشاركة شهادة تفوق الطالب (${studentName}) من منصة نِكْسَس التعليمية بالتعاون مع مدارس الإخلاص الأهلية بإشراف ${teacherName}.`,
          url: verifyUrl,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(verifyUrl);
      alert('تم نسخ رابط توثيق الشهادة بنجاح!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col my-auto" dir="rtl">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-black">شهادة التفوق والاعتماد الأكاديمي الرقمية</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-4 py-2 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Printer size={15} />
              <span>طباعة PDF 🖨️</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2 transition cursor-pointer"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">مشاركة</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 hover:bg-rose-500/80 hover:text-white text-slate-300 p-2 transition cursor-pointer"
              title="إغلاق"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-4 sm:p-8 bg-slate-950/50 flex items-center justify-center overflow-x-auto">
          <div
            ref={printRef}
            className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-4 border-emerald-900"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 57, 44, 0.03) 0%, transparent 70%)',
            }}
          >
            {/* Guilloche Corner SVG Decorations */}
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-emerald-900">
                <circle cx="100" cy="0" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="100" cy="0" r="70" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="0" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-emerald-900">
                <circle cx="0" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="0" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="0" cy="100" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>

            {/* Header: Logos (Nexus + Ikhlas) + Certification Seal info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                    <img src="/logo_new.webp" alt="Nexus" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">منصة نِكْسَس التعليمية</div>
                    <div className="text-[9px] font-bold text-blue-600">NEXUS EDU</div>
                  </div>
                </div>

                <div className="w-px h-7 bg-slate-200 mx-1" />

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                    <img src="/ikhlas-logo.jpg" alt="مدارس الإخلاص" className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">مدارس الإخلاص الأهلية</div>
                    <div className="text-[9px] font-bold text-slate-500">بنين — جدة</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200/90 px-4 py-2 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-black text-emerald-950">شهادة تفوق معتمدة رسمياً</div>
                  <div className="text-[10px] font-mono font-bold text-slate-500">{certNumber}</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="text-center py-6 sm:py-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                <Sparkles size={13} className="text-amber-500" />
                <span>شهادة تميز وتفوق أكاديمي</span>
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-emerald-950 font-serif tracking-tight">
                شـهـادة شـكـر وتـقـديـر
              </h1>

              <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-xl mx-auto">
                تمنح منصة <strong className="text-emerald-900">نِكْسَس للتعليم والتدريب الذكي</strong> وبالتعاون مع{' '}
                <strong className="text-slate-900">مدارس الإخلاص الأهلية بجدة</strong> هذه الشهادة للطالب المتميز:
              </p>

              {/* Student Name with Photo */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-amber-400 ring-4 ring-emerald-100 shadow-lg shrink-0 bg-slate-100">
                  {studentPhoto ? (
                    <img
                      src={studentPhoto}
                      alt={studentName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-800 to-teal-900 text-white font-black text-2xl">
                      {studentName.slice(0, 1)}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 leading-tight">
                    {studentName}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
                    {grade}
                  </p>
                </div>
              </div>

              {/* Achievement Track Banner */}
              <div className="max-w-2xl mx-auto rounded-2xl bg-emerald-50/80 border border-emerald-200/90 p-4 space-y-2">
                <p className="text-xs font-bold text-slate-600">نظير تميزه وتفوقه في المسار الأكاديمي:</p>
                <p className="text-base sm:text-lg font-black text-emerald-950">{trackTitle}</p>

                <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-600">وحصوله على تقدير:</span>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                    {ratingText}
                  </span>
                  <span className="text-xs font-bold text-slate-600">بنسبة تفوق:</span>
                  <span className="bg-emerald-900 text-white font-mono font-black text-xs px-3 py-1 rounded-lg">
                    %{score}
                  </span>
                </div>
              </div>

              {notes && (
                <p className="text-xs font-bold text-slate-500 max-w-lg mx-auto italic">
                  &ldquo;{notes}&rdquo;
                </p>
              )}
            </div>

            {/* Footer: Teacher Signature + Digital Stamp + Scannable QR */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Teacher Signature */}
              <div className="text-right space-y-1">
                <p className="text-[11px] font-bold text-slate-500">يعتمد رسمياً:</p>
                <h3 className="text-lg font-black text-slate-900">{teacherName}</h3>
                <p className="text-[11px] font-bold text-slate-500">{teacherRole}</p>
                <div className="h-0.5 w-32 bg-slate-300 mt-2" />
              </div>

              {/* Official Stamp */}
              <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-emerald-900 flex flex-col items-center justify-center p-2 text-center rotate-[-6deg] bg-emerald-50/40">
                <Award size={24} className="text-emerald-900 mb-1" />
                <span className="text-[9px] font-black text-emerald-950 leading-tight">الختم الرقمي المعتمد</span>
                <span className="text-[8px] font-bold text-emerald-800">{teacherName}</span>
                <span className="text-[7px] font-mono text-slate-500 mt-0.5">{date}</span>
              </div>

              {/* Scannable Verification QR */}
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl hover:bg-emerald-50 transition cursor-pointer"
                title="امسح الرمز للتحقق من صحة الشهادة"
              >
                <img
                  src={qrUrl}
                  alt="QR Verification"
                  className="w-16 h-16 rounded-xl border border-slate-200 bg-white"
                />
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-800">رمز التحقق الرقمي</div>
                  <div className="text-[9px] text-slate-500">امسح الكاميرا للتوثيق</div>
                  <div className="text-[8px] text-emerald-700 font-bold mt-1">تحقق مباشر ↗</div>
                </div>
              </a>
            </div>

            {/* Bottom Credit Line */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>منصة نِكْسَس التعليمية الذكية · مدارس الإخلاص الأهلية للبنين © {new Date().getFullYear()}</span>
              <span>تاريخ الإصدار: {date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
