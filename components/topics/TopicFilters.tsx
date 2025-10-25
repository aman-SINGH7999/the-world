/**
 * Topic Filters Component
 * Filter controls for topics by category, era, and type
 */

import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface FilterOptions {
  categories: string[];
  eras: string[];
  selectedCategory: string;
  selectedEra: string;
}

interface TopicFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filterType: 'category' | 'era', value: string) => void;
  onClearFilters: () => void;
}

export function TopicFilters({ filters, onFilterChange, onClearFilters }: TopicFiltersProps) {
  const hasActiveFilters = filters.selectedCategory !== 'All' || filters.selectedEra !== 'All';

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-amber-500"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="text-sm text-slate-400 mb-3 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((category) => (
              <Badge
                key={category}
                onClick={() => onFilterChange('category', category)}
                className={`cursor-pointer transition-all ${
                  filters.selectedCategory === category
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Era Filter */}
        <div>
          <label className="text-sm text-slate-400 mb-3 block">Era</label>
          <div className="flex flex-wrap gap-2">
            {filters.eras.map((era) => (
              <Badge
                key={era}
                onClick={() => onFilterChange('era', era)}
                className={`cursor-pointer transition-all ${
                  filters.selectedEra === era
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {era}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
