"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { useToast } from "./toast"
import axios from "axios"

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

    try {
      // 1) Get presign data from server
      const { data: presign } = await axios.post("/api/admin/media/presign")
      console.log("presign:", presign)

      const { timestamp, signature, apiKey, cloudName, uploadPreset } = presign

      // 2) Prepare FormData for Cloudinary
      const formData = new FormData()
      formData.append("file", file)

      // If server returned apiKey + signature -> signed upload
      if (apiKey && signature && timestamp) {
        formData.append("api_key", apiKey)
        formData.append("timestamp", String(timestamp))
        if (uploadPreset) formData.append("upload_preset", uploadPreset)
        formData.append("signature", signature)
      } else if (uploadPreset) {
        // unsigned preset flow (no signature/api_key/timestamp)
        formData.append("upload_preset", uploadPreset)
      }

      // 3) Upload to Cloudinary (auto endpoint handles image/video/raw)
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setProgress(percent)
          },
        },
      )

      console.log("cloudinary upload response:", uploadRes.data)
      const uploadData = uploadRes.data

      // 4) Save media metadata in your backend
      const { data: saveRes } = await axios.post("/api/admin/media", {
        type: uploadData.resource_type, // image / video / raw
        url: uploadData.secure_url,
        provider: "cloudinary",
        thumbnailUrl: uploadData.thumbnail_url || uploadData.secure_url,
        caption,
        altText,
      })

      // 5) finalize
      onUploadComplete(saveRes.media)
      setFile(null)
      setCaption("")
      setAltText("")
      setProgress(0)
      setUploading(false)
      addToast("Media uploaded successfully", "success")
    } catch (error) {
      console.error("Upload error full:", error)

      // ✅ Narrow `error` type safely
      if (axios.isAxiosError(error)) {
        // Agar AxiosError hai to ye safe hai
        console.error("Upload error response data:", error.response?.data)

        const cloudErrObj = error.response?.data?.error
        console.error("Cloudinary error object:", cloudErrObj)

        let message = "Upload failed"
        if (typeof cloudErrObj === "string") {
          message = cloudErrObj
        } else if (cloudErrObj?.message) {
          message = String(cloudErrObj.message)
        } else if (error.message) {
          message = error.message
        }

        setUploading(false)
        addToast(message, "error")
        return
      }

      // ✅ Fallback for non-Axios errors
      if (error instanceof Error) {
        console.error("Generic JS error:", error.message)
        addToast(error.message, "error")
      } else {
        console.error("Unknown error:", error)
        addToast("Upload failed (unknown error)", "error")
      }

      setUploading(false)
    }

  }

  return (
    <div className="space-y-6">
  {/* ✅ Drag & Drop Area */}
  <div
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    className={`
      group relative border-2 border-dashed rounded-2xl p-10 text-center
      transition-all cursor-pointer
      ${uploading ? "opacity-70 cursor-not-allowed" : "hover:border-primary/70 hover:bg-muted/60"}
      ${file ? "border-muted bg-muted/40" : "border-border bg-muted/30"}
    `}
  >
    <input
      type="file"
      id="file-input"
      onChange={handleFileChange}
      className="hidden"
      accept="image/*,video/*"
      disabled={uploading}
    />
    <label htmlFor="file-input" className="block cursor-pointer select-none">
      <Upload size={40} className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
      <p className="font-semibold text-foreground text-lg">Drag & drop your file here</p>
      <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
    </label>
  </div>

  {/* ✅ File Preview Card */}
  {file && (
    <div className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="font-semibold text-foreground">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={() => setFile(null)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          disabled={uploading}
        >
          <X size={18} className="text-muted-foreground hover:text-destructive" />
        </button>
      </div>

      {/* ✅ Form Fields */}
      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter media caption"
            disabled={uploading}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descriptive alt text (for accessibility)"
            disabled={uploading}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* ✅ Progress Bar */}
      {uploading && (
        <div className="mb-5">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* ✅ Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`
          w-full py-2.5 rounded-lg font-medium transition-all
          ${uploading
            ? "bg-primary/50 cursor-not-allowed text-white/70"
            : "bg-primary hover:bg-primary/90 text-white shadow"}
        `}
      >
        {uploading ? "Uploading..." : "Upload Media"}
      </button>
    </div>
  )}
</div>

  )
}
