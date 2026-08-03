import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    const locales = ['en', 'ar'];
    if (!locale || !locales.includes(locale)) {
        locale = 'ar';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
