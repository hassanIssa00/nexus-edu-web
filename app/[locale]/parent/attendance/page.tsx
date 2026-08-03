'use client'
import { Card } from '@/components/ui/card'
import { Calendar, QrCode } from 'lucide-react'

export default function ParentAttendancePage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">سجل الحضور</h1>
          <p className="text-sm text-gray-500 font-medium">متابعة الحضور والغياب والاستئذان</p>
        </div>
      </div>
      <Card className="p-16 text-center border-gray-100 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <QrCode className="w-16 h-16 text-emerald-200 dark:text-emerald-500/30 mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">قريباً.. السجل التفصيلي للحضور</h2>
        <p className="text-gray-500 text-sm font-medium">يتم تجهيز بوابة المتابعة اللحظية لتسجيل الدخول والخروج من البوابات الذكية.</p>
      </Card>
    </div>
  )
}
