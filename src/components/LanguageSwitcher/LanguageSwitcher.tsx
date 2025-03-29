'use client';

import { useEffect, useState } from 'react';
import styles from './LanguageSwitcher.module.css';
import { usePathname, useRouter } from 'next/navigation';
import useLanguageStore from '@/store/useLanguageStore';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { query, setLocale, setQuery } = useLanguageStore();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null); // Стан для ховера

  // Функція для визначення локалі з URL
  const getLocaleFromPath = (pathname: string): string => {
    const pathSegments = pathname.split('/');
    return pathSegments[1] || 'uk';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const queryString = urlSearchParams.toString();
      setQuery(queryString ? `?${queryString}` : '');
    }
  }, [setQuery]);

  const locale = getLocaleFromPath(pathname || '');

  // Оновлюємо локаль у глобальному стані
  useEffect(() => {
    setLocale(locale);
  }, [setLocale, locale]);

  const handleLanguageChange = (lang: string) => {
    const path = pathname?.split('/').slice(2).join('/');
    router.push(`/${lang}/${path}?${query}`);
  };

  // Обробники подій для ховера
  const handleMouseEnter = (lang: string) => {
    if (locale !== lang) {
      setHoveredButton(lang); // Встановлюємо кнопку, на яку наведено курсор
    }
  };

  const handleMouseLeave = () => {
    setHoveredButton(null); // Скидаємо стан ховера
  };

  // Функція для визначення класів кнопок
  const getButtonClass = (lang: string) => {
    let className = styles.button;
    if (locale === lang) {
      className += ` ${styles.buttonActive}`;
      if (hoveredButton && hoveredButton !== lang) {
        className += ` ${styles.buttonActiveHover}`;
      }
    } else {
      className += ` ${styles.buttonUnActive}`;
      if (hoveredButton === lang) {
        className += ` ${styles.buttonUnActiveHover}`;
      }
    }
    return className;
  };

  return (
    <div className={styles.language}>
      <button
        className={getButtonClass('sk')}
        onClick={() => handleLanguageChange('sk')}
        onMouseEnter={() => handleMouseEnter('sk')}
        onMouseLeave={handleMouseLeave}
        type="button"
      >
        SK
      </button>
      <button
        className={getButtonClass('uk')}
        onClick={() => handleLanguageChange('uk')}
        onMouseEnter={() => handleMouseEnter('uk')}
        onMouseLeave={handleMouseLeave}
        type="button"
      >
        UA
      </button>
    </div>
  );
};

export default LanguageSwitcher;
