"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { ITopic } from "@/lib/types";
import { TopicCard } from "@/components/topics/TopicCard";
import { TopicFilters, FilterOptions } from "@/components/topics/TopicFilters";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [era, setEra] = useState("");
  const [category, setCategory] = useState("");
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // filters for TopicFilters component (local)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: ["All", "History", "Science", "Nature", "Culture", "Geography", "Biology", "Oceans", "Technology"],
    eras: ["All", "Ancient", "Medieval", "Modern", "Contemporary"],
    selectedCategory: "All",
    selectedEra: "All",
  });

  // Debounce search input (400ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // build params for server request
  const buildParams = useCallback(
    (p = page) => {
      const params: Record<string, string | number> = {
        page: p,
        limit,
      };
      if (debouncedQuery) params.q = debouncedQuery;
      if (era) params.era = era;
      if (category) params.category = category;
      return params;
    },
    [debouncedQuery, era, category, page, limit]
  );

  // fetch topics from server
  const fetchTopics = useCallback(
    async (p = 1) => {
      try {
        setLoading(true);
        const params = buildParams(p);
        const { data } = await axios.get("/api/admin/topics", { params });
        setTopics(Array.isArray(data?.topics) ? data.topics : []);
        setPage(Number(data?.page || p));
        setTotalPages(Number(data?.totalPages || 1));
        setTotal(Number(data?.total || 0));
      } catch (err) {
        console.error("Failed to fetch topics", err);
        setTopics([]);
        setTotalPages(1);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  // initial load + when debouncedQuery / era / category change -> go to page 1
  useEffect(() => {
    setPage(1);
    fetchTopics(1);
  }, [debouncedQuery, era, category, fetchTopics]);

  // when page changes (by pagination UI), fetch that page
  useEffect(() => {
    fetchTopics(page);
  }, [page, fetchTopics]);

  // handlers for TopicFilters
  const handleFilterChange = (filterType: "category" | "era", value: string) => {
    if (filterType === "category") {
      setFilters((prev) => ({ ...prev, selectedCategory: value }));
      setCategory(value === "All" ? "" : value);
    } else {
      setFilters((prev) => ({ ...prev, selectedEra: value }));
      setEra(value === "All" ? "" : value);
    }
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({ ...prev, selectedCategory: "All", selectedEra: "All" }));
    setCategory("");
    setEra("");
    setSearchQuery("");
  };

  // Pagination helpers (render numeric pages compactly)
  const paginationRange = useMemo(() => {
    const current = page;
    const last = totalPages;
    const delta = 2;
    const range: (number | "...")[] = [];
    let l = 0;
    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        if (l + 1 !== i) {
          if (range[range.length - 1] !== "...") range.push("...");
        }
        range.push(i);
        l = i;
      }
    }
    return range;
  }, [page, totalPages]);

  const goToPage = (p: number) => {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl text-white mb-4">Explore Topics</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Discover fascinating stories from history, science, nature, and culture</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 py-6 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-amber-500" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-1">
            <TopicFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
          </motion.div>

          {/* Topics Grid */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
            {/* Summary + results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400">
                Showing {topics.length} of {total} {total === 1 ? "topic" : "topics"}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400">Loading topics…</div>
            ) : topics.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topics.map((topic, index) => (
                    <TopicCard key={String(topic._id)} topic={topic} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationPrevious onClick={() => goToPage(page - 1)} aria-disabled={page <= 1} />
                        {paginationRange.map((p, idx) =>
                          p === "..." ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={p}>
                              <PaginationLink onClick={() => goToPage(Number(p))} isActive={p === page} href="#" >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationNext onClick={() => goToPage(page + 1)} aria-disabled={page >= totalPages} />
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-slate-400">No topics found matching your criteria.</p>
                <button onClick={handleClearFilters} className="mt-4 text-amber-500 hover:text-amber-400 underline">Clear all filters</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
