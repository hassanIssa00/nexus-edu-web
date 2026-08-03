'use client'
import { Card } from '@/components/ui/card'
import { Award, TrendingUp } from 'lucide-react'

export default function ParentGradesPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">درجات الأبناء</h1>
          <p className="text-sm text-gray-500 font-medium">تفصيل الأداء الأكاديمي والشهادات</p>
        </div>
      </div>
      <Card className="p-16 text-center border-gray-100 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <TrendingUp className="w-16 h-16 text-amber-200 dark:text-amber-500/30 mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">قريباً.. تقارير الدرجات التفصيلية</h2>
        <p className="text-gray-500 text-sm font-medium">يتم حالياً تجهيز النظام لربط درجات الفترات والشهادات الأكاديمية مع منصة نور.</p>
      </Card>
    </div>
  )
}
