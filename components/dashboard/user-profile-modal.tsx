'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { User, Mail, School, GraduationCap, Calendar } from 'lucide-react';

export function UserProfileModal({ children }: { children: React.ReactNode }) {
    const { user, profile } = useAuth();

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                <DialogHeader className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                    <DialogTitle className="text-white text-xl">الملف الشخصي</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center -mt-12">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600">
                                {profile?.full_name?.[0] || 'S'}
                            </div>
                        </div>
                        <h3 className="mt-4 font-bold text-xl text-gray-900">{profile?.full_name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{profile?.role}</p>
                    </div>

                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm">
                                <Mail className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm">
                                <School className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">مدرسة الرياض النموذجية</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">الصف الثالث الابتدائي - أ</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">تاريخ التسجيل: 2023-09-01</span>
                        </div>
                    </div>

                    <Button className="w-full" size="lg">تعديل البيانات</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
