/**
 * Scroll To Top Button Component
 * Floating button that appears when scrolling down and returns user to top
 */
'use client'

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </Button>
  );
}
