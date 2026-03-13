'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import ArticleCard from './ArticleCard';
import styles from '../styles/ArticlesSection.module.css';

export default function ArticlesSection({ posts }) {
  const [activeTab, setActiveTab] = useState('latest');

  // Memoized sorting based on active tab
  const sortedPosts = useMemo(() => {
    switch (activeTab) {
      case 'latest':
        return [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'trending':
        // Most comments (or could be views – adjust as needed)
        return [...posts].sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
      case 'hot':
        // Most likes
        return [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return posts;
    }
  }, [posts, activeTab]);

  // Take only first 4
  const displayedPosts = sortedPosts.slice(0, 4);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Articles</h2>
      <div className={styles.tabs}>
        {['latest', 'trending', 'hot'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.gridContainer}>
        {displayedPosts.map((post, index) => (
          <div
            key={post.id}
            className={index === 0 ? styles.featuredCard : styles.regularCard}
          >
            <ArticleCard post={post} featured={index === 0} />
          </div>
        ))}
      </div>

      {posts.length > 4 && (
        <div className={styles.viewMoreContainer}>
          <Link href={`/articles?tab=${activeTab}`} className={styles.viewMoreButton}>
            View More {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Articles
          </Link>
        </div>
      )}
    </section>
  );
}