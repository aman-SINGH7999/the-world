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
import { ChapterAccordion, Chapter } from '@/components/topic/ChapterAccordion';
import { MediaGallery, MediaItem } from '@/components/topic/MediaGallery';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useTheme } from '@/components/common/ThemeProvider';
import type { ITopic } from "@/lib/types";
import axios from 'axios';
import { formatDate } from '@/lib/utils';
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

const mockChapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'The Dawn of Civilization',
    duration: '12 min',
    hasVideo: true,
    sections: [
      {
        type: 'text',
        content: 'The story begins in the fertile crescent, a region nestled between the Tigris and Euphrates rivers, where the first permanent settlements emerged around 10,000 BCE. This revolutionary shift from nomadic hunter-gatherer societies to settled agricultural communities marked the beginning of human civilization as we know it.',
      },
      {
        type: 'heading',
        content: 'The Agricultural Revolution',
        level: 3,
      },
      {
        type: 'text',
        content: 'The development of agriculture was a transformative moment in human history. Early settlers discovered that wheat, barley, and other grains could be cultivated in the rich soil along the riverbanks. This reliable food source allowed populations to grow and communities to flourish.',
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1624040016660-d4d56bdc42df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwbWVzb3BvdGFtaWElMjBydWluc3xlbnwxfHx8fDE3NjEzNzQxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Ancient Mesopotamian ruins showing the remains of early urban settlements',
      },
      {
        type: 'heading',
        content: 'The Birth of Cities',
        level: 3,
      },
      {
        type: 'text',
        content: 'As agricultural surplus grew, so did the population. Villages expanded into towns, and towns into the world\'s first cities. Uruk, Ur, and Eridu became centers of trade, religion, and governance. These urban centers featured sophisticated architecture, complex social hierarchies, and specialized labor divisions.',
      },
      {
        type: 'video',
        content: 'https://www.youtube.com/watch?v=sohXPx_XZ6Y',
        caption: 'Documentary: The First Civilizations of Mesopotamia',
      },
      {
        type: 'text',
        content: 'The emergence of cities brought new challenges and innovations. Societies needed systems for managing resources, resolving disputes, and organizing labor for large-scale projects. These needs would drive the development of governance, law, and record-keeping systems in the millennia to come.',
      },
    ],
  },
  {
    id: 'ch2',
    number: 2,
    title: 'The Sumerians: Inventors of Writing',
    duration: '10 min',
    hasVideo: true,
    sections: [
      {
        type: 'text',
        content: 'Around 3500 BCE, the Sumerians developed cuneiform, the world\'s first writing system. This revolutionary invention transformed human communication and society, allowing for the recording of laws, literature, trade records, and historical events.',
      },
      {
        type: 'heading',
        content: 'The Evolution of Cuneiform',
        level: 3,
      },
      {
        type: 'text',
        content: 'Cuneiform began as a simple pictographic system used for accounting and record-keeping. Merchants and temple administrators needed a way to track goods, livestock, and transactions. Over time, these pictographs evolved into abstract wedge-shaped marks pressed into clay tablets with a reed stylus.',
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1615129162044-8287f97d3763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW5laWZvcm0lMjB0YWJsZXQlMjB3cml0aW5nfGVufDF8fHx8MTc2MTM0MTI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Ancient cuneiform tablet displaying early Sumerian writing',
      },
      {
        type: 'heading',
        content: 'Impact on Society',
        level: 3,
      },
      {
        type: 'text',
        content: 'The invention of writing had profound effects on Mesopotamian society. It enabled the development of complex legal codes, the preservation of religious texts, and the recording of history. Scribes became a prestigious class of professionals, and literacy became a mark of education and status.',
      },
      {
        type: 'heading',
        content: 'Literary Achievements',
        level: 4,
      },
      {
        type: 'text',
        content: 'The Sumerians produced remarkable literary works, including the Epic of Gilgamesh, one of humanity\'s oldest surviving pieces of literature. This epic poem tells the story of a legendary king and explores timeless themes of friendship, mortality, and the search for meaning.',
      },
      {
        type: 'video',
        content: 'https://www.youtube.com/watch?v=N4EKOpKX2DA',
        caption: 'The History of Cuneiform Writing',
      },
    ],
  },
  {
    id: 'ch3',
    number: 3,
    title: 'The Code of Hammurabi',
    duration: '9 min',
    sections: [
      {
        type: 'text',
        content: 'King Hammurabi of Babylon (r. 1792-1750 BCE) created one of the world\'s earliest and most complete written legal codes. This monumental achievement established principles of justice that would influence legal systems for millennia to come.',
      },
      {
        type: 'heading',
        content: 'Structure and Content',
        level: 3,
      },
      {
        type: 'text',
        content: 'The Code of Hammurabi consists of 282 laws covering a wide range of topics: property rights, trade regulations, family relationships, labor contracts, and criminal justice. The code was inscribed on a massive stone stele and displayed publicly, ensuring that all citizens could know the law.',
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1742053138311-4ac647ee7750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2l2aWxpemF0aW9uJTIwYXJjaGFlb2xvZ3l8ZW58MXx8fHwxNzYxMzc0MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Archaeological artifacts from the Babylonian period',
      },
      {
        type: 'heading',
        content: 'Principles of Justice',
        level: 3,
      },
      {
        type: 'text',
        content: 'The code established the principle of proportional justice, often summarized as "an eye for an eye." However, punishments varied based on social class, with different penalties for nobles, commoners, and slaves. The code also provided protections for the vulnerable, including widows, orphans, and debtors.',
      },
      {
        type: 'heading',
        content: 'Legacy',
        level: 4,
      },
      {
        type: 'text',
        content: 'Hammurabi\'s legal innovations influenced subsequent legal systems throughout the ancient Near East and beyond. The concept of written law accessible to all citizens, the presumption of innocence, and the presentation of evidence in court all trace their origins to this ancient code.',
      },
    ],
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Ziggurats and Religious Life',
    duration: '11 min',
    hasVideo: true,
    sections: [
      {
        type: 'text',
        content: 'Mesopotamian ziggurats were massive stepped pyramids that served as temples to the gods. These architectural marvels dominated city skylines and demonstrated the sophisticated engineering capabilities and deep religious devotion of ancient civilizations.',
      },
      {
        type: 'heading',
        content: 'Architecture and Construction',
        level: 3,
      },
      {
        type: 'text',
        content: 'Ziggurats were built using millions of sun-baked mud bricks, often rising to heights of over 100 feet. The most famous, the ziggurat of Ur, had three massive terraces connected by staircases. Each level was smaller than the one below, creating the distinctive stepped profile.',
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1737314409593-0b969a279596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwYmFieWxvbiUyMHppZ2d1cmF0fGVufDF8fHx8MTc2MTM3NDE1OXww&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Reconstruction of an ancient Mesopotamian ziggurat',
      },
      {
        type: 'heading',
        content: 'Religious Significance',
        level: 3,
      },
      {
        type: 'text',
        content: 'Each ziggurat was dedicated to a city\'s patron deity. Priests conducted elaborate rituals at the temple shrine atop the structure, which was believed to be the dwelling place of the god. The ziggurat served as a symbolic mountain linking heaven and earth.',
      },
      {
        type: 'video',
        content: 'https://www.youtube.com/watch?v=VBKh7R9M4tI',
        caption: '3D Reconstruction: Inside a Mesopotamian Ziggurat',
      },
      {
        type: 'heading',
        content: 'The Priestly Class',
        level: 4,
      },
      {
        type: 'text',
        content: 'Priests held significant power in Mesopotamian society. They managed temple estates, conducted religious ceremonies, and often served as advisors to kings. Temples functioned as economic centers, controlling vast agricultural lands and engaging in trade.',
      },
    ],
  },
  {
    id: 'ch5',
    number: 5,
    title: 'The Assyrian Empire',
    duration: '10 min',
    sections: [
      {
        type: 'text',
        content: 'The Assyrians built one of history\'s most powerful and feared empires through military innovation, administrative excellence, and cultural achievements. At its height, the Assyrian Empire stretched from Egypt to Persia, encompassing diverse peoples and cultures.',
      },
      {
        type: 'heading',
        content: 'Military Innovations',
        level: 3,
      },
      {
        type: 'text',
        content: 'The Assyrian army was the most advanced military force of its time. They pioneered the use of iron weapons, cavalry units, and sophisticated siege engines. Their military tactics emphasized speed, discipline, and overwhelming force.',
      },
      {
        type: 'image',
        content: 'https://images.unsplash.com/photo-1719415930895-163dacace8ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwYXNzeXJpYW4lMjBhcnR8ZW58MXx8fHwxNzYxMzc0MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        caption: 'Ancient Assyrian art depicting warriors and royal hunts',
      },
      {
        type: 'heading',
        content: 'Administrative Genius',
        level: 3,
      },
      {
        type: 'text',
        content: 'To manage their vast empire, the Assyrians developed an efficient administrative system. They built roads for rapid communication, established a postal system, and created a network of provincial governors who reported directly to the king.',
      },
      {
        type: 'heading',
        content: 'Cultural Achievements',
        level: 3,
      },
      {
        type: 'text',
        content: 'The Assyrians were not only warriors but also scholars and artists. King Ashurbanipal established a great library at Nineveh, which contained over 30,000 clay tablets covering literature, science, mathematics, and astronomy. Assyrian sculptors created magnificent palace reliefs depicting royal hunts, battles, and religious ceremonies.',
      },
      {
        type: 'heading',
        content: 'The Fall of Assyria',
        level: 4,
      },
      {
        type: 'text',
        content: 'Despite their power, the Assyrian Empire collapsed rapidly in the late 7th century BCE. A coalition of Babylonians and Medes captured and destroyed Nineveh in 612 BCE, ending Assyrian dominance but not their cultural legacy.',
      },
    ],
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Legacy and Decline',
    duration: '8 min',
    sections: [
      {
        type: 'text',
        content: 'Though the great Mesopotamian empires eventually fell to conquest and internal strife, their contributions to human civilization endure. The innovations and ideas that emerged in the fertile crescent between the Tigris and Euphrates rivers continue to shape our world today.',
      },
      {
        type: 'heading',
        content: 'Lasting Contributions',
        level: 3,
      },
      {
        type: 'text',
        content: 'Mesopotamian civilizations gave humanity its first writing systems, legal codes, and urban planning principles. They developed mathematics, including the sexagesimal system that gives us 60-second minutes and 360-degree circles. Their astronomical observations laid the groundwork for modern astronomy.',
      },
      {
        type: 'heading',
        content: 'Cultural Transmission',
        level: 3,
      },
      {
        type: 'text',
        content: 'The knowledge and innovations of Mesopotamia spread throughout the ancient world. The Phoenicians adapted cuneiform to create an alphabet that would evolve into Greek and Latin scripts. Persian, Greek, and Roman empires all drew on Mesopotamian administrative and legal traditions.',
      },
      {
        type: 'heading',
        content: 'Archaeological Rediscovery',
        level: 3,
      },
      {
        type: 'text',
        content: 'For millennia, the great cities of Mesopotamia lay buried beneath desert sands. In the 19th century, archaeologists began uncovering these lost civilizations, revealing their achievements to the modern world. The decipherment of cuneiform opened a window into humanity\'s earliest written records.',
      },
      {
        type: 'heading',
        content: 'The Eternal Legacy',
        level: 4,
      },
      {
        type: 'text',
        content: 'Every time we write a law, tell a story, build a city, or gaze at the stars, we walk in the footsteps of the ancient Mesopotamians. Their legacy is not just in ruins and artifacts, but in the fundamental structures of civilization itself. They showed humanity what was possible when people came together to build, create, and dream of a better world.',
      },
    ],
  },
];

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
              <ChapterAccordion chapters={ topic?.chapters || mockChapters} />
            </motion.section>

            <Separator className={theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} />

            {/* Media Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MediaGallery media={mockMedia} />
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