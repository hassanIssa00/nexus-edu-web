'use client'

import { useState } from 'react'
import { PricingCard } from '@/components/pricing/pricing-card'
import { CheckoutModal } from '@/components/pricing/checkout-modal'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'

const plans = [
    {
        id: 'free',
        name: 'مجاني',
        description: 'مثالي للطلاب والمعلمين الأفراد',
        price: '0 ر.س',
        period: '/ شهرياً',
        features: [
            { text: 'الوصول للمحتوى الأساسي', included: true },
            { text: 'إنشاء 3 فصول دراسية', included: true },
            { text: 'تخزين سحابي 1GB', included: true },
            { text: 'دعم فني عبر البريد', included: true },
            { text: 'تحليلات متقدمة', included: false },
            { text: 'تخصيص الهوية البصرية', included: false },
        ],
        buttonText: 'ابدأ مجاناً',
        popular: false
    },
    {
        id: 'premium',
        name: 'احترافي',
        description: 'للمعلمين المحترفين والمدارس الصغيرة',
        price: '49 ر.س',
        period: '/ شهرياً',
        features: [
            { text: 'كل مميزات الخطة المجانية', included: true },
            { text: 'فصول دراسية غير محدودة', included: true },
            { text: 'تخزين سحابي 50GB', included: true },
            { text: 'دعم فني ذو أولوية', included: true },
            { text: 'تحليلات متقدمة للأداء', included: true },
            { text: 'تصدير التقارير (PDF/Excel)', included: true },
        ],
        buttonText: 'اشترك الآن',
        popular: true
    },
    {
        id: 'school',
        name: 'المؤسسات',
        description: 'للمدارس والمجمعات التعليمية الكبيرة',
        price: '199 ر.س',
        period: '/ شهرياً',
        features: [
            { text: 'كل مميزات الخطة الاحترافية', included: true },
            { text: 'لوحة تحكم للإدارة المركزية', included: true },
            { text: 'تخزين سحابي غير محدود', included: true },
            { text: 'مدير حساب مخصص', included: true },
            { text: 'تخصيص كامل للهوية', included: true },
            { text: 'ربط مع أنظمة الوزارة (API)', included: true },
        ],
        buttonText: 'تواصل معنا',
        popular: false
    }
]

export default function PricingPage() {
    const { toast } = useToast()
    const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    const handleSelectPlan = (planId: string) => {
        const plan = plans.find(p => p.id === planId)
        if (plan) {
            if (plan.id === 'free') {
                toast({
                    title: "تم الاشتراك بنجاح",
                    description: "أنت الآن على الخطة المجانية.",
                })
            } else {
                setSelectedPlan(plan)
                setIsCheckoutOpen(true)
            }
        }
    }

    const handleCheckoutSuccess = () => {
        toast({
            title: "تمت الترقية بنجاح! 🎉",
            description: `شكراً لاشتراكك في خطة ${selectedPlan?.name}. تم تفعيل المميزات الجديدة.`,
            duration: 5000,
        })
    }

    return (
        <div className="container mx-auto py-16 px-4">
            <div className="text-center mb-16 space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight sm:text-5xl"
                >
                    خطط أسعار تناسب الجميع
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-500 max-w-2xl mx-auto"
                >
                    اختر الخطة المناسبة لاحتياجاتك التعليمية. يمكنك الترقية أو الإلغاء في أي وقت.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                    >
                        <PricingCard
                            plan={{
                                ...plan,
                                onSelect: handleSelectPlan
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {selectedPlan && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </div>
    )
}
