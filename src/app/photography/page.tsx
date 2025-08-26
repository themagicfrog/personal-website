'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { Photo, PhotoCollection } from '@/types/photography';
import Breadcrumb from '../../components/Breadcrumb';

const PHOTOGRAPHY_DESCRIPTION = "I love taking photography! In general, I take photos of document where I go and to capture interesting things I see. I like street photography. The photography below is organized into collcetions, based on location and theme. Hope you enjoy!";

export default function Photography() {
  const [collections, setCollections] = useState<PhotoCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photography');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photography');
        }
        
        const photos: Photo[] = await response.json();
        
        const groupedPhotos = photos.reduce((acc, photo) => {
          const collection = photo.collection;
          if (!acc[collection]) {
            acc[collection] = [];
          }
          acc[collection].push(photo);
          return acc;
        }, {} as Record<string, Photo[]>);

        const collectionsArray: PhotoCollection[] = Object.entries(groupedPhotos).map(([name, photos]) => ({
          name,
          photos
        }));

        setCollections(collectionsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Breadcrumb 
          items={[
            { label: 'home', href: '/' },
            { label: 'photography' }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>photography</h1>
          <p className={styles.description}>{PHOTOGRAPHY_DESCRIPTION}</p>
          <p className={styles.loading}>loading collections...</p>
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
            { label: 'photography' }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>photography</h1>
          <p className={styles.description}>{PHOTOGRAPHY_DESCRIPTION}</p>
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
          { label: 'photography' }
        ]} 
      />
      <div className={styles.header}>
        <h1 className={styles.title}>photography</h1>
        <p className={styles.description}>{PHOTOGRAPHY_DESCRIPTION}</p>
      </div>
      
      <div className={styles.collectionsGrid}>
        {collections && collections.length > 0 ? (
          collections.map((collection) => (
            <Link 
              key={collection.name} 
              href={`/photography/${collection.name.toLowerCase()}`}
              className={styles.collectionCard}
            >
              <div className={styles.imageContainer}>
                {collection.photos.length > 0 ? (
                  <div className={styles.imageCarousel}>
                    {collection.photos.slice(0, 3).map((photo) => (
                      <div 
                        key={photo.id} 
                        className={styles.carouselImage}
                        style={{ 
                          backgroundImage: `url(${photo.image})`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noImage}>
                    <p>no images available</p>
                  </div>
                )}
              </div>
              <div className={styles.collectionInfo}>
                <h2 className={styles.collectionTitle}>{collection.name}</h2>
                <p className={styles.photoCount}>
                  {collection.photos.length} photo{collection.photos.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.noCollections}>
            <p>no collections found</p>
          </div>
        )}
      </div>
    </div>
  );
}
