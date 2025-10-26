"use client"

import { useState } from "react"
import { Upload, Trash2, Search } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { mockGetMedia, mockDeleteMedia } from "@/lib/mock-api"
import { MediaUpload } from "@/components/media-upload"
import { useToast } from "@/components/toast"
import { useEffect } from "react"

export default function MediaPage() {
  const [tab, setTab] = useState<"upload" | "library">("library")
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    setLoading(true)
    const data = await mockGetMedia()
    setMedia(data)
    setLoading(false)
  }

  const handleUploadComplete = (newMedia: MediaItem) => {
    setMedia([newMedia, ...media])
    setTab("library")
  }

  const handleDelete = async (id: string) => {
    await mockDeleteMedia(id)
    setMedia(media.filter((m) => m.id !== id))
    addToast("Media deleted", "success")
  }

  const filteredMedia = media.filter(
    (m) =>
      m.caption.toLowerCase().includes(search.toLowerCase()) || m.altText.toLowerCase().includes(search.toLowerCase()),
  )

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
          <div className="mb-6">
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
          </div>

          {/* Media Grid */}
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading media...</p>
          ) : filteredMedia.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No media found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="card group">
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
                      className="flex-1 btn-secondary text-sm"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-100 rounded-md transition-colors text-error"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
