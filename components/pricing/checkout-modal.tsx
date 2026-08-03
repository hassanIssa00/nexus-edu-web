'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    planName: string
    price: string
    onSuccess: () => void
}

export function CheckoutModal({ isOpen, onClose, planName, price, onSuccess }: CheckoutModalProps) {
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details')
    const [loading, setLoading] = useState(false)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setStep('processing')
        setLoading(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        setLoading(false)
        setStep('success')

        // Close after showing success
        setTimeout(() => {
            onSuccess()
            onClose()
            // Reset state after closing
            setTimeout(() => setStep('details'), 300)
        }, 2000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <AnimatePresence mode="wait">
                    {step === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <DialogHeader>
                                <DialogTitle>إتمام الاشتراك</DialogTitle>
                                <DialogDescription>
                                    أنت على وشك الاشتراك في خطة <span className="font-bold text-primary-500">{planName}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handlePayment} className="space-y-4 mt-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium">المجموع</span>
                                    <span className="text-xl font-bold">{price}</span>
                                </div>

                                <div className="space-y-2">
                                    <Label>رقم البطاقة (وهمي)</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input placeholder="4242 4242 4242 4242" className="pr-9" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>تاريخ الانتهاء</Label>
                                        <Input placeholder="MM/YY" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVC</Label>
                                        <Input placeholder="123" required />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                    <Lock className="w-3 h-3" />
                                    <span>جميع المعاملات مشفرة وآمنة (محاكاة)</span>
                                </div>

                                <DialogFooter className="mt-6">
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        دفع {price}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </motion.div>
                    )}

                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-10 space-y-4"
                        >
                            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                            <p className="text-lg font-medium">جاري معالجة الدفع...</p>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-10 space-y-4"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-green-600">تم الدفع بنجاح!</h3>
                                <p className="text-gray-500 mt-2">تم تفعيل اشتراكك بنجاح.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
