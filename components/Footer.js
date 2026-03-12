'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>&copy; {new Date().getFullYear()} MySite. All rights reserved. Nepal</p>
      </div>
      {showButton && (
        <button onClick={scrollToTop} className={styles.scrollTop} aria-label="Back to top">
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
}