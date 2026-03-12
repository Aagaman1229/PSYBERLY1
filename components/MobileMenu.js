'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from '../styles/MobileMenu.module.css';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={styles.mobileMenu}>
      <button onClick={toggleMenu} className={styles.hamburger} aria-label="Menu">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          <Link href="/" onClick={toggleMenu}>Home</Link>
          <Link href="/about" onClick={toggleMenu}>About</Link>
          <Link href="/articles" onClick={toggleMenu}>Articles</Link>
        </div>
      )}
    </div>
  );
}