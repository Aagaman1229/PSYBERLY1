import { supabase } from '../../../lib/supabase';
import ArticleContent from '../../../components/ArticleContent';
import CommentSection from '../../../components/CommentSection';
import { notFound } from 'next/navigation';
import styles from '../../../styles/ArticlePage.module.css';

export default async function ArticlePage({ params }) {
  // ✅ Await the params promise
  const { id } = await params;

  // Fetch post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound(); // shows 404 page
  }

  // Fetch comments for this post, sorted by latest first
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: false });

  if (commentsError) {
    console.error('Error fetching comments:', commentsError);
  }

  return (
    <div className={styles.container}>
      <ArticleContent post={post} />
      <CommentSection postId={id} initialComments={comments || []} />
    </div>
  );
}