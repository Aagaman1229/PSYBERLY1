'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // import hook
import ThemeToggle, { useTheme } from './ThemeToggle';
import MobileMenu from './MobileMenu';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { darkMode } = useTheme();
  const pathname = usePathname(); // get current path
  const logoSrc = darkMode ? '/logo-dark.png' : '/logo-light.png';

  // Helper to check if a link is active
  const isActive = (href) => {
    if (href === '/') return pathname === '/'; // exact match for home
    return pathname.startsWith(href); // for /about and /articles (and any subpages)
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <Image src={logoSrc} alt="Logo" width={40} height={40} />
          <span>Psyberly</span>
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" className={isActive('/') ? styles.active : ''}>
            Home
          </Link>
          <Link href="/about" className={isActive('/about') ? styles.active : ''}>
            About
          </Link>
          <Link href="/articles" className={isActive('/articles') ? styles.active : ''}>
            Articles
          </Link>
        </div>

        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
}