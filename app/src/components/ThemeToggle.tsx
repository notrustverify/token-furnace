import React from 'react';
import styles from '../styles/ThemeToggle.module.css';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className={styles.themeToggle}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}; 