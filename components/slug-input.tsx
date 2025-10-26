"use client"

import { useEffect, useState } from "react"

interface SlugInputProps {
  title: string
  value: string
  onChange: (slug: string) => void
}

export function SlugInput({ title, value, onChange }: SlugInputProps) {
  const [isAuto, setIsAuto] = useState(true)

  useEffect(() => {
    if (isAuto && title) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
      
      if (slug !== value) {
        onChange(slug)
      }
    }
  }, [title, isAuto, value, onChange])

  return (
    <div className="input-group">
      <div className="flex items-center justify-between">
        <label className="input-label">Slug</label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isAuto} onChange={(e) => setIsAuto(e.target.checked)} className="w-4 h-4" />
          <span className="text-muted-foreground">Auto-generate</span>
        </label>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isAuto}
        placeholder="topic-slug"
        pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
      <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase, hyphens only)</p>
    </div>
  )
}
