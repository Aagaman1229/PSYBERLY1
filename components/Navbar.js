'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle, { useTheme } from './ThemeToggle'; // import useTheme
import MobileMenu from './MobileMenu';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { darkMode } = useTheme(); // get current theme
  const logoSrc = darkMode ? '/logo-dark.png' : '/logo-light.png';

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo with theme support */}
        <Link href="/" className={styles.logo}>
          <Image src={logoSrc} alt="Logo" width={40} height={40} />
          <span>Psyberly</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/articles">Articles</Link>
        </div>

        {/* Theme Toggle (visible on desktop) */}
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </nav>
  );
}