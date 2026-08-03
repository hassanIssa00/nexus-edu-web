'use client';

import { useTranslations } from 'next-intl';
import { GraduationCap, TrendingUp, Calendar, BookOpen, Trophy, MessageCircle, Bell } from 'lucide-react';

export default function ParentDashboardPage() {
    const t = useTranslations();

    const children = [
        {
            id: '1',
            name: 'أحمد محمد',
            grade: 'الصف الثامن',
            avatar: '👦',
            avgGrade: 92,
            attendance: 95,
            assignments: { pending: 2, completed: 18 },
        },
        {
            id: '2',
            name: 'فاطمة محمد',
            grade: 'الصف السادس',
            avatar: '👧',
            avgGrade: 88,
            attendance: 98,
            assignments: { pending: 1, completed: 20 },
        },
    ];

    const recentActivity = [
        { type: 'grade', text: 'حصل أحمد على 95% في اختبار الرياضيات', time: 'منذ ساعتين', icon: Trophy, color: 'text-green-500' },
        { type: 'attendance', text: 'فاطمة حضرت جميع الحصص اليوم', time: 'منذ 3 ساعات', icon: Calendar, color: 'text-blue-500' },
        { type: 'assignment', text: 'أحمد سلّم واجب العلوم', time: 'منذ 5 ساعات', icon: BookOpen, color: 'text-purple-500' },
        { type: 'message', text: 'رسالة جديدة من معلم الفيزياء', time: 'منذ يوم', icon: MessageCircle, color: 'text-orange-500' },
    ];

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">👨‍👩‍👧‍👦 بوابة أولياء الأمور</h1>
                <p className="text-muted-foreground mt-2">
                    تابع أداء أبنائك وتواصل مع المعلمين
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">متوسط الدرجات</p>
                            <p className="text-3xl font-bold">90%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">نسبة الحضور</p>
                            <p className="text-3xl font-bold">96%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">واجبات معلقة</p>
                            <p className="text-3xl font-bold">3</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8" />
                        <div>
                            <p className="text-sm opacity-90">إشعارات جديدة</p>
                            <p className="text-3xl font-bold">5</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Children Cards */}
            <div>
                <h2 className="text-2xl font-bold mb-4">الأبناء</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {children.map((child) => (
                        <div
                            key={child.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-6xl">{child.avatar}</div>
                                <div>
                                    <h3 className="text-xl font-bold">{child.name}</h3>
                                    <p className="text-muted-foreground">{child.grade}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">المعدل</p>
                                    <p className="text-2xl font-bold text-blue-600">{child.avgGrade}%</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">الحضور</p>
                                    <p className="text-2xl font-bold text-green-600">{child.attendance}%</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">الواجبات المكتملة</span>
                                    <span className="font-medium">{child.assignments.completed}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">الواجبات المعلقة</span>
                                    <span className="font-medium text-orange-500">{child.assignments.pending}</span>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                عرض التفاصيل
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold mb-4">النشاط الأخير</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                        {recentActivity.map((activity, idx) => {
                            const Icon = activity.icon;
                            return (
                                <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                                    <div className={`${activity.color} p-2 rounded-lg`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{activity.text}</p>
                                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
