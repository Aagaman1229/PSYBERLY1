'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaHeart, FaComment, FaTwitter, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import styles from '../styles/ArticleCard.module.css';

const platformIcon = {
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedin,
  website: FaGlobe,
};

export default function ArticleCard({ post, featured = false }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAuthorPopup, setShowAuthorPopup] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAuthorPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const likedStatus = localStorage.getItem(`liked_post_${post.id}`);
    if (likedStatus === 'true') setLiked(true);
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
    setLikes(likes + 1);
    setLiked(true);
    localStorage.setItem(`liked_post_${post.id}`, 'true');

    const { error } = await supabase.rpc('increment_post_likes', { post_id: post.id });
    if (error) {
      console.error('Error liking post:', error);
      setLikes(likes);
      setLiked(false);
      localStorage.removeItem(`liked_post_${post.id}`);
    }
    setIsLiking(false);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
  };

  const toggleAuthorPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAuthorPopup(!showAuthorPopup);
  };

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <Link href={`/articles/${post.id}`} className={styles.cardLink} aria-label={post.title} />

      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className={featured ? styles.featuredImage : styles.image}
        />
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{post.title}</h3>
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
            <Link
              href={`/articles/${post.id}#comments`}
              className={styles.commentLink}
              onClick={handleCommentClick}
            >
              <FaComment /> {post.comments_count || 0}
            </Link>
          </div>
        </div>

        <div className={styles.tags}>
          {post.tags && post.tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>

        {/* Author section with popup */}
        {post.author && (
          <div className={styles.authorContainer} ref={popupRef}>
            <button onClick={toggleAuthorPopup} className={styles.authorButton}>
              {post.author.avatar_url && (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  className={styles.authorAvatar}
                />
              )}
              <span className={styles.authorName}>{post.author.name}</span>
            </button>

            {showAuthorPopup && (
              <div className={styles.authorPopup}>
                <h4>{post.author.name}</h4>
                {post.author.bio && <p className={styles.authorBio}>{post.author.bio}</p>}
                <div className={styles.authorLinks}>
                  {post.author.social_links && post.author.social_links.map((link, index) => {
                    const Icon = platformIcon[link.platform] || FaGlobe;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.authorLink}
                        title={link.platform}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}