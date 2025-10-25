/**
 * Home Page
 * Landing page with hero, featured topics, categories, and quick links
 */

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { QuickLinks } from '@/components/home/QuickLinks';

interface HomePageProps {
  onNavigate: (page: string, topicId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection onNavigate={onNavigate} />
      <FeaturedCarousel onNavigate={onNavigate} />
      <CategoryGrid onNavigate={onNavigate} />
      <QuickLinks onNavigate={onNavigate} />
    </div>
  );
}
