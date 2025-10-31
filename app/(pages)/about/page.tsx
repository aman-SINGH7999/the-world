/**
 * About Page
 * Mission statement, team members, and key features
 */

'use client'

import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Sparkles, Globe, BookOpen, Compass } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

const teamMembers = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Chief Curator',
    image: 'https://images.unsplash.com/photo-1632670468093-6e7a07ae9848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc2MTI4NzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Prof. James Chen',
    role: 'Lead Historian',
    image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Dr. Maria Rodriguez',
    role: 'Science Director',
    image: 'https://images.unsplash.com/photo-1614777959970-6774563e87f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGFzdHJvbm9teSUyMGNvc21vc3xlbnwxfHx8fDE3NjEyODc1OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'David Thompson',
    role: 'Documentary Producer',
    image: 'https://images.unsplash.com/photo-1760493828288-d2dbb70d18c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwdGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MXx8fHwxNzYxMjg3NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Content',
    description: 'Dive deep into topics with expertly curated chapters, multimedia, and primary sources.',
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    description: 'Explore knowledge from every corner of the world with our interactive map feature.',
  },
  {
    icon: Compass,
    title: 'Interactive Timeline',
    description: 'Navigate through history with our visual timeline connecting events across eras.',
  },
  {
    icon: Sparkles,
    title: 'Cinematic Experience',
    description: 'Enjoy a premium, documentary-style presentation that brings knowledge to life.',
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl sm:text-6xl text-white mb-6">About WorldDoc</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Bringing the world's knowledge to life through cinematic storytelling and immersive experiences
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-8 md:p-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-3xl text-white mb-4">Our Mission</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  WorldDoc is dedicated to making knowledge accessible, engaging, and unforgettable. We believe that learning should be an adventure—a journey through time, space, and human achievement.
                </p>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Through documentary-style narratives, interactive features, and stunning visuals, we transform educational content into compelling stories that inspire curiosity and deepen understanding of our world.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-4xl text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 p-6 h-full hover:border-amber-500 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-amber-500" />
              <h2 className="text-4xl text-white">Meet Our Team</h2>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Our diverse team of experts brings together decades of experience in education, research, and storytelling
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 overflow-hidden group hover:border-amber-500 transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl text-white mb-1">{member.name}</h3>
                    <p className="text-amber-500 text-sm">{member.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30 p-12">
            <h2 className="text-4xl text-white mb-4">Ready to Explore?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Join us on a journey through the knowledge of your world. Start exploring today.
            </p>
            <button
              onClick={() => router.push('/topics')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg text-lg transition-all hover:scale-105"
            >
              Start Exploring
            </button>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
