"use client"

import { useState, useEffect, useCallback, FormEvent } from "react"
import { Upload, Trash2, Search } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { MediaUpload } from "@/components/media-upload"
import { useToast } from "@/components/toast"
import axios from "axios"
import Image from "next/image"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

// ✅ Response shape from API
interface MediaResponse {
  media: MediaItem[]
  total: number
  page: number
  limit: number
}

export default function MediaPage() {
  const [tab, setTab] = useState<"upload" | "library">("library")
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(12)
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)))

  // ✅ Clean normalize function — safe for frontend
  const normalize = (items: unknown[]): MediaItem[] => {
    if (!Array.isArray(items)) return []
    return items.map((m) => {
      const item = m as Partial<MediaItem> & { id?: string }
      return {
        _id: String(item._id ?? item.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
        type: item.type ?? "image",
        url: item.url ?? "",
        provider: item.provider ?? "other",
        thumbnailUrl: item.thumbnailUrl,
        caption: item.caption,
        altText: item.altText,
        uploadedAt: item.uploadedAt ?? new Date().toISOString(),
      }
    })
  }

  // ✅ Load media
  const loadMedia = useCallback(
    async (searchTerm = search, pageNum = page): Promise<void> => {
      setLoading(true)
      try {
        const { data } = await axios.get<MediaResponse>("/api/admin/media", {
          params: { search: searchTerm, page: pageNum, limit },
        })

        const items = normalize(data.media)
        setMedia(items)
        setTotal(typeof data.total === "number" ? data.total : items.length)
      } catch (err) {
        console.error("Failed to load media", err)
        addToast("Failed to load media", "error")
        setMedia([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    [search, page, limit, addToast]
  )

  useEffect(() => {
    Promise.resolve().then(() => {
      loadMedia()
    })
  }, [loadMedia])

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPage(1)
    await loadMedia(search, 1)
  }

  const handlePageChange = async (newPage: number) => {
    setPage(newPage)
    await loadMedia(search, newPage)
  }

  // ✅ Upload handler now uses MediaItem
  const handleUploadComplete = (newMedia: MediaItem) => {
    const safe: MediaItem = {
      ...newMedia,
      _id: String(newMedia._id ?? `${Date.now()}`),
      uploadedAt: newMedia.uploadedAt ?? new Date().toISOString(),
    }
    setMedia((prev) => [safe, ...prev])
    setTotal((t) => t + 1)
    setTab("library")
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/media/${id}`)
      setMedia((prev) => prev.filter((m) => m._id !== id))
      setTotal((t) => Math.max(0, t - 1))
      addToast("Media deleted", "success")
    } catch (error) {
      console.error("Failed to delete media", error)
      addToast("Failed to delete", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Media Library</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {(["library", "upload"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {key === "library" ? "Library" : "Upload"}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {tab === "upload" && (
        <div className="card">
          <MediaUpload onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Library Tab */}
      {tab === "library" && (
        <div>
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          {/* Media Grid */}
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading media...</p>
          ) : media.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No media found</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {media.map((item) => (
                  <div key={item._id} className="card group">
                    {item.type === "image" && item.url ? (
                      <div className="w-full h-40 relative rounded-md mb-3 overflow-hidden">
                        <Image
                          src={item.url}
                          alt={item.altText ?? item.caption ?? "media"}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-muted rounded-md mb-3 flex items-center justify-center">
                        <Upload size={32} className="text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-medium text-foreground truncate">{item.caption || "Untitled"}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{item.provider || "local"}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (item.url) {
                            navigator.clipboard.writeText(item.url)
                            addToast("URL copied to clipboard", "success")
                          }
                        }}
                        className="flex-1 btn-secondary text-sm bg-black/20 rounded-md"
                      >
                        Copy URL
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 hover:bg-red-100 rounded-md transition-colors text-error"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(page + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
