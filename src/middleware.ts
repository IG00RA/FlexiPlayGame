import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Функція для визначення локалі на основі країни
function getLocaleFromRequest(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const country = request.geo?.country || 'UA'; // За замовчуванням UA
  console.log(
    'geo:',
    request.geo,
    'country:',
    country,
    'acceptLanguage:',
    acceptLanguage
  );

  if (country === 'SK') return 'sk';
  if (country === 'UA') return 'uk';

  if (acceptLanguage.startsWith('sk')) return 'sk';
  if (acceptLanguage.startsWith('uk')) return 'uk';

  return 'uk';
}

// Middleware для перенаправлення
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('pathname:', pathname);

  if (pathname === '/') {
    const locale = getLocaleFromRequest(request);
    console.log('redirecting to:', `/${locale}`);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(uk|sk)/:path*'],
};

// Експорт middleware за замовчуванням (опціонально, якщо потрібен next-intl без кастомізації)
export default createMiddleware({
  ...routing,
  defaultLocale: 'uk',
  locales: ['uk', 'sk'],
});
