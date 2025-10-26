"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { mockUploadMedia } from "@/lib/mock-api"
import { useToast } from "./toast"

interface MediaUploadProps {
  onUploadComplete: (media: MediaItem) => void
}

export function MediaUpload({ onUploadComplete }: MediaUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [altText, setAltText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { addToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setCaption(selectedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-blue-50")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-blue-50")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-blue-50")
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      setCaption(droppedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = async () => {
    if (!file || !caption || !altText) {
      addToast("Please fill in all fields", "error")
      return
    }

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
    }, 200)

    try {
      const media = await mockUploadMedia(file, caption, altText)
      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        onUploadComplete(media)
        setFile(null)
        setCaption("")
        setAltText("")
        setProgress(0)
        setUploading(false)
        addToast("Media uploaded successfully", "success")
      }, 500)
    } catch (error) {
      clearInterval(progressInterval)
      setUploading(false)
      addToast("Upload failed", "error")
    }
  }

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/50"
      >
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*"
          disabled={uploading}
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium text-foreground">Drag and drop your file here</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
        </label>
      </div>

      {/* File Preview */}
      {file && (
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              disabled={uploading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 mb-4">
            <div className="input-group">
              <label className="input-label">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Media caption"
                disabled={uploading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Alt Text</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive alt text for accessibility"
                disabled={uploading}
              />
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
            </div>
          )}

          {/* Upload Button */}
          <button onClick={handleUpload} disabled={uploading} className="btn-primary w-full">
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      )}
    </div>
  )
}
