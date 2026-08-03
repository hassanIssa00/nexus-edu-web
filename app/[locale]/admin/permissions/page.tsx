'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, Lock, CheckCircle } from 'lucide-react'

export default function PermissionsPage() {
    const t = useTranslations('admin')

    const roles = [
        {
            name: 'المسؤول',
            icon: Shield,
            users: 3,
            color: 'text-red-600',
            permissions: ['إدارة كاملة', 'إضافة مستخدمين', 'حذف بيانات', 'تعديل الإعدادات']
        },
        {
            name: 'المعلم',
            icon: Users,
            users: 45,
            color: 'text-blue-600',
            permissions: ['إدارة الفصول', 'إضافة واجبات', 'تقييم الطلاب', 'عرض التقارير']
        },
        {
            name: 'الطالب',
            icon: Users,
            users: 567,
            color: 'text-green-600',
            permissions: ['عرض المحتوى', 'حل الواجبات', 'المشاركة في الألعاب', 'عرض الدرجات']
        },
        {
            name: 'ولي الأمر',
            icon: Users,
            users: 234,
            color: 'text-purple-600',
            permissions: ['متابعة الأبناء', 'عرض الدرجات', 'التواصل مع المعلمين', 'عرض الحضور']
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">إدارة الصلاحيات</h1>
                <p className="text-muted-foreground">إدارة أدوار المستخدمين وصلاحياتهم</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {roles.map((role, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <role.icon className={`h-6 w-6 ${role.color}`} />
                                <div>
                                    <CardTitle>{role.name}</CardTitle>
                                    <CardDescription>{role.users} مستخدم</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm font-semibold mb-2">الصلاحيات:</p>
                                {role.permissions.map((permission, pIndex) => (
                                    <div key={pIndex} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>{permission}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ملاحظات الأمان</CardTitle>
                    <CardDescription>إرشادات مهمة حول إدارة الصلاحيات</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <Lock className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span>تأكد من منح الصلاحيات بحذر لتجنب الوصول غير المصرح به</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Lock className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span>راجع الصلاحيات بشكل دوري وقم بإزالة الصلاحيات غير المستخدمة</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Lock className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span>تتبع التغييرات في الصلاحيات من خلال سجل النشاطات</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
