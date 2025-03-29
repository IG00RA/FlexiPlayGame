'use client';

import styles from './BasicBoardGame.module.css';
import header_ico from '@/img/game/header_ico.webp';
import main_board from '@/img/game/basicBoard.webp';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState, useRef } from 'react';
import ModalComponent from '../Modals/ModalComponent';
import { shapes } from '@/data/data';

// Інтерфейс для фігури
interface Shape {
  type: string;
  color: string;
  image: StaticImageData;
}

export default function BasicBoardGame() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [timer, setTimer] = useState('00:00');
  const [lastRecord, setLastRecord] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [displayedShapes, setDisplayedShapes] = useState<Shape[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [allCombinations, setAllCombinations] = useState<Shape[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations();

  const shapeTypes = ['circle', 'rectangle', 'square', 'triangle'];
  const colorMap: { [key: number]: string } = {
    0: 'blue',
    1: 'green',
    2: 'red',
    3: 'yellow',
  };

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
    }
    return newArray;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return hours > 0
      ? `${hours.toString().padStart(2, '0')}:${mins}:${secs}`
      : `${mins}:${secs}`;
  };

  const startTimer = () => {
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setTimer(formatTime(seconds));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimer('00:00');
  };

  const startTotalTimer = () => {
    if (!totalTimerRef.current) {
      let totalSeconds = parseInt(
        localStorage.getItem('totalSecondsBoard') || '0',
        10
      );
      totalTimerRef.current = setInterval(() => {
        totalSeconds += 1;
        const formattedTime = formatTime(totalSeconds);
        setTotalTime(formattedTime);
        localStorage.setItem('totalSecondsBoard', totalSeconds.toString());
      }, 1000);
    }
  };

  const pauseTotalTimer = () => {
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
  };

  useEffect(() => {
    const combinations: Shape[] = [];
    shapeTypes.forEach(type => {
      [0, 1, 2, 3].forEach(colorIndex => {
        const color = colorMap[colorIndex];
        const image = shapes[type][colorIndex];
        combinations.push({ type, color, image });
      });
    });
    combinations.sort(() => 0.5 - Math.random());
    setAllCombinations(combinations);
  }, []);

  const generateUniqueShapes = (): Shape[] => {
    const availableShapes = [...shapeTypes];
    const availableColors = Object.values(colorMap);

    const shuffledShapes = shuffleArray(availableShapes).slice(0, 4);
    const shuffledColors = shuffleArray(availableColors).slice(0, 4);

    return shuffledShapes.map((type, index) => {
      const color = shuffledColors[index];
      const colorIndex = Object.keys(colorMap).find(
        key => colorMap[Number(key)] === color
      );
      const image = shapes[type][Number(colorIndex)];
      return { type, color, image };
    });
  };

  const displayShapesWithDelay = () => {
    const newShapes = generateUniqueShapes();
    setDisplayedShapes([]);
    newShapes.forEach((shape, index) => {
      setTimeout(() => {
        setDisplayedShapes(prev => [...prev, shape]);
      }, index * 500);
    });
  };

  const generateAllCombinations = () => {
    const combinations: Shape[] = [];
    shapeTypes.forEach(type => {
      [0, 1, 2, 3].forEach(colorIndex => {
        const color = colorMap[colorIndex];
        const image = shapes[type][colorIndex];
        combinations.push({ type, color, image });
      });
    });
    combinations.sort(() => 0.5 - Math.random());
    setAllCombinations(combinations);
  };

  const handleStartOrYes = () => {
    if (isGameCompleted) {
      setCurrentRound(0);
      setIsGameCompleted(false);
      setIsGameActive(false);
      setCurrentShape(null);
      setIsMenuOpen(true);
      generateAllCombinations();
    } else if (!isGameActive && currentRound < 16) {
      setIsGameActive(true);
      setDisplayedShapes([]);
      startTimer();
      const newShape = allCombinations[currentRound];
      setTimeout(() => setCurrentShape(newShape), 500);
    }
  };

  const handleDone = () => {
    if (isGameActive) {
      stopTimer();
      setLastRecord(timer);
      localStorage.setItem('lastRecordBoard', timer);
      resetTimer();
      setCurrentShape(null);
      setCurrentRound(prev => prev + 1);
      if (currentRound + 1 < 16) {
        setIsGameActive(false);
      } else {
        setIsGameActive(false);
        setIsGameCompleted(true);
      }
    }
  };

  const handleStopOrNo = () => {
    setCurrentRound(0);
    setIsGameCompleted(false);
    setIsGameActive(false);
    setCurrentShape(null);
    setDisplayedShapes([]);
    resetTimer();
    generateAllCombinations();
    displayShapesWithDelay();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    displayShapesWithDelay();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLastRecord =
        localStorage.getItem('lastRecordBoard') || '00:00';
      const savedTotalSeconds = parseInt(
        localStorage.getItem('totalSecondsBoard') || '0',
        10
      );
      const savedTotalTime = formatTime(savedTotalSeconds);

      setLastRecord(savedLastRecord);
      setTotalTime(savedTotalTime);
      startTotalTimer();
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
        document.body.style.touchAction = 'auto';
        stopTimer();
        pauseTotalTimer();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
      document.body.style.touchAction = isMenuOpen ? 'none' : 'auto';
    }
  }, [isMenuOpen]);

  return (
    <section>
      <h2 className={styles.header}>
        <span className={styles.ico_wrap}>
          <Image
            src={header_ico}
            className={styles.header_ico}
            width={0}
            height={0}
            sizes="100vw"
            alt="Header icon"
            priority
          />
        </span>
        {t('BasicBoardGame.header')}
      </h2>
      <h3 className={styles.header_text}>{t('BasicBoardGame.headerText')}</h3>
      <div className={styles.game_text_wrap}>
        {isGameActive && currentShape ? (
          <p className={styles.game_text}>
            {t('BasicBoardGame.gameTextFirst')}{' '}
            <span>
              {t(
                `${currentShape.type === 'circle' ? 'ColorCircle' : 'Color'}.${
                  currentShape.color
                }`
              )}
            </span>{' '}
            {t(`Figures.${currentShape.type}`)}
            {t('BasicBoardGame.gameTextSecond')}
          </p>
        ) : isGameCompleted ? (
          <p className={styles.game_text}>{t('BasicBoardGame.newGameText')}</p>
        ) : currentRound === 0 ? (
          <p className={styles.game_text}>{t('BasicBoardGame.previewText')}</p>
        ) : (
          <p className={styles.game_text}>{t('BasicBoardGame.continueText')}</p>
        )}
      </div>
      <div className={styles.field}>
        <div className={styles.image_wrap}>
          <Image
            src={main_board}
            className={styles.main_board}
            width={0}
            height={0}
            sizes="100vw"
            alt="Main board image"
            priority
          />
          {isGameActive && currentShape ? (
            <div className={styles.figures_box}>
              <Image
                src={currentShape.image}
                className={`${styles.figure} ${
                  currentShape.type === 'rectangle'
                    ? styles.figure_rectangle
                    : ''
                }`}
                width={0}
                height={0}
                sizes="100vw"
                alt={`${currentShape.color} ${currentShape.type}`}
              />
            </div>
          ) : !isGameCompleted && currentRound === 0 ? (
            <div className={styles.figures_box}>
              {displayedShapes.map((shape, index) => (
                <Image
                  key={index}
                  src={shape.image}
                  className={`${styles.figure} ${
                    shape.type === 'rectangle' ? styles.figure_rectangle : ''
                  }`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt={`${shape.color} ${shape.type}`}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.btn_box}>
          <div className={styles.timer_wrap}>
            <button className={styles.timer_button} type="button">
              {t('BasicBoardGame.buttons.timer')} {timer}
            </button>
            <button className={styles.record_button} type="button">
              {t('BasicBoardGame.buttons.record')} {lastRecord}
            </button>
          </div>
          <div className={styles.control_wrap_main}>
            <div className={styles.control_wrap}>
              <button
                className={styles.start_button}
                type="button"
                onClick={isGameActive ? handleDone : handleStartOrYes}
              >
                {isGameCompleted
                  ? t('BasicBoardGame.buttons.yes')
                  : isGameActive
                  ? t('BasicBoardGame.buttons.done')
                  : t('BasicBoardGame.buttons.start')}
              </button>
              <button
                className={styles.stop_button}
                type="button"
                onClick={handleStopOrNo}
              >
                {isGameCompleted
                  ? t('BasicBoardGame.buttons.no')
                  : t('BasicBoardGame.buttons.stop')}
              </button>
            </div>
            <button className={styles.time_button} type="button">
              {t('BasicBoardGame.buttons.time')} {totalTime}
            </button>
          </div>
        </div>
      </div>
      <ModalComponent key="menuModal" isOpen={isMenuOpen} onClose={closeMenu}>
        <div className={styles.modal_wrap}>
          <h3 className={styles.modal_header}>
            {t('BasicBoardGame.modal.tip.header')}
          </h3>
          <p className={styles.modal_text}>
            {t('BasicBoardGame.modal.tip.text.first')}
          </p>
          <p className={styles.modal_text}>
            {t('BasicBoardGame.modal.tip.text.second')}
          </p>
          <p className={styles.modal_text}>
            {t('BasicBoardGame.modal.tip.text.third')}
          </p>
          <button
            className={styles.modal_button}
            onClick={closeMenu}
            type="button"
          >
            {t('BasicBoardGame.modal.buttons.ok')}
          </button>
        </div>
      </ModalComponent>
    </section>
  );
}
