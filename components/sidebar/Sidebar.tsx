'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import {
    Home,
    BookOpen,
    Users,
    Calendar,
    FileText,
    Award,
    Bell,
    Settings,
    Zap,
    LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
    id: string;
    label: string;
    icon: LucideIcon;
    route?: string;
    drawer?: boolean;
    badge?: number;
}

const sidebarItems: SidebarItem[] = [
    { id: 'home', label: 'الرئيسية', icon: Home, route: '/student' },
    { id: 'nexus', label: 'NEXUS Dialogue', icon: Zap, route: '/student/million' },
    { id: 'courses', label: 'المواد الدراسية', icon: BookOpen, route: '/student/courses' },
    { id: 'assignments', label: 'الواجبات', icon: FileText, drawer: true, badge: 3 },
    { id: 'grades', label: 'الدرجات', icon: Award, drawer: true },
    { id: 'attendance', label: 'الحضور', icon: Calendar, drawer: true },
    { id: 'classes', label: 'الفصول', icon: Users, route: '/student/classes' },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, drawer: true, badge: 5 },
    { id: 'settings', label: 'الإعدادات', icon: Settings, drawer: true },
];

export function Sidebar() {
    const pathname = usePathname();
    const { activeDrawer, toggleDrawer } = useSidebar();

    const handleItemClick = (item: SidebarItem) => {
        if (item.drawer) {
            toggleDrawer(item.id);
        }
    };

    const isActive = (item: SidebarItem) => {
        if (item.drawer) {
            return activeDrawer === item.id;
        }
        return pathname === item.route;
    };

    return (
        <div className="hidden md:flex md:w-20 lg:w-64 flex-shrink-0">
            <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-20 lg:w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
                <nav className="p-3 space-y-2" dir="rtl">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);

                        const content = (
                            <div
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer',
                                    'group relative',
                                    active
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                                onClick={() => handleItemClick(item)}
                            >
                                <Icon className={cn(
                                    'w-6 h-6 flex-shrink-0',
                                    active ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600'
                                )} />

                                <span className="hidden lg:block font-medium">
                                    {item.label}
                                </span>

                                {item.badge && item.badge > 0 && (
                                    <span className="hidden lg:flex absolute left-3 top-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}

                                {/* Tooltip for small sidebar */}
                                <div className="lg:hidden absolute right-full mr-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {item.label}
                                </div>
                            </div>
                        );

                        if (item.route) {
                            return (
                                <Link key={item.id} href={item.route}>
                                    {content}
                                </Link>
                            );
                        }

                        return <div key={item.id}>{content}</div>;
                    })}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;
