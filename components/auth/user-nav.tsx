'use client';

import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';

export function UserNav() {
    const { profile, signOut } = useAuth();

    if (!profile) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleName = (role: string) => {
        const roles = {
            student: 'طالب',
            teacher: 'معلم',
            parent: 'ولي أمر',
            admin: 'مشرف',
        };
        return roles[role as keyof typeof roles] || role;
    };

    return (
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger className="focus:outline-none">
                <Avatar>
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {profile.email}
                        </p>
                        <p className="text-xs text-primary-500 font-medium">
                            {getRoleName(profile.role)}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="ml-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
