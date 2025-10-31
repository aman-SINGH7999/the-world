/**
 * Topic Card Component
 * Individual topic card with image, title, summary, and hover effects
 */
'use client'

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

export interface Topic {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  duration: string;
  chapters: number;
  era?: string;
}

interface TopicCardProps {
  topic: Topic;
  index?: number;
}

export function TopicCard({ topic, index = 0 }: TopicCardProps) {
  const router = useRouter();
  const id = "6900f16425bd9f357e22547f";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden bg-slate-800 border-slate-700 hover:border-amber-500 transition-all duration-300 h-full flex flex-col cursor-pointer">
        <div
          onClick={() => router.push(`/topicdetail/${id}`)}
          className="relative aspect-[16/10] overflow-hidden"
        >
          <ImageWithFallback
            src={topic.image}
            alt={topic.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          
          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600 text-white border-0">
            {topic.category}
          </Badge>

          {/* Era Badge (if available) */}
          {topic.era && (
            <Badge className="absolute top-4 right-4 bg-slate-900/80 text-slate-300 border-slate-700">
              {topic.era}
            </Badge>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3
            onClick={() => router.push(`/topicdetail/${id}`)}
            className="text-2xl text-white mb-3 group-hover:text-amber-500 transition-colors cursor-pointer"
          >
            {topic.title}
          </h3>
          
          <p className="text-slate-400 mb-4 flex-1 line-clamp-3">{topic.summary}</p>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{topic.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{topic.chapters} Chapters</span>
            </div>
          </div>

          {/* Read More Button */}
          <button
            onClick={() => router.push(`/topicdetail/${id}`)}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors group/btn"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
