'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Video, FileText, Image } from 'lucide-react'

export default function ContentManagementPage() {
    const t = useTranslations('admin')

    const contentTypes = [
        { icon: BookOpen, title: 'المقالات', count: 45, color: 'text-blue-600' },
        { icon: Video, title: 'الفيديوهات', count: 23, color: 'text-purple-600' },
        { icon: FileText, title: 'المستندات', count: 67, color: 'text-green-600' },
        { icon: Image, title: 'الصور', count: 120, color: 'text-orange-600' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">إدارة المحتوى</h1>
                <p className="text-muted-foreground">إدارة جميع محتويات المنصة التعليمية</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {contentTypes.map((type, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {type.title}
                            </CardTitle>
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{type.count}</div>
                            <p className="text-xs text-muted-foreground">
                                عنصر محفوظ
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>المحتوى الأخير</CardTitle>
                    <CardDescription>آخر المحتويات التي تم إضافتها للمنصة</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <div className="flex-1">
                                <h3 className="font-semibold">مقدمة في الرياضيات</h3>
                                <p className="text-sm text-muted-foreground">تم الإضافة منذ يومين</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <Video className="h-8 w-8 text-purple-600" />
                            <div className="flex-1">
                                <h3 className="font-semibold">شرح الدوال الرياضية</h3>
                                <p className="text-sm text-muted-foreground">تم الإضافة منذ 3 أيام</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
