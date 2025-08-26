import styles from './page.module.css';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';

const WRITING_DESCRIPTION = "I like writing short stories, especially in scifi and mystery. I also like to write blogs sometimes about my experiences and thoughts.";

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
        <p className={styles.description}>{WRITING_DESCRIPTION}</p>
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