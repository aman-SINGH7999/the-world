/**
 * Home Page
 * Landing page with hero, featured topics, categories, and quick links
 */

import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { QuickLinks } from '@/components/home/QuickLinks';


export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCarousel />
      <CategoryGrid />
      <QuickLinks />
    </div>
  );
}
