/**
 * Map Page
 * Interactive world map with topic location markers
 */
'use client'

import React from 'react';
import { motion } from 'motion/react';
import { Globe2 } from 'lucide-react';
import { WorldMap, MapMarker } from '@/components/map/WorldMap';
import { useRouter } from 'next/navigation'


// Mock map markers data
const mockMarkers: MapMarker[] = [
  {
    id: 'm1',
    topicId: '1',
    title: 'Ancient Mesopotamia',
    category: 'History',
    description: 'Explore the cradle of civilization between the Tigris and Euphrates rivers.',
    image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 60, y: 40 },
  },
  {
    id: 'm2',
    topicId: '2',
    title: 'African Savanna',
    category: 'Nature',
    description: 'Discover the rich biodiversity of Africa\'s iconic grassland ecosystem.',
    image: 'https://images.unsplash.com/photo-1719743441581-632023e3d2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3aWxkbGlmZSUyMGRvY3VtZW50YXJ5fGVufDF8fHx8MTc2MTI4NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 55, y: 60 },
  },
  {
    id: 'm3',
    topicId: '3',
    title: 'Space Exploration',
    category: 'Science',
    description: 'Journey through the cosmos and explore the mysteries of the universe.',
    image: 'https://images.unsplash.com/photo-1614777959970-6774563e87f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGFzdHJvbm9teSUyMGNvc21vc3xlbnwxfHx8fDE3NjEyODc1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 20, y: 35 },
  },
  {
    id: 'm4',
    topicId: '4',
    title: 'Renaissance Italy',
    category: 'Culture',
    description: 'Witness the rebirth of art and culture in Renaissance Italy.',
    image: 'https://images.unsplash.com/photo-1632670468093-6e7a07ae9848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc2MTI4NzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 52, y: 38 },
  },
  {
    id: 'm5',
    topicId: '5',
    title: 'Pacific Ocean Depths',
    category: 'Science',
    description: 'Dive into the deepest parts of Earth\'s largest ocean.',
    image: 'https://images.unsplash.com/photo-1760493828288-d2dbb70d18c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwdGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MXx8fHwxNzYxMjg3NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 85, y: 50 },
  },
  {
    id: 'm6',
    topicId: '6',
    title: 'The Silk Road',
    category: 'History',
    description: 'Follow the ancient trade routes connecting East and West.',
    image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 70, y: 38 },
  },
  {
    id: 'm7',
    topicId: '1',
    title: 'Ancient Egypt',
    category: 'History',
    description: 'Uncover the mysteries of the pharaohs and pyramids.',
    image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 56, y: 45 },
  },
  {
    id: 'm8',
    topicId: '2',
    title: 'Amazon Rainforest',
    category: 'Nature',
    description: 'Explore the world\'s most biodiverse ecosystem.',
    image: 'https://images.unsplash.com/photo-1719743441581-632023e3d2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3aWxkbGlmZSUyMGRvY3VtZW50YXJ5fGVufDF8fHx8MTc2MTI4NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    position: { x: 30, y: 60 },
  },
];

export default function MapPage() {
  const router = useRouter();
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe2 className="w-12 h-12 text-amber-500" />
            <h1 className="text-5xl sm:text-6xl text-white">World Map</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore knowledge across the globe. Click on markers to discover topics by location.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {['History', 'Science', 'Nature', 'Culture'].map((category) => (
            <div key={category} className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300 text-sm">{category}</span>
            </div>
          ))}
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <WorldMap markers={mockMarkers} />
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl text-white mb-4">How to Use the Map</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                <span className="text-amber-500">1</span>
              </div>
              <p className="text-sm">Hover over markers to see topic titles and categories</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                <span className="text-amber-500">2</span>
              </div>
              <p className="text-sm">Click on a marker to open detailed information</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                <span className="text-amber-500">3</span>
              </div>
              <p className="text-sm">Select "Explore Topic" to dive deeper into the content</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
