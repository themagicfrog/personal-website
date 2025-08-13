'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        console.log('Fetched projects:', data); 
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>projects</h1>
          <p className={styles.loading}>loading projects...</p>
          <Link href="/" className={styles.backLink}>
            back to home
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>projects</h1>
          <p className={styles.error}>Error: {error}</p>
          <Link href="/" className={styles.backLink}>
            back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>projects</h1>
        <Link href="/" className={styles.backLink}>
          back to home
        </Link>
      </div>
      
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <h2 className={styles.projectName}>{project.name}</h2>
            <p className={styles.oneLiner}>{project.oneLiner}</p>
            
            {project.images && project.images.length > 0 ? (
              <div className={styles.imageContainer}>
                <ImageCarousel images={project.images} />
              </div>
            ) : (
              <div className={styles.noImage}>
                <p>No images available</p>
              </div>
            )}
            
            <p className={styles.projectDescription}>{project.description}</p>
            
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.seeMoreLink}
              >
                see more
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageCarousel({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<number[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || !isHovering) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  const handleImageError = (index: number) => {
    setImageError(prev => [...prev, index]);
  };

  const validImages = images.filter((_, index) => !imageError.includes(index));

  if (validImages.length === 0) {
    return (
      <div className={styles.noImage}>
        <p>Images failed to load</p>
      </div>
    );
  }

  return (
    <div 
      className={styles.carouselContainer}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0); 
      }}
    >
      <Image
        src={validImages[currentImageIndex]}
        alt={`Project image ${currentImageIndex + 1}`}
        className={styles.carouselImage}
        onError={() => handleImageError(currentImageIndex)}
        width={400}
        height={250}
        style={{ objectFit: 'cover' }}
        unoptimized
      />
      {validImages.length > 1 && isHovering && (
        <div className={styles.carouselDots}>
          {validImages.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 