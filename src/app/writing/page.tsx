import styles from './page.module.css';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';

export default function Writing() {
  return (
    <div className={styles.container}>
      <Breadcrumb 
        items={[
          { label: 'home', href: '/' },
          { label: 'writing' }
        ]} 
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          writing
        </h1>
        <div className={styles.links}>
          <Link href="/writing/published" className={styles.subLink}>
            published
          </Link>
          <Link href="/writing/blog" className={styles.subLink}>
            blog
          </Link>
        </div>
      </div>
    </div>
  );
} 