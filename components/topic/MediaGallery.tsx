/**
 * Media Gallery Component
 * Gallery for images, videos, and audio related to a topic
 */
'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, Music, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../common/ThemeProvider';

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const { theme } = useTheme();

  const images = media.filter((item) => item.type === 'image');
  const videos = media.filter((item) => item.type === 'video');
  const audios = media.filter((item) => item.type === 'audio');

  const getFilteredMedia = () => {
    if (activeTab === 'all') return media;
    return media.filter((item) => item.type === activeTab);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      default:
        return ImageIcon;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Media Gallery
        </h2>
        <div
          className={`flex gap-2 text-sm ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <span>{images.length} Images</span>
          <span>•</span>
          <span>{videos.length} Videos</span>
          <span>•</span>
          <span>{audios.length} Audio</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList
          className={
            theme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-slate-100 border border-slate-200'
          }
        >
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            All Media
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Images ({images.length})
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Audio ({audios.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getFilteredMedia().map((item, index) => {
              const Icon = getMediaIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedMedia(item)}
                  className={`group relative aspect-square ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                  } rounded-lg overflow-hidden cursor-pointer border-2 ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                  } hover:border-amber-500 transition-all`}
                >
                  {item.type === 'image' && (
                    <ImageWithFallback
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}

                  {item.type !== 'image' && (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                      }`}
                    >
                      <Icon
                        className={`w-12 h-12 ${
                          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  )}

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-t from-slate-900 via-transparent to-transparent'
                        : 'bg-gradient-to-t from-white via-transparent to-transparent'
                    } opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          } text-sm truncate`}
                        >
                          {item.title}
                        </span>
                        <ZoomIn className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={
                        theme === 'dark' ? 'bg-slate-900/80 rounded-full p-1.5' : 'bg-white/80 rounded-full p-1.5'
                      }
                    >
                      <Icon className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Media Preview Dialog */}
      <Dialog open={selectedMedia !== null} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent
          className={`max-w-4xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          {selectedMedia && (
            <div className="space-y-4">
              <DialogTitle
                className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              >
                {selectedMedia.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Preview of {selectedMedia.type} media: {selectedMedia.title}
              </DialogDescription>

              <div
                className={`aspect-video ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                } rounded-lg overflow-hidden`}
              >
                {selectedMedia.type === 'image' && (
                  <ImageWithFallback
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-full object-contain"
                  />
                )}
                {selectedMedia.type === 'video' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video
                      className={`w-16 h-16 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
                    />
                    <p className={theme === 'dark' ? 'ml-4 text-slate-400' : 'ml-4 text-slate-600'}>
                      Video player placeholder
                    </p>
                  </div>
                )}
                {selectedMedia.type === 'audio' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music
                      className={`w-16 h-16 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
                    />
                    <p className={theme === 'dark' ? 'ml-4 text-slate-400' : 'ml-4 text-slate-600'}>
                      Audio player placeholder
                    </p>
                  </div>
                )}
              </div>

              {selectedMedia.description && (
                <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                  {selectedMedia.description}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}