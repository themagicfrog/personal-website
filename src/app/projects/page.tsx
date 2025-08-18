'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import Breadcrumb from '../../components/Breadcrumb';

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
        setProjects(data || []);
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
        <Breadcrumb 
          items={[
            { label: 'home', href: '/' },
            { label: 'projects' }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>projects</h1>
          <p className={styles.loading}>loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Breadcrumb 
          items={[
            { label: 'home', href: '/' },
            { label: 'projects' }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>projects</h1>
          <p className={styles.error}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb 
        items={[
          { label: 'home', href: '/' },
          { label: 'projects' }
        ]} 
      />
      <div className={styles.header}>
        <h1 className={styles.title}>projects</h1>
      </div>
      
      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <div className={styles.projectInfo}>
                <h2 className={styles.projectName}>{project.name}</h2>
                <p className={styles.oneLiner}>{project.oneLiner}</p>
              </div>
              {project.date && (
                <div className={styles.dateContainer}>
                  <span className={styles.date}>{project.date}</span>
                </div>
              )}
            </div>
            
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