import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

function getLocaleFromRequest(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const country = request.headers.get('x-country-code');
  console.log('country:', country, 'acceptLanguage:', acceptLanguage);

  if (country === 'SK') return 'sk';
  if (country === 'UA') return 'uk';

  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim());
  console.log('parsed languages:', languages);
  if (languages.includes('sk')) return 'sk';
  if (languages.includes('uk') || languages.includes('uk-UA')) return 'uk';

  return 'uk';
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('pathname:', pathname);

  if (pathname === '/') {
    const locale = getLocaleFromRequest(request);
    console.log('redirecting to:', `/${locale}`);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(uk|sk)/:path*'],
};
