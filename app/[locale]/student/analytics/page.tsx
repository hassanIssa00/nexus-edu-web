'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Award, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

// Import new analytics components
import { StudentProgressChart } from '@/components/analytics/student-progress-chart';
import { ClassComparisonCard } from '@/components/analytics/class-comparison-card';
import { ParentReportView } from '@/components/analytics/parent-report-view';
import { StudentGamificationCard } from '@/components/gamification/student-stats-card';

function LoadingCard() {
    return (
        <Card className="animate-pulse">
            <CardContent className="pt-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
        </Card>
    );
}

export default function StudentAnalyticsPage() {
    const { user, profile } = useAuth();
    const studentId = user?.id || 'demo-student';
    const studentName = profile?.full_name || 'الطالب';

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2">📊 تحليلات الأداء</h1>
                    <p className="text-blue-100 text-lg">تابع تقدمك وقارن مستواك بزملائك</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl transition-all border border-white/30 print:hidden"
                >
                    <FileText className="w-5 h-5" />
                    <span>تحميل تقرير PDF</span>
                </button>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="progress" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="hidden sm:inline">تطور المستوى</span>
                    </TabsTrigger>
                    <TabsTrigger value="comparison" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">مقارنة بالفصل</span>
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span className="hidden sm:inline">الإنجازات</span>
                    </TabsTrigger>
                    <TabsTrigger value="report" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">التقرير</span>
                    </TabsTrigger>
                </TabsList>

                {/* Progress Tab */}
                <TabsContent value="progress">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Suspense fallback={<LoadingCard />}>
                            <StudentProgressChart studentId={studentId} />
                        </Suspense>
                    </motion.div>
                </TabsContent>

                {/* Comparison Tab */}
                <TabsContent value="comparison">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Suspense fallback={<LoadingCard />}>
                            <ClassComparisonCard studentId={studentId} />
                        </Suspense>
                    </motion.div>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Suspense fallback={<LoadingCard />}>
                            <StudentGamificationCard studentId={studentId} />
                        </Suspense>
                    </motion.div>
                </TabsContent>

                {/* Report Tab */}
                <TabsContent value="report">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Suspense fallback={<LoadingCard />}>
                            <ParentReportView studentId={studentId} />
                        </Suspense>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
