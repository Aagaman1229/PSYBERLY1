import { supabase } from '../lib/supabase';
import Hero from '../components/Hero';
import ArticlesSection from '../components/ArticlesSection';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <div className={styles.container}>
      <Hero />
      <ArticlesSection posts={posts || []} />
      <Footer />
    </div>
  );
}