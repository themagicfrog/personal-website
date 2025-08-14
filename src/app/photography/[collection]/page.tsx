'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { Photo } from '@/types/photography';

export default function CollectionPage() {
  const params = useParams();
  const collectionName = params.collection as string;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photography');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photography');
        }
        
        const allPhotos: Photo[] = await response.json();
        
        const collectionPhotos = allPhotos.filter(photo => 
          photo.collection.toLowerCase() === collectionName.toLowerCase()
        );
        
        setPhotos(collectionPhotos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [collectionName]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Loading...</h1>
          <Link href="/photography" className={styles.backLink}>
            back to collections
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Error</h1>
          <p className={styles.error}>Error: {error}</p>
          <Link href="/photography" className={styles.backLink}>
            back to collections
          </Link>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>collection not found</h1>
          <Link href="/photography" className={styles.backLink}>
            back to collections
          </Link>
        </div>
      </div>
    );
  }

  const displayName = photos[0]?.collection || collectionName;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{displayName}</h1>
        <Link href="/photography" className={styles.backLink}>
          back to collections
        </Link>
      </div>
      
      <div className={styles.photosGrid}>
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className={styles.photoCard}>
              <div className={styles.imageContainer}>
                {photo.image ? (
                  <div 
                    className={styles.photoImage}
                    style={{ backgroundImage: `url(${photo.image})` }}
                  />
                ) : (
                  <div className={styles.noImage}>
                    <p>no image available</p>
                  </div>
                )}
              </div>
              <div className={styles.polaroidInfo}>
                <p className={styles.polaroidTitle}>{photo.title || 'no title'}</p>
                <p className={styles.polaroidDate}>{photo.date || 'no date'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noPhotos}>
            <p>no photos found</p>
          </div>
        )}
      </div>
    </div>
  );
}
