import { supabase } from '../../lib/supabase';
import ArticlesPageClient from '../../components/ArticlesPageClient';

export default async function ArticlesPage() {
  const { data: initialPosts, error } = await supabase
    .from('posts')
    .select('*, author:author_id(*)')
    .order('created_at', { ascending: false })
    .range(0, 9);

  const { data: allTags } = await supabase
    .from('posts')
    .select('tags');

  const tagSet = new Set();
  allTags?.forEach(post => {
    post.tags?.forEach(tag => tagSet.add(tag));
  });
  const availableTags = Array.from(tagSet).sort();

  return (
    <ArticlesPageClient
      initialPosts={initialPosts || []}
      availableTags={availableTags}
    />
  );
}