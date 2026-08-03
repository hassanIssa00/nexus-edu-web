'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Square, Plus, Trash2, Settings, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

export default function RulesEnginePage() {
    const t = useTranslations();
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/teacher/automation/rules');
            if (res.data?.success) {
                setRules(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRule = async (id: string) => {
        try {
            await apiClient.put(`/teacher/automation/rules/${id}/toggle`);
            // Optimistic update
            setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
        } catch (error) {
            console.error('Error toggling rule:', error);
        }
    };

    const deleteRule = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه القاعدة؟')) return;
        try {
            await apiClient.delete(`/teacher/automation/rules/${id}`);
            setRules(rules.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting rule:', error);
        }
    };

    const translateTrigger = (type: string) => {
        const types: Record<string, string> = {
            'ABSENCE_LIMIT': 'تجاوز حد الغياب',
            'LOW_GRADE': 'رسوب في اختبار',
            'HOMEWORK_MISSED': 'عدم تسليم الواجب',
        };
        return types[type] || type;
    };

    const translateAction = (type: string) => {
        const types: Record<string, string> = {
            'NOTIFY_PARENT': 'إشعار ولي الأمر',
            'SEND_WARNING': 'توجيه إنذار للطالب',
            'ASSIGN_EXTRA_WORK': 'تعيين واجب إضافي',
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">محرك القواعد الذكية</h1>
                    <p className="text-muted-foreground mt-2">
                        قم بإعداد قواعد "إذا حدث كذا.. افعل كذا" لتوفير وقتك.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    <Plus className="w-5 h-5" />
                    قاعدة جديدة
                </button>
            </div>

            {rules.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">لا توجد قواعد بعد</h3>
                    <p className="text-muted-foreground">قم بإنشاء أول قاعدة أتمتة لتبسيط مهامك اليومية.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {rules.map(rule => (
                        <Card key={rule.id} className={!rule.isActive ? 'opacity-60' : ''}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">
                                    {rule.name}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleRule(rule.id)}
                                        className={`p-2 rounded-lg ${rule.isActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                                        title={rule.isActive ? 'إيقاف' : 'تشغيل'}
                                    >
                                        {rule.isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <button 
                                        onClick={() => deleteRule(rule.id)}
                                        className="p-2 bg-gray-100 text-gray-600 hover:text-red-600 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm">
                                    <div className="flex-1 border-r border-gray-200 dark:border-gray-700 pr-4">
                                        <span className="text-primary font-bold">إذا: </span>
                                        {translateTrigger(rule.triggerType)} 
                                        <span className="text-muted-foreground mx-1">(الشرط: {rule.condition})</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-green-600 font-bold">فإن: </span>
                                        {translateAction(rule.actionType)}
                                    </div>
                                </div>
                                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" />
                                    تم تنفيذها {rule._count?.logs || 0} مرات
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
