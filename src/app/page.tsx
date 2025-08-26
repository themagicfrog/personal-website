'use client';

import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Opening from '../components/opening';
import Model3D from '../components/Model3D';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const pageContainer = document.querySelector(`.${styles.pageContainer}`) as HTMLElement;
      if (pageContainer) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          const scrollAmount = e.deltaY * 3;
          pageContainer.scrollLeft += scrollAmount;
        }
        else if (Math.abs(e.deltaX) > 0) {
          e.preventDefault();
          const scrollAmount = e.deltaX * 3;
          pageContainer.scrollLeft += scrollAmount;
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const scrollToProjects = () => {
    const projectsSection = document.querySelector(`.${styles.projectsSection}`);
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showWelcome) {
    return <Opening onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.leftSection}>
          <div className={styles.modelContainer}>
            <Model3D />
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.centerSection}>
            <h1 className={styles.title}>estella gu</h1>
            <p className={styles.intro}>
              hello! i&apos;m a high school programmer, artist, and writer from Massachusetts. i enjoy music, hiking, and reading.
            </p>
            <div className={styles.navigationLinks}>
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
            <div className={styles.socialLinks}>
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
        </div>
        
        <div className={styles.scrollContainer}>
          <button onClick={scrollToProjects} className={styles.scrollArrow}>
            <div className={styles.vArrow}></div>
          </button>
        </div>
        
        <div className={styles.projectsSection}>
          <h2 className={styles.projectsTitle}>projects</h2>
          <p className={styles.projectsDescription}>
            here are some of the things i&apos;ve been working on.
          </p>
          <div className={styles.projectsGrid}>
            <div className={styles.projectCard}>
              <h3 className={styles.projectName}>project 1</h3>
              <p className={styles.projectDescription}>
                asdfasdfasdfasdfasdf
              </p>
            </div>
            <div className={styles.projectCard}>
              <h3 className={styles.projectName}>coming soon</h3>
              <p className={styles.projectDescription}>
                more things!!!
              </p>
            </div>
          </div>
          <Link href="/projects" className={styles.viewAllProjects}>
            view all projects →
          </Link>
        </div>
      </div>
    </div>
  );
}
