import { supabase } from '../../../lib/supabase';
import ArticleContent from '../../../components/ArticleContent';
import CommentSection from '../../../components/CommentSection';
import { notFound } from 'next/navigation';
import styles from '../../../styles/ArticlePage.module.css';

export default async function ArticlePage({ params }) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from('posts')
    .select('*, author:author_id(*)')
    .eq('id', id)
    .single();

  if (error || !post) notFound();

  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: false });

  if (commentsError) console.error('Error fetching comments:', commentsError);

  return (
    <div className={styles.container}>
      <ArticleContent post={post} />
      <CommentSection postId={id} initialComments={comments || []} />
    </div>
  );
}