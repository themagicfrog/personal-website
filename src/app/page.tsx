'use client';

import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Opening from '../components/opening';
import Model3D from '../components/Model3D';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [homePageVisits, setHomePageVisits] = useState(0);
  const fullText = "scroll right to sail boat →";

  useEffect(() => {
    setViewportWidth(window.innerWidth);
    
    let timer: NodeJS.Timeout | null = null;
    let typeTimer: NodeJS.Timeout | null = null;
    
    const currentVisits = parseInt(localStorage.getItem('homePageVisits') || '0');
    console.log('Current visits:', currentVisits);
    console.log('fadeIn state:', fadeIn);
    console.log('typedText state:', typedText);
    
    if (currentVisits === 0) {
      console.log('Showing intro sequence');
      timer = setTimeout(() => {
        console.log('Setting fadeIn to false');
        setFadeIn(false);
      }, 1500);

      typeTimer = setTimeout(() => {
        console.log('Starting typing animation');
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex < fullText.length) {
            setTypedText(fullText.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            console.log('Typing animation complete');
          }
        }, 100);
      }, 2000);
    } else {
      console.log('Skipping intro, going to main content');
      setFadeIn(false);
      setTypedText(fullText);
      const pageContainer = document.querySelector(`.${styles.pageContainer}`) as HTMLElement;
      if (pageContainer) {
        const scrollToHome = () => {
          if (window.innerWidth > 0) {
            pageContainer.scrollLeft = window.innerWidth * 2;
            setScrollPosition(window.innerWidth * 2);
          } else {
            setTimeout(scrollToHome, 10);
          }
        };
        scrollToHome();
      }
    }
    
    const handleWheel = (e: WheelEvent) => {
      const pageContainer = document.querySelector(`.${styles.pageContainer}`) as HTMLElement;
      if (pageContainer) {
        e.preventDefault();
        let scrollAmount = 0;
        
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          scrollAmount = e.deltaY * 1.5;
        } else {
          scrollAmount = e.deltaX * 1.5;
        }
        
        pageContainer.scrollLeft += scrollAmount;
        setScrollPosition(pageContainer.scrollLeft);
      }
    };

    const handleScroll = () => {
      const pageContainer = document.querySelector(`.${styles.pageContainer}`) as HTMLElement;
      if (pageContainer) {
        setScrollPosition(pageContainer.scrollLeft);
      }
    };

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const pageContainer = document.querySelector(`.${styles.pageContainer}`) as HTMLElement;
      if (pageContainer) {
        if (e.code === 'Space' || e.code === 'ArrowRight') {
          e.preventDefault();
          pageContainer.scrollTo({
            left: pageContainer.scrollLeft + 200,
            behavior: 'smooth'
          });
          setScrollPosition(pageContainer.scrollLeft);
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          pageContainer.scrollTo({
            left: pageContainer.scrollLeft - 200,
            behavior: 'smooth'
          });
          setScrollPosition(pageContainer.scrollLeft);
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (timer) clearTimeout(timer);
      if (typeTimer) clearTimeout(typeTimer);
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

  const handleNavigationClick = (path: string) => {
    // Increment the counter when navigating to another page
    const currentVisits = parseInt(localStorage.getItem('homePageVisits') || '0');
    localStorage.setItem('homePageVisits', (currentVisits + 1).toString());
    // Navigate to the page
    window.location.href = path;
  };

  if (showWelcome) {
    return <Opening onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className={styles.pageContainer}>
      {fadeIn && <div className={styles.fadeOverlay}></div>}
      <div className={styles.mainContent}>
        <div className={styles.introSection}>
          <div className={styles.scrollText}>{typedText}</div>
          <div className={styles.clouds}>
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud1} width={180} height={90} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud2} width={135} height={67} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud3} width={225} height={112} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud4} width={157} height={78} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud9} width={140} height={70} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud10} width={200} height={100} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud11} width={120} height={60} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud12} width={170} height={85} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud13} width={110} height={55} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud14} width={160} height={80} />
          </div>
          <div className={styles.waterContainer}>
            <div 
              className={styles.water} 
              style={{
                animationDuration: `${Math.max(0.5, 3 - (scrollPosition / 1000))}s`
              }}
            ></div>
          </div>
          {scrollPosition < viewportWidth * 1.5 && (
            <Image 
              src="/boat.png" 
              alt="Boat" 
              className={styles.boat} 
              width={300} 
              height={150}
            />
          )}
        </div>
        
        <div className={styles.blackSection}>
          <div className={styles.clouds}>
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud5} width={202} height={100} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud6} width={168} height={84} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud7} width={145} height={72} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud8} width={190} height={95} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud15} width={130} height={65} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud16} width={185} height={92} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud17} width={150} height={75} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud18} width={175} height={87} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud19} width={125} height={62} />
            <Image src="/cloud.png" alt="Cloud" className={styles.cloud20} width={195} height={97} />
          </div>
          <div className={styles.waterContainer}>
            <div className={styles.water}></div>
          </div>
        </div>
        
        <div className={styles.homeSection}>
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
                <button onClick={() => handleNavigationClick('/projects')} className={styles.projectsLink}>
                  projects
                </button>
                <button onClick={() => handleNavigationClick('/art')} className={styles.projectsLink}>
                  art
                </button>
                <button onClick={() => handleNavigationClick('/photography')} className={styles.projectsLink}>
                  photography
                </button>
                <button onClick={() => handleNavigationClick('/adventures')} className={styles.projectsLink}>
                  adventures
                </button>
                <button onClick={() => handleNavigationClick('/writing')} className={styles.projectsLink}>
                  writing
                </button>
                <button onClick={() => handleNavigationClick('/coding')} className={styles.projectsLink}>
                  coding
                </button>
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
    </div>
  );
}
