/**
 * Category Grid Component
 * Grid display of topic categories with icons and hover effects
 */

import React from 'react';
import { motion } from 'motion/react';
import { History, Telescope, Globe2, Dna, Landmark, Trees, Waves, Zap } from 'lucide-react';
import { useTheme } from '../common/ThemeProvider';

interface Category {
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

interface CategoryGridProps {
  onNavigate: (page: string) => void;
}

const categories: Category[] = [
  { name: 'History', icon: History, count: 24, color: 'from-amber-500 to-orange-600' },
  { name: 'Science', icon: Telescope, count: 18, color: 'from-blue-500 to-cyan-600' },
  { name: 'Geography', icon: Globe2, count: 16, color: 'from-green-500 to-emerald-600' },
  { name: 'Biology', icon: Dna, count: 20, color: 'from-purple-500 to-pink-600' },
  { name: 'Culture', icon: Landmark, count: 22, color: 'from-red-500 to-rose-600' },
  { name: 'Nature', icon: Trees, count: 19, color: 'from-teal-500 to-green-600' },
  { name: 'Oceans', icon: Waves, count: 14, color: 'from-indigo-500 to-blue-600' },
  { name: 'Technology', icon: Zap, count: 17, color: 'from-yellow-500 to-amber-600' },
];

export function CategoryGrid({ onNavigate }: CategoryGridProps) {
  const { theme } = useTheme();

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl sm:text-5xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>
            Explore by Category
          </h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-lg max-w-2xl mx-auto`}>
            Choose your area of interest and dive into a world of knowledge
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('topics')}
                className={`group relative overflow-hidden rounded-xl ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                } p-6 text-center border-2 hover:border-amber-500 transition-all duration-300`}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                  } group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-amber-600 flex items-center justify-center transition-all duration-300`}>
                    <Icon className={`w-8 h-8 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    } group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className={`${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  } mb-1 group-hover:text-amber-500 transition-colors`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {category.count} Topics
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}