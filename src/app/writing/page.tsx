import styles from './page.module.css';
import Link from 'next/link';

export default function Writing() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          writing
        </h1>
        <Link href="/" className={styles.backLink}>
          back to home
        </Link>
      </div>
    </div>
  );
} 