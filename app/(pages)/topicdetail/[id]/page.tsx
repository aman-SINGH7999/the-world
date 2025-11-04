/**
 * Topic Detail Page
 * Detailed view of a single topic with chapters, media, and navigation
 */
'use client'

import React, { useState, useEffect} from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Share2, Bookmark, Clock, Calendar, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChapterAccordion } from '@/components/topic/ChapterAccordion';
import { MediaGallery, MediaItem } from '@/components/topic/MediaGallery';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useTheme } from '@/components/common/ThemeProvider';
import type { ITopic } from "@/lib/types";
import axios from 'axios';
import { formatDate, extractMedia, IMediaItem } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface TopicDetailPageProps {
  topicId?: string;
}

// Mock topic data
const mockTopic = {
  id: '1',
  title: 'Ancient Civilizations of Mesopotamia',
  subtitle: 'The Cradle of Human Civilization',
  description: 'Explore the remarkable achievements of the world\'s first urban societies in the fertile crescent between the Tigris and Euphrates rivers. From the invention of writing to complex legal systems, discover how Mesopotamian cultures laid the foundation for modern civilization.',
  image: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  category: 'History',
  era: 'Ancient',
  duration: '45 min',
  publishDate: 'October 15, 2025',
};



const mockMedia: MediaItem[] = [
  {
    id: 'img1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1717606344894-66e5696bcd18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwaGlzdG9yeXxlbnwxfHx8fDE3NjEyODc1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Ancient Ruins',
    description: 'Mesopotamian archaeological site',
  },
  {
    id: 'img2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1632670468093-6e7a07ae9848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc2MTI4NzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Cuneiform Tablet',
    description: 'Ancient writing system',
  },
  {
    id: 'vid1',
    type: 'video',
    url: '#',
    title: '3D Reconstruction of Babylon',
  },
  {
    id: 'vid2',
    type: 'video',
    url: '#',
    title: 'Ziggurat Architecture',
  },
  {
    id: 'aud1',
    type: 'audio',
    url: '#',
    title: 'Expert Commentary: Daily Life',
  },
  {
    id: 'aud2',
    type: 'audio',
    url: '#',
    title: 'Mesopotamian Music Recreation',
  },
];

export default function TopicDetailPage({ topicId }: TopicDetailPageProps) {
  const [topic, setTopic] = useState<ITopic | null>(null);
  const [allMedia, setAllMedia] = useState<IMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState("#");
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params.id;      
  
  console.log("Data Called")

  const fetchTopicById = async ()=>{
    try{
      setLoading(true);
      const { data } = await axios.get(`/api/admin/topics/${id}`)
      console.log("DATA: ",data);
      setTopic(data.topic);
      const result = extractMedia(data?.topic?.chapters);
      setAllMedia(result);
      console.log("ALL media: ", result)
      console.log("Topic: ", data.topic)
    }catch(err){
      setError('Failed to load topic');
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("fetch data: ", id)
    if (!id) return;
    fetchTopicById();
  }, [id]);


    const handleShare = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${origin}${pathname || ''}` // 👈 combine origin + pathname

    try {
      await navigator.clipboard.writeText(url)
      alert(`✅ Link copied!\n${url}`)
    } catch (err) {
      console.error('Copy failed:', err)
      alert('❌ Failed to copy link')
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-end">
        <ImageWithFallback
          src={topic?.heroMediaUrl || mockTopic.image}
          alt={topic?.title || mockTopic.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent'
              : 'bg-gradient-to-t from-white via-white/70 to-transparent'
          }`}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex gap-3 mb-4">
              {
                topic?.category?.map((catg, i)=>{
                  return <Badge key={i} className="bg-amber-500 text-white">{catg || mockTopic.category}</Badge>
                })
              }
              
              <Badge
                className={
                  theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                }
              >
                {topic?.era || mockTopic.era}
              </Badge>
            </div>
            <h1
              className={`text-5xl sm:text-6xl ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              } mb-4 max-w-4xl`}
            >
              {topic?.title || mockTopic.title}
            </h1>
            <p
              className={`text-xl ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              } max-w-2xl`}
            >
              {topic?.subtitle || mockTopic.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6`}>
                Overview
              </h2>
              <p
                className={`${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                } leading-relaxed text-lg`}
              >
                {topic?.overview || mockTopic.description}
              </p>
            </motion.section>

            <Separator className={theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} />

            {/* Chapters */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ChapterAccordion chapters={ topic?.chapters || []} />
            </motion.section>

            <Separator className={theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} />

            {/* Media Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MediaGallery media={allMedia || mockMedia} />
            </motion.section>

            <Separator className={theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} />

            {/* Sources & References */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6`}>
                Sources & References
              </h2>
              {
                topic?.sources?.map((source,i)=>{
                  return  (
                    <div key={i} className='flex flex-nowrap items-center'>
                       <Dot size={30} />
                      <a
                      className={`space-y-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                      href={source?.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source?.title || "N/A"}
                    </a>
                    </div>
                 )
                }) || "N/A"
              }
             
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24 space-y-6"
            >
              {/* Topic Info Card */}
              <div
                className={`${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                } rounded-xl p-6 border`}
              >
                <h3 className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-4`}>
                  Topic Information
                </h3>
                <div className="space-y-4">
                  <div
                    className={`flex items-center gap-3 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span>{formatDate(topic?.updatedAt) || mockTopic.publishDate}</span>
                  </div>
                  <div>
                  <div
                    className={`flex items-center gap-3 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span>Key Points</span>
                  </div>
                    <div className='px-6'>
                      <ul className='list-disc flex flex-col text-xs opacity-80 gap-2 pt-3'>
                      {topic?.keyPoints?.map((keyPoint, i) => (
                        <li key={i}>{keyPoint}</li>
                      ))}
                    </ul>
                    </div>
                  </div>
                  <Separator className={theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} />
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${
                        theme === 'dark'
                          ? 'border-slate-600 text-slate-300'
                          : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${
                        theme === 'dark'
                          ? 'border-slate-600 text-slate-300'
                          : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/topics')}
                  variant="outline"
                  className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Topics
                </Button>
                <Button
                  onClick={() => router.push(`topicdetail/${id}`)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Next Topic
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}