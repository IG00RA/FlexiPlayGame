import styles from './Main.module.css';
import MainPage from '@/components/MainPage/MainPage';

export default function Home() {
  return (
    <main className={styles.main}>
      <MainPage />
    </main>
  );
}
