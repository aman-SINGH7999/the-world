/**
 * Featured Carousel Component
 * Carousel displaying featured documentary topics with cinematic cards
 */
'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../common/ThemeProvider';
import { useRouter } from 'next/navigation';
import { ITopic } from '@/lib/types';
import axios from 'axios';

interface FeaturedTopic {
  _id: string;
  title: string;
  description: string;
  heroMediaUrl: string;
  category: string;
  duration: string;
}



const featuredTopics: FeaturedTopic[] = [
  {
    _id: '1',
    title: 'Ancient Civilizations',
    description: 'Explore the rise and fall of the world\'s greatest ancient empires',
    heroMediaUrl: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'History',
    duration: '45 min',
  },
  {
    _id: '2',
    title: 'Wildlife of the Savanna',
    description: 'Journey into the heart of Africa\'s most incredible ecosystems',
    heroMediaUrl: 'https://images.unsplash.com/photo-1719743441581-632023e3d2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjB3aWxkbGlmZSUyMGRvY3VtZW50YXJ5fGVufDF8fHx8MTc2MTI4NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Nature',
    duration: '60 min',
  },
  {
    _id: '3',
    title: 'The Cosmos Unveiled',
    description: 'Discover the mysteries of space, stars, and the universe beyond',
    heroMediaUrl: 'https://images.unsplash.com/photo-1614777959970-6774563e87f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGFzdHJvbm9teSUyMGNvc21vc3xlbnwxfHx8fDE3NjEyODc1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Science',
    duration: '50 min',
  },
];

export function FeaturedCarousel() {
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const router = useRouter()

    const fetchTopics = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/admin/topics/?limit=3");
        setTopics(Array.isArray(data?.topics) ? data.topics : []);
        
      } catch (err) {
        console.error("Failed to fetch topics", err);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    }

    useEffect(()=>{
      fetchTopics();
    }, [])

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl sm:text-5xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>
            Featured Documentaries
          </h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-lg max-w-2xl mx-auto`}>
            Immerse yourself in our handpicked selection of captivating stories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics?.map((topic, index) => (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`group overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-200'
              } hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <ImageWithFallback
                    src={topic.heroMediaUrl}
                    alt={topic.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent'
                      : 'bg-gradient-to-t from-white via-white/50 to-transparent'
                  }`} />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                      {topic.category}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className={`absolute top-4 right-4 flex items-center gap-1 ${
                    theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'
                  } px-2 py-1 rounded`}>
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className={theme === 'dark' ? 'text-white text-sm' : 'text-slate-900 text-sm'}>
                      {45}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-2xl ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  } mb-2 group-hover:text-amber-500 transition-colors`}>
                    {topic.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-slate-400 mb-4' : 'text-slate-600 mb-4'}>
                    {topic.overview}
                  </p>
                  
                  <Button
                    onClick={() => router.push(`/topicdetail/${topic._id}`)}
                    variant="ghost"
                    className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 p-0 h-auto group/btn"
                  >
                    Explore Story
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}