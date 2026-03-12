'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/ArticleContent.module.css';

export default function ArticleContent({ post }) {
  const [viewCount, setViewCount] = useState(post.views);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    // Check if we've already recorded a view for this post in this session
    const viewedKey = `viewed_${post.id}`;
    const alreadyViewed = sessionStorage.getItem(viewedKey);

    if (!alreadyViewed) {
      // Not viewed yet: increment and mark
      const incrementViews = async () => {
        const { error } = await supabase.rpc('increment_post_views', { post_id: post.id });
        if (!error) {
          setViewCount(prev => prev + 1);
          sessionStorage.setItem(viewedKey, 'true');
        }
      };
      incrementViews();
    }
  }, [post.id]);

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.meta}>
        <span className={styles.date}>{date}</span>
        <span className={styles.views}>👁️ {viewCount} views</span>
      </div>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className={styles.coverImage} />
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}