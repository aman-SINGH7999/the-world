/**
 * World Map Component
 * Interactive world map with topic markers and tooltips
 */
'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

export interface MapMarker {
  id: string;
  topicId: string;
  title: string;
  category: string;
  description: string;
  image: string;
  position: { x: number; y: number }; // Percentage positions
}

interface WorldMapProps {
  markers: MapMarker[];
}

export function WorldMap({ markers }: WorldMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const router = useRouter();

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700">
      {/* World Map Background */}
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1619469399933-05d6e31688d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMGdlb2dyYXBoeXxlbnwxfHx8fDE3NjExNzY1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="World Map"
        className="w-full h-full object-cover opacity-40"
      />

      {/* Markers */}
      {markers.map((marker, index) => (
        <motion.div
          key={marker.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          style={{
            position: 'absolute',
            left: `${marker.position.x}%`,
            top: `${marker.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setHoveredMarker(marker)}
          onMouseLeave={() => setHoveredMarker(null)}
          onClick={() => setSelectedMarker(marker)}
          className="cursor-pointer z-10"
        >
          {/* Marker Pin */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500 border-4 border-white shadow-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white fill-white" />
            </div>
            
            {/* Pulse Animation */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full bg-amber-500"
            />
          </motion.div>

          {/* Hover Tooltip */}
          {hoveredMarker?.id === marker.id && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none"
            >
              <Card className="bg-slate-900 border-amber-500 p-3 min-w-[200px] shadow-xl">
                <Badge className="bg-amber-500 text-white mb-2">{marker.category}</Badge>
                <p className="text-white text-sm">{marker.title}</p>
              </Card>
              {/* Arrow */}
              <div className="w-3 h-3 bg-slate-900 border-r border-b border-amber-500 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Selected Marker Side Panel */}
      {selectedMarker && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-slate-900 border-l-2 border-amber-500 overflow-y-auto z-20"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl text-white">Topic Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedMarker.image}
                  alt={selectedMarker.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <Badge className="bg-amber-500 text-white">{selectedMarker.category}</Badge>

              <h4 className="text-xl text-white">{selectedMarker.title}</h4>
              
              <p className="text-slate-300">{selectedMarker.description}</p>

              <Button
                onClick={() => {
                  router.push(`/topicdetail/${selectedMarker.topicId}`);
                  setSelectedMarker(null);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                Explore Topic
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
