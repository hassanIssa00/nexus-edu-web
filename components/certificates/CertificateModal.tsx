'use client';

import { useState, useRef, useEffect } from 'react';
import { Printer, X, ShieldCheck, Check } from 'lucide-react';

function stableCertificateSuffix(...parts: string[]) {
  const seed = parts.filter(Boolean).join('|') || 'nexus-certificate';
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 33 + seed.charCodeAt(i)) % 90000;
  }
  return String(hash + 10000).slice(0, 5);
}

function ringDots(cx: number, cy: number, r: number, n: number, fill: string) {
  const dots = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    dots.push(<circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r="1" fill={fill} />);
  }
  return dots;
}

export function CertificateOfficialStamp({
  dateStr = '2026/09/30',
  isAr = true,
  teacherName = 'المعلم المشرف',
}: {
  dateStr?: string;
  isAr?: boolean;
  teacherName?: string;
}) {
  const CX = 80;
  const CY = 80;
  const INK = '#0f172a';
  const RO = 76;
  const RI = 68;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={110} height={110} viewBox="0 0 160 160">
      <circle cx={CX} cy={CY} r={RO} fill="none" stroke={INK} strokeWidth="2.5" />
      {ringDots(CX, CY, (RO + RI) / 2, 60, INK)}
      <circle cx={CX} cy={CY} r={RI} fill="white" stroke={INK} strokeWidth="1.2" />

      {/* Top label */}
      <text
        x={CX}
        y={CY - 44}
        textAnchor="middle"
        fontFamily="Cairo, Amiri, Arial"
        fontSize="6.5"
        fontWeight="bold"
        fill={INK}
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {isAr ? 'الختم الرقمي المعتمد' : 'OFFICIAL APPROVED STAMP'}
      </text>

      {/* Name */}
      <text
        x={CX}
        y={CY - 30}
        textAnchor="middle"
        fontFamily="Cairo, Amiri, Arial"
        fontSize="9.5"
        fontWeight="900"
        fill={INK}
        direction={isAr ? 'rtl' : 'ltr'}
      >
        {teacherName}
      </text>

      {/* Decorative stars + divider */}
      <text x={CX - 38} y={CY - 21} textAnchor="middle" fontSize="6" fill={INK}>✦</text>
      <text x={CX + 38} y={CY - 21} textAnchor="middle" fontSize="6" fill={INK}>✦</text>
      <line x1={CX - 56} y1={CY - 17} x2={CX + 56} y2={CY - 17} stroke={INK} strokeWidth="0.8" />

      {/* Center school & platform mark */}
      <text x={CX} y={CY - 2} textAnchor="middle" fontFamily="Cairo, Arial" fontSize="7" fontWeight="bold" fill="#0284c7">
        {isAr ? 'منصة نِكْسَس التعليمية' : 'NEXUS SMART EDUCATION'}
      </text>
      <text x={CX} y={CY + 11} textAnchor="middle" fontFamily="Cairo, Arial" fontSize="6" fontWeight="bold" fill="#64748b">
        {isAr ? 'مدارس الإخلاص الأهلية' : 'IKHLAS SCHOOLS — JEDDAH'}
      </text>

      <line x1={CX - 56} y1={CY + 18} x2={CX + 56} y2={CY + 18} stroke={INK} strokeWidth="0.8" />

      {/* Date */}
      <text
        x={CX}
        y={CY + 30}
        textAnchor="middle"
        fontFamily="Cairo, Amiri, Arial"
        fontSize="7.5"
        fontWeight="900"
        fill={INK}
        letterSpacing="0.5"
      >
        {dateStr}
      </text>

      {/* Bottom label */}
      <text
        x={CX}
        y={CY + 42}
        textAnchor="middle"
        fontFamily="Cairo, Amiri, Arial"
        fontSize="5"
        fontWeight="bold"
        fill={INK}
      >
        {isAr ? 'مدارس الإخلاص الأهلية · جدة' : 'IKHLAS SCHOOL · JEDDAH'}
      </text>
    </svg>
  );
}

export interface CertificateData {
  studentName: string;
  studentNameEn?: string;
  programTitle: string;
  completionDate: string;
  score: number;
  certNumber?: string;
  teacherName?: string;
  teacherTitle?: string;
}

/* ─── LAUREL BRANCH ─────────────────────────────────────────── */
function GoldenLaurelBranch({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      width="44"
      height="80"
      viewBox="0 0 44 80"
      fill="none"
      className="shrink-0"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <path d="M22 5 Q18 28 15 60 Q13 70 17 76" stroke="#c49a28" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M21 8 Q9 4 7 14 Q13 22 21 16Z" fill="#d4a820" />
      <path d="M20 19 Q8 16 7 26 Q13 33 20 27Z" fill="#c49a28" />
      <path d="M19 30 Q8 28 7 38 Q13 44 19 38Z" fill="#d4a820" />
      <path d="M18 42 Q7 40 8 50 Q14 55 18 49Z" fill="#c49a28" />
      <path d="M17 54 Q7 52 8 62 Q14 67 18 60Z" fill="#d4a820" />
      <path d="M23 12 Q35 7 37 17 Q31 25 23 19Z" fill="#e5c040" />
      <path d="M22 23 Q34 19 36 29 Q30 36 22 30Z" fill="#d4a820" />
      <path d="M21 35 Q33 32 35 42 Q29 48 21 42Z" fill="#e5c040" />
      <path d="M20 47 Q31 44 33 53 Q28 58 20 52Z" fill="#d4a820" />
      <path d="M18 59 Q29 57 30 65 Q26 70 19 64Z" fill="#c49a28" />
      <circle cx="16" cy="74" r="3.5" fill="#d4a820" />
      <circle cx="16" cy="74" r="2" fill="#e8c040" />
    </svg>
  );
}

/* ─── TOP RIBBON BADGE ───────────────────────────────────────── */
function TopTrophyRibbonBadge({ isAr }: { isAr: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 290,
        height: 82,
        marginTop: -14,
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.30))',
        flexShrink: 0,
      }}
    >
      <svg width="290" height="82" viewBox="0 0 290 82" fill="none" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="rw" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5d060" />
            <stop offset="45%" stopColor="#d9a030" />
            <stop offset="100%" stopColor="#9a6210" />
          </linearGradient>
          <linearGradient id="sg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d5a44" />
            <stop offset="100%" stopColor="#042e20" />
          </linearGradient>
          <linearGradient id="sb" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5d060" />
            <stop offset="100%" stopColor="#b07820" />
          </linearGradient>
        </defs>
        {/* Left wing */}
        <path d="M0 17 L74 17 L61 41 L74 65 L0 65 L15 41 Z" fill="url(#rw)" />
        <path d="M0 17 L15 41 L0 65Z" fill="#7a4e0e" opacity="0.4" />
        {/* Right wing */}
        <path d="M290 17 L216 17 L229 41 L216 65 L290 65 L275 41 Z" fill="url(#rw)" />
        <path d="M290 17 L275 41 L290 65Z" fill="#7a4e0e" opacity="0.4" />
        {/* Gold border shield */}
        <path d="M70 3 L220 3 Q234 3 237 15 L246 49 Q239 78 145 82 Q51 78 44 49 L53 15 Q56 3 70 3Z" fill="url(#sb)" />
        {/* Green shield */}
        <path d="M71 7 L219 7 Q231 7 234 17 L242 49 Q236 74 145 78 Q54 74 48 49 L56 17 Q59 7 71 7Z" fill="url(#sg)" />
      </svg>
      {/* Overlay content */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 72,
          right: 72,
          bottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
        dir="rtl"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
              {isAr ? 'شهادة إنجاز وتفوق' : 'Certificate of Achievement'}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fde68a', lineHeight: 1.2 }}>
              {isAr ? 'تقدير رفيع المستوى 🏆' : 'High Honor Distinction'}
            </div>
          </div>
        </div>
        <div style={{ color: '#f5d060', fontSize: 12, letterSpacing: 3 }}>★★★★★</div>
      </div>
    </div>
  );
}

