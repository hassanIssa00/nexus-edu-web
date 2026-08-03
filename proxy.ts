// Next.js 16: proxy.ts replaces the deprecated middleware.ts
// The "middleware" file convention is deprecated in Next.js 16 - use "proxy" instead
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
