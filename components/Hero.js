'use client';

import { useTheme } from './ThemeToggle';
import styles from '../styles/Hero.module.css';

export default function Hero() {
  const { darkMode } = useTheme();
  const imageSrc = darkMode ? '/inv_t_bg.png' : '/bg_transparent.png';

  return (
    <section className={styles.hero}>
      <img src={imageSrc} alt="Hero" className={styles.heroImage} />
      <div className={styles.descriptionContainer}>
        <p className={styles.description}>
          Discover amazing articles and stories
        </p>
      </div>
    </section>
  );
}