'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import Icon from '@/helpers/Icon';
import MobMenu from '../MobMenu/MobMenu';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import useLanguageStore from '@/store/useLanguageStore';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useLanguageStore();
  const t = useTranslations();

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
    document.body.style.touchAction = 'auto';
  };
  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  return (
    <header className={`${styles.header}`}>
      <Link className={styles.logo_wrap} href={`/${locale}`}>
        <Icon name="icon-logoMob" width={116} height={35} color="#000" />
      </Link>
      <Link className={styles.logo_desk} href={`/${locale}`}>
        <Icon name="icon-logoDesk" width={220} height={64} color="#000" />
      </Link>

      <div className={`${styles.lang_wrap}`}>
        <LanguageSwitcher />
        <div
          className={`${styles.burger_wrap} ${
            isMenuOpen ? styles.burger_open : ''
          }`}
          onClick={isMenuOpen ? closeMenu : openMenu}
        >
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </div>
        <Link className={styles.main_button} href={`/${locale}`}>
          {t('Buttons.main')}
        </Link>
      </div>

      <MobMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
    </header>
  );
}
