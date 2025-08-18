import Link from 'next/link';
import styles from './BackButton.module.css';

interface BackButtonProps {
  href: string;
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href} className={styles.backButton}>
      ←
    </Link>
  );
}
