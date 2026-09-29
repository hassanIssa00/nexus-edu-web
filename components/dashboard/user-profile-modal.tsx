'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { User, Mail, School, GraduationCap, Calendar, Sparkles } from 'lucide-react';

export function UserProfileModal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [open, setOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [studentName, setStudentName] = useState<string>('');
    const [grade, setGrade] = useState<string>('الصف الأول الابتدائي - أ');
    const [registrationDate, setRegistrationDate] = useState<string>('1447 / 1448هـ');

    useEffect(() => {
        try {
            const raw = localStorage.getItem('nexus_user');
            if (raw) {
                const u = JSON.parse(raw);
                if (u.name) setStudentName(u.name);
                if (u.photoUrl) setPhotoUrl(u.photoUrl);
                if (u.grade) setGrade(u.grade);
                if (u.createdAt) {
                    try {
                        const d = new Date(u.createdAt);
                        setRegistrationDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                    } catch {}
                }
            }
            const dedicatedPhoto = localStorage.getItem('nexus_student_photo');
            if (dedicatedPhoto) setPhotoUrl(dedicatedPhoto);

            const storedStage = localStorage.getItem('nexus_student_stage');
            if (storedStage && !raw) {
                if (storedStage.includes('روض')) setGrade('مرحلة رياض الأطفال');
                else if (storedStage.includes('ابتدائ')) setGrade('الصف الأول الابتدائي - أ');
                else if (storedStage.includes('متوسط')) setGrade('الصف الأول المتوسط');
                else if (storedStage.includes('ثانو')) setGrade('الصف الأول الثانوي');
            }
        } catch {}
    }, [open]);

    const displayName = studentName || profile?.full_name || 'الطالب';
    const initial = (displayName.trim()[0] || 'ط').toUpperCase();

    const handleEditProfile = () => {
        setOpen(false);
        router.push('/student/settings');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl" dir="rtl">
                <DialogHeader className="p-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white relative">
                    <DialogTitle className="text-white text-xl font-black flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        الملف الشخصي للطالب
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center -mt-14">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-[#1e1e2d] p-1.5 shadow-xl border-2 border-purple-200 dark:border-purple-500/30 overflow-hidden">
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={displayName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center text-3xl font-black text-purple-700 dark:text-purple-300">
                                    {initial}
                                </div>
                            )}
                        </div>
                        <h3 className="mt-4 font-black text-xl text-gray-900 dark:text-white">{displayName}</h3>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-0.5">طالب معتمد • منصة نكسس التعليمية</p>
                    </div>

                    <div className="space-y-3.5 bg-gray-50/80 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                        {/* Email */}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs flex-shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate" dir="ltr">{user?.email || 'student@ikhlas.edu.sa'}</span>
                        </div>

                        {/* School Name */}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs flex-shrink-0">
                                <School className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">مدارس الإخلاص الأهلية للبنين بجدة</span>
                        </div>

                        {/* Grade */}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs flex-shrink-0">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{grade}</span>
                        </div>

                        {/* Registration Date */}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs flex-shrink-0">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">تاريخ التسجيل: {registrationDate}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleEditProfile}
                        className="w-full bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-lg cursor-pointer"
                        size="lg"
                    >
                        تعديل البيانات في الإعدادات
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
