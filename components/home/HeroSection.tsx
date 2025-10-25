/**
 * Hero Section Component
 * Full-width hero with background image, overlay text, and call-to-action
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1632670468093-6e7a07ae9848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc2MTI4NzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6"
          >
            Discover the{' '}
            <span className="text-gradient-gold">Knowledge</span>
            <br />
            of Your World
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto"
          >
            Journey through time and space with documentary-style explorations of history, science, nature, and culture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              onClick={() => onNavigate('topics')}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg group"
            >
              Explore Topics
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white px-8 py-6 text-lg group"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Intro
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-amber-500 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-amber-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
