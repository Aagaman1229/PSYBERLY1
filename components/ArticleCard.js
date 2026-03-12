 import Link from 'next/link';
import { FaHeart, FaComment } from 'react-icons/fa';
import styles from '../styles/ArticleCard.module.css';

export default function ArticleCard({ post }) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className={styles.card}>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className={styles.image} />
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link href={`/articles/${post.id}`}>{post.title}</Link>
        </h3>
        <p className={styles.description}>{post.description}</p>
        <div className={styles.meta}>
          <span className={styles.date}>{date}</span>
          <div className={styles.stats}>
            <span><FaHeart /> {post.likes_count || 0}</span>
            <span><FaComment /> {post.comments_count || 0}</span>
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