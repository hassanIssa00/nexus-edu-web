'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';
import { Loader2, Save, User, Bell, Shield, Lock } from 'lucide-react';

export default function ParentSettingsPage() {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [notifications, setNotifications] = useState({
        grades: true,
        attendance: true,
        assignments: false,
    });

    useEffect(() => {
        setLoading(true);
        apiClient.get('/users/me')
            .then(res => {
                const u = res.data?.data || res.data;
                setFormData({ name: u?.name || profile?.full_name || '', phone: u?.phone || '' });
            })
            .catch(() => setFormData({ name: profile?.full_name || '', phone: '' }))
            .finally(() => setLoading(false));
    }, [profile]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toast({ title: 'خطأ', description: 'الاسم مطلوب', variant: 'destructive' });
            return;
        }
        setSaving(true);
        try {
            await apiClient.patch('/users/me', formData);
            toast({ title: '✅ تم الحفظ', description: 'تم تحديث بياناتك بنجاح' });
        } catch (e: any) {
            toast({ title: 'خطأ', description: e.response?.data?.message || 'فشل حفظ الإعدادات', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const initials = (formData.name || 'P').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="max-w-2xl space-y-6" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold">⚙️ إعدادات ولي الأمر</h1>
                <p className="text-muted-foreground mt-1">تحكم في ملفك الشخصي وتفضيلاتك</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" />الملف الشخصي</CardTitle></CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16"><AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-lg">{initials}</AvatarFallback></Avatar>
                            <div><p className="font-semibold">{formData.name || 'ولي الأمر'}</p><p className="text-sm text-muted-foreground">{user?.email}</p></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="p-name">الاسم الكامل</Label>
                                <Input id="p-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="أدخل اسمك" />
                            </div>
                            <div className="space-y-2">
                                <Label>البريد الإلكتروني</Label>
                                <Input value={user?.email || ''} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p-phone">رقم الهاتف</Label>
                                <Input id="p-phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" dir="ltr" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />متابعة الأبناء</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { key: 'grades', label: 'إشعارات الدرجات', desc: 'تنبيه فوري عند تسجيل درجة جديدة' },
                            { key: 'attendance', label: 'إشعارات الغياب والتأخر', desc: 'تنبيه في حال غياب أو تأخر ابنك' },
                            { key: 'assignments', label: 'إشعارات الواجبات', desc: 'تنبيه عند إضافة واجب جديد لابنك' },
                        ].map(item => (
                            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">{item.label}</Label>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                                <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={val => setNotifications({ ...notifications, [item.key]: val })} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-32">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
