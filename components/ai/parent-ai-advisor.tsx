'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, Send, Loader2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export function ParentAiAdvisor({ studentId, studentName }: { studentId: string, studentName: string }) {
    const [advice, setAdvice] = useState<any>(null);
    const [risk, setRisk] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState('');
    const [asking, setAsking] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [adviceRes, riskRes] = await Promise.all([
                    apiClient.post('/ai/parent-advice', { studentId }),
                    apiClient.get(`/ai/learning-risk/${studentId}`)
                ]);
                
                if (adviceRes.data?.success) setAdvice(adviceRes.data.data);
                if (riskRes.data?.success) setRisk(riskRes.data.data);
            } catch (err) {
                console.error("Failed to fetch AI insights", err);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchInitialData();
        }
    }, [studentId]);

    const handleAskQuestion = async () => {
        if (!question.trim() || asking) return;
        
        setAsking(true);
        try {
            const res = await apiClient.post('/ai/parent-advice', { studentId, question });
            if (res.data?.success) {
                setAdvice(res.data.data);
                setQuestion('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAsking(false);
        }
    };

    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                    </div>
                    <div className="space-y-2 mt-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!advice) return null;

    const riskIcon = 
        risk?.riskLevel === 'high' ? <AlertTriangle className="text-red-500 w-6 h-6" /> :
        risk?.riskLevel === 'medium' ? <Info className="text-yellow-500 w-6 h-6" /> :
        <ShieldCheck className="text-emerald-500 w-6 h-6" />;

    return (
        <Card className="border-2 border-indigo-100 dark:border-indigo-900 overflow-hidden relative shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <BrainCircuit className="w-32 h-32 text-indigo-600" />
            </div>
            
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                            <Sparkles className="w-5 h-5" />
                            المستشار الذكي لولي الأمر
                        </CardTitle>
                        <CardDescription className="mt-1">تحليل مدعوم بالذكاء الاصطناعي لحالة {studentName}</CardDescription>
                    </div>
                    {risk && (
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                            <span className="text-xs font-bold">مؤشر المخاطر:</span>
                            {riskIcon}
                        </div>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6 relative z-10">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {advice.summary}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            نقاط القوة
                        </h4>
                        <ul className="space-y-2">
                            {advice.positives.map((p: string, i: number) => (
                                <li key={i} className="text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            نصائح للتحسين
                        </h4>
                        <ul className="space-y-2">
                            {advice.actionableAdvice.map((a: string, i: number) => (
                                <li key={i} className="text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-2 rounded-lg border border-amber-100 dark:border-amber-800/50">
                                    {a}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-sm mb-3 text-slate-500">هل لديك سؤال محدد عن أداء {studentName}؟</h4>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="مثال: كيف أساعده في تحسين درجات الرياضيات؟" 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                            className="bg-white dark:bg-slate-900 border-indigo-200 focus-visible:ring-indigo-500"
                            disabled={asking}
                        />
                        <Button 
                            onClick={handleAskQuestion} 
                            disabled={asking || !question.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg"
                        >
                            {asking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
