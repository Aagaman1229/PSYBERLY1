'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { supabase } from '../lib/supabase';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import styles from '../styles/ArticlesPageClient.module.css';

export default function ArticlesPageClient({ initialPosts, availableTags }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const observerRef = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  // Build the base query with filters
  const buildQuery = (from, to) => {
    let query = supabase
      .from('posts')
      .select('*, author:author_id(*)')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (selectedTags.length > 0) {
      // Use overlaps (&&) for OR condition: posts that contain any of the selected tags
      query = query.overlaps('tags', selectedTags);
    }
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }
    return query;
  };

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const from = nextPage * 10;
    const to = from + 9;

    const { data: newPosts, error } = await buildQuery(from, to);

    if (error) {
      console.error(error);
      setHasMore(false);
    } else {
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(nextPage);
      }
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);

    const { data, error } = await buildQuery(0, 9);

    if (error) {
      console.error(error);
    } else {
      setPosts(data || []);
      setHasMore((data?.length || 0) === 10);
    }
    setLoading(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    // After toggling, reset and search with new tags
    setPosts([]);
    setPage(0);
    setHasMore(true);
    // We'll call handleSearch after state update; but since setSelectedTags is async,
    // we need to use the updated value. Use setTimeout or a function.
    // Simpler: pass the new tags directly to a search function.
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    performSearchWithTags(newTags, searchTerm);
  };

  const performSearchWithTags = async (tags, term) => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, author:author_id(*)')
      .order('created_at', { ascending: false })
      .range(0, 9);

    if (tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
    if (term) {
      query = query.ilike('title', `%${term}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      setPosts(data || []);
      setHasMore((data?.length || 0) === 10);
    }
    setLoading(false);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    // Reset and fetch all
    setPosts([]);
    setPage(0);
    setHasMore(true);
    performSearchWithTags([], '');
  };

  // For the initial render, we already have initialPosts; but after any filter change we call search.
  // To avoid duplication, we can call performSearchWithTags on mount? Not needed because we have initialPosts.
  // However, when the component first mounts, the state is as given. The search functions replace the list.

  // Helper to know if any filter is active
  const hasActiveFilters = selectedTags.length > 0 || searchTerm;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Articles</h1>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <FaSearch />
          </button>
        </form>

        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filter
          {hasActiveFilters && <span className={styles.filterBadge} />}
        </button>

        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <h4>Filter by category</h4>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className={styles.clearButton}>
                  <FaTimes /> Remove all
                </button>
              )}
            </div>
            <div className={styles.tagList}>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tag} ${selectedTags.includes(tag) ? styles.activeTag : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostRef} key={post.id}>
                <ArticleCard post={post} />
              </div>
            );
          } else {
            return <ArticleCard key={post.id} post={post} />;
          }
        })}
      </div>

      {loading && <p className={styles.loading}>Loading more articles...</p>}
      {!hasMore && posts.length > 0 && (
        <p className={styles.endMessage}>You've reached the end 🎉</p>
      )}
    </div>
  );
}