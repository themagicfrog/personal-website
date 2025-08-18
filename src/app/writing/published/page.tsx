'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { PublishedWork } from '../../../types/published';
import Breadcrumb from '../../../components/Breadcrumb';

export default function Published() {
  const [publishedWorks, setPublishedWorks] = useState<PublishedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublishedWorks = async () => {
      try {
        const response = await fetch('/api/published');
        if (!response.ok) {
          throw new Error('Failed to fetch published works');
        }
        const data = await response.json();
        setPublishedWorks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedWorks();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatWordCount = (words: number) => {
    if (words >= 1000) {
      return `${(words / 1000).toFixed(1)}k words`;
    }
    return `${words} words`;
  };

  return (
    <div className={styles.container}>
      <Breadcrumb 
        items={[
          { label: 'home', href: '/' },
          { label: 'writing', href: '/writing' },
          { label: 'published' }
        ]} 
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          published
        </h1>
        
        {loading && (
          <div className={styles.loading}>
            loading published works...
          </div>
        )}
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className={styles.worksContainer}>
            {publishedWorks.length === 0 ? (
              <div className={styles.noWorks}>
                no published works yet
              </div>
            ) : (
              publishedWorks.map((work) => (
                <div key={work.id} className={styles.workItem}>
                  <div className={styles.workHeader}>
                    <h2 className={styles.workTitle}>
                      {work.link ? (
                        <a href={work.link} target="_blank" rel="noopener noreferrer" className={styles.workLink}>
                          {work.title}
                        </a>
                      ) : (
                        work.title
                      )}
                    </h2>
                    <span className={styles.workTag}>{work.tag}</span>
                  </div>
                  
                  <p className={styles.workOneLiner}>{work.oneLiner}</p>
                  
                  <div className={styles.workMeta}>
                    <span className={styles.workDate}>{formatDate(work.date)}</span>
                    <span className={styles.workWords}>{formatWordCount(work.words)}</span>
                  </div>
                  
                  {work.description && (
                    <p className={styles.workDescription}>{work.description}</p>
                  )}
                  
                  {work.link && (
                    <a 
                      href={work.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.readButton}
                    >
                      read more
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
