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
import { Search, Plus, Pencil, Trash2, Users, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

interface ClassData {
    id: string;
    name: string;
    academicYear: string;
    description?: string;
    _count?: { enrollments: number; subjects: number };
    studentsCount?: number;
    subjectsCount?: number;
}

export default function ClassesPage() {
    const { toast } = useToast();
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({ name: '', description: '', academicYear: '' });

    const fetchClasses = async () => {
        try {
            const res = await apiClient.get('/class');
            const data = res.data?.data || res.data || [];
            setClasses(data);
        } catch {
            toast({ title: 'خطأ', description: 'فشل تحميل الفصول', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingClass) {
                await apiClient.patch(`/class/${editingClass.id}`, formData);
                toast({ title: 'تم بنجاح', description: 'تم تحديث بيانات الفصل' });
            } else {
                await apiClient.post('/class', formData);
                toast({ title: 'تم بنجاح', description: 'تم إنشاء الفصل الجديد' });
            }
            await fetchClasses();
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            toast({ title: 'خطأ', description: err.response?.data?.message || 'فشل حفظ الفصل', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingClass(null);
        setFormData({ name: '', description: '', academicYear: '' });
    };

    const handleEdit = (cls: ClassData) => {
        setEditingClass(cls);
        setFormData({ name: cls.name, description: cls.description || '', academicYear: cls.academicYear });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا الفصل؟')) return;
        try {
            await apiClient.delete(`/class/${id}`);
            setClasses(prev => prev.filter(c => c.id !== id));
            toast({ title: 'تم بنجاح', description: 'تم حذف الفصل' });
        } catch {
            toast({ title: 'خطأ', description: 'فشل حذف الفصل', variant: 'destructive' });
        }
    };

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cls.academicYear || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">الفصول الدراسية</h1>
                    <p className="text-muted-foreground">إدارة الفصول الدراسية والمراحل</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={open => { setIsModalOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" />إضافة فصل</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingClass ? 'تعديل فصل' : 'إضافة فصل جديد'}</DialogTitle>
                            <DialogDescription>{editingClass ? 'تعديل بيانات الفصل الحالي' : 'إضافة فصل دراسي جديد'}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">اسم الفصل</label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: الأول ابتدائي - أ" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">السنة الدراسية</label>
                                <Input value={formData.academicYear} onChange={e => setFormData({ ...formData, academicYear: e.target.value })} placeholder="مثال: 2024-2025" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">الوصف</label>
                                <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="وصف مختصر للفصل" />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
                                <Button type="submit" disabled={isSubmitting} className="gap-2">
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input placeholder="بحث عن فصل..." className="pr-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">اسم الفصل</TableHead>
                                <TableHead className="text-right">السنة الدراسية</TableHead>
                                <TableHead className="text-right">الوصف</TableHead>
                                <TableHead className="text-right">الإحصائيات</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClasses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        لا يوجد فصول دراسية
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClasses.map(cls => (
                                    <TableRow key={cls.id}>
                                        <TableCell className="font-medium">{cls.name}</TableCell>
                                        <TableCell><Badge variant="outline">{cls.academicYear}</Badge></TableCell>
                                        <TableCell className="text-muted-foreground">{cls.description}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Badge variant="secondary" className="gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {cls._count?.enrollments ?? cls.studentsCount ?? 0}
                                                </Badge>
                                                <Badge variant="secondary" className="gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    {cls._count?.subjects ?? cls.subjectsCount ?? 0}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)} className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
