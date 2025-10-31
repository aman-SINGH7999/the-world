/**
 * Chapter Accordion Component
 * Collapsible chapter sections for topic detail pages
 */

import React from 'react';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { IChapter, IContentBlock } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTheme } from '../common/ThemeProvider';

export interface ChapterSection {
  type: 'heading' | 'text' | 'image' | 'video';
  content: string;
  caption?: string;
  level?: number; // For headings (h3, h4, h5)
}



interface ChapterAccordionProps {
  chapters: IChapter[];
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const { theme } = useTheme();

  const renderSection = (block: IContentBlock) => {
    switch (block?.type) {
      case 'heading':
        const HeadingTag = `h${3}`;
        return (
          <HeadingTag
            key={block?._id}
            className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} mt-6 mb-3`}
          >
            {block?.text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p
            key={block?._id}
            className={`${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            } leading-relaxed mb-4`}
          >
            {block?.text}
          </p>
        );

      case 'image':
        return (
          <div key={block?._id} className="my-6">
            <ImageWithFallback
              src={block?.url}
              alt={block?.caption || 'Chapter image'}
              className="w-full rounded-lg object-cover max-h-96"
            />
            {block.caption && (
              <p
                className={`text-sm italic mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {block.caption}
              </p>
            )}
          </div>
        );

      case 'video':
        // Extract YouTube video ID from URL
        const getYouTubeId = (url: string) => {
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
          const match = url.match(regExp);
          return match && match[2].length === 11 ? match[2] : null;
        };

        const videoId = getYouTubeId(block?.url || "");

        return (
          <div key={block?._id} className="my-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={block?.caption || 'Chapter video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
                  }`}
                >
                  <PlayCircle className="w-16 h-16 text-amber-500" />
                </div>
              )}
            </div>
            {block.caption && (
              <p
                className={`text-sm italic mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {block.caption}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className={`text-3xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mb-6`}>
        Chapters
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        {chapters.map((chapter,i) => (
          <AccordionItem
            key={chapter._id}
            value={String(chapter._id)}
            className={`${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 data-[state=open]:border-amber-500'
                : 'bg-white border-slate-200 data-[state=open]:border-amber-500'
            } rounded-lg overflow-hidden`}
          >
            <AccordionTrigger
              onClick={(e) => {
                const target = e.currentTarget;
                setTimeout(() => {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 300);
              }}
              className={`px-6 py-4 hover:no-underline group ${
                theme === 'dark' ? 'data-[state=open]:bg-slate-700/50' : 'data-[state=open]:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full text-left">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-500/10'
                    } flex items-center justify-center group-hover:bg-amber-500/30 transition-colors`}
                  >
                    <span className="text-amber-500">{i+1}</span>
                  </div>
                  <div>
                    <h3
                      className={`${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      } group-hover:text-amber-500 transition-colors`}
                    >
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-sm ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {"chapter.duration"}
                      </span>
                      {chapter?._id === "video" && (
                        <span className="flex items-center gap-1 text-sm text-amber-500">
                          <PlayCircle className="w-4 h-4" />
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="pl-14">
                {chapter?.blocks?.map((block) => renderSection(block))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}