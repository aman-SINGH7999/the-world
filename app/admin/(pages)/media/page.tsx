"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, Search } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { MediaUpload } from "@/components/media-upload"
import { useToast } from "@/components/toast"
import axios from "axios"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

export default function MediaPage() {
  const [tab, setTab] = useState<"upload" | "library">("library")
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const totalPages = Math.ceil(total / limit)

  const loadMedia = async (searchTerm = search, pageNum = page) => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/admin/media`, {
        params: { search: searchTerm, page: pageNum, limit },
      })
      setMedia(data.media)
      setTotal(data.total)
      setLoading(false)
    } catch (err) {
      console.error(err)
      addToast("Failed to load media", "error")
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    await loadMedia(search, 1)
  }

  const handlePageChange = async (newPage: number) => {
    setPage(newPage)
    await loadMedia(search, newPage)
  }

  const handleUploadComplete = (newMedia: MediaItem) => {
    setMedia([newMedia, ...media])
    setTab("library")
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/media/${id}`)
      setMedia(media.filter((m) => m._id !== id))
      addToast("Media deleted", "success")
    } catch (error) {
      addToast("Failed to delete", "error")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Media Library</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setTab("library")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            tab === "library"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setTab("upload")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            tab === "upload"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Upload
        </button>
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
                    {item.type === "image" ? (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.altText}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                    ) : (
                      <div className="w-full h-40 bg-muted rounded-md mb-3 flex items-center justify-center">
                        <Upload size={32} className="text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-medium text-foreground truncate">{item.caption}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{item.provider}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.url)
                          addToast("URL copied to clipboard", "success")
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
                    {[...Array(totalPages)].map((_, i) => (
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
