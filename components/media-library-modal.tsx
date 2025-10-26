"use client"

import { useState, useEffect } from "react"
import { X, Upload, Search } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { mockGetMedia } from "@/lib/mock-api"
import { useTheme } from "@/components/common/ThemeProvider"

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (isOpen) {
      loadMedia()
    }
  }, [isOpen])

  const loadMedia = async () => {
    setLoading(true)
    const data = await mockGetMedia()
    setMedia(data)
    setLoading(false)
  }

  const filteredMedia = media.filter(
    (m) =>
      m.caption.toLowerCase().includes(search.toLowerCase()) || m.altText.toLowerCase().includes(search.toLowerCase()),
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Select Media</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
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
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading media...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMedia.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item)
                    onClose()
                  }}
                  className="group relative overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.altText}
                      className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted flex items-center justify-center">
                      <Upload size={24} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{item.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
