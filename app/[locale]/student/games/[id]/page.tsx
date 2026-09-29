'use client'

import React, { use } from 'react'
import { useRouter } from 'next/navigation'
import InteractiveStudentGameModal from '@/components/InteractiveStudentGameModal'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function GameDynamicPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const gameId = unwrappedParams.id

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4" dir="rtl">
      <InteractiveStudentGameModal
        isOpen={true}
        gameId={gameId}
        onClose={() => router.push('/student/games')}
        onAwardXP={(xp) => {
          // Handled inside modal
        }}
      />
    </div>
  )
}
