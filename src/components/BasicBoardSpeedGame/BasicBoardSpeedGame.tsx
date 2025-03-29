'use client';

import styles from './BasicBoardSpeedGame.module.css';
import header_ico from '@/img/game/header_ico.webp';
import main_board from '@/img/game/basicBoard.webp';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState, useRef } from 'react';
import ModalComponent from '../Modals/ModalComponent';
import { shapes } from '@/data/data';

interface Shape {
  type: string;
  color: string;
  image: StaticImageData;
}

export default function BasicBoardSpeedGame() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [roundTimer, setRoundTimer] = useState(30);
  const [lastRecord, setLastRecord] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [displayedShapes, setDisplayedShapes] = useState<Shape[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentShapes, setCurrentShapes] = useState<Shape[]>([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [allCombinations, setAllCombinations] = useState<Shape[]>([]);
  const [levelTwoColors, setLevelTwoColors] = useState<string[]>([]);
  const [levelThreePairs, setLevelThreePairs] = useState<Shape[][]>([]);
  const [isTimeOut, setIsTimeOut] = useState(false); // Новий стан для закінчення часу

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

  const startRoundTimer = () => {
    const timeLimit = currentLevel === 3 ? 20 : 30;
    setRoundTimer(timeLimit);
    setIsTimeOut(false); // Скидаємо стан закінчення часу
    timerRef.current = setInterval(() => {
      setRoundTimer(prev => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsTimeOut(true); // Час закінчився
          handleRoundEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setRoundTimer(currentLevel === 3 ? 20 : 30);
  };

  const startTotalTimer = () => {
    totalTimerRef.current = setInterval(() => {
      setTotalTime(prev => {
        const [minutes, seconds] = prev.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds + 1;
        const newTime = formatTime(totalSeconds);
        localStorage.setItem('totalSecondsSpeedBoard', totalSeconds.toString());
        return newTime;
      });
    }, 1000);
  };

  const pauseTotalTimer = () => {
    if (totalTimerRef.current !== null) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
  };

  useEffect(() => {
    generateAllCombinations();
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

  const generateFourShapesSameColor = (round: number): Shape[] => {
    const selectedColor = levelTwoColors[round];
    return shapeTypes.map(type => {
      const colorIndex = Object.keys(colorMap).find(
        key => colorMap[Number(key)] === selectedColor
      );
      const image = shapes[type][Number(colorIndex)];
      return { type, color: selectedColor, image };
    });
  };

  const generatePairsForLevelThree = (): Shape[][] => {
    const combinations: Shape[] = [];
    shapeTypes.forEach(type => {
      [0, 1, 2, 3].forEach(colorIndex => {
        const color = colorMap[colorIndex];
        const image = shapes[type][colorIndex];
        combinations.push({ type, color, image });
      });
    });

    const shuffledCombinations = shuffleArray(combinations);
    const pairs: Shape[][] = [];
    for (let i = 0; i < 16 && pairs.length < 8; i += 2) {
      // Генеруємо 8 пар
      pairs.push([shuffledCombinations[i], shuffledCombinations[i + 1]]);
    }
    return pairs;
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

  const handleStart = () => {
    if (!isGameActive) {
      const maxRounds = currentLevel === 1 ? 16 : currentLevel === 2 ? 4 : 8;
      if (currentRound < maxRounds) {
        setIsGameActive(true);
        setDisplayedShapes([]);
        startRoundTimer();
        if (currentLevel === 1) {
          const newShape = allCombinations[currentRound];
          setTimeout(() => setCurrentShapes([newShape]), 500);
        } else if (currentLevel === 2) {
          const newShapes = generateFourShapesSameColor(currentRound);
          setTimeout(() => setCurrentShapes(newShapes), 500);
        } else if (currentLevel === 3) {
          const newPair = levelThreePairs[currentRound];
          setTimeout(() => setCurrentShapes(newPair), 500);
        }
      }
    }
  };

  const handleRoundEnd = () => {
    stopTimer();
    // Оновлюємо рекорд лише якщо користувач натиснув "Done", а не при закінченні часу
    if (!isTimeOut) {
      setLastRecord(formatTime((currentLevel === 3 ? 20 : 30) - roundTimer));
      localStorage.setItem(
        'lastRecordSpeedBoard',
        formatTime((currentLevel === 3 ? 20 : 30) - roundTimer)
      );
    }
    resetTimer();
    setCurrentShapes([]);
    setCurrentRound(prev => prev + 1);
    const maxRounds = currentLevel === 1 ? 16 : currentLevel === 2 ? 4 : 8;
    if (currentRound + 1 < maxRounds) {
      setIsGameActive(false);
    } else {
      setIsGameActive(false);
      setIsGameCompleted(true);
      setCurrentLevel(prev => prev + 1);
      setIsMenuOpen(true);
    }
  };

  const handleDone = () => {
    if (isGameActive) {
      setIsTimeOut(false); // Користувач натиснув "Done", а не час закінчився
      handleRoundEnd();
    }
  };

  const handleNextLevel = () => {
    setCurrentRound(0);
    setIsGameCompleted(false);
    setIsGameActive(false);
    setCurrentShapes([]);
    setIsMenuOpen(false);
    generateAllCombinations();

    if (currentLevel === 2) {
      const availableColors = Object.values(colorMap);
      setLevelTwoColors(shuffleArray([...availableColors]));
    } else if (currentLevel === 3) {
      setLevelThreePairs(generatePairsForLevelThree());
    } else if (currentLevel === 4) {
      setCurrentLevel(1); // Скидаємо до рівня 1
    }

    setDisplayedShapes(generateUniqueShapes());
  };

  const handleStopOrNo = () => {
    setCurrentRound(0);
    setIsGameCompleted(false);
    setIsGameActive(false);
    setCurrentShapes([]);
    setDisplayedShapes([]);
    resetTimer();
    generateAllCombinations();
    displayShapesWithDelay();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (currentRound === 0 && currentLevel === 1) {
      displayShapesWithDelay();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLastRecord =
        localStorage.getItem('lastRecordSpeedBoard') || '00:00';
      const savedTotalSeconds = parseInt(
        localStorage.getItem('totalSecondsSpeedBoard') || '0',
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
        {t('BasicBoardSpeedGame.header')}
      </h2>
      <h3 className={styles.header_text}>
        {t('BasicBoardSpeedGame.headerText')}
      </h3>
      <div className={styles.game_text_wrap}>
        {isGameActive && currentShapes.length > 0 ? (
          <p className={styles.game_text}>
            {t('BasicBoardSpeedGame.gameTextLevel')} {currentLevel}:{' '}
            {t('BasicBoardSpeedGame.gameTextFirst')}{' '}
            {currentLevel === 1 ? (
              <>
                <span className={styles.game_text_color}>
                  {t(
                    `${
                      currentShapes[0].type === 'circle'
                        ? 'ColorCircle'
                        : 'Color'
                    }.${currentShapes[0].color}`
                  )}{' '}
                  {t(`Figures.${currentShapes[0].type}`)}
                </span>{' '}
                {t('BasicBoardSpeedGame.gameTextSecond')}
              </>
            ) : currentLevel === 2 ? (
              <>
                <span className={styles.game_text_color}>
                  {t(`Colors.${currentShapes[0].color}`)}
                </span>{' '}
                {t('BasicBoardSpeedGame.gameTextSecond')}
              </>
            ) : (
              <>
                {t('BasicBoardSpeedGame.gameTextFindPair')}{' '}
                {currentShapes.map((shape, index) => (
                  <span key={index} className={styles.game_text_color}>
                    {t(
                      `${shape.type === 'circle' ? 'ColorCircle' : 'Color'}.${
                        shape.color
                      }`
                    )}{' '}
                    {t(`Figures.${shape.type}`)}
                    {index < currentShapes.length - 1 ? ' і ' : ''}
                  </span>
                ))}
              </>
            )}
          </p>
        ) : isGameCompleted ? (
          <p className={styles.game_text}>
            {t('BasicBoardSpeedGame.newGameText')}
          </p>
        ) : currentRound === 0 ? (
          currentLevel === 1 ? (
            <p className={styles.game_text}>
              {t('BasicBoardSpeedGame.previewText')} <br />
              <span>{t('BasicBoardSpeedGame.previewTextSecond')}</span>
            </p>
          ) : (
            <p className={styles.game_text}>
              {t('BasicBoardSpeedGame.newGameText')}
            </p>
          )
        ) : isTimeOut ? (
          <p className={styles.game_text}>
            {t('BasicBoardSpeedGame.timeOutTextText')}
          </p>
        ) : (
          <p className={styles.game_text}>
            {t('BasicBoardSpeedGame.continueText')}
          </p>
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
          {isGameActive && currentShapes.length > 0 ? (
            <div className={styles.figures_box}>
              {currentShapes.map((shape, index) => (
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
              {t('BasicBoardSpeedGame.buttons.timer')} {formatTime(roundTimer)}
            </button>
            <button className={styles.record_button} type="button">
              {t('BasicBoardSpeedGame.buttons.record')} {lastRecord}
            </button>
          </div>
          <div className={styles.control_wrap_main}>
            <div className={styles.control_wrap}>
              <button
                className={styles.start_button}
                type="button"
                onClick={isGameActive ? handleDone : handleStart}
              >
                {isGameActive
                  ? t('BasicBoardSpeedGame.buttons.done')
                  : t('BasicBoardSpeedGame.buttons.start')}
              </button>
              <button
                className={styles.stop_button}
                type="button"
                onClick={handleStopOrNo}
              >
                {t('BasicBoardSpeedGame.buttons.stop')}
              </button>
            </div>
            <button className={styles.time_button} type="button">
              {t('BasicBoardSpeedGame.buttons.time')} {totalTime}
            </button>
          </div>
        </div>
      </div>
      <ModalComponent
        key="menuModal"
        isOpen={isMenuOpen}
        onClose={currentLevel === 1 ? closeMenu : handleNextLevel}
      >
        <div className={styles.modal_wrap}>
          <h3 className={styles.modal_header}>
            {t('BasicBoardSpeedGame.modal.tip.header')}
          </h3>
          {currentLevel === 1 || currentLevel > 3 ? (
            <>
              <p className={styles.modal_text}>
                {t('BasicBoardSpeedGame.modal.tip.text.first')}
              </p>
              <p className={styles.modal_text}>
                {t('BasicBoardSpeedGame.modal.tip.text.second')}
              </p>
            </>
          ) : (
            <>
              <p className={styles.modal_text}>
                {t('BasicBoardSpeedGame.modal.nextLevel.first')}
              </p>
              <p className={styles.modal_text}>
                {t('BasicBoardSpeedGame.modal.nextLevel.second')}
              </p>
              <p className={styles.modal_text}>
                {t('BasicBoardSpeedGame.modal.nextLevel.third')}
              </p>
            </>
          )}
          <button
            className={styles.modal_button}
            onClick={currentLevel === 1 ? closeMenu : handleNextLevel}
            type="button"
          >
            {t('BasicBoardSpeedGame.modal.buttons.ok')}
          </button>
        </div>
      </ModalComponent>
    </section>
  );
}
