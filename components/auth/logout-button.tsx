'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
    const { signOut, profile } = useAuth();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut();
            toast({
                title: '✅ تم تسجيل الخروج بنجاح',
                description: 'نراك قريباً',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: '❌ خطأ',
                description: error.message,
            });
        }
    };

    if (!profile) return null;

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
        >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
        </Button>
    );
}
