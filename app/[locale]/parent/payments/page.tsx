'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Download, History, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table';
import { apiClient } from '@/lib/api/client';
import { motion } from 'framer-motion';

interface Invoice {
    id: string;
    description: string;
    amount: number;
    dueDate?: string;
    createdAt: string;
    status: 'paid' | 'pending' | 'overdue';
    studentName?: string;
}

interface PaymentSummary {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    invoices: Invoice[];
}

export default function ParentPaymentsPage() {
    const [data, setData] = useState<PaymentSummary>({ totalPaid: 0, totalPending: 0, totalOverdue: 0, invoices: [] });
    const [loading, setLoading] = useState(true);

    const fetchPayments = () => {
        setLoading(true);
        apiClient.get('/payment/invoices')
            .then(res => {
                const result = res.data?.data || res.data;
                if (Array.isArray(result)) {
                    // Compute summary from array
                    const invoices = result as Invoice[];
                    setData({
                        totalPaid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0),
                        totalPending: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + (i.amount || 0), 0),
                        totalOverdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0),
                        invoices,
                    });
                } else if (result?.invoices) {
                    setData(result);
                }
            })
            .catch(() => {}) // keep empty state if no payment module
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchPayments(); }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">مدفوع ✓</Badge>;
            case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">مستحق</Badge>;
            case 'overdue': return <Badge variant="destructive">متأخر ⚠️</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">💳 المدفوعات والفواتير</h1>
                    <p className="text-muted-foreground mt-1">سجل العمليات المالية والرسوم المستحقة</p>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchPayments} disabled={loading} className="gap-1">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: 'إجمالي المدفوع', value: data.totalPaid, icon: CreditCard, color: 'text-green-600', sub: 'للعام الدراسي الحالي' },
                    { label: 'المبالغ المستحقة', value: data.totalPending, icon: History, color: 'text-yellow-600', sub: 'تستحق قريباً' },
                    { label: 'متأخرات', value: data.totalOverdue, icon: AlertTriangle, color: 'text-red-600', sub: 'يرجى السداد فوراً' },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-8 bg-muted animate-pulse rounded w-24" />
                                ) : (
                                    <div className={`text-2xl font-bold ${item.color}`}>{item.value.toLocaleString('ar-SA')} ر.س</div>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle>سجل الفواتير</CardTitle>
                    <CardDescription>عرض وتحميل الفواتير السابقة والحالية</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
                        </div>
                    ) : data.invoices.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>لا توجد فواتير مسجلة بعد</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">رقم الفاتورة</TableHead>
                                    <TableHead className="text-right">الوصف</TableHead>
                                    <TableHead className="text-right">الطالب</TableHead>
                                    <TableHead className="text-right">التاريخ</TableHead>
                                    <TableHead className="text-right">المبلغ</TableHead>
                                    <TableHead className="text-center">الحالة</TableHead>
                                    <TableHead className="text-left">إجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.invoices.map(invoice => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-mono text-xs">{invoice.id.slice(0, 8).toUpperCase()}</TableCell>
                                        <TableCell>{invoice.description}</TableCell>
                                        <TableCell>{invoice.studentName || '—'}</TableCell>
                                        <TableCell>{new Date(invoice.createdAt || invoice.dueDate || Date.now()).toLocaleDateString('ar-SA')}</TableCell>
                                        <TableCell className="font-bold">{(invoice.amount || 0).toLocaleString()} ر.س</TableCell>
                                        <TableCell className="text-center">{getStatusBadge(invoice.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 justify-end">
                                                {invoice.status !== 'paid' && <Button size="sm">دفع</Button>}
                                                <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
