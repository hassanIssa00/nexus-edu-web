import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define and export locales for next-intl plugin & middleware
export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'ar';
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
    if (!locale || !locales.includes(locale as Locale)) {
        notFound();
    }

    const currentLocale = locale as Locale;

    // Load messages from individual locale files
    const messages = (await import(`./messages/${currentLocale}.json`)).default;

    return {
        locale: currentLocale,
        messages,
    };
});
