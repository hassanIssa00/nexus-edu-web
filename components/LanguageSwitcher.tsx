'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        const path = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(path);
    };

    return (
        <button
            onClick={switchLanguage}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={locale === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
        >
            <span className="text-lg">{locale === 'en' ? '🇸🇦' : '🇺🇸'}</span>
            <span>{locale === 'en' ? 'عربي' : 'English'}</span>
        </button>
    );
}
