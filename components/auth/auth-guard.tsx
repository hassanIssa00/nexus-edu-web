'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useAuth, type UserRole } from '@/contexts/auth-context';

const ROLE_ROUTES: Record<UserRole, string> = {
    student: '/student',
    teacher: '/teacher',
    parent: '/parent',
    admin: '/admin',
    manager: '/admin',
    principal: '/principal',
    vice_principal: '/vice_principal',
    counselor: '/counselor',
    supervisor: '/supervisor',
    accountant: '/accountant',
    hr: '/hr',
};

const PUBLIC_ROUTES = ['/login', '/register', '/pricing'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        // Check if current path is a public route or landing page
        const isPublicRoute = PUBLIC_ROUTES.some((route) =>
            pathname === route || pathname.endsWith(route) || pathname.includes(`${route}/`)
        ) || pathname === '/' || pathname.match(/^\/[a-z]{2}$/);

        // If not authenticated and trying to access protected route
        if (!user && !isPublicRoute) {
            router.push('/login');
            return;
        }

        // If authenticated and on login/register, redirect to dashboard
        const isAuthPage = pathname.includes('/login') || pathname.includes('/register');

        if (user && profile && isAuthPage) {
            const dashboardRoute = ROLE_ROUTES[profile.role];
            router.push(dashboardRoute || '/student');
            return;
        }

        // Check role-based access
        if (user && profile && !isPublicRoute) {
            const allowedRoute = ROLE_ROUTES[profile.role];

            if (allowedRoute && !pathname.startsWith(allowedRoute)) {
                router.push(allowedRoute);
            }
        }
    }, [user, profile, loading, pathname, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
