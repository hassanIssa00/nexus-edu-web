'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Star,
  Download,
  Loader2,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Search,
  CheckCircle2,
  Sun,
  Moon,
  Coffee,
  Repeat,
  Compass,
} from 'lucide-react';
import { CurriculumSubject } from '@/lib/curriculaData';

// ── Complete 37 Surahs of Juz' Amma with starting pages and details ────────────
export type SurahInfo = {
  num: number;
  name: string;
  type: 'مكية' | 'مدنية';
  ayahCount: number;
  page: number;
  mp3Padded: string;
};

export const JUZ_AMMA_SURAHS: SurahInfo[] = [
  { num: 78, name: 'النبأ', type: 'مكية', ayahCount: 40, page: 1, mp3Padded: '078' },
  { num: 79, name: 'النازعات', type: 'مكية', ayahCount: 46, page: 6, mp3Padded: '079' },
  { num: 80, name: 'عبس', type: 'مكية', ayahCount: 42, page: 11, mp3Padded: '080' },
  { num: 81, name: 'التكوير', type: 'مكية', ayahCount: 29, page: 15, mp3Padded: '081' },
  { num: 82, name: 'الانفطار', type: 'مكية', ayahCount: 19, page: 18, mp3Padded: '082' },
  { num: 83, name: 'المطففين', type: 'مكية', ayahCount: 36, page: 20, mp3Padded: '083' },
  { num: 84, name: 'الانشقاق', type: 'مكية', ayahCount: 25, page: 24, mp3Padded: '084' },
  { num: 85, name: 'البروج', type: 'مكية', ayahCount: 22, page: 27, mp3Padded: '085' },
  { num: 86, name: 'الطارق', type: 'مكية', ayahCount: 17, page: 30, mp3Padded: '086' },
  { num: 87, name: 'الأعلى', type: 'مكية', ayahCount: 19, page: 32, mp3Padded: '087' },
  { num: 88, name: 'الغاشية', type: 'مكية', ayahCount: 26, page: 34, mp3Padded: '088' },
  { num: 89, name: 'الفجر', type: 'مكية', ayahCount: 30, page: 37, mp3Padded: '089' },
  { num: 90, name: 'البلد', type: 'مكية', ayahCount: 20, page: 41, mp3Padded: '090' },
  { num: 91, name: 'الشمس', type: 'مكية', ayahCount: 15, page: 43, mp3Padded: '091' },
  { num: 92, name: 'الليل', type: 'مكية', ayahCount: 21, page: 45, mp3Padded: '092' },
  { num: 93, name: 'الضحى', type: 'مكية', ayahCount: 11, page: 47, mp3Padded: '093' },
  { num: 94, name: 'الشرح', type: 'مكية', ayahCount: 8, page: 48, mp3Padded: '094' },
  { num: 95, name: 'التين', type: 'مكية', ayahCount: 8, page: 49, mp3Padded: '095' },
  { num: 96, name: 'العلق', type: 'مكية', ayahCount: 19, page: 50, mp3Padded: '096' },
  { num: 97, name: 'القدر', type: 'مكية', ayahCount: 5, page: 52, mp3Padded: '097' },
  { num: 98, name: 'البينة', type: 'مدنية', ayahCount: 8, page: 53, mp3Padded: '098' },
  { num: 99, name: 'الزلزلة', type: 'مدنية', ayahCount: 8, page: 55, mp3Padded: '099' },
  { num: 100, name: 'العاديات', type: 'مكية', ayahCount: 11, page: 56, mp3Padded: '100' },
  { num: 101, name: 'القارعة', type: 'مكية', ayahCount: 11, page: 57, mp3Padded: '101' },
  { num: 102, name: 'التكاثر', type: 'مكية', ayahCount: 8, page: 58, mp3Padded: '102' },
  { num: 103, name: 'العصر', type: 'مكية', ayahCount: 3, page: 59, mp3Padded: '103' },
  { num: 104, name: 'الهمزة', type: 'مكية', ayahCount: 9, page: 60, mp3Padded: '104' },
  { num: 105, name: 'الفيل', type: 'مكية', ayahCount: 5, page: 61, mp3Padded: '105' },
  { num: 106, name: 'قريش', type: 'مكية', ayahCount: 4, page: 62, mp3Padded: '106' },
  { num: 107, name: 'الماعون', type: 'مكية', ayahCount: 7, page: 63, mp3Padded: '107' },
  { num: 108, name: 'الكوثر', type: 'مكية', ayahCount: 3, page: 64, mp3Padded: '108' },
  { num: 109, name: 'الكافرون', type: 'مكية', ayahCount: 6, page: 65, mp3Padded: '109' },
  { num: 110, name: 'النصر', type: 'مدنية', ayahCount: 3, page: 66, mp3Padded: '110' },
  { num: 111, name: 'المسد', type: 'مكية', ayahCount: 5, page: 67, mp3Padded: '111' },
  { num: 112, name: 'الإخلاص', type: 'مكية', ayahCount: 4, page: 68, mp3Padded: '112' },
  { num: 113, name: 'الفلق', type: 'مكية', ayahCount: 5, page: 69, mp3Padded: '113' },
  { num: 114, name: 'الناس', type: 'مكية', ayahCount: 6, page: 70, mp3Padded: '114' },
];

const RECITERS = [
  { id: 'minshawi', name: 'الشيخ محمد صديق المنشاوي (المرتل)', server: 'https://server10.mp3quran.net/minsh/' },
  { id: 'alafasy', name: 'الشيخ مشاري راشد العفاسي', server: 'https://server8.mp3quran.net/afs/' },
  { id: 'husary', name: 'الشيخ محمود خليل الحصري (المعلم)', server: 'https://server13.mp3quran.net/husr/' },
  { id: 'abdulbasit', name: 'الشيخ عبد الباسط عبد الصمد (مرتل)', server: 'https://server7.mp3quran.net/basit/' },
];

const QURAN_BOOKMARK_KEY = 'nexus.quranBookmark.v1';

type ThemeMode = 'royal' | 'sepia' | 'dark';

function playPageTurnSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

export default function QuranReadOnlyViewer({
  curriculum,
}: {
  curriculum: CurriculumSubject;
}) {
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // New Features State
  const [theme, setTheme] = useState<ThemeMode>('royal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSurahIndex, setShowSurahIndex] = useState(false);
  const [surahSearch, setSurahSearch] = useState('');
  const [savedBookmarkPage, setSavedBookmarkPage] = useState<number | null>(null);

  // Audio Reciter Player State
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hifz Repeat Counter
  const [repeatTarget, setRepeatTarget] = useState<number>(3);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [showHifzModal, setShowHifzModal] = useState(false);

  const totalPages = curriculum.pageCount || 72;
  const pdfUrl = `/resources/curricula/${curriculum.slug}/juz-amma.pdf`;

  // Pre-rendered fast page image
  const pageSrc = (n: number) =>
    `/resources/curricula/${curriculum.slug}/page-${String(n).padStart(3, '0')}.jpg`;

  // Determine current active Surah by page
  const currentSurah =
    [...JUZ_AMMA_SURAHS]
      .reverse()
      .find((s) => page >= s.page) || JUZ_AMMA_SURAHS[0];

  // Load bookmark on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(QURAN_BOOKMARK_KEY);
      if (saved) {
        setSavedBookmarkPage(parseInt(saved, 10));
      }
    } catch {}
  }, []);

  const goToPage = useCallback(
    (n: number) => {
      const clamped = Math.max(1, Math.min(totalPages, n));
      if (clamped !== page) {
        if (soundEnabled) playPageTurnSound();
        setPage(clamped);
        setPageInput(String(clamped));
        setImageLoaded(false);
      }
    },
    [page, soundEnabled, totalPages],
  );

  const handlePageInput = (v: string) => {
    setPageInput(v);
    const n = parseInt(v, 10);
    if (!isNaN(n)) goToPage(n);
  };

  const clampZoom = (v: number) => Math.max(70, Math.min(180, v));

  // Toggle bookmark ribbon
  function toggleQuranBookmark() {
    if (savedBookmarkPage === page) {
      setSavedBookmarkPage(null);
      localStorage.removeItem(QURAN_BOOKMARK_KEY);
    } else {
      setSavedBookmarkPage(page);
      localStorage.setItem(QURAN_BOOKMARK_KEY, String(page));
    }
  }

  // Preload adjacent pages
  useEffect(() => {
    if (page < totalPages) {
      const nextImg = new Image();
      nextImg.src = pageSrc(page + 1);
    }
    if (page > 1) {
      const prevImg = new Image();
      prevImg.src = pageSrc(page - 1);
    }
    if (page + 2 <= totalPages) {
      const next2Img = new Image();
      next2Img.src = pageSrc(page + 2);
    }
  }, [page, totalPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        goToPage(page + 1);
      } else if (e.key === 'ArrowRight') {
        goToPage(page - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, goToPage]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (diffX > 50) {
      goToPage(page + 1);
    } else if (diffX < -50) {
      goToPage(page - 1);
    }
  };

  // Audio Playback Handler
  const currentAudioUrl = `${selectedReciter.server}${currentSurah.mp3Padded}.mp3`;

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      setAudioError(false);
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          setAudioError(true);
          setIsPlayingAudio(false);
        });
    }
  };

  // When Surah changes, pause or update audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentAudioUrl;
      if (isPlayingAudio) {
        audioRef.current
          .play()
          .catch(() => setIsPlayingAudio(false));
      }
    }
  }, [currentSurah.mp3Padded, selectedReciter.server]);

  // Filtered Surahs for Index Modal
  const filteredSurahs = JUZ_AMMA_SURAHS.filter(
    (s) =>
      s.name.includes(surahSearch) ||
      String(s.num).includes(surahSearch) ||
      String(s.page).includes(surahSearch),
  );

  // Background style based on reading theme
  const getContainerBg = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f7f2e5] text-amber-950';
      case 'dark':
        return 'bg-[#121316] text-slate-100';
      default:
        return 'bg-[#faf8f3] text-slate-900';
    }
  };

  const getPageViewerBg = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ece3d0] border-amber-200';
      case 'dark':
        return 'bg-[#181a20] border-white/5';
      default:
        return 'bg-[#f5f1e8] border-amber-100';
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 transition-colors duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 overflow-auto ' + getContainerBg() : ''
      }`}
      dir="rtl"
    >
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => {
          setAudioError(true);
          setIsPlayingAudio(false);
        }}
      />

      {/* ── Islamic Royal Header ── */}
      <div
        className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
        }}
      >
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 text-[11px] font-black">
                <Star size={12} className="text-amber-300" />
                المصحف الشريف — الجزء الثلاثون
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-black text-amber-200">
                <Sparkles size={11} />
                سورة {currentSurah.name} ({currentSurah.type} — {currentSurah.ayahCount} آية)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
              جزء عمّ — القرآن الكريم
            </h1>
            <p className="text-xs md:text-sm font-bold text-emerald-100/90 mt-1 max-w-xl">
              تصفح المصحف الشريف بدقة عالية مع الاستماع لتلاوات خاشعة بصوت كبار القراء، وفهرس شامل لكافة السور.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Surah Index Button */}
            <button
              onClick={() => setShowSurahIndex(true)}
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition border border-white/10"
            >
              <Compass size={14} className="text-amber-300" />
              <span>فهرس السور (37 سورة)</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={toggleQuranBookmark}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition border ${
                savedBookmarkPage === page
                  ? 'bg-amber-400 text-amber-950 border-amber-300 ring-2 ring-amber-300/50'
                  : 'bg-white/15 text-white border-white/10 hover:bg-white/25'
              }`}
              title="فاصل القراءة"
            >
              {savedBookmarkPage === page ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              <span>{savedBookmarkPage === page ? 'فاصل القراءة محفوظ' : 'حفظ موضع التوقف'}</span>
            </button>

            {/* Hifz Repetition Modal Button */}
            <button
              onClick={() => setShowHifzModal(!showHifzModal)}
              className="inline-flex items-center gap-1.5 bg-emerald-600/60 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-black shadow-sm transition border border-emerald-400/30"
              title="عداد التكرار للحفظ"
            >
              <Repeat size={14} />
              <span>تكرار الحفظ ({repeatCount}/{repeatTarget})</span>
            </button>

            {/* Download PDF */}
            <a
              href={pdfUrl}
              download="جزء-عم-المصحف-الشريف.pdf"
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition"
              title="تحميل نسخة PDF الأصلية للطباعة"
            >
              <Download size={13} />
              <span>تحميل PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Saved Bookmark Notification Banner ── */}
      {savedBookmarkPage && savedBookmarkPage !== page && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-3 px-4 shadow-xs">
          <div className="flex items-center gap-2">
            <BookmarkCheck size={16} className="text-amber-600" />
            <span className="text-xs font-black text-amber-900 dark:text-amber-200">
              📌 لديك فاصل محفوظ عند صفحة {savedBookmarkPage}
            </span>
          </div>
          <button
            onClick={() => goToPage(savedBookmarkPage)}
            className="text-xs font-black text-amber-800 bg-amber-200/80 hover:bg-amber-300 px-3 py-1 rounded-lg transition"
          >
            الانتقال للموضع المحفوظ ⬅️
          </button>
        </div>
      )}

      {/* ── Holy Audio Reciter Player Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200/70 dark:border-white/10 bg-white dark:bg-[#1a1b22] p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            onClick={togglePlayAudio}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-md ${
              isPlayingAudio
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title={isPlayingAudio ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
          >
            {isPlayingAudio ? <Pause size={18} /> : <Play size={18} className="mr-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                تلاوة سورة {currentSurah.name}
              </span>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/30">
                {isPlayingAudio ? 'جاري الاستماع الآن 🎧' : 'جاهز للتشغيل'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              تلاوة مرئية متطابقة مع صفحات جزء عمّ المبارك
            </p>
          </div>
        </div>

        {/* Reciter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">القارئ:</span>
          <select
            value={selectedReciter.id}
            onChange={(e) => {
              const r = RECITERS.find((rec) => rec.id === e.target.value);
              if (r) setSelectedReciter(r);
            }}
            className="text-xs font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Toolbar with Page Navigation, Themes & Zoom ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1b22] p-3 shadow-xs">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
            title="الصفحة السابقة (السهم الأيمن)"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => handlePageInput(e.target.value)}
              className="w-12 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white outline-none"
            />
            <span className="text-xs font-bold text-slate-400">/ {totalPages}</span>
          </div>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
            title="الصفحة التالية (السهم الأيسر)"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Current Surah Indicator Pill */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3.5 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300">
            <BookOpen size={13} />
            سورة {currentSurah.name} ({currentSurah.type})
          </span>
        </div>

        {/* Themes, Sound & Zoom */}
        <div className="flex items-center gap-2">
          {/* Themes */}
          <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5">
            <button
              onClick={() => setTheme('royal')}
              title="ورق المصحف العاجي الملكي"
              className={`p-1.5 rounded-lg transition ${
                theme === 'royal' ? 'bg-amber-100 shadow text-amber-950 font-bold' : 'text-slate-400'
              }`}
            >
              <Sun size={15} />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              title="ورق مريح للعين (سيبيا)"
              className={`p-1.5 rounded-lg transition ${
                theme === 'sepia' ? 'bg-[#ede6d4] shadow text-amber-900' : 'text-slate-400'
              }`}
            >
              <Coffee size={15} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="المصحف الليلي"
              className={`p-1.5 rounded-lg transition ${
                theme === 'dark' ? 'bg-slate-800 shadow text-amber-300' : 'text-slate-400'
              }`}
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'صوت تقليب الصفحات مفعل' : 'صوت تقليب الصفحات معطل'}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 transition"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Zoom Controls */}
          <button
            onClick={() => setZoom((z) => clampZoom(z - 15))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
            title="تصغير"
          >
            <ZoomOut size={17} />
          </button>
          <span className="min-w-[42px] text-center text-xs font-black text-slate-700 dark:text-slate-300">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => clampZoom(z + 15))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
            title="تكبير"
          >
            <ZoomIn size={17} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
            title="إعادة ضبط الحجم"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
            title={isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </div>

      {/* ── Hifz Memorization Repetition Box (if open) ── */}
      {showHifzModal && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Repeat size={16} className="text-emerald-700" />
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                عداد التكرار لترسيخ حفظ صفحة {page} (سورة {currentSurah.name}):
              </span>
            </div>
            <button
              onClick={() => setShowHifzModal(false)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              إغلاق
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">الهدف:</span>
              {[3, 5, 7, 10].map((t) => (
                <button
                  key={t}
                  onClick={() => setRepeatTarget(t)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition border ${
                    repeatTarget === t
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-white/5 border-slate-200 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {t} مرات
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRepeatCount((c) => Math.min(repeatTarget, c + 1))}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition"
              >
                + قرأت الصفحة مرة واحدة ({repeatCount}/{repeatTarget})
              </button>
              <button
                onClick={() => setRepeatCount(0)}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 transition"
              >
                إعادة التعيين
              </button>
            </div>
          </div>
          {repeatCount >= repeatTarget && (
            <div className="mt-3 p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-center text-xs font-black text-emerald-800 dark:text-emerald-200">
              🎉 مبارك يا بطل! أتممت تكرار الصفحة {repeatTarget} مرات بنجاح، ثبتك الله وزادك حفظاً.
            </div>
          )}
        </div>
      )}

      {/* ── Read-Only Quran Page Display with Gold Frame & 3D Depth ── */}
      <div
        className={`overflow-hidden rounded-3xl border shadow-xl transition-colors duration-300 ${getPageViewerBg()}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Read-only notice */}
        <div className="flex items-center justify-between border-b border-amber-200/60 bg-amber-100/60 dark:bg-amber-950/40 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">📖</span>
            <p className="text-[11px] font-black text-amber-950 dark:text-amber-200">
              المصحف الشريف المبارك — تصفح وتلاوة خاشعة وحفظ متقن
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
            اسحب لليمين/اليسار للتقليب، أو استخدم الأسهم ⬅️ ➡️
          </span>
        </div>

        {/* Page Container */}
        <div className="relative flex items-center justify-center p-4 sm:p-8 min-h-[72vh] transition-all">
          {/* Subtle loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 dark:bg-slate-900/70 z-20 backdrop-blur-xs">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                جاري عرض صفحة {page}...
              </p>
            </div>
          )}

          {/* Golden Ribbon Bookmark when saved */}
          {savedBookmarkPage === page && (
            <div className="absolute top-2 right-8 z-30 flex flex-col items-center pointer-events-none drop-shadow-lg">
              <div className="w-7 h-12 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-b-sm flex items-center justify-center text-amber-950 font-black text-xs shadow-md">
                ★
              </div>
            </div>
          )}

          {/* Quran Page Image with Authentic Mushaf Frame Shadow */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`quran-page-${page}`}
            src={pageSrc(page)}
            alt={`القرآن الكريم - جزء عم - صفحة ${page}`}
            onLoad={() => setImageLoaded(true)}
            className="rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-200 select-none block mx-auto border border-amber-200/50"
            style={{
              width: `${zoom}%`,
              maxWidth: '850px',
              minWidth: '270px',
              display: 'block',
            }}
          />
        </div>

        {/* ── Fast Range Slider Bar ── */}
        <div className="border-t border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-2 flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400">1</span>
          <input
            type="range"
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-[11px] font-bold text-slate-400">{totalPages}</span>
        </div>

        {/* Bottom Fast Page Switcher Bar */}
        <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1b22] px-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition"
          >
            <ChevronRight size={16} />
            <span>الصفحة السابقة</span>
          </button>

          <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
            صفحة {page} من {totalPages}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition"
          >
            <span>الصفحة التالية</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* ── Surah Index Modal / Drawer ── */}
      {showSurahIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#1a1b22] rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-white/10 max-h-[85vh] flex flex-col"
            dir="rtl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  فهرس سور جزء عمّ المبارك (37 سورة)
                </h3>
              </div>
              <button
                onClick={() => setShowSurahIndex(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-4">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                placeholder="ابحث باسم السورة أو رقمها أو رقم الصفحة..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* Surah List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredSurahs.map((s) => (
                <button
                  key={s.num}
                  onClick={() => {
                    goToPage(s.page);
                    setShowSurahIndex(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition border text-right ${
                    currentSurah.num === s.num
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-black'
                      : 'border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center justify-center">
                      {s.num}
                    </span>
                    <div>
                      <span className="text-sm font-black">سورة {s.name}</span>
                      <span className="text-[11px] text-slate-400 font-bold mr-2">
                        ({s.type} • {s.ayahCount} آيات)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg">
                      صفحة {s.page}
                    </span>
                    <ChevronLeft size={16} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>

            {/* Duaa Khatm Al-Quran Quick Link */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">دعاء ختم القرآن الكريم:</span>
              <button
                onClick={() => {
                  goToPage(71);
                  setShowSurahIndex(false);
                }}
                className="text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
              >
                الانتقال لدعاء الختم (ص 71) 📜
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
