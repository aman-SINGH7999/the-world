/**
 * Main App Component
 * WorldDoc: Knowledge of Your World
 * A cinematic documentary-style knowledge website
 */
'use client'

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { HomePage } from '@/app/(pages)/home/page';
import { TopicsPage } from '@/app/(pages)/topics/page';
import { TopicDetailPage } from '@/app/(pages)/topicdetail/page';
import { TimelinePage } from '@/app/(pages)/timeline/page';
import { MapPage } from '@/app/(pages)/maps/page';
import { AboutPage } from '@/app/(pages)/about/page';

type Page = 'home' | 'topics' | 'topic-detail' | 'timeline' | 'map' | 'about';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [topicId, setTopicId] = useState<string | undefined>();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    setTopicId(id);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'topics':
        return <TopicsPage onNavigate={handleNavigate} />;
      case 'topic-detail':
        return <TopicDetailPage topicId={topicId} onNavigate={handleNavigate} />;
      case 'timeline':
        return <TimelinePage onNavigate={handleNavigate} />;
      case 'map':
        return <MapPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        <main>{renderPage()}</main>
        <Footer onNavigate={handleNavigate} />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}