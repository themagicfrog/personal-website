'use client';

import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Opening from '../components/opening';

const Model3D = dynamic(() => import('../components/Model3D'), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '500px', 
      height: '420px', 
      margin: '1rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
      fontSize: '1rem'
    }}>
      loading 3D model...
    </div>
  )
});

export default function Home() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
    
    const hasSeenOpening = sessionStorage.getItem('hasSeenOpening');
    
    if (!hasSeenOpening) {
      setShowWelcome(true);
      
      sessionStorage.setItem('hasSeenOpening', 'true');
    }

    const timer = setTimeout(() => {
      setIsModelReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <Opening onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <h1 className={styles.title}>
            estella gu
          </h1>
          <p className={styles.intro}>
            hello! i&apos;m a high school programmer, artist, and writer from Massachusetts.
          </p>
          <div className={styles.socialLinks}>
            <span className={styles.findMe}>find me:</span>
            <a href="https://github.com/themagicfrog" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Image src="/github.svg" alt="GitHub" className={styles.socialIcon} width={24} height={24} />
              github
            </a>
            <a href="https://www.linkedin.com/in/estellagu/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Image src="/linkedin.png" alt="LinkedIn" className={styles.socialIcon} width={24} height={24} />
              linkedin
            </a>
            <a href="https://open.spotify.com/user/31mtq5inpuxt2bnkyzsihnksioky?si=6a34d73d32b24ce7" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Image src="/spotify.png" alt="Spotify" className={styles.socialIcon} width={24} height={24} />
              spotify
            </a>
            <a href="https://www.instagram.com/estella.g.42/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Image src="/instagram.webp" alt="Instagram" className={styles.socialIcon} width={24} height={24} />
              instagram
            </a>
            <a href="https://scrapbook.hackclub.com/magicfrog" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Image src="/hackclub.png" alt="Hack Club" className={styles.socialIcon} width={24} height={24} />
              hack club
            </a>
          </div>
        </div>
        
        <div className={styles.centerSection}>
          {isModelReady && <Model3D modelPath="/cat.glb" />}
        </div>
        
        <div className={styles.rightSection}>
          <Link href="/projects" className={styles.projectsLink}>
            projects
          </Link>
          <Link href="/art" className={styles.projectsLink}>
            art
          </Link>
          <Link href="/photography" className={styles.projectsLink}>
            photography
          </Link>
          <Link href="/adventures" className={styles.projectsLink}>
            adventures
          </Link>
          <Link href="/writing" className={styles.projectsLink}>
            writing
          </Link>
          <Link href="/coding" className={styles.projectsLink}>
            coding
          </Link>
        </div>
      </div>
    </div>
  );
}
