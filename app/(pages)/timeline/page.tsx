/**
 * Timeline Page
 * Interactive horizontal timeline with historical events
 */
'use client'

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimelineCard, TimelineEvent } from '@/components/timeline/TimelineCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelinePageProps {
  onNavigate: (page: string, topicId?: string) => void;
}

// Mock timeline data
const mockEvents: TimelineEvent[] = [
  {
    id: 'e1',
    year: '3500 BCE',
    title: 'Invention of Writing',
    description: 'The Sumerians develop cuneiform, the world\'s first writing system, revolutionizing human communication.',
    category: 'History',
    location: 'Mesopotamia',
    topicId: '1',
  },
  {
    id: 'e2',
    year: '2560 BCE',
    title: 'Great Pyramid of Giza',
    description: 'Construction of the Great Pyramid, one of the Seven Wonders of the Ancient World.',
    category: 'History',
    location: 'Egypt',
    topicId: '1',
  },
  {
    id: 'e3',
    year: '776 BCE',
    title: 'First Olympic Games',
    description: 'The ancient Olympic Games are held in Olympia, Greece, marking the beginning of a tradition.',
    category: 'Culture',
    location: 'Greece',
  },
  {
    id: 'e4',
    year: '221 BCE',
    title: 'Qin Dynasty Unifies China',
    description: 'Emperor Qin Shi Huang unifies China and begins construction of the Great Wall.',
    category: 'History',
    location: 'China',
  },
  {
    id: 'e5',
    year: '476 CE',
    title: 'Fall of Rome',
    description: 'The Western Roman Empire falls, marking the end of ancient Rome and the beginning of the Middle Ages.',
    category: 'History',
    location: 'Rome',
  },
  {
    id: 'e6',
    year: '1492',
    title: 'Columbus Reaches Americas',
    description: 'Christopher Columbus\'s voyage leads to European awareness of the American continents.',
    category: 'History',
    location: 'Americas',
  },
  {
    id: 'e7',
    year: '1687',
    title: 'Newton\'s Principia',
    description: 'Isaac Newton publishes Philosophiæ Naturalis Principia Mathematica, laying the foundation for classical mechanics.',
    category: 'Science',
    location: 'England',
  },
  {
    id: 'e8',
    year: '1859',
    title: 'Darwin\'s Origin of Species',
    description: 'Charles Darwin publishes On the Origin of Species, introducing the theory of evolution.',
    category: 'Science',
    location: 'England',
  },
  {
    id: 'e9',
    year: '1969',
    title: 'Moon Landing',
    description: 'Apollo 11 astronauts Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon.',
    category: 'Science',
    location: 'Moon',
    topicId: '3',
  },
  {
    id: 'e10',
    year: '2000',
    title: 'Digital Revolution',
    description: 'The turn of the millennium marks the height of the digital revolution and the internet age.',
    category: 'Technology',
  },
];

export function TimelinePage({ onNavigate }: TimelinePageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
          <h1 className="text-5xl sm:text-6xl text-white mb-4">Interactive Timeline</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Journey through history and explore pivotal moments that shaped our world
          </p>
        </motion.div>

        {/* Timeline Navigation Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => scroll('left')}
            variant="outline"
            size="icon"
            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => scroll('right')}
            variant="outline"
            size="icon"
            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          
          {/* Scrollable Timeline */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-8 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mockEvents.map((event, index) => (
              <TimelineCard
                key={event.id}
                event={event}
                onNavigate={onNavigate}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Era Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {['Ancient', 'Medieval', 'Modern', 'Contemporary'].map((era) => (
            <div key={era} className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
              <h3 className="text-amber-500 mb-1">{era}</h3>
              <p className="text-sm text-slate-400">Era</p>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
