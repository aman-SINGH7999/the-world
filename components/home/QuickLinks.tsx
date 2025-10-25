/**
 * Quick Links Component
 * Call-to-action cards for Timeline and Map pages
 */

import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../common/ThemeProvider';

interface QuickLinksProps {
  onNavigate: (page: string) => void;
}

export function QuickLinks({ onNavigate }: QuickLinksProps) {
  const { theme } = useTheme();

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timeline Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`group relative overflow-hidden rounded-2xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
            } p-8 border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20`}
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>
                Interactive Timeline
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                Journey through history with our visual timeline. Explore key events and their connections across civilizations and eras.
              </p>
              <Button
                onClick={() => onNavigate('timeline')}
                className="bg-amber-500 hover:bg-amber-600 text-white group/btn"
              >
                Explore Timeline
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
          </motion.div>

          {/* Map Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`group relative overflow-hidden rounded-2xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'
                : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
            } p-8 border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20`}
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>
                World Map
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                Discover knowledge geographically. Navigate our interactive world map to find topics by location and explore global connections.
              </p>
              <Button
                onClick={() => onNavigate('map')}
                className="bg-amber-500 hover:bg-amber-600 text-white group/btn"
              >
                Explore Map
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Decorative Background */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full -ml-32 -mb-32 group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}