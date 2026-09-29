'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Sparkles, Trophy, Zap, Star, CheckCircle2,
  AlertCircle, RotateCcw, Volume2, ArrowRight, Play,
  HelpCircle, Award, Flame, Heart, Clock
} from 'lucide-react'

export interface GameItem {
  id: string
  title: string
  subject: string
  emoji: string
  xp: number
  difficulty: string
}

interface Props {
  isOpen: boolean
  gameId: string
  onClose: () => void
  onAwardXP?: (amount: number) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME DATA
// ─────────────────────────────────────────────────────────────────────────────

const SPELLING_ROUNDS = [
  { prompt: 'أكمل الكلمة بالحرف المناسب: مـ...ـرسة', missing: 'د', options: ['د', 'ذ', 'ر', 'ز'], word: 'مَدْرَسَة' },
  { prompt: 'اختر حرف المد الصحيح: كـ...ـاب', missing: 'ت', options: ['ت', 'ث', 'ب', 'ن'], word: 'كِتَاب' },
  { prompt: 'ما الحرف الصحيح في كلمة: قـ...ـم', missing: 'ل', options: ['ل', 'م', 'ن', 'ع'], word: 'قَلَم' },
  { prompt: 'أكمل بحرف المد: عـ...ـفور', missing: 'ص', options: ['ص', 'ض', 'ط', 'ظ'], word: 'عُصْفُور' },
  { prompt: 'اختر التاء المناسبة: شجر...', missing: 'ة', options: ['ة', 'ت', 'هـ', 'ـت'], word: 'شَجَرَة' },
  { prompt: 'أكمل الكلمة: حـ...ـيبة', missing: 'ق', options: ['ق', 'ف', 'ك', 'ع'], word: 'حَقِيبَة' },
]

const MATH_ROUNDS = [
  { question: '5 + 3 = ؟', answer: 8, options: [7, 8, 9, 10] },
  { question: '10 - 4 = ؟', answer: 6, options: [5, 6, 7, 8] },
  { question: '7 + 6 = ؟', answer: 13, options: [11, 12, 13, 14] },
  { question: '15 - 8 = ؟', answer: 7, options: [6, 7, 8, 9] },
  { question: '9 + 9 = ؟', answer: 18, options: [16, 17, 18, 19] },
  { question: '20 - 7 = ؟', answer: 13, options: [12, 13, 14, 15] },
]

const QURAN_SURAHS = [
  {
    name: 'سورة الإخلاص',
    verses: [
      'قُلْ هُوَ اللَّهُ أَحَدٌ',
      'اللَّهُ الصَّمَدُ',
      'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    ],
  },
  {
    name: 'سورة الفلق',
    verses: [
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      'مِن شَرِّ مَا خَلَقَ',
      'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    ],
  },
  {
    name: 'سورة الكوثر',
    verses: [
      'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    ],
  },
]

const SCIENCE_ROUNDS = [
  {
    question: 'أي من الكائنات التالية يعتبر من الثدييات؟',
    options: ['الأسد 🦁', 'الصقر 🦅', 'السمكة 🐟', 'الضفدع 🐸'],
    answer: 0,
    hint: 'الثدييات تلد وترضع صغارها!',
  },
  {
    question: 'أي حاسة نستخدمها لسماع صوت الأذان؟',
    options: ['حاسة السمع 👂', 'حاسة البصر 👁️', 'حاسة الشم 👃', 'حاسة التذوق 👅'],
    answer: 0,
    hint: 'نسمع الأصوات عبر الأذن.',
  },
  {
    question: 'ماذا تحتاج النبتة لتنمو وتصنع غذاءها؟',
    options: ['الماء وضوء الشمس 🌱', 'الثلج والظلام ❄️', 'الملح والعصير 🧂', 'الحجارة والرمال 🪨'],
    answer: 0,
    hint: 'النباتات تحتاج الضوء والماء لتكبر.',
  },
  {
    question: 'أي مما يلي يعتبر شيئاً غير حي؟',
    options: ['الحصاة والصخرة 🪨', 'العصفور المغرد 🐦', 'شجرة النخيل 🌴', 'القطة الأليفة 🐱'],
    answer: 0,
    hint: 'الجمادات لا تنمو ولا تتنفس.',
  },
]

const CROSSWORD_ROUNDS = [
  {
    clue: 'عاصمة المملكة العربية السعودية 🇸🇦',
    word: 'الرياض',
    letters: ['ا', 'ل', 'ر', 'ي', 'ا', 'ض'],
  },
  {
    clue: 'طائر يرمز للسلام والمحبة 🕊️',
    word: 'حمامة',
    letters: ['ح', 'م', 'ا', 'م', 'ة'],
  },
  {
    clue: 'أول شهر في السنة الهجرية 🌙',
    word: 'محرم',
    letters: ['م', 'ح', 'ر', 'م'],
  },
  {
    clue: 'كتاب الله المعجز المنزل على نبينا محمد ﷺ 📖',
    word: 'القرآن',
    letters: ['ا', 'ل', 'ق', 'ر', 'آ', 'ن'],
  },
]

export default function InteractiveStudentGameModal({
  isOpen,
  gameId,
  onClose,
  onAwardXP,
}: Props) {
  // Normalize gameId (e.g. 'math-dash' or 'math' -> 'math')
  const normalizedId = gameId === 'math-dash' ? 'math'
    : gameId === 'quran-memorize' ? 'quran'
    : gameId === 'science-explorer' ? 'science'
    : gameId

  // Common Game States
  const [score, setScore] = useState(0)
  const [roundIndex, setRoundIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [streak, setStreak] = useState(0)
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Quran game specific states
  const [quranSurahIdx, setQuranSurahIdx] = useState(0)
  const [shuffledVerses, setShuffledVerses] = useState<string[]>([])
  const [orderedVerses, setOrderedVerses] = useState<string[]>([])

  // Crossword specific states
  const [assembledWord, setAssembledWord] = useState<string[]>([])
  const [availableTiles, setAvailableTiles] = useState<{ id: number; char: string; used: boolean }[]>([])

  // Sound effect simulation
  const playSound = (type: 'correct' | 'wrong' | 'win') => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        if (type === 'correct') {
          osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1) // A5
          gain.gain.setValueAtTime(0.15, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          osc.start()
          osc.stop(ctx.currentTime + 0.3)
        } else if (type === 'wrong') {
          osc.frequency.setValueAtTime(220, ctx.currentTime) // A3
          osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.1) // E3
          gain.gain.setValueAtTime(0.2, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          osc.start()
          osc.stop(ctx.currentTime + 0.3)
        } else if (type === 'win') {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const o = ctx.createOscillator()
            const g = ctx.createGain()
            o.connect(g)
            g.connect(ctx.destination)
            o.frequency.value = freq
            g.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1)
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3)
            o.start(ctx.currentTime + idx * 0.1)
            o.stop(ctx.currentTime + idx * 0.1 + 0.3)
          })
        }
      }
    } catch {}
  }

  // Voice narration for text
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'ar-SA'
        u.rate = 0.95
        window.speechSynthesis.speak(u)
      } catch {}
    }
  }

  // Reset Game on Open / Change
  useEffect(() => {
    if (isOpen) {
      setScore(0)
      setRoundIndex(0)
      setLives(3)
      setStreak(0)
      setGameOver(false)
      setGameWon(false)
      setSelectedOption(null)
      setIsCorrect(null)

      if (normalizedId === 'quran') {
        initQuranRound(0)
      } else if (normalizedId === 'crossword') {
        initCrosswordRound(0)
      }
    }
  }, [isOpen, normalizedId])

  // Init Quran Round
  const initQuranRound = (sIdx: number) => {
    const surah = QURAN_SURAHS[sIdx % QURAN_SURAHS.length]
    setQuranSurahIdx(sIdx)
    const shuffled = [...surah.verses].sort(() => Math.random() - 0.5)
    setShuffledVerses(shuffled)
    setOrderedVerses([])
  }

  // Init Crossword Round
  const initCrosswordRound = (rIdx: number) => {
    const round = CROSSWORD_ROUNDS[rIdx % CROSSWORD_ROUNDS.length]
    // Shuffle letters + add random decoys
    const decoys = ['ب', 'س', 'ن', 'ت']
    const combined = [...round.letters, decoys[rIdx % decoys.length]].sort(() => Math.random() - 0.5)
    setAvailableTiles(combined.map((c, i) => ({ id: i, char: c, used: false })))
    setAssembledWord([])
  }

  // Handle standard option answer (Spelling, Math, Science)
  const handleSelectOption = (opt: any, correctVal: any, maxRounds: number, xpPerRound: number) => {
    if (selectedOption !== null || gameOver || gameWon) return
    setSelectedOption(opt)

    const isMatch = opt === correctVal
    setIsCorrect(isMatch)

    if (isMatch) {
      playSound('correct')
      const newScore = score + xpPerRound + (streak * 5)
      setScore(newScore)
      setStreak(s => s + 1)

      setTimeout(() => {
        if (roundIndex + 1 >= maxRounds) {
          handleWin(newScore)
        } else {
          setRoundIndex(r => r + 1)
          setSelectedOption(null)
          setIsCorrect(null)
        }
      }, 1000)
    } else {
      playSound('wrong')
      setStreak(0)
      const newLives = lives - 1
      setLives(newLives)

      setTimeout(() => {
        if (newLives <= 0) {
          setGameOver(true)
        } else {
          setSelectedOption(null)
          setIsCorrect(null)
        }
      }, 1200)
    }
  }

  // Quran Verse Click
  const handleQuranVerseClick = (verse: string) => {
    const surah = QURAN_SURAHS[quranSurahIdx]
    const nextExpected = surah.verses[orderedVerses.length]

    if (verse === nextExpected) {
      playSound('correct')
      const newOrdered = [...orderedVerses, verse]
      setOrderedVerses(newOrdered)
      setShuffledVerses(prev => prev.filter(v => v !== verse))

      if (newOrdered.length === surah.verses.length) {
        playSound('win')
        const newScore = score + 50
        setScore(newScore)

        if (quranSurahIdx + 1 >= QURAN_SURAHS.length) {
          handleWin(newScore + 50)
        } else {
          setTimeout(() => {
            initQuranRound(quranSurahIdx + 1)
          }, 1500)
        }
      }
    } else {
      playSound('wrong')
      setLives(l => {
        const nextL = l - 1
        if (nextL <= 0) setGameOver(true)
        return nextL
      })
    }
  }

  // Crossword tile click
  const handleTileClick = (tileId: number, char: string) => {
    const round = CROSSWORD_ROUNDS[roundIndex % CROSSWORD_ROUNDS.length]
    setAvailableTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t))
    const newWord = [...assembledWord, char]
    setAssembledWord(newWord)

    if (newWord.length === round.letters.length) {
      const spelled = newWord.join('')
      if (spelled === round.word) {
        playSound('correct')
        const newScore = score + 40
        setScore(newScore)

        if (roundIndex + 1 >= CROSSWORD_ROUNDS.length) {
          handleWin(newScore + 40)
        } else {
          setTimeout(() => {
            setRoundIndex(r => r + 1)
            initCrosswordRound(roundIndex + 1)
          }, 1200)
        }
      } else {
        playSound('wrong')
        setTimeout(() => {
          // Reset tiles for retry
          initCrosswordRound(roundIndex)
          setLives(l => {
            const nextL = l - 1
            if (nextL <= 0) setGameOver(true)
            return nextL
          })
        }, 800)
      }
    }
  }

  // Handle Win
  const handleWin = (finalScore: number) => {
    playSound('win')
    setGameWon(true)

    // Save earned XP to localStorage
    try {
      const currentXP = parseInt(localStorage.getItem('nexus_student_xp') || '0', 10)
      localStorage.setItem('nexus_student_xp', (currentXP + finalScore).toString())

      // Record game activity
      const historyRaw = localStorage.getItem('nexus_student_games_history')
      const history = historyRaw ? JSON.parse(historyRaw) : []
      history.unshift({
        gameId: normalizedId,
        date: new Date().toISOString(),
        score: finalScore,
      })
      localStorage.setItem('nexus_student_games_history', JSON.stringify(history.slice(0, 20)))
    } catch {}

    if (onAwardXP) onAwardXP(finalScore)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-2xl bg-white dark:bg-[#1a1a2e] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* ── TOP BAR ── */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm">
              {normalizedId === 'spelling' ? '✏️'
                : normalizedId === 'math' ? '🔢'
                : normalizedId === 'quran' ? '📿'
                : normalizedId === 'science' ? '🔬'
                : '🧩'}
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                {normalizedId === 'spelling' ? 'تحدي الإملاء السريع'
                  : normalizedId === 'math' ? 'سباق الحساب الذهني'
                  : normalizedId === 'quran' ? 'ترتيل وتثبيت الآيات'
                  : normalizedId === 'science' ? 'مستكشف الطبيعة والعلوم'
                  : 'الكلمات المتقاطعة الذكية'}
              </h3>
              <p className="text-[11px] text-purple-200 font-bold">الصف الأول الابتدائي • مدارس الإخلاص الأهلية</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-md">
              {[1, 2, 3].map(i => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i <= lives ? 'text-rose-400 fill-rose-400 animate-pulse' : 'text-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-xl border border-yellow-300/30">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="font-black text-sm text-yellow-200">+{score} XP</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* ── GAME CONTENT ── */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
          {/* WIN STATE */}
          {gameWon && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
              <div className="text-6xl animate-bounce">🏆</div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">أحسنت صنعاً! بطل نكسس! 🌟</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 max-w-md mx-auto font-medium">
                لقد أنهيت التحدي بنجاح تام واستحققت نقاط الخبرة المعتمدة. رائع جداً!
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-lg font-black">
                <Sparkles className="w-5 h-5" />
                حصلت على +{score} XP
              </div>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setGameWon(false)
                    setScore(0)
                    setRoundIndex(0)
                    setLives(3)
                    if (normalizedId === 'quran') initQuranRound(0)
                    if (normalizedId === 'crossword') initCrosswordRound(0)
                  }}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm flex items-center gap-2 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  العب مجدداً
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  إغلاق واحة الألعاب
                </button>
              </div>
            </motion.div>
          )}

          {/* GAME OVER STATE */}
          {gameOver && !gameWon && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
              <div className="text-6xl">💔</div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">حاول مجدداً يا بطل!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                نفدت الفرص الثلاث، لكن التعلم يحتاج المحاولة والاستمرار. اضغط للبدء من جديد.
              </p>
              <button
                onClick={() => {
                  setGameOver(false)
                  setScore(0)
                  setRoundIndex(0)
                  setLives(3)
                  if (normalizedId === 'quran') initQuranRound(0)
                  if (normalizedId === 'crossword') initCrosswordRound(0)
                }}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm inline-flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة المحاولة
              </button>
            </motion.div>
          )}

          {/* ── 1. SPELLING GAME ── */}
          {!gameOver && !gameWon && normalizedId === 'spelling' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-black text-gray-400">
                <span>السؤال {roundIndex + 1} من {SPELLING_ROUNDS.length}</span>
                {streak > 1 && <span className="text-amber-500 font-bold">🔥 متتالية: {streak} إجابات صحيحة!</span>}
              </div>

              <div className="text-center py-6 bg-gradient-to-b from-blue-50/50 to-indigo-50/20 dark:from-white/5 dark:to-transparent rounded-3xl border border-blue-100 dark:border-white/5">
                <button
                  onClick={() => speakText(SPELLING_ROUNDS[roundIndex].word)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4 hover:scale-105 transition-transform"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  استمع للنطق الصحيح 🔊
                </button>
                <h4 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-wide">
                  {SPELLING_ROUNDS[roundIndex].prompt}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {SPELLING_ROUNDS[roundIndex].options.map((opt, i) => {
                  const isSelected = selectedOption === opt
                  const isAnswer = opt === SPELLING_ROUNDS[roundIndex].missing
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt, SPELLING_ROUNDS[roundIndex].missing, SPELLING_ROUNDS.length, 25)}
                      className={`p-5 rounded-2xl text-2xl font-black transition-all border shadow-sm ${
                        isSelected
                          ? isAnswer
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                            : 'bg-rose-500 text-white border-rose-600'
                          : 'bg-white dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 hover:border-blue-300'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── 2. MATH GAME ── */}
          {!gameOver && !gameWon && normalizedId === 'math' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-black text-gray-400">
                <span>المسألة {roundIndex + 1} من {MATH_ROUNDS.length}</span>
                {streak > 1 && <span className="text-amber-500 font-bold">⚡ سرعة خارقة ({streak} متتالية)</span>}
              </div>

              <div className="text-center py-8 bg-gradient-to-b from-amber-50/50 to-orange-50/20 dark:from-white/5 dark:to-transparent rounded-3xl border border-amber-100 dark:border-white/5">
                <p className="text-xs font-bold text-amber-600 mb-2">احسب سريعاً في ذهنك</p>
                <h4 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-wider font-mono">
                  {MATH_ROUNDS[roundIndex].question}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {MATH_ROUNDS[roundIndex].options.map((opt, i) => {
                  const isSelected = selectedOption === opt
                  const isAnswer = opt === MATH_ROUNDS[roundIndex].answer
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt, MATH_ROUNDS[roundIndex].answer, MATH_ROUNDS.length, 30)}
                      className={`p-5 rounded-2xl text-2xl font-black font-mono transition-all border shadow-sm ${
                        isSelected
                          ? isAnswer
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                            : 'bg-rose-500 text-white border-rose-600'
                          : 'bg-white dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-white/10 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 hover:border-amber-300'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── 3. QURAN GAME ── */}
          {!gameOver && !gameWon && normalizedId === 'quran' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-black text-gray-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {QURAN_SURAHS[quranSurahIdx].name}
                </span>
                <span>اضغط الآيات بالترتيب الصحيح 📿</span>
              </div>

              {/* Already ordered verses */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 min-h-[100px] space-y-2">
                <p className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 mb-1">
                  الآيات المرتبة:
                </p>
                {orderedVerses.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">ابدأ بالضغط على الآية الأولى أدناه...</p>
                ) : (
                  orderedVerses.map((v, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-bold text-emerald-950 dark:text-emerald-200 bg-white/70 dark:bg-white/10 p-2.5 rounded-xl shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span>{v}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Available scrambled verses */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-gray-500">اختر الآية التالية بالترتيب:</p>
                {shuffledVerses.map((verse, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuranVerseClick(verse)}
                    className="w-full text-right p-3.5 rounded-xl bg-white dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-900 dark:text-white transition-all hover:scale-[1.01] shadow-xs"
                  >
                    {verse}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 4. SCIENCE GAME ── */}
          {!gameOver && !gameWon && normalizedId === 'science' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-black text-gray-400">
                <span>المهمة {roundIndex + 1} من {SCIENCE_ROUNDS.length}</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">مستكشف الطبيعة 🌿</span>
              </div>

              <div className="p-6 bg-gradient-to-b from-teal-50/50 to-cyan-50/20 dark:from-white/5 dark:to-transparent rounded-3xl border border-teal-100 dark:border-white/5 text-center">
                <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-relaxed">
                  {SCIENCE_ROUNDS[roundIndex].question}
                </h4>
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-2 font-bold">
                  💡 تلميح: {SCIENCE_ROUNDS[roundIndex].hint}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {SCIENCE_ROUNDS[roundIndex].options.map((opt, i) => {
                  const isSelected = selectedOption === i
                  const isAnswer = i === SCIENCE_ROUNDS[roundIndex].answer
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i, SCIENCE_ROUNDS[roundIndex].answer, SCIENCE_ROUNDS.length, 30)}
                      className={`p-4 rounded-2xl text-sm font-black transition-all border shadow-sm text-right flex items-center justify-between ${
                        isSelected
                          ? isAnswer
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                            : 'bg-rose-500 text-white border-rose-600'
                          : 'bg-white dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-white/10 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 hover:border-teal-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && isAnswer && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── 5. CROSSWORD GAME ── */}
          {!gameOver && !gameWon && normalizedId === 'crossword' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-black text-gray-400">
                <span>اللغز {roundIndex + 1} من {CROSSWORD_ROUNDS.length}</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">تكوين الكلمات 🧩</span>
              </div>

              <div className="p-6 bg-gradient-to-b from-purple-50/50 to-violet-50/20 dark:from-white/5 dark:to-transparent rounded-3xl border border-purple-100 dark:border-white/5 text-center">
                <p className="text-xs font-bold text-purple-600 mb-1">حل اللغز ورتّب الحروف:</p>
                <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {CROSSWORD_ROUNDS[roundIndex % CROSSWORD_ROUNDS.length].clue}
                </h4>

                {/* Assembled Word Slots */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  {CROSSWORD_ROUNDS[roundIndex % CROSSWORD_ROUNDS.length].letters.map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-14 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-500/40 bg-white/80 dark:bg-white/10 flex items-center justify-center text-2xl font-black text-purple-700 dark:text-purple-300 shadow-inner"
                    >
                      {assembledWord[i] || ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Letter Tiles to click */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 text-center">اضغط الحروف بالترتيب الصحيح:</p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {availableTiles.map(tile => (
                    <button
                      key={tile.id}
                      disabled={tile.used}
                      onClick={() => handleTileClick(tile.id, tile.char)}
                      className={`w-14 h-14 rounded-2xl text-2xl font-black shadow-md transition-all ${
                        tile.used
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 border border-transparent scale-95 cursor-not-allowed'
                          : 'bg-white dark:bg-white/10 hover:bg-purple-500 hover:text-white text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {tile.char}
                    </button>
                  ))}
                </div>
              </div>

              {assembledWord.length > 0 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => initCrosswordRound(roundIndex)}
                    className="text-xs font-bold text-gray-400 hover:text-purple-600 inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    مسح وإعادة ترتيب الحروف
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
