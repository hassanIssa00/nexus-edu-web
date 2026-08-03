'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
}

const ROLES = ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'] as const;

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({ email: '', name: '', role: 'STUDENT', phone: '' });

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get('/users');
            const data = res.data?.data || res.data?.users || res.data || [];
            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch {
            toast({ title: 'خطأ', description: 'فشل تحميل المستخدمين', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingUser) {
                await apiClient.patch(`/users/${editingUser.id}`, formData);
                toast({ title: 'تم بنجاح', description: 'تم تحديث بيانات المستخدم' });
            } else {
                await apiClient.post('/users', { ...formData, password: 'Welcome@123' });
                toast({ title: 'تم بنجاح', description: 'تم إنشاء المستخدم (كلمة المرور: Welcome@123)' });
            }
            await fetchUsers();
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            toast({ title: 'خطأ', description: err.response?.data?.message || 'فشل حفظ المستخدم', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({ email: '', name: '', role: 'STUDENT', phone: '' });
    };

    const handleEdit = (user: UserData) => {
        setEditingUser(user);
        setFormData({ email: user.email, name: user.name, role: user.role, phone: user.phone || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
        try {
            await apiClient.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            toast({ title: 'تم بنجاح', description: 'تم حذف المستخدم' });
        } catch {
            toast({ title: 'خطأ', description: 'فشل حذف المستخدم', variant: 'destructive' });
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const variants: any = { ADMIN: 'destructive', TEACHER: 'secondary', STUDENT: 'default', PARENT: 'outline' };
        const labels: any = { ADMIN: 'مدير', TEACHER: 'معلم', STUDENT: 'طالب', PARENT: 'ولي أمر' };
        return <Badge variant={variants[role] || 'secondary'}>{labels[role] || role}</Badge>;
    };



    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">المستخدمين</h1>
                    <p className="text-muted-foreground">إدارة جميع مستخدمي المنصة وصلاحياتهم</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            إضافة مستخدم
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
                            <DialogDescription>
                                {editingUser ? 'تعديل بيانات المستخدم الحالي' : 'إضافة مستخدم جديد للنظام'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الاسم الكامل</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="الاسم الكامل"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">البريد الإلكتروني</label>
                                <Input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="example@school.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">الدور (Role)</label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر الدور" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">رقم الهاتف</label>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="05xxxxxxxx"
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    إلغاء
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="بحث بالاسم أو البريد الإلكتروني..."
                        className="pr-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="كل الأدوار" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">كل الأدوار</SelectItem>
                        {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">الاسم</TableHead>
                            <TableHead className="text-right">البريد الإلكتروني</TableHead>
                            <TableHead className="text-right">الدور</TableHead>
                            <TableHead className="text-right">رقم الهاتف</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    لا يوجد مستخدمين
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{user.phone || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(user)}
                                                className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(user.id)}
                                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
