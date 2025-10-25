/**
 * Theme Provider Component
 * Manages light and dark mode theme state for the application
 */
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // Initialize theme immediately on mount
  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('worlddoc-theme') as Theme | null;
    if (saved && (saved === 'light' || saved === 'dark')) {
      setTheme(saved);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(saved);
    } else {
      // Default to dark
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    // Update document class and save preference whenever theme changes
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('worlddoc-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}