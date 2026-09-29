'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { 
    Mail, School, GraduationCap, Calendar, Sparkles, 
    ShieldCheck, QrCode, Phone, IdCard, ExternalLink, X, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export function UserProfileModal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [open, setOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [studentName, setStudentName] = useState<string>('أحمد فيصل الغامدي');
    const [studentId, setStudentId] = useState<string>('STD-1447-0284');
    const [grade, setGrade] = useState<string>('الصف الأول الابتدائي — الفئة (أ)');
    const [stageName, setStageName] = useState<string>('المرحلة الابتدائية');
    const [phone, setPhone] = useState<string>('+966 50 123 4567');
    const [registrationDate, setRegistrationDate] = useState<string>('1447 / 1448هـ');

    const loadData = () => {
        try {
            const raw = localStorage.getItem('nexus_user');
            if (raw) {
                const u = JSON.parse(raw);
                if (u.name && u.name !== 'طالب' && !u.name.includes('@')) {
                    setStudentName(u.name);
                } else if (u.fullName) {
                    setStudentName(u.fullName);
                } else if (u.full_name && !u.full_name.includes('@') && u.full_name !== 'طالب') {
                    setStudentName(u.full_name);
                } else if (profile?.full_name && !profile.full_name.includes('@')) {
                    setStudentName(profile.full_name);
                }

                if (u.photoUrl) setPhotoUrl(u.photoUrl);
                if (u.universalId) setStudentId(u.universalId);
                if (u.phone) setPhone(u.phone);
                if (u.grade) setGrade(u.grade);
                if (u.stage) {
                    if (u.stage === 'kindergarten') setStageName('مرحلة رياض الأطفال');
                    else if (u.stage === 'middle') setStageName('المرحلة المتوسطة');
                    else if (u.stage === 'high') setStageName('المرحلة الثانوية');
                    else setStageName('المرحلة الابتدائية');
                }
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
            if (storedStage) {
                if (storedStage.includes('روض')) {
                    setStageName('مرحلة رياض الأطفال');
                    setGrade('مرحلة رياض الأطفال — الروضة');
                } else if (storedStage.includes('متوسط')) {
                    setStageName('المرحلة المتوسطة');
                    setGrade('الصف الأول المتوسط — الفئة (أ)');
                } else if (storedStage.includes('ثانو')) {
                    setStageName('المرحلة الثانوية');
                    setGrade('الصف الأول الثانوي — المسار العام');
                } else {
                    setStageName('المرحلة الابتدائية');
                    setGrade('الصف الأول الابتدائي — الفئة (أ)');
                }
            }
        } catch {}
    };

    useEffect(() => {
        loadData();
    }, [open]);

    const initial = (studentName.trim()[0] || 'أ').toUpperCase();

    const handleEditProfile = () => {
        setOpen(false);
        router.push('/student/settings');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[2.2rem] border-0 shadow-2xl bg-white dark:bg-[#151521] text-gray-900 dark:text-white" dir="rtl">
                {/* ═══ OFFICIAL CARD HEADER ═══ */}
                <div className="relative bg-gradient-to-br from-[#1e1b4b] via-[#31104b] to-[#0f172a] text-white p-6 pb-7 overflow-hidden">
                    {/* Background Glows & Watermarks */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

                    {/* Top Bar: Ministry / School Info */}
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-2xl bg-white p-1 shadow-md border border-white/20 flex items-center justify-center overflow-hidden">
                                <img src="/ikhlas-logo.jpg" alt="شعار المدارس" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-black tracking-tight text-white leading-tight">مدارس الإخلاص الأهلية للبنين بجدة</h4>
                                <p className="text-[10px] text-purple-200/80 font-bold">تحت إشراف وزارة التعليم • جدة</p>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            معتمد رسمياً
                        </span>
                    </div>

                    {/* Student Hero inside Card */}
                    <div className="flex items-center gap-4 relative z-10 pt-1">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl bg-slate-800 p-0.5">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={studentName}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white">
                                        {initial}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#1e1b4b] flex items-center justify-center text-white shadow-sm" title="حساب موثق">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Name & Academic Rank */}
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-amber-300 mb-1 border border-white/10">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>{stageName}</span>
                            </div>
                            <h3 className="font-black text-lg text-white truncate leading-tight">
                                {studentName}
                            </h3>
                            <p className="text-[11px] font-mono text-purple-200/90 mt-0.5">
                                الرقم الأكاديمي: <span className="font-bold text-white tracking-wider">{studentId}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══ CARD DETAILS BODY ═══ */}
                <div className="p-6 space-y-4">
                    {/* Grid of Key Info */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-gray-50 dark:bg-white/[0.04] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                <GraduationCap className="w-4 h-4" />
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">الصف الدراسي</span>
                            </div>
                            <p className="text-xs font-black text-gray-900 dark:text-white truncate">{grade}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-white/[0.04] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">العام الدراسي</span>
                            </div>
                            <p className="text-xs font-black text-gray-900 dark:text-white truncate">{registrationDate}</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-white/[0.04] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                                <Mail className="w-4 h-4" />
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">البريد الأكاديمي</span>
                            </div>
                            <p className="text-[11px] font-mono font-bold text-gray-800 dark:text-gray-200 truncate" dir="ltr">
                                {user?.email || 'student@ikhlas.edu.sa'}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-white/[0.04] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                                <Phone className="w-4 h-4" />
                                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">هاتف ولي الأمر</span>
                            </div>
                            <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 truncate" dir="ltr">{phone}</p>
                        </div>
                    </div>

                    {/* Digital Verification Bar */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-teal-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-900 dark:text-white">الهوية الرقمية الموحدة</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">مشفرة برمز أمان PDPL ومعتمدة للحضور الذكي</p>
                            </div>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col gap-2">
                        <Button
                            onClick={handleEditProfile}
                            className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-lg shadow-violet-500/25 h-11 transition-all cursor-pointer"
                        >
                            <span>تعديل البيانات في الإعدادات</span>
                            <ExternalLink className="w-4 h-4 mr-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
