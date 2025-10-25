/**
 * Timeline Card Component
 * Individual event card for timeline display
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  topicId?: string;
}

interface TimelineCardProps {
  event: TimelineEvent;
  onNavigate: (page: string, topicId?: string) => void;
  index?: number;
}

export function TimelineCard({ event, onNavigate, index = 0 }: TimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="min-w-[320px] md:min-w-[380px]"
    >
      <Card className="group h-full bg-slate-800 border-slate-700 hover:border-amber-500 transition-all duration-300 overflow-hidden">
        {/* Year Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-2xl text-white">{event.year}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Category Badge */}
          <Badge className="bg-slate-700 text-slate-300 mb-3 hover:bg-slate-600">
            {event.category}
          </Badge>

          <h3 className="text-xl text-white mb-3 group-hover:text-amber-500 transition-colors">
            {event.title}
          </h3>

          <p className="text-slate-400 mb-4 line-clamp-3">{event.description}</p>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}

          {/* Learn More Link */}
          {event.topicId && (
            <button
              onClick={() => onNavigate('topic-detail', event.topicId)}
              className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors group/btn text-sm"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
