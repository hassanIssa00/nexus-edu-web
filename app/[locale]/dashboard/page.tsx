'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const t = useTranslations('dashboard');
    const tCommon = useTranslations('common');

    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        if (!user) {
            router.push(`/${locale}/login`);
        }
    }, [user, router, locale]);

    const handleLogout = () => {
        logout();
        router.push(`/${locale}/login`);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">{tCommon('loading')}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <nav className="bg-white dark:bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {tCommon('appName')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-300 hidden sm:block">
                                {user.email}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                {user.role}
                            </span>
                            <LanguageSwitcher />
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {tCommon('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('welcomeMessage')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t('loggedInAs')} <strong>{user.role}</strong>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {user.role === 'ADMIN' && (
                                <a
                                    href={`/${locale}/admin/classes`}
                                    className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200 cursor-pointer"
                                >
                                    <h3 className="text-xl font-semibold mb-2">⚙️ Admin Panel</h3>
                                    <p className="text-red-100">Manage Classes & Subjects</p>
                                    <div className="mt-4 text-3xl font-bold">→</div>
                                </a>
                            )}

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-xl font-semibold mb-2">{t('courses')}</h3>
                                <p className="text-blue-100">{t('startLearning')}</p>
                                <div className="mt-4 text-3xl font-bold">0</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-xl font-semibold mb-2">{t('progress')}</h3>
                                <p className="text-green-100">{t('completionRate')}</p>
                                <div className="mt-4 text-3xl font-bold">0%</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
                                <h3 className="text-xl font-semibold mb-2">{t('certificates')}</h3>
                                <p className="text-purple-100">{t('achievements')}</p>
                                <div className="mt-4 text-3xl font-bold">0</div>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                ℹ️ {t('userInfo')}
                            </h3>
                            <div className="space-y-2 text-blue-800 dark:text-blue-300">
                                <p><strong>{tCommon('email')}:</strong> {user.email}</p>
                                <p><strong>{tCommon('role')}:</strong> {user.role}</p>
                                <p><strong>{t('userId')}:</strong> {user.id}</p>
                            </div>
                        </div>

                        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                                🚀 {t('nextSteps')}
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-300">
                                <li>{t('nextStepsList.0')}</li>
                                <li>{t('nextStepsList.1')}</li>
                                <li>{t('nextStepsList.2')}</li>
                                <li>{t('nextStepsList.3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
