'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from '../styles/ThemeToggle.module.css';

// Create context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (storedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    const newTheme = newDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for easy use
export function useTheme() {
  return useContext(ThemeContext);
}

// The toggle button component itself
export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className={styles.toggleButton} aria-label="Toggle theme">
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}