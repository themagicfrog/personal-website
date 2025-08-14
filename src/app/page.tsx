import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          estella gu
        </h1>
        <Link href="/projects" className={styles.projectsLink}>
          projects
        </Link>
        <Link href="/art" className={styles.projectsLink}>
          art
        </Link>
        <Link href="/photography" className={styles.projectsLink}>
          photography
        </Link>
        <Link href="/coding" className={styles.projectsLink}>
          coding
        </Link>
        <Link href="/writing" className={styles.projectsLink}>
          writing
        </Link>
        <Link href="/adventures" className={styles.projectsLink}>
          adventures
        </Link>
      </div>
    </div>
  );
}
