'use client';

import styles from './MainVideoModal.module.css';
import { useTranslations } from 'next-intl';
import Icon from '@/helpers/Icon';
import { VideoItem } from '@/components/MainPage/MainPage';

interface ModalProps {
  onClose: () => void;
  item: VideoItem;
}

export default function MainVideoModal({ onClose, item }: ModalProps) {
  const t = useTranslations();

  return (
    <div className={styles.modal}>
      <div className={styles.image_wrapper}>
        <button type="button" className={styles.play_wrapper}>
          <Icon
            className={styles.play_icon}
            name="icon-play"
            width={136}
            height={136}
          />
        </button>
      </div>
      <div className={styles.content_wrapper}>
        <h2 className={styles.header}>{t(item.header)}</h2>
        <p className={styles.time}>
          <span>{item.time}</span>
          {t('MainPage.min')}
        </p>
        <p className={styles.description}>{t(item.descriptionFull)}</p>
        <p className={styles.question}>{t('MainPage.question')}</p>
        <ul className={styles.list}>
          {item.quests.map((quest, index) => (
            <li className={styles.item} key={index}>
              {t(quest)}
            </li>
          ))}
        </ul>
        <button className={styles.button} onClick={onClose} type="button">
          {t('Buttons.back')}
        </button>
      </div>
    </div>
  );
}
