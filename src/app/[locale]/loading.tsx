import styles from './loading.module.css';
import logo from '@/img/logo.webp';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className={styles.logo_wrap}>
      <Image
        src={logo}
        alt="Flexi logo"
        className={styles.logo}
        width={0}
        height={0}
        sizes="100vw"
      />
    </div>
  );
}
