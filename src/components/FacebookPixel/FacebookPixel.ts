'use client';
import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useLanguageStore from '@/store/useLanguageStore';

export const FacebookPixel: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useLanguageStore();

  useEffect(() => {
    const fbpId = searchParams?.get('fbp') || '';
    import('react-facebook-pixel')
      .then(x => x.default)
      .then(ReactPixel => {
        ReactPixel.init(fbpId);
        ReactPixel.pageView();
        if (pathname === `/${locale}/confirm`) {
          ReactPixel.track('Lead', {});
        }
      });
  }, [pathname, searchParams, locale]);

  return null;
};
