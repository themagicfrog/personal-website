import styles from './page.module.css';
import Breadcrumb from '../../../components/Breadcrumb';

export default function Blog() {
  return (
    <div className={styles.container}>
      <Breadcrumb 
        items={[
          { label: 'home', href: '/' },
          { label: 'writing', href: '/writing' },
          { label: 'blog' }
        ]} 
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          blog
        </h1>
      </div>
    </div>
  );
}