export default function CertificateModal({ data, onClose }: { data: CertificateData; onClose: () => void }) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const printRef = useRef<HTMLDivElement>(null);

  // Load teacher from localStorage if available
  const [teacherName, setTeacherName] = useState(data.teacherName || 'معلم الفصل');
  const [teacherTitle, setTeacherTitle] = useState(data.teacherTitle || 'معلم الفصل والمشرف الأكاديمي');

  useEffect(() => {
    try {
      const u = localStorage.getItem('nexus_user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.name && !data.teacherName) {
          setTeacherName(parsed.name);
          if (parsed.specialization) {
            setTeacherTitle(`معلم مادة ${parsed.specialization} والمشرف الأكاديمي`);
          }
        }
      }
    } catch {}
  }, [data.teacherName]);

  const isAr = lang === 'ar';
  const certSuffix = stableCertificateSuffix(data.studentName, data.programTitle, String(data.score));
  const certNumber = data.certNumber || `NEXUS-CERT-2026-${certSuffix}`;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexus.masarplatform.org';
  const verifyUrl = `${origin}/verify/${certNumber}?name=${encodeURIComponent(data.studentName)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML)
      .join('\n');

    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`<!doctype html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8"/>
  <title>شهادة معتمدة - ${data.studentName}</title>
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
      padding: 6mm;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col my-auto" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-black text-white">
              {isAr ? 'الشهادة الأكاديمية المعتمدة' : 'Official Accredited Certificate'}
            </span>
            <div className="flex bg-slate-800 rounded-lg p-0.5 mr-3">
              <button
                onClick={() => setLang('ar')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${isAr ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${!isAr ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                English
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 transition"
            >
              <Printer size={15} />
              <span>{isAr ? 'طباعة PDF 🖨️' : 'Print PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white p-2 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Content Frame */}
        <div className="p-4 sm:p-8 bg-slate-950/60 flex justify-center overflow-x-auto">
          <div
            ref={printRef}
            className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-4 border-[#06392c]"
          >
            {/* Corner Guillioche */}
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-15">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#06392c]">
                <circle cx="100" cy="0" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="100" cy="0" r="70" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="0" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none opacity-15">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#06392c]">
                <circle cx="0" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="0" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="0" cy="100" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>

            {/* Header: LOGOS (NEXUS + IKHLAS SCHOOL) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                    <img src="/logo_new.webp" alt="Nexus" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      {isAr ? 'منصة نِكْسَس التعليمية' : 'NEXUS SMART EDUCATION'}
                    </div>
                    <div className="text-[9px] font-bold text-blue-600">NEXUS PLATFORM</div>
                  </div>
                </div>

                <div className="w-px h-7 bg-slate-200 mx-1" />

                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                    <img src="/ikhlas-logo.jpg" alt="مدارس الإخلاص" className="w-full h-full object-contain rounded-lg" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      {isAr ? 'مدارس الإخلاص الأهلية' : 'IKHLAS PRIVATE SCHOOLS'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500">
                      {isAr ? 'بنين — جدة' : 'BOYS — JEDDAH'}
                    </div>
                  </div>
                </div>
              </div>

              <TopTrophyRibbonBadge isAr={isAr} />

              <div className="text-right">
                <div className="text-[11px] font-black text-[#06392c]">
                  {isAr ? 'رقم التوثيق الرقمي' : 'Accreditation No.'}
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-500">{certNumber}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{data.completionDate}</div>
              </div>
            </div>

            {/* Body */}
            <div className="text-center py-6 sm:py-8 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-[#06392c] font-serif">
                {isAr ? 'شهادة شكر وتقدير' : 'CERTIFICATE OF EXCELLENCE'}
              </h1>

              <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-xl mx-auto">
                {isAr
                  ? 'يُسعد منصة نِكْسَس التعليمية ومدارس الإخلاص الأهلية للبنين بجدة منح هذه الشهادة للطالب المتميز:'
                  : 'Nexus Smart Education & Ikhlas Private Schools proudly award this certificate of honor to:'}
              </p>

              {/* Student Name flanked by Golden Laurels */}
              <div className="flex items-center justify-center gap-6 py-2">
                <GoldenLaurelBranch side="left" />
                <div>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] font-serif leading-tight">
                    {isAr ? data.studentName : data.studentNameEn || data.studentName}
                  </h2>
                  <div className="h-0.5 w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
                </div>
                <GoldenLaurelBranch side="right" />
              </div>

              {/* Program & Achievement Box */}
              <div className="max-w-2xl mx-auto rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500">
                  {isAr ? 'نظير تفوقه وتميزه الأكاديمي الاستثنائي في:' : 'For outstanding academic performance and excellence in:'}
                </p>
                <p className="text-base sm:text-lg font-black text-[#06392c]">{data.programTitle}</p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <span className="text-xs font-bold text-slate-600">
                    {isAr ? 'التقدير المستحق:' : 'Grade Awarded:'}
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                    {data.score >= 95 ? (isAr ? 'ممتاز مع مرتبة الشرف 🏆' : 'High Distinction with Honors 🏆') : (isAr ? 'ممتاز مرتفع ⭐' : 'Excellent ⭐')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">{isAr ? 'بنسبة:' : 'Score:'}</span>
                  <span className="bg-[#06392c] text-white font-mono font-black text-xs px-3 py-1 rounded-lg">
                    %{data.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Teacher Signature */}
              <div className="text-right space-y-1">
                <p className="text-[11px] font-bold text-slate-500">{isAr ? 'يعتمد المعلم والمشرف:' : 'Approved by Teacher:'}</p>
                <h3 className="text-lg font-black text-slate-900">{teacherName}</h3>
                <p className="text-[11px] font-bold text-slate-500">{teacherTitle}</p>
                <div className="h-0.5 w-36 bg-slate-300 mt-2" />
              </div>

              {/* Official Stamp with Teacher Name */}
              <CertificateOfficialStamp dateStr={data.completionDate} isAr={isAr} teacherName={teacherName} />

              {/* Verification QR */}
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl hover:bg-slate-100 transition cursor-pointer"
              >
                <img src={qrUrl} alt="QR Verification" className="w-14 h-14 rounded-xl border border-slate-200 bg-white" />
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-800">
                    {isAr ? 'رمز التحقق الرقمي' : 'Digital Verification'}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {isAr ? 'امسح للتأكد من الاعتماد' : 'Scan to verify authenticity'}
                  </div>
                  <div className="text-[8px] text-blue-700 font-bold mt-0.5">
                    {isAr ? 'فحص الشهادة ↗' : 'Verify Online ↗'}
                  </div>
                </div>
              </a>
            </div>

            {/* Bottom copyright line */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>منصة نِكْسَس التعليمية الذكية · مدارس الإخلاص الأهلية للبنين بجدة © {new Date().getFullYear()}</span>
              <span>تاريخ الإصدار: {data.completionDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
