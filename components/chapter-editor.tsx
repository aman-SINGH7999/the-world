"use client"

import { useState } from "react"
import type { Chapter, Block } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface ChapterEditorProps {
  chapter: Chapter
  index: number
  onUpdate: (chapter: Chapter) => void
  onDelete: () => void
}

export function ChapterEditor({ chapter, index, onUpdate, onDelete }: ChapterEditorProps) {
  const [expanded, setExpanded] = useState(true)

  const updateChapter = (updates: Partial<Chapter>) => {
    onUpdate({ ...chapter, ...updates })
  }

  const addBlock = (type: Block["type"]) => {
    const newBlock: Block = {
      id: "block-" + Date.now(),
      type,
      content: "",
    }
    updateChapter({ blocks: [...chapter.blocks, newBlock] })
  }

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const updated = chapter.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b))
    updateChapter({ blocks: updated })
  }

  const deleteBlock = (blockId: string) => {
    updateChapter({ blocks: chapter.blocks.filter((b) => b.id !== blockId) })
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-muted cursor-pointer hover:bg-gray-500 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <input
            type="text"
            value={chapter.title}
            onChange={(e) => updateChapter({ title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-foreground bg-transparent outline-none"
            placeholder="Chapter title"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 hover:bg-red-400 rounded-md transition-colors text-error"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-border">
          {/* Blocks */}
          <div className="space-y-3">
            {chapter.blocks.map((block) => (
              <BlockEditor
                key={block.id}
                block={block}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onDelete={() => deleteBlock(block.id)}
              />
            ))}
          </div>

          {/* Add Block Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => addBlock("paragraph")}
              className="flex items-center gap-1 text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Paragraph
            </button>
            <button
              type="button"
              onClick={() => addBlock("heading")}
              className="flex items-center gap-1 text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Heading
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="flex items-center gap-1 text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Image
            </button>
            <button
              type="button"
              onClick={() => addBlock("video")}
              className="flex items-center gap-1 text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Video
            </button>
            <button
              type="button"
              onClick={() => addBlock("list")}
              className="flex items-center gap-1 text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              List
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
}) {
  return (
    <div className="p-3 border border-border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase">{block.type}</span>
        <button onClick={onDelete} className="p-1 hover:bg-red-500 rounded-md transition-colors text-error">
          <Trash2 size={16} />
        </button>
      </div>

      {block.type === "paragraph" && (
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter paragraph text"
          rows={3}
          className="w-full resize-none"
        />
      )}

      {block.type === "heading" && (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter heading text"
          className="w-full"
        />
      )}

      {(block.type === "image" || block.type === "video") && (
        <input
          type="url"
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter media URL"
          className="w-full"
        />
      )}

      {block.type === "list" && (
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Enter list items (one per line)"
          rows={3}
          className="w-full resize-none"
        />
      )}
    </div>
  )
}
