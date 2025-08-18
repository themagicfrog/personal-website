'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { Photo } from '@/types/photography';
import Breadcrumb from '../../../components/Breadcrumb';

export default function CollectionPage() {
  const params = useParams();
  const collectionName = params.collection as string;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photography');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photography');
        }
        
        const allPhotos: Photo[] = await response.json();
        
        const collectionPhotos = allPhotos.filter(photo => 
          photo.collection && photo.collection.toLowerCase() === collectionName.toLowerCase()
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhoto]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Breadcrumb 
          items={[
            { label: 'home', href: '/' },
            { label: 'photography', href: '/photography' },
            { label: collectionName }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>Loading...</h1>
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
            { label: 'photography', href: '/photography' },
            { label: collectionName }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>Error</h1>
          <p className={styles.error}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.container}>
        <Breadcrumb 
          items={[
            { label: 'home', href: '/' },
            { label: 'photography', href: '/photography' },
            { label: collectionName }
          ]} 
        />
        <div className={styles.header}>
          <h1 className={styles.title}>collection not found</h1>
        </div>
      </div>
    );
  }

  const displayName = photos[0]?.collection || collectionName;

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumb 
        items={[
          { label: 'home', href: '/' },
          { label: 'photography', href: '/photography' },
          { label: displayName }
        ]} 
      />
      <div className={styles.header}>
        <h1 className={styles.title}>{displayName}</h1>
      </div>
      
      <div className={styles.photosGrid}>
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div 
              key={photo.id} 
              className={styles.photoCard}
              onClick={() => handlePhotoClick(photo)}
            >
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

      {/* Modal */}
      {selectedPhoto && (
        <div className={styles.modalOverlay} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ×
            </button>
            <div className={styles.modalImageContainer}>
              {selectedPhoto.image ? (
                <div 
                  className={styles.modalImage}
                  style={{ backgroundImage: `url(${selectedPhoto.image})` }}
                />
              ) : (
                <div className={styles.modalNoImage}>
                  <p>no image available</p>
                </div>
              )}
            </div>
            <div className={styles.modalInfo}>
              <h2 className={styles.modalTitle}>{selectedPhoto.title || 'no title'}</h2>
              <p className={styles.modalDate}>{selectedPhoto.date || 'no date'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
