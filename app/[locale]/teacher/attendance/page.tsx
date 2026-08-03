'use client'

import { useState } from 'react'
import { Check, X, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const students = [
    { id: 1, name: 'أحمد علي', status: 'present' },
    { id: 2, name: 'سارة محمد', status: 'present' },
    { id: 3, name: 'خالد عمر', status: 'absent' },
    { id: 4, name: 'نورة سعيد', status: 'late' },
    { id: 5, name: 'محمد حسن', status: 'present' },
]

export default function AttendancePage() {
    const { toast } = useToast()
    const [attendance, setAttendance] = useState(students)
    const [isGeneratingQR, setIsGeneratingQR] = useState(false)
    const [qrSession, setQrSession] = useState<any>(null)

    const updateStatus = (id: number, status: string) => {
        setAttendance(attendance.map(s => s.id === id ? { ...s, status } : s))
    }

    const handleSave = () => {
        toast({
            title: "تم حفظ التحضير ✅",
            description: "تم تحديث سجل الحضور لهذا اليوم.",
        })
    }

    const handleGenerateQR = async () => {
        setIsGeneratingQR(true)
        try {
            const { apiClient } = await import('@/lib/api-client')
            const res = await apiClient.post('/attendance/qr/sessions', {
                classId: 'cls_1',
                subjectId: 'sub_1',
                durationMinutes: 10
            })
            if (res.data?.success) {
                setQrSession(res.data.data)
            }
        } catch (error) {
            console.error('Failed to generate QR', error)
            toast({ title: 'خطأ', description: 'لم نتمكن من إنشاء جلسة QR', variant: 'destructive' })
        } finally {
            setIsGeneratingQR(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">تحضير الطلاب 📅</h2>
                    <p className="text-muted-foreground">تسجيل الحضور والغياب اليومي</p>
                </div>
                <div className="flex gap-3">
                    <Select defaultValue="cls_1">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="اختر الفصل" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cls_1">الصف 10 - أ</SelectItem>
                            <SelectItem value="cls_2">الصف 11 - ب</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleGenerateQR} disabled={isGeneratingQR} className="border-primary text-primary hover:bg-primary/10">
                        {isGeneratingQR ? 'جاري الإنشاء...' : 'إنشاء QR للحضور'}
                    </Button>
                    <Button onClick={handleSave}>حفظ السجل</Button>
                </div>
            </div>

            {qrSession && (
                <Card className="border-primary bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-center text-primary">امسح الرمز لتسجيل الحضور</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-4 pb-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrSession.qrCode}`} 
                                alt="QR Code" 
                                width={250} 
                                height={250} 
                            />
                        </div>
                        <p className="text-xl font-mono tracking-widest bg-white px-6 py-2 rounded-lg shadow-inner">{qrSession.qrCode}</p>
                        <p className="text-sm text-muted-foreground">ينتهي الرمز في 10 دقائق</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>قائمة الطلاب - {new Date().toLocaleDateString('ar-SA')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {attendance.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-lg">{student.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={student.status === 'present' ? 'default' : 'outline'}
                                        className={student.status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        onClick={() => updateStatus(student.id, 'present')}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        حاضر
                                    </Button>
                                    <Button
                                        variant={student.status === 'absent' ? 'destructive' : 'outline'}
                                        onClick={() => updateStatus(student.id, 'absent')}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        غائب
                                    </Button>
                                    <Button
                                        variant={student.status === 'late' ? 'secondary' : 'outline'}
                                        className={student.status === 'late' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
                                        onClick={() => updateStatus(student.id, 'late')}
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        تأخير
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
