'use client';

import { useState } from 'react';
import ArticleCard from './ArticleCard';
import styles from '../styles/ArticlesSection.module.css';

export default function ArticlesSection({ posts }) {
  const [activeTab, setActiveTab] = useState('latest');

  // Define filter/sort logic for each tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'latest':
        return posts; // already sorted by created_at desc
      case 'trending':
        // Replace with your own logic – e.g., most commented
        return [...posts].reverse();
      case 'hot':
        // Replace with your own logic – e.g., most liked
        return [...posts].sort((a, b) => (a.likes || 0) - (b.likes || 0)).reverse();
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();

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
      <div className={styles.grid}>
        {filteredPosts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}