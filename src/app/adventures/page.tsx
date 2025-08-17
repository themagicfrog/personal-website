'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Adventure } from '@/types/adventure';

export default function Adventures() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const response = await fetch('/api/adventures');
        
        if (!response.ok) {
          throw new Error('Failed to fetch adventures');
        }
        const data = await response.json();
        setAdventures(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>adventures</h1>
          <p className={styles.loading}>loading adventures...</p>
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
        <div className={styles.header}>
          <h1 className={styles.title}>adventures</h1>
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
        <h1 className={styles.title}>adventures</h1>
        <Link href="/" className={styles.backLink}>
          back to home
        </Link>
      </div>
      
      <div className={styles.adventuresGrid}>
        {adventures && adventures.length > 0 ? (
          adventures.map((adventure) => (
            <div 
              key={adventure.id} 
              className={styles.adventureCard}
            >
              <div className={styles.adventureHeader}>
                <div className={styles.adventureInfo}>
                  <h2 className={styles.adventureName}>{adventure.name}</h2>
                </div>
                <div className={styles.dateContainer}>
                  <span className={styles.date}>{adventure.date}</span>
                </div>
              </div>
              
              {adventure.images && adventure.images.length > 0 ? (
                <div className={styles.imageContainer}>
                  <ImageCarousel images={adventure.images} />
                </div>
              ) : (
                <div className={styles.noImage}>
                  <p>no images available</p>
                </div>
              )}
              
              <p className={styles.adventureDescription}>
                {adventure.description}
              </p>
            </div>
          ))
        ) : (
          <div className={styles.noAdventures}>
            <p>no adventures found</p>
          </div>
        )}
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
        alt={`Adventure image ${currentImageIndex + 1}`}
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