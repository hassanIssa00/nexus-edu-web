'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export interface CertData {
  certTitle: string;
  subTitle: string;
  teacherName: string;
  teacherTitle: string;
  studentPrefix: string;
  studentName: string;
  gradeLabel: string;
  achievementIntro: string;
  achievement: string;
  score: number;
  ratingText: string;
  date: string;
  note: string;
  certNumber: string;
  themeColor?: 'gold' | 'emerald' | 'blue' | 'classic';
}

/* ── GOLDEN LAUREL SVG BRANCH ── */
export function GoldenLaurelBranch({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      width="38"
      height="64"
      viewBox="0 0 36 60"
      fill="none"
      style={{ transform: side === 'left' ? 'scaleX(-1)' : 'none', flexShrink: 0 }}
    >
      <path d="M18 55C18 35 25 15 32 5" stroke="#d9a238" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 12C23 10 18 13 19 18C23 18 27 16 28 12Z" fill="#d9a238" />
      <path d="M24 22C19 20 14 23 15 28C19 28 23 26 24 22Z" fill="#d9a238" />
      <path d="M20 32C15 30 10 33 11 38C15 38 19 36 20 32Z" fill="#d9a238" />
      <path d="M16 42C11 40 6 43 7 48C11 48 15 46 16 42Z" fill="#d9a238" />
    </svg>
  );
}

/* ── BOTTOM GOLD MEDAL SVG ── */
export function BottomGoldMedal() {
  return (
    <svg width="34" height="40" viewBox="0 0 38 44" fill="none">
      <defs>
        <linearGradient id="mgl_cert_official" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="55%" stopColor="#d9a030" />
          <stop offset="100%" stopColor="#9a6210" />
        </linearGradient>
      </defs>
      <path d="M12 26L7 42L15 38L19 42L17 26Z" fill="#b07820" />
      <path d="M26 26L31 42L23 38L19 42L21 26Z" fill="#b07820" />
      <circle cx="19" cy="16" r="15" fill="url(#mgl_cert_official)" />
      <circle cx="19" cy="16" r="12.5" fill="none" stroke="#fff" strokeWidth="1.4" />
      <path d="M13 16L17 20.5L25 12" stroke="#06392c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function OfficialCertificateDesign({
  form,
  isPrintTarget = false,
  customId,
}: {
  form: CertData;
  isPrintTarget?: boolean;
  customId?: string;
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nexus.masarplatform.org';
  const verifyUrl = `${origin}/verify/${form.certNumber}?name=${encodeURIComponent(form.studentName)}&prog=${encodeURIComponent(form.achievement)}&score=${form.score}&date=${encodeURIComponent(form.date)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const borderColor = form.themeColor === 'blue' ? '#1e3a8a' : form.themeColor === 'gold' ? '#b45309' : '#06392c';
  const headerBgColor = form.themeColor === 'blue' ? '#1e3a8a' : form.themeColor === 'gold' ? '#92400e' : '#06392c';
  const accentLight = form.themeColor === 'blue' ? '#eff6ff' : form.themeColor === 'gold' ? '#fefce8' : '#f0fdf4';

  return (
    <div
      id={customId || (isPrintTarget ? 'printable-certificate' : 'certificate-preview-only')}
      dir="rtl"
      style={{
        background: '#ffffff',
        border: `3.5px solid ${borderColor}`,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Cairo', 'Amiri', Arial, sans-serif",
        boxShadow: isPrintTarget ? 'none' : '0 10px 30px rgba(0,0,0,0.08)',
        minHeight: isPrintTarget ? '200mm' : 'auto',
      }}
    >
      {/* Corner decorative circles SVG */}
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        style={{ position: 'absolute', top: 0, right: 0, opacity: 0.12, pointerEvents: 'none' }}
      >
        <circle cx="200" cy="0" r="185" stroke={borderColor} strokeWidth="1" strokeDasharray="5 4" />
        <circle cx="200" cy="0" r="145" stroke={borderColor} strokeWidth="0.7" />
        <circle cx="200" cy="0" r="105" stroke={borderColor} strokeWidth="0.9" strokeDasharray="3 4" />
      </svg>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.12, pointerEvents: 'none' }}
      >
        <circle cx="0" cy="200" r="185" stroke={borderColor} strokeWidth="1" strokeDasharray="5 4" />
        <circle cx="0" cy="200" r="145" stroke={borderColor} strokeWidth="0.7" />
        <circle cx="0" cy="200" r="105" stroke={borderColor} strokeWidth="0.9" strokeDasharray="3 4" />
      </svg>

      {/* ── TOP HEADER WITH BOTH LOGOS (NEXUS + IKHLAS SCHOOL) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 26px 8px 26px',
          position: 'relative',
          zIndex: 1,
          width: '100%',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        {/* LOGOS SECTION: NEXUS PLATFORM + IKHLAS SCHOOL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Nexus Platform Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                position: 'relative',
                width: 44,
                height: 44,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/logo_new.webp"
                alt="شعار منصة نكسس"
                style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a' }}>منصة نِكْسَس التعليمية</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: '#0284c7' }}>NEXUS SMART EDUCATION</div>
            </div>
          </div>

          {/* Elegant Divider between logos */}
          <div style={{ width: 1.5, height: 32, background: '#cbd5e1' }} />

          {/* School Logo: Ikhlas School */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                position: 'relative',
                width: 44,
                height: 44,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/ikhlas-logo.jpg"
                alt="شعار مدارس الإخلاص"
                style={{ width: '90%', height: '90%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: '#0f172a' }}>مدارس الإخلاص الأهلية</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>بنين — جدة</div>
            </div>
          </div>
        </div>

        {/* Certified Badge Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#ffffff',
            border: '1.5px solid #e2e8e4',
            borderRadius: 14,
            padding: '7px 12px',
            minWidth: 140,
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              background: headerBgColor,
              borderRadius: 10,
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={16} color="white" />
          </div>
          <div style={{ textAlign: 'right', lineHeight: 1.3 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: headerBgColor }}>شهادة تفوق معتمدة</div>
            <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#475569', fontWeight: 700 }}>
              {form.certNumber}
            </div>
            <div style={{ fontSize: 8.5, color: '#64748b' }}>التاريخ: {form.date}</div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        style={{
          padding: '12px 28px 8px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          position: 'relative',
          zIndex: 1,
          flex: 1,
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: headerBgColor,
            margin: 0,
            fontFamily: "'Amiri', Georgia, serif",
            lineHeight: 1.2,
          }}
        >
          {form.certTitle}
        </h1>

        <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0 }}>
          {form.subTitle}
        </p>

        <p style={{ fontSize: 13, fontWeight: 800, color: '#64748b', margin: '2px 0 0' }}>
          {form.studentPrefix} <span style={{ color: headerBgColor }}>({form.gradeLabel})</span>
        </p>

        {/* Student Name + Golden Laurel Branches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '6px 0' }}>
          <GoldenLaurelBranch side="left" />
          <div>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: '#0f172a',
                margin: 0,
                fontFamily: "'Amiri', Georgia, serif",
                lineHeight: 1.1,
              }}
            >
              {form.studentName || 'اسم الطالب'}
            </h2>

            {/* Gold divider line with center diamond */}
            <div style={{ position: 'relative', marginTop: 6, height: 2, display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: 2,
                  background: 'linear-gradient(to right, transparent, #d9a238 20%, #d9a238 80%, transparent)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: 9,
                  height: 9,
                  background: '#d9a238',
                }}
              />
            </div>
          </div>
          <GoldenLaurelBranch side="right" />
        </div>

        {/* Achievement Program / Domain Box */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%', marginTop: 2 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0 }}>
            {form.achievementIntro}
          </p>
          <div
            style={{
              background: accentLight,
              border: `1.5px solid ${borderColor}40`,
              borderRadius: 14,
              padding: '8px 30px',
              maxWidth: '85%',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 900, color: headerBgColor }}>
              {form.achievement}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: '#334155',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 2,
            }}
          >
            <span>وحصل على تقدير تفوق قدره</span>
            <span
              style={{
                background: form.score >= 90 ? '#d4a820' : form.score >= 80 ? headerBgColor : '#2563eb',
                color: 'white',
                fontWeight: 900,
                fontSize: 12,
                padding: '2px 14px',
                borderRadius: 20,
                border: '1.5px solid rgba(0,0,0,0.1)',
              }}
            >
              {form.ratingText}
            </span>
            <span>بنسبة متميزة بلغت</span>
            <span
              style={{
                background: headerBgColor,
                color: 'white',
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: 13,
                padding: '3px 14px',
                borderRadius: 8,
              }}
            >
              %{form.score}
            </span>
          </div>

          {form.note && (
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#64748b',
                fontStyle: 'italic',
                maxWidth: '80%',
                marginTop: 2,
              }}
            >
              &quot;{form.note}&quot;
            </p>
          )}
        </div>
      </div>

      {/* ── FOOTER: TEACHER SIGNATURE & DIGITAL SEAL ── */}
      <div
        style={{
          padding: '8px 28px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid #e2e8f0',
        }}
        dir="rtl"
      >
        {/* Dynamic Teacher Signature Section */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>يعتمد المعلم والمشرف:</span>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#0f172a',
              margin: 0,
              fontFamily: "'Amiri', Georgia, serif",
            }}
          >
            {form.teacherName || 'معلم الفصل'}
          </h3>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', margin: 0 }}>
            {form.teacherTitle || 'معلم الفصل والمشرف الأكاديمي'}
          </p>

          {/* Calligraphic signature text / stamp */}
          <div style={{ position: 'relative', width: 220, marginTop: 8 }}>
            <div
              style={{
                position: 'absolute',
                bottom: 2,
                right: 10,
                fontFamily: "'Amiri', 'Georgia', cursive",
                fontSize: 19,
                fontWeight: 900,
                color: headerBgColor,
                fontStyle: 'italic',
              }}
            >
              {form.teacherName}
            </div>
            <div style={{ borderBottom: '1.5px solid #94a3b8', width: '100%', marginTop: 32, minHeight: 1 }} />
          </div>
        </div>

        {/* Digital Stamp with Teacher's Name and Serial Number */}
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#ffffff',
            border: `1.5px dashed ${borderColor}`,
            borderRadius: 16,
            padding: '6px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            minWidth: 180,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          title="اضغط للتحقق الرقمي من صحة هذه الشهادة"
        >
          <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={100} height={100} viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="76" fill="none" stroke={borderColor} strokeWidth="2.5" />
              <circle cx="80" cy="80" r="68" fill="white" stroke={borderColor} strokeWidth="1.2" />
              <text x="80" y="36" textAnchor="middle" fontFamily="Cairo, Arial" fontSize="6.5" fontWeight="bold" fill={borderColor} direction="rtl">
                الختم الرقمي المعتمد
              </text>
              <text x="80" y="52" textAnchor="middle" fontFamily="Cairo, Arial" fontSize="10" fontWeight="900" fill={borderColor} direction="rtl">
                {form.teacherName}
              </text>
              <line x1="24" y1="63" x2="136" y2="63" stroke={borderColor} strokeWidth="0.8" />
              
              {/* Center emblem or star */}
              <text x="80" y="82" textAnchor="middle" fontSize="16" fill="#d9a238">✦</text>
              <text x="80" y="95" textAnchor="middle" fontFamily="Cairo, Arial" fontSize="6.5" fontWeight="bold" fill="#64748b">
                مدارس الإخلاص الأهلية
              </text>

              <line x1="24" y1="104" x2="136" y2="104" stroke={borderColor} strokeWidth="0.8" />
              <text x="80" y="116" textAnchor="middle" fontFamily="Cairo, Arial" fontSize="7.5" fontWeight="900" fill={borderColor}>
                {form.date}
              </text>
              <text x="80" y="128" textAnchor="middle" fontFamily="Cairo, Arial" fontSize="5" fontWeight="bold" fill={borderColor}>
                منصة نِكْسَس التعليمية · جدة
              </text>
            </svg>
          </div>

          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: borderColor }}>شهادة معتمدة رقمياً</div>
            <div style={{ fontSize: 8.5, fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>
              {form.certNumber}
            </div>
          </div>
        </a>
      </div>

      {/* ── BOTTOM BRAND & COPYRIGHT BAR ── */}
      <div
        style={{
          background: headerBgColor,
          padding: '8px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BottomGoldMedal />
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#ffffff' }}>وثيقة تفوق واعتماد أكاديمي رسمي</div>
            <div style={{ fontSize: 9.5, color: '#cbd5e1' }}>
              منصة نِكْسَس التعليمية الذكية بالتعاون مع مدارس الإخلاص الأهلية للبنين بجدة · جميع الحقوق محفوظة
            </div>
          </div>
        </div>

        {/* Real Scannable QR Code */}
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          title="اضغط أو امسح الـ QR للتحقق الرقمي من صحة الشهادة"
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', lineHeight: 1.3 }}>
              تحقق من صحة الشهادة
            </div>
            <div style={{ fontSize: 9.5, color: '#93c5fd', lineHeight: 1.3 }}>
              امسح الرمز للتأكد
            </div>
          </div>
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              padding: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              flexShrink: 0,
            }}
          >
            <img
              src={qrImageUrl}
              alt="رمز QR للتحقق"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </a>
      </div>
    </div>
  );
}
