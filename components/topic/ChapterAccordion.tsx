/**
 * Chapter Accordion Component
 * Collapsible chapter sections for topic detail pages
 */

import React from 'react';
import { ChevronDown, PlayCircle } from 'lucide-react';
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

export interface Chapter {
  id: string;
  number: number;
  title: string;
  duration: string;
  sections: ChapterSection[];
  hasVideo?: boolean;
}

interface ChapterAccordionProps {
  chapters: Chapter[];
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const { theme } = useTheme();

  const renderSection = (section: ChapterSection, index: number) => {
    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${section.level || 3}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            className={`${
              section.level === 3 ? 'text-2xl' : section.level === 4 ? 'text-xl' : 'text-lg'
            } ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mt-6 mb-3`}
          >
            {section.content}
          </HeadingTag>
        );

      case 'text':
        return (
          <p
            key={index}
            className={`${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            } leading-relaxed mb-4`}
          >
            {section.content}
          </p>
        );

      case 'image':
        return (
          <div key={index} className="my-6">
            <ImageWithFallback
              src={section.content}
              alt={section.caption || 'Chapter image'}
              className="w-full rounded-lg object-cover max-h-96"
            />
            {section.caption && (
              <p
                className={`text-sm italic mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {section.caption}
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

        const videoId = getYouTubeId(section.content);

        return (
          <div key={index} className="my-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={section.caption || 'Chapter video'}
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
            {section.caption && (
              <p
                className={`text-sm italic mt-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {section.caption}
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
        {chapters.map((chapter) => (
          <AccordionItem
            key={chapter.id}
            value={chapter.id}
            className={`${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 data-[state=open]:border-amber-500'
                : 'bg-white border-slate-200 data-[state=open]:border-amber-500'
            } rounded-lg overflow-hidden`}
          >
            <AccordionTrigger
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
                    <span className="text-amber-500">{chapter.number}</span>
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
                        {chapter.duration}
                      </span>
                      {chapter.hasVideo && (
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
                {chapter.sections.map((section, index) => renderSection(section, index))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}