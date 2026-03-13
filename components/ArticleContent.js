'use client';

import { useEffect, useState, useRef } from 'react';
import { FaHeart, FaTwitter, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import styles from '../styles/ArticleContent.module.css';

const platformIcon = {
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedin,
  website: FaGlobe,
};

export default function ArticleContent({ post }) {
  const [viewCount, setViewCount] = useState(post.views);
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAuthorPopup, setShowAuthorPopup] = useState(false);
  const popupRef = useRef();

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAuthorPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // View count
  useEffect(() => {
    const viewedKey = `viewed_${post.id}`;
    const alreadyViewed = sessionStorage.getItem(viewedKey);
    if (!alreadyViewed) {
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

  // Liked state
  useEffect(() => {
    const likedStatus = localStorage.getItem(`liked_post_${post.id}`);
    if (likedStatus === 'true') setLiked(true);
  }, [post.id]);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    const newLikedState = !liked;
    const newLikes = newLikedState ? likes + 1 : likes - 1;

    setIsLiking(true);
    setLiked(newLikedState);
    setLikes(newLikes);
    localStorage.setItem(`liked_post_${post.id}`, newLikedState ? 'true' : 'false');

    const rpcFunction = newLikedState ? 'increment_post_likes' : 'decrement_post_likes';
    const { error } = await supabase.rpc(rpcFunction, { post_id: post.id });

    if (error) {
      console.error('Error toggling like:', error);
      setLiked(!newLikedState);
      setLikes(newLikedState ? likes : likes + 1);
      localStorage.setItem(`liked_post_${post.id}`, (!newLikedState).toString());
    }
    setIsLiking(false);
  };

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{post.title}</h1>

      {/* Compact author info with popup */}
      {post.author && (
        <div className={styles.authorCompact} ref={popupRef}>
          <button onClick={() => setShowAuthorPopup(!showAuthorPopup)} className={styles.authorButton}>
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

      <div className={styles.meta}>
        <span className={styles.date}>{date}</span>
        <span className={styles.views}>👁️ {viewCount} views</span>
        <button
          onClick={handleLikeToggle}
          className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
          disabled={isLiking}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <FaHeart /> {likes}
        </button>
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