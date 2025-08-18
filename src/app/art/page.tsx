'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { ArtPiece } from '@/types/art';
import Breadcrumb from '../../components/Breadcrumb';

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
        <Breadcrumb 
          items={[
            { label: 'home', href: '/' },
            { label: 'art' }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>art</h1>
          <p className={styles.loading}>loading art...</p>
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
            { label: 'art' }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>art</h1>
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
          { label: 'art' }
        ]} 
      />
      <div className={styles.header}>
        <h1 className={styles.title}>art</h1>
      </div>
      
      <div className={styles.artGrid}>
        {artPieces && artPieces.length > 0 ? (
          artPieces.map((artPiece) => (
            <div 
              key={artPiece.id} 
              className={styles.artCard}
            >
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
                    <p>no image available</p>
                  </div>
                )}
              </div>
              <div className={styles.artInfo}>
                <div className={styles.descriptionSection}>
                  <p className={styles.description}>{artPiece.description || 'no description'}</p>
                </div>
                <div className={styles.dateSection}>
                  <span className={styles.date}>{artPiece.date || 'no date'}</span>
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