'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaHeart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import styles from '../styles/CommentSection.module.css';

export default function CommentSection({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [sortBy, setSortBy] = useState('latest');
  const [visibleCount, setVisibleCount] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState({});

  // Load liked status from localStorage on mount
  useEffect(() => {
    const liked = {};
    comments.forEach(comment => {
      const status = localStorage.getItem(`liked_comment_${comment.id}`);
      if (status === 'true') liked[comment.id] = true;
    });
    setLikedComments(liked);
  }, [comments]);

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return b.likes - a.likes;
    }
  });

  const visibleComments = sortedComments.slice(0, visibleCount);
  const hasMore = visibleCount < sortedComments.length;

  const toggleSort = () => {
    setSortBy(prev => prev === 'latest' ? 'top' : 'latest');
  };

  const handleLike = async (commentId) => {
    // Check if already liked
    if (likedComments[commentId]) return;

    // Optimistic update
    setComments(prev =>
      prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
    );
    setLikedComments(prev => ({ ...prev, [commentId]: true }));
    localStorage.setItem(`liked_comment_${commentId}`, 'true');

    const { error } = await supabase.rpc('increment_comment_likes', {
      comment_id: commentId,
    });
    if (error) {
      console.error('Error liking comment:', error);
      // Revert
      setComments(prev =>
        prev.map(c => c.id === commentId ? { ...c, likes: c.likes - 1 } : c)
      );
      setLikedComments(prev => {
        const newLiked = { ...prev };
        delete newLiked[commentId];
        return newLiked;
      });
      localStorage.removeItem(`liked_comment_${commentId}`);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const tempId = Date.now().toString();
    const optimisticComment = {
      id: tempId,
      post_id: postId,
      content: newComment,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [optimisticComment, ...prev]);
    setNewComment('');
    setSubmitting(false);

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, content: newComment }])
      .select();

    if (error) {
      console.error('Error posting comment:', error);
      setComments(prev => prev.filter(c => c.id !== tempId));
    } else {
      setComments(prev =>
        prev.map(c => c.id === tempId ? data[0] : c)
      );
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Comments ({comments.length})</h2>
        <button onClick={toggleSort} className={styles.sortToggle} title={`Sort by ${sortBy === 'latest' ? 'top' : 'latest'}`}>
          {sortBy === 'latest' ? <FaArrowDown /> : <FaArrowUp />}
          <span>{sortBy === 'latest' ? 'Latest' : 'Top'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmitComment} className={styles.form}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={styles.input}
        />
        <button type="submit" disabled={submitting} className={styles.submitButton}>
          Post
        </button>
      </form>

      <div className={styles.commentsList}>
        {visibleComments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <p className={styles.commentContent}>{comment.content}</p>
            <button
              onClick={() => handleLike(comment.id)}
              className={`${styles.likeButton} ${likedComments[comment.id] ? styles.liked : ''}`}
              disabled={likedComments[comment.id]}
            >
              <FaHeart /> {comment.likes}
            </button>
          </div>
        ))}
        {hasMore && (
          <button onClick={() => setVisibleCount(prev => prev + 5)} className={styles.viewMore}>
            View more comments
          </button>
        )}
        {sortedComments.length === 0 && (
          <p className={styles.noComments}>No comments yet. Be the first!</p>
        )}
      </div>
      <p className={styles.anonymousNote}>All comments are anonymous</p>
    </section>
  );
}