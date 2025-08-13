'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { ArtPiece } from '@/types/art';

export default function Art() {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const response = await fetch('/api/art');
        
        if (!response.ok) {
          throw new Error('Failed to fetch art');
        }
        const data = await response.json();
        console.log('Fetched art:', data);
        setArtPieces(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArt();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>art</h1>
          <p className={styles.loading}>loading art...</p>
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
          <h1 className={styles.title}>art</h1>
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
        <h1 className={styles.title}>art</h1>
        <Link href="/" className={styles.backLink}>
          back to home
        </Link>
      </div>
      
      <div className={styles.artGrid}>
        {artPieces && artPieces.length > 0 ? (
          artPieces.map((artPiece) => (
            <div key={artPiece.id} className={styles.artCard}>
              <div className={styles.imageContainer}>
                {artPiece.image ? (
                  <Image
                    src={artPiece.image}
                    alt="Art piece"
                    className={styles.artImage}
                    width={400}
                    height={400}
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                ) : (
                  <div className={styles.noImage}>
                    <p>No image available</p>
                  </div>
                )}
              </div>
              <div className={styles.descriptionOverlay}>
                <div className={styles.overlayContent}>
                  <div className={styles.dateSection}>
                    <span className={styles.date}>{artPiece.date || 'No date'}</span>
                  </div>
                  <div className={styles.descriptionSection}>
                    <p className={styles.description}>{artPiece.description || 'No description'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noArt}>
            <p>no art found</p>
          </div>
        )}
      </div>
    </div>
  );
} 