'use client';

import styles from './BasicBoard.module.css';
import find from '@/img/pages/find.webp';
import find_mob from '@/img/pages/find_mob.webp';
import speed from '@/img/pages/speed.webp';
import speed_mob from '@/img/pages/speed_mob.webp';
import useLanguageStore from '@/store/useLanguageStore';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import arrow from '@/img/arrow.webp';
import { useRouter } from 'next/navigation';

export default function BasicBoard() {
  const t = useTranslations();
  const { locale } = useLanguageStore();

  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(`/${locale}/basic-board/${path}`);
  };
  return (
    <section>
      <h2 className={styles.header}>{t('BasicBoardPage.header')}</h2>
      <h3 className={styles.header_text}>{t('BasicBoardPage.headerText')}</h3>
      <h3 className={styles.header_text_second}>
        {t('BasicBoardPage.headerTextSecond')}
      </h3>
      <div className={styles.card_wrap}>
        <div
          className={styles.card}
          onClick={() => handleNavigation('game')}
          role="button"
          tabIndex={0}
        >
          <div className={styles.image_wrap}>
            <Image
              src={find}
              className={styles.img}
              width={0}
              height={0}
              sizes="100vw"
              alt={t('BasicBoardPage.cardHeader')}
              priority
            />
            <Image
              src={find_mob}
              className={styles.img_mob}
              width={0}
              height={0}
              sizes="100vw"
              alt={t('BasicBoardPage.cardHeader')}
              priority
            />
          </div>

          <div className={styles.bottom_wrap}>
            <h3 className={styles.item_header}>
              {t('BasicBoardPage.cardHeader')}
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
                  {t('BasicBoardPage.cardText')}
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
                href={`/${locale}/basic-board/game`}
                className={styles.button}
              >
                {t('Buttons.start')}
              </Link>
            </div>
          </div>
        </div>
        <div
          className={styles.card}
          onClick={() => handleNavigation('game2')}
          role="button"
          tabIndex={0}
        >
          <div className={styles.image_wrap}>
            <Image
              src={speed}
              className={styles.img}
              width={0}
              height={0}
              sizes="100vw"
              alt={t('BasicBoardPage.secondCardHeader')}
              priority
            />
            <Image
              src={speed_mob}
              className={styles.img_mob}
              width={0}
              height={0}
              sizes="100vw"
              alt={t('BasicBoardPage.secondCardHeader')}
              priority
            />
          </div>

          <div className={styles.bottom_wrap}>
            <h3 className={styles.item_header}>
              {t('BasicBoardPage.secondCardHeader')}
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
                  {t('BasicBoardPage.secondCardText')}
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
                  <span>8-12 </span>
                  {t('MainPage.min')}
                </p>
              </div>
              <Link
                href={`/${locale}/basic-board/game2`}
                className={styles.button}
              >
                {t('Buttons.start')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
