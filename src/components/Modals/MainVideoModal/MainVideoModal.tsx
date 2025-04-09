'use client';

import styles from './MainVideoModal.module.css';
import { useTranslations } from 'next-intl';
import Icon from '@/helpers/Icon';
import { VideoItem } from '@/components/MainPage/MainPage';
import { useState, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  item: VideoItem;
}

const videoLinks: { [key: string]: string } = {
  'MainPage.introduction.header': '/assets/forms.webm',
  'MainPage.color.header': '/assets/colors.webm',
  'MainPage.placing.header': '/assets/figures.webm',
  'MainPage.combinations.header': '/assets/combinations.webm',
};

export default function MainVideoModal({ onClose, item }: ModalProps) {
  const t = useTranslations();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Стан для лоадера
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSrc = videoLinks[item.header]; // Отримуємо URL відео за ключем header

  const playVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing video:', error);
        });
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo(e);
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false); // Прибираємо лоадер, коли відео готове
  };

  return (
    <div className={styles.modal}>
      <div className={styles.image_wrapper}>
        <video
          ref={videoRef}
          src={videoSrc}
          className={styles.video}
          onClick={handleVideoClick}
          onLoadedData={handleLoadedData} // Відео готове до відтворення
          style={{ cursor: 'pointer' }}
        />
        {isLoading && (
          <div className={styles.loader}>
            <Icon name="icon-load" width={55} height={55} color="#88b2ff" />
          </div>
        )}
        {!isPlaying && !isLoading && (
          <div className={styles.play_wrapper_main}>
            <button
              type="button"
              className={styles.play_wrapper}
              onClick={playVideo}
            >
              <Icon
                className={styles.play_icon}
                name="icon-play"
                width={136}
                height={136}
              />
            </button>
            <p className={styles.play_text}>{t('MainPage.videoPlay')}</p>
          </div>
        )}
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
