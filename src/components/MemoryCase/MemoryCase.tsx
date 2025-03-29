'use client';

import styles from './MemoryCase.module.css';
import memory from '@/img/pages/memory.webp';
import memory_mob from '@/img/pages/memory_mob.webp';
import useLanguageStore from '@/store/useLanguageStore';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import arrow from '@/img/arrow.webp';
import { useRouter } from 'next/navigation';

export default function MemoryCase() {
  const t = useTranslations();
  const { locale } = useLanguageStore();

  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/${locale}/memory-case/game`);
  };

  return (
    <section>
      <h2 className={styles.header}>{t('MemoryCasePage.header')}</h2>
      <h3 className={styles.header_text}>{t('MemoryCasePage.headerText')}</h3>
      <div
        className={styles.card}
        onClick={handleNavigation}
        role="button"
        tabIndex={0}
      >
        <div className={styles.image_wrap}>
          <Image
            src={memory}
            className={styles.img}
            width={0}
            height={0}
            sizes="100vw"
            alt={t('MemoryCasePage.header')}
            priority
          />
          <Image
            src={memory_mob}
            className={styles.img_mob}
            width={0}
            height={0}
            sizes="100vw"
            alt={t('MemoryCasePage.header')}
            priority
          />
        </div>

        <div className={styles.bottom_wrap}>
          <h3 className={styles.item_header}>
            {t('MemoryCasePage.cardHeader')}
          </h3>
          <div className={styles.text_wrap}>
            <div className={styles.arrow_wrap}>
              <Image
                src={arrow}
                className={styles.arrow}
                width={0}
                height={0}
                sizes="100vw"
                alt="Text arrow"
                priority
              />
              <p className={styles.item_description}>
                {t('MemoryCasePage.cardText')}
              </p>
            </div>
            <div className={styles.arrow_wrap}>
              <Image
                src={arrow}
                className={styles.arrow}
                width={0}
                height={0}
                sizes="100vw"
                alt="Text arrow"
                priority
              />
              <p className={styles.time}>
                <span>10-15 </span>
                {t('MainPage.min')}
              </p>
            </div>
            <Link
              href={`/${locale}/memory-case/game`}
              className={styles.button}
            >
              {t('Buttons.start')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
