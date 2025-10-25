/**
 * Topics Page
 * Grid/list of all topics with filtering capabilities
 */
'use client'

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { TopicCard, Topic } from '@/components/topics/TopicCard';
import { TopicFilters, FilterOptions } from '@/components/topics/TopicFilters';
import { Input } from '@/components/ui/input';

interface TopicsPageProps {
  onNavigate: (page: string, topicId?: string) => void;
}

// Mock topics data
const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Ancient Civilizations of Mesopotamia',
    summary: 'Discover the cradle of civilization and the remarkable achievements of ancient Mesopotamian cultures including Sumerians, Babylonians, and Assyrians.',
    image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'History',
    duration: '45 min',
    chapters: 6,
    era: 'Ancient',
  },
  {
    id: '2',
    title: 'The African Savanna Ecosystem',
    summary: 'Explore the rich biodiversity and complex ecological relationships in Africa\'s iconic grassland biome.',
    image: 'https://images.unsplash.com/photo-1719743441581-632023e3d2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3aWxkbGlmZSUyMGRvY3VtZW50YXJ5fGVufDF8fHx8MTc2MTI4NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Nature',
    duration: '60 min',
    chapters: 8,
    era: 'Contemporary',
  },
  {
    id: '3',
    title: 'Journey Through the Cosmos',
    summary: 'An exploration of our universe from the Big Bang to black holes, revealing the wonders of space and time.',
    image: 'https://images.unsplash.com/photo-1614777959970-6774563e87f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGFzdHJvbm9teSUyMGNvc21vc3xlbnwxfHx8fDE3NjEyODc1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Science',
    duration: '50 min',
    chapters: 7,
    era: 'Contemporary',
  },
  {
    id: '4',
    title: 'The Renaissance Revolution',
    summary: 'Witness the rebirth of art, science, and culture that transformed Europe and shaped the modern world.',
    image: 'https://images.unsplash.com/photo-1632670468093-6e7a07ae9848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc2MTI4NzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Culture',
    duration: '55 min',
    chapters: 5,
    era: 'Medieval',
  },
  {
    id: '5',
    title: 'Oceans: The Last Frontier',
    summary: 'Dive deep into Earth\'s oceans to discover mysterious creatures and unexplored underwater worlds.',
    image: 'https://images.unsplash.com/photo-1760493828288-d2dbb70d18c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwdGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MXx8fHwxNzYxMjg3NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Science',
    duration: '48 min',
    chapters: 6,
    era: 'Contemporary',
  },
  {
    id: '6',
    title: 'The Silk Road Chronicles',
    summary: 'Follow the ancient trade routes that connected East and West, facilitating commerce, culture, and ideas.',
    image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'History',
    duration: '52 min',
    chapters: 7,
    era: 'Ancient',
  },
];

export function TopicsPage({ onNavigate }: TopicsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: ['All', 'History', 'Science', 'Nature', 'Culture'],
    eras: ['All', 'Ancient', 'Medieval', 'Modern', 'Contemporary'],
    selectedCategory: 'All',
    selectedEra: 'All',
  });

  const handleFilterChange = (filterType: 'category' | 'era', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType === 'category' ? 'selectedCategory' : 'selectedEra']: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: 'All',
      selectedEra: 'All',
    }));
    setSearchQuery('');
  };

  const filteredTopics = useMemo(() => {
    return mockTopics.filter((topic) => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filters.selectedCategory === 'All' || topic.category === filters.selectedCategory;
      const matchesEra = filters.selectedEra === 'All' || topic.era === filters.selectedEra;

      return matchesSearch && matchesCategory && matchesEra;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl text-white mb-4">Explore Topics</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover fascinating stories from history, science, nature, and culture
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <TopicFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </motion.div>

          {/* Topics Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {filteredTopics.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-slate-400">
                    Showing {filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTopics.map((topic, index) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onNavigate={onNavigate}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-slate-400">No topics found matching your criteria.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-amber-500 hover:text-amber-400 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
