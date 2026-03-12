'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import styles from '../styles/ArticleCard.module.css';

export default function ArticleCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    // Check if this post has been liked in this browser
    const likedStatus = localStorage.getItem(`liked_post_${post.id}`);
    if (likedStatus === 'true') {
      setLiked(true);
    }
  }, [post.id]);

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (liked || isLiking) return;

    setIsLiking(true);
    // Optimistic update
    setLikes(likes + 1);
    setLiked(true);
    localStorage.setItem(`liked_post_${post.id}`, 'true');

    const { error } = await supabase.rpc('increment_post_likes', {
      post_id: post.id,
    });

    if (error) {
      console.error('Error liking post:', error);
      // Revert
      setLikes(likes);
      setLiked(false);
      localStorage.removeItem(`liked_post_${post.id}`);
    }
    setIsLiking(false);
  };

  return (
    <article className={styles.card}>
      {post.cover_image && (
        <Link href={`/articles/${post.id}`}>
          <img src={post.cover_image} alt={post.title} className={styles.image} />
        </Link>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link href={`/articles/${post.id}`}>{post.title}</Link>
        </h3>
        <p className={styles.description}>{post.description}</p>
        <div className={styles.meta}>
          <span className={styles.date}>{date}</span>
          <div className={styles.stats}>
            <button
              onClick={handleLike}
              className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
              disabled={liked}
            >
              <FaHeart /> {likes}
            </button>
            <Link href={`/articles/${post.id}#comments`} className={styles.commentLink}>
              <FaComment /> {post.comments_count || 0}
            </Link>
          </div>
        </div>
        <div className={styles.tags}>
          {post.tags && post.tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}