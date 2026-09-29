'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Highlighter,
  Loader2,
  Maximize2,
  Minimize2,
  PenLine,
  Printer,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  FileText,
  Sliders,
  Columns,
  Undo2,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Check,
} from 'lucide-react';
import { CurriculumSubject } from '@/lib/curriculaData';

// ── Unit badge colours (cycling) ────────────────────────────────────────────
const UNIT_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
];

const COLOR_PALETTE = [
  { name: 'أسود', value: '#0f172a' },
  { name: 'كحلي', value: '#1e3a8a' },
  { name: 'أحمر', value: '#dc2626' },
  { name: 'أخضر', value: '#059669' },
  { name: 'بنفسجي', value: '#7c3aed' },
  { name: 'ذهبي', value: '#d97706' },
  { name: 'أزرق سماوي', value: '#0284c7' },
];

type Tool = 'view' | 'pen' | 'highlighter' | 'eraser';
type ThemeMode = 'classic' | 'sepia' | 'dark';

const DRAWINGS_KEY = 'nexus.curriculumDrawings.v1';
const BOOKMARKS_KEY = 'nexus.curriculumBookmarks.v1';
const NOTES_KEY = 'nexus.curriculumNotes.v1';

type DrawingRecord = {
  id: string;
  slug: string;
  page: number;
  dataUrl: string;
  savedAt: string;
};

type BookmarkRecord = {
  id: string;
  slug: string;
  page: number;
  title: string;
  createdAt: string;
};

function readDrawings(): DrawingRecord[] {
  try {
    return JSON.parse(localStorage.getItem(DRAWINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveDrawing(record: DrawingRecord) {
  const all = readDrawings().filter((d) => d.id !== record.id);
  try {
    localStorage.setItem(DRAWINGS_KEY, JSON.stringify([record, ...all]));
  } catch {}
}

function deleteDrawing(id: string) {
  const next = readDrawings().filter((d) => d.id !== id);
  try {
    localStorage.setItem(DRAWINGS_KEY, JSON.stringify(next));
  } catch {}
}

function playPageTurnSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch {}
}

export default function CurriculumInteractiveWorkbook({
  curriculum,
}: {
  curriculum: CurriculumSubject;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyStack = useRef<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#0f172a');
  const [brush, setBrush] = useState(4);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedAt, setSavedAt] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  // New High-End Enhancements
  const [theme, setTheme] = useState<ThemeMode>('sepia');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [twoPageMode, setTwoPageMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [pageNote, setPageNote] = useState('');

  const totalPages = curriculum.pageCount;

  function pageSrc(pageNum: number) {
    return `/resources/curricula/${curriculum.slug}/page-${String(pageNum).padStart(3, '0')}.jpg`;
  }

  function drawingId(pageNum = page) {
    return `${curriculum.slug}_p${pageNum}`;
  }

  function getCanvasContext() {
    return canvasRef.current?.getContext('2d') ?? null;
  }

  function syncCanvasSize() {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const w = img.naturalWidth || img.clientWidth || 800;
    const h = img.naturalHeight || img.clientHeight || 1130;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  const redrawSavedDrawing = useCallback((pageNum = page) => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    syncCanvasSize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const saved = readDrawings().find((d) => d.id === drawingId(pageNum));
    if (!saved?.dataUrl) {
      setSavedAt('');
      historyStack.current = [];
      return;
    }
    const tmp = new Image();
    tmp.onload = () => {
      ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
      setSavedAt(new Date(saved.savedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
      historyStack.current = [saved.dataUrl];
    };
    tmp.src = saved.dataUrl;
  }, [curriculum.slug, page]);

  // Load Bookmarks & Notes
  useEffect(() => {
    try {
      const bMarks: BookmarkRecord[] = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      setBookmarks(bMarks.filter((b) => b.slug === curriculum.slug));
    } catch {}
  }, [curriculum.slug]);

  // Load page note when page changes
  useEffect(() => {
    try {
      const notesMap = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
      setPageNote(notesMap[`${curriculum.slug}_p${page}`] || '');
    } catch {
      setPageNote('');
    }
  }, [curriculum.slug, page]);

  // Preload adjacent pages
  useEffect(() => {
    const preload = (n: number) => {
      if (n >= 1 && n <= totalPages) {
        const i = new Image();
        i.src = pageSrc(n);
      }
    };
    preload(page - 1);
    preload(page + 1);
    preload(page + 2);
  }, [page, totalPages]);

  // Restore drawings on page change
  useEffect(() => {
    setPageInput(String(page));
    setLoadingPage(true);
    setImageLoaded(false);
    const t = setTimeout(() => {
      redrawSavedDrawing(page);
      setLoadingPage(false);
    }, 150);
    return () => clearTimeout(t);
  }, [page, redrawSavedDrawing]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') goToPage(page + 1);
      else if (e.key === 'ArrowRight') goToPage(page - 1);
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page]);

  function goToPage(n: number) {
    const c = Math.max(1, Math.min(totalPages, n));
    if (c !== page) {
      if (soundEnabled) playPageTurnSound();
      setPage(c);
      setPageInput(String(c));
    }
  }

  // Toggle bookmark for current page
  function toggleBookmark() {
    const exists = bookmarks.find((b) => b.page === page);
    let next: BookmarkRecord[];
    if (exists) {
      next = bookmarks.filter((b) => b.page !== page);
    } else {
      const newBm: BookmarkRecord = {
        id: `bm_${Date.now()}`,
        slug: curriculum.slug,
        page,
        title: activeUnit ? activeUnit.title : `صفحة ${page}`,
        createdAt: new Date().toLocaleDateString('ar-SA'),
      };
      next = [...bookmarks, newBm];
    }
    setBookmarks(next);
    try {
      const all: BookmarkRecord[] = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      const withoutThisSlug = all.filter((b) => b.slug !== curriculum.slug);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...withoutThisSlug, ...next]));
    } catch {}
  }

  const isCurrentPageBookmarked = Boolean(bookmarks.find((b) => b.page === page));

  function handleSaveNote(text: string) {
    setPageNote(text);
    try {
      const notesMap = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
      notesMap[`${curriculum.slug}_p${page}`] = text;
      localStorage.setItem(NOTES_KEY, JSON.stringify(notesMap));
    } catch {}
  }

  function handleUndo() {
    if (historyStack.current.length <= 1) {
      clearPage();
      return;
    }
    historyStack.current.pop();
    const prevUrl = historyStack.current[historyStack.current.length - 1];
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tmp = new Image();
    tmp.onload = () => {
      ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      saveDrawing({ id: drawingId(), slug: curriculum.slug, page, dataUrl, savedAt: new Date().toISOString() });
    };
    tmp.src = prevUrl;
  }

  function getCanvasCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function applyToolStyle(ctx: CanvasRenderingContext2D) {
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brush * 4;
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = brush * 3.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = brush;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function startDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === 'view') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const pt = getCanvasCoords(e);
    lastPointRef.current = pt;
    if (!pt) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.save();
    applyToolStyle(ctx);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (ctx.lineWidth || 4) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function onDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || tool === 'view') return;
    const cur = getCanvasCoords(e);
    const last = lastPointRef.current;
    if (!cur || !last) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.save();
    applyToolStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.stroke();
    ctx.restore();
    lastPointRef.current = cur;
  }

  function endDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    persistCanvas();
  }

  function persistCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    historyStack.current.push(dataUrl);
    const now = new Date().toISOString();
    saveDrawing({ id: drawingId(), slug: curriculum.slug, page, dataUrl, savedAt: now });
    setSavedAt(new Date(now).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
  }

  function clearPage() {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    deleteDrawing(drawingId());
    historyStack.current = [];
    setSavedAt('');
  }

  const activeUnit = curriculum.units.find((u) => page >= u.fromPage && page <= u.toPage);

  // Background style based on reading theme
  const getContainerBg = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f7f2e7] text-amber-950';
      case 'dark':
        return 'bg-[#121316] text-slate-100';
      default:
        return 'bg-slate-50 text-slate-900';
    }
  };

  const getPageViewerBg = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ede6d4] border-amber-200/60';
      case 'dark':
        return 'bg-[#18191e] border-white/5';
      default:
        return 'bg-[#f8f9fa] border-slate-200';
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 transition-colors duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 overflow-auto ' + getContainerBg() : ''
      }`}
      dir="rtl"
    >
      {/* ── Modern Premium Book Header ── */}
      <div
        className="rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${curriculum.color} 0%, ${curriculum.color}ee 100%)`,
        }}
      >
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 text-white px-3 py-1 text-[11px] font-black backdrop-blur-sm">
                <Sparkles size={13} className="text-amber-300" />
                {curriculum.badge}
              </span>
              <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                {curriculum.grade}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black drop-shadow-sm">{curriculum.title}</h1>
            <p className="text-xs md:text-sm font-bold text-white/85 mt-1 max-w-xl">
              {curriculum.subtitle} — تجربة تصفح تفاعلية مع إمكانية التدوين والرسم والحفظ الفوري.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                isCurrentPageBookmarked
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="إشارة مرجعية"
            >
              {isCurrentPageBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              <span>{isCurrentPageBookmarked ? 'صفحة محفوظة' : 'إشارة مرجعية'}</span>
            </button>

            {/* Notes button */}
            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                showNotesDrawer
                  ? 'bg-white text-slate-900'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="ملاحظات الصفحة"
            >
              <FileText size={15} />
              <span>ملاحظاتي {pageNote ? '•' : ''}</span>
            </button>

            {/* Bookmarks List Modal Trigger */}
            {bookmarks.length > 0 && (
              <button
                onClick={() => setShowBookmarksList(!showBookmarksList)}
                className="bg-white/15 text-white hover:bg-white/25 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <span>العلامات ({bookmarks.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Bookmarks Dropdown Bar (if open) ── */}
      {showBookmarksList && bookmarks.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-amber-900 dark:text-amber-200">
              📌 العلامات المرجعية المحفوظة في هذا الكتاب:
            </span>
            <button
              onClick={() => setShowBookmarksList(false)}
              className="text-[11px] font-bold text-amber-700 hover:underline"
            >
              إغلاق
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  goToPage(b.page);
                  setShowBookmarksList(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition border flex items-center gap-1.5 ${
                  b.page === page
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 hover:bg-amber-100'
                }`}
              >
                <Bookmark size={12} className="text-amber-600" />
                <span>صفحة {b.page}</span>
                <span className="opacity-60 text-[10px]">({b.title})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Units Horizontal Strip ── */}
      <div className="flex flex-wrap gap-2">
        {curriculum.units.map((unit, i) => (
          <button
            key={unit.title}
            onClick={() => goToPage(unit.fromPage)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-black transition hover:opacity-90 ${
              UNIT_COLORS[i % UNIT_COLORS.length]
            } ${
              activeUnit?.title === unit.title
                ? 'ring-2 ring-offset-1 ring-slate-700 dark:ring-white scale-[1.02]'
                : ''
            }`}
          >
            {unit.title}
            <span className="opacity-60 mr-1.5 text-[10px]">
              ({unit.fromPage}–{unit.toPage})
            </span>
          </button>
        ))}
      </div>

      {/* ── Advanced Studio Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1b22] p-3 shadow-sm">
        {/* Tools */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'view', icon: <BookOpen size={16} />, label: 'عرض وتصفح فقط' },
            { id: 'pen', icon: <PenLine size={16} />, label: 'قلم تفاعلي' },
            { id: 'highlighter', icon: <Highlighter size={16} />, label: 'قلم تظليل' },
            { id: 'eraser', icon: <Eraser size={16} />, label: 'ممحاة' },
          ].map((t) => (
            <button
              key={t.id}
              title={t.label}
              onClick={() => setTool(t.id as Tool)}
              className={`grid h-9 w-9 place-items-center rounded-xl border text-sm transition ${
                tool === t.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 font-bold'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {t.icon}
            </button>
          ))}

          {/* Undo Button */}
          {tool !== 'view' && (
            <button
              onClick={handleUndo}
              title="تراجع (Ctrl+Z)"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
            >
              <Undo2 size={15} />
            </button>
          )}
        </div>

        {/* Color Palette */}
        {tool !== 'view' && tool !== 'eraser' && (
          <div className="flex items-center gap-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.value}
                title={c.name}
                onClick={() => setColor(c.value)}
                className={`h-6 w-6 rounded-full border-2 transition ${
                  color === c.value ? 'border-slate-800 dark:border-white scale-125' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}

        {/* Brush size */}
        {tool === 'pen' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">حجم:</span>
            {[2, 4, 7, 12].map((s) => (
              <button
                key={s}
                onClick={() => setBrush(s)}
                className={`grid h-8 w-8 place-items-center rounded-xl border text-[10px] font-black transition ${
                  brush === s
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Themes & Viewing Preferences */}
        <div className="flex items-center gap-1.5 border-r pr-2 border-slate-200 dark:border-white/10">
          {/* Themes */}
          <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl p-0.5">
            <button
              onClick={() => setTheme('classic')}
              title="ورق ناصع"
              className={`p-1.5 rounded-lg transition ${
                theme === 'classic' ? 'bg-white shadow text-slate-900' : 'text-slate-400'
              }`}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              title="ورق مريح للعين (سيبيا)"
              className={`p-1.5 rounded-lg transition ${
                theme === 'sepia' ? 'bg-[#f7f2e7] shadow text-amber-900' : 'text-slate-400'
              }`}
            >
              <Coffee size={14} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="الوضع الليلي"
              className={`p-1.5 rounded-lg transition ${
                theme === 'dark' ? 'bg-slate-800 shadow text-amber-300' : 'text-slate-400'
              }`}
            >
              <Moon size={14} />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'صوت تقليب الورق مفعل' : 'صوت تقليب الورق معطل'}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 transition"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Two Page Spread Toggle (on larger screens) */}
          <button
            onClick={() => setTwoPageMode(!twoPageMode)}
            title={twoPageMode ? 'عرض صفحة واحدة' : 'عرض صفحتين متقابلتين كالكتاب'}
            className={`hidden lg:grid h-9 w-9 place-items-center rounded-xl border transition ${
              twoPageMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'border-slate-200 dark:border-white/10 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Columns size={15} />
          </button>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 disabled:opacity-30 transition"
            title="السابقة (اليمين)"
          >
            <ChevronRight size={18} />
          </button>
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => {
                setPageInput(e.target.value);
                const n = parseInt(e.target.value, 10);
                if (!isNaN(n)) goToPage(n);
              }}
              className="w-10 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white outline-none"
            />
            <span className="text-xs font-bold text-slate-400">/ {totalPages}</span>
          </div>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 disabled:opacity-30 transition"
            title="التالية (اليسار)"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Zoom & Extras */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(60, z - 15))}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition"
            title="تصغير"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 min-w-[36px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 15))}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition"
            title="تكبير"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => setZoom(100)}
            title="إعادة ضبط الحجم"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={clearPage}
            title="مسح رسومات هذه الصفحة"
            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1.5 text-xs font-black text-rose-700 hover:bg-rose-100 transition"
          >
            <Eraser size={13} />
          </button>
          <button
            onClick={() => window.print()}
            title="طباعة الصفحة"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition"
          >
            <Printer size={15} />
          </button>
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ── Saved Status Indicator ── */}
      {savedAt && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <Check size={14} className="text-emerald-500" />
          <span>تم حفظ رسوماتك تلقائياً على صفحة {page} — آخر حفظ: {savedAt}</span>
        </div>
      )}

      {/* ── Realistic Book Page Container with 3D Depth ── */}
      <div
        className={`overflow-hidden rounded-3xl border shadow-lg transition-colors duration-300 ${getPageViewerBg()}`}
      >
        <div className="relative flex items-center justify-center p-4 sm:p-8 min-h-[72vh]">
          {/* Loading indicator */}
          {(loadingPage || !imageLoaded) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 dark:bg-slate-900/70 z-20 backdrop-blur-xs">
              <Loader2 className="animate-spin text-slate-600 dark:text-white" size={32} />
              <p className="text-xs font-black text-slate-700 dark:text-white">
                جاري إعداد صفحة {page}...
              </p>
            </div>
          )}

          {/* 3D Realistic Book Spine & Page Wrapper */}
          <div
            className={`relative flex items-center justify-center transition-all ${
              twoPageMode ? 'gap-2 md:gap-4' : ''
            }`}
          >
            {/* Optional Left Page in Two-Page Mode */}
            {twoPageMode && page < totalPages && (
              <div className="relative hidden md:block rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-white/10 opacity-90 scale-95">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pageSrc(page + 1)}
                  alt={`صفحة ${page + 1}`}
                  className="rounded-xl select-none"
                  style={{ width: `${zoom * 0.8}%`, maxWidth: '500px' }}
                />
                <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  ص {page + 1}
                </div>
              </div>
            )}

            {/* Main Active Page Card with 3D Spine Shadow */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-[0_22px_60px_rgba(0,0,0,0.18)] border border-slate-200/80 dark:border-white/10"
              style={{
                boxShadow:
                  '0 20px 50px rgba(0,0,0,0.15), inset 15px 0 25px -10px rgba(0,0,0,0.06)',
              }}
            >
              {/* Bookmark Ribbon on Top Right */}
              {isCurrentPageBookmarked && (
                <div className="absolute -top-1 right-6 z-30 flex flex-col items-center pointer-events-none drop-shadow-md">
                  <div className="w-6 h-10 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-sm flex items-center justify-center text-amber-950 font-black text-[10px] shadow-sm">
                    ★
                  </div>
                </div>
              )}

              {/* Book page image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                key={`book-page-${page}`}
                src={pageSrc(page)}
                alt={`${curriculum.title} - صفحة ${page}`}
                onLoad={() => {
                  setImageLoaded(true);
                  syncCanvasSize();
                  redrawSavedDrawing(page);
                }}
                className="rounded-xl select-none block mx-auto transition-transform"
                style={{
                  width: `${zoom}%`,
                  maxWidth: '850px',
                  minWidth: '270px',
                  display: 'block',
                }}
              />

              {/* Drawing canvas overlay */}
              {imageLoaded && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full rounded-xl"
                  style={{
                    cursor:
                      tool === 'view'
                        ? 'default'
                        : tool === 'eraser'
                        ? 'cell'
                        : 'crosshair',
                    touchAction: 'none',
                    opacity: tool === 'view' ? 0.35 : 1,
                  }}
                  onPointerDown={startDrawing}
                  onPointerMove={onDraw}
                  onPointerUp={endDrawing}
                  onPointerLeave={endDrawing}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Visual Fast Scrubber Slider Bar ── */}
        <div className="border-t border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-6 py-2 flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400">1</span>
          <input
            type="range"
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-800 dark:accent-amber-400"
          />
          <span className="text-[11px] font-bold text-slate-400">{totalPages}</span>
        </div>

        {/* Bottom Fast Page Switcher Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1b22] p-3 px-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition"
          >
            <ChevronRight size={16} /> الصفحة السابقة
          </button>
          <span className="text-xs font-black text-slate-800 dark:text-white">
            صفحة {page} من {totalPages}
            {activeUnit && (
              <span className="mr-2 text-slate-400 font-bold hidden sm:inline">
                — {activeUnit.title}
              </span>
            )}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 transition"
          >
            الصفحة التالية <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* ── Collapsible Personal Notes Notepad ── */}
      {showNotesDrawer && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/20 p-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <span className="text-xs font-black text-blue-900 dark:text-blue-300">
                مفكرة ملاحظاتي لصفحة {page} (تُحفظ تلقائياً):
              </span>
            </div>
            <button
              onClick={() => setShowNotesDrawer(false)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              إغلاق المفكرة
            </button>
          </div>
          <textarea
            value={pageNote}
            onChange={(e) => handleSaveNote(e.target.value)}
            placeholder="اكتب هنا ملاحظاتك على الدرس، الأسئلة التي تريد سؤال المعلم عنها، أو ملخص سريع..."
            rows={3}
            className="w-full p-3 rounded-xl border border-blue-200 dark:border-white/10 bg-white dark:bg-[#1a1b22] text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          />
        </div>
      )}

      {/* ── Quick Jump Units Grid ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1b22] p-5 shadow-sm">
        <p className="mb-3 text-xs font-black text-slate-500 dark:text-slate-400">
          انتقل سريعاً إلى أي وحدة في هذا المنهج:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {curriculum.units.map((unit, i) => (
            <button
              key={unit.title}
              onClick={() => goToPage(unit.fromPage)}
              className={`rounded-xl border p-3 text-right transition hover:scale-[1.02] ${
                UNIT_COLORS[i % UNIT_COLORS.length]
              } ${activeUnit?.title === unit.title ? 'ring-2 ring-slate-700 dark:ring-white' : ''}`}
            >
              <p className="text-xs font-black leading-5">{unit.title}</p>
              <p className="mt-1 text-[11px] font-bold opacity-70">
                ص {unit.fromPage} – {unit.toPage}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
