import styles from './page.module.css';
import Breadcrumb from '../../components/Breadcrumb';

const CODING_DESCRIPTION = "I enjoy building websites, games, apps and exploring new things! I'm part of Hack Club, a global community of high schoolers who build things.";

export default function Coding() {
  return (
    <div className={styles.container}>
      <Breadcrumb 
        items={[
          { label: 'home', href: '/' },
          { label: 'coding' }
        ]} 
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          coding
        </h1>
        <p className={styles.description}>{CODING_DESCRIPTION}</p>
      </div>
    </div>
  );
} 