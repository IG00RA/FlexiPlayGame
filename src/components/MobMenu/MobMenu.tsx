'use client';

import styles from './MobMenu.module.css';
import Icon from '@/helpers/Icon';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import useLanguageStore from '@/store/useLanguageStore';

type MobMenuProps = {
  isMenuOpen: boolean;
  closeMenu: () => void;
};

export default function MobMenu({ isMenuOpen, closeMenu }: MobMenuProps) {
  const t = useTranslations();
  const { locale } = useLanguageStore();
  return (
    <div
      onClick={closeMenu}
      className={`${styles.mobile_wrap} ${
        isMenuOpen && styles.mobile_menu_open
      }`}
    >
      <div
        className={styles.burger_menu}
        onClick={event => event.stopPropagation()}
      >
        <Link className={styles.logo_wrap} onClick={closeMenu} href={`/`}>
          <Icon name="icon-logoMob" width={116} height={35} color={'#fff'} />
        </Link>
        <Link
          onClick={closeMenu}
          className={styles.main_button}
          href={`/${locale}`}
        >
          {t('Buttons.main')}
        </Link>
      </div>
    </div>
  );
}
