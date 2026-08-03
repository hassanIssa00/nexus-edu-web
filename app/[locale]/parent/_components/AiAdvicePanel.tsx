'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient } from '@/lib/api/client'
import { BrainCircuit, Sparkles, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

export function AiAdvicePanel({ childId }: { childId: string }) {
  const [advice, setAdvice] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchAdvice = async () => {
    if (!childId || loading) return
    setLoading(true)
    try {
      const res = await apiClient.post('/ai/parent-advice', { studentId: childId })
      if (res.data?.success) setAdvice(res.data.data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchAdvice() }, [childId])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        <BrainCircuit className="w-6 h-6 animate-pulse text-yellow-300" />
      </div>
      <p className="text-xs font-bold text-white/80 animate-pulse">المعلم الذكي يحلل البيانات...</p>
      <div className="flex gap-1">
        {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
      </div>
    </div>
  )

  if (!advice) return (
    <button onClick={fetchAdvice} className="w-full bg-white text-violet-700 hover:bg-gray-50 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2">
      <Sparkles className="w-4 h-4 text-violet-500" /> توليد تقرير الذكاء الاصطناعي
    </button>
  )

  const statusColor: Record<string, string> = { excellent: '#4ade80', good: '#60a5fa', needsAttention: '#fbbf24', urgent: '#f87171' }
  const sc = statusColor[advice.overallStatus] || '#9ca3af'

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
        <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: sc, color: sc }} />
        <p className="text-xs font-bold text-white leading-relaxed">{advice.summary}</p>
      </div>
      {advice.positives?.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl">
          <p className="text-[10px] font-black text-emerald-300 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> الإيجابيات</p>
          {advice.positives.map((p: string, i: number) => <p key={i} className="text-[11px] text-emerald-100/90 font-medium mb-1 pr-4 relative before:absolute before:right-1 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full">{p}</p>)}
        </div>
      )}
      {advice.concerns?.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl">
          <p className="text-[10px] font-black text-amber-300 mb-2 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> ملاحظات</p>
          {advice.concerns.map((c: string, i: number) => <p key={i} className="text-[11px] text-amber-100/90 font-medium mb-1 pr-4 relative before:absolute before:right-1 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-amber-400 before:rounded-full">{c}</p>)}
        </div>
      )}
      {advice.actionableAdvice?.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl">
          <p className="text-[10px] font-black text-blue-300 mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" /> خطة العمل</p>
          {advice.actionableAdvice.map((a: string, i: number) => <p key={i} className="text-[11px] text-blue-100/90 font-medium mb-1 pr-4 relative before:absolute before:right-1 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-blue-400 before:rounded-full">{a}</p>)}
        </div>
      )}
    </div>
  )
}
