"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface TagInputProps {
  label: string;
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ label="Tags", value, onChange, placeholder = `Add ${label.toLowerCase()} and press Enter` }: TagInputProps) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault()
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()])
      }
      setInput("")
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 border border-border rounded-md">
        {value.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:opacity-80 transition-opacity" type="button">
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 outline-none bg-transparent text-foreground placeholder-muted-foreground min-w-[100px]"
        />
      </div>
    </div>
  )
}
