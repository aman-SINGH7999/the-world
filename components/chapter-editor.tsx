"use client"

import { useState } from "react"
import type { IChapter, IContentBlock } from "@/lib/types"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface ChapterEditorProps {
  chapter: IChapter
  index: number
  onUpdate: (chapter: IChapter) => void
  onDelete: () => void
}

export function ChapterEditor({ chapter, index, onUpdate, onDelete }: ChapterEditorProps) {
  const [expanded, setExpanded] = useState(true)

  const updateChapter = (updates: Partial<IChapter>) => {
    onUpdate({ ...chapter, ...updates })
  }

  const addBlock = (type: IContentBlock["type"]) => {
    const newBlock: IContentBlock = {
      _id: new Date().getTime().toString(),
      type,
      text: "",
      items: [],
      url: "",
    }
    updateChapter({ blocks: [...(chapter.blocks || []), newBlock] })
  }

  const updateBlock = (blockId: string, updates: Partial<IContentBlock>) => {
    const updatedBlocks = (chapter.blocks || []).map((b) =>
      b._id === blockId ? { ...b, ...updates } : b,
    )
    updateChapter({ blocks: updatedBlocks })
  }

  const deleteBlock = (blockId: string) => {
    updateChapter({
      blocks: (chapter.blocks || []).filter((b) => b._id !== blockId),
    })
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4  cursor-pointer transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <input
            type="text"
            value={chapter.title}
            onChange={(e) => updateChapter({ title: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="font-medium bg-transparent outline-none"
            placeholder="Chapter title"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 hover:bg-red-200 rounded-md text-red-600 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Blocks */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-gray-200">
          {(chapter.blocks || []).map((block) => (
            <BlockEditor
              key={block._id?.toString()}
              block={block}
              onUpdate={(updates) => updateBlock(block._id ?? "", updates)}
              onDelete={() => deleteBlock(block._id ?? "")}
            />
          ))}

          {/* Add Block Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {["paragraph", "heading", "image", "video", "list", "quote", "embed"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type as IContentBlock["type"])}
                className="flex items-center gap-1 text-sm px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <Plus size={16} />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
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
  block: IContentBlock
  onUpdate: (updates: Partial<IContentBlock>) => void
  onDelete: () => void
}) {
  return (
    <div className="p-3 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium uppercase">{block.type}</span>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-200 rounded-md text-red-600 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Paragraph */}
      {block.type === "paragraph" && (
        <textarea
          value={block.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter paragraph text"
          rows={3}
          className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
        />
      )}

      {/* Heading */}
      {block.type === "heading" && (
        <input
          type="text"
          value={block.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter heading text"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      )}

      {/* Image / Video / Embed */}
      {(block.type === "image" || block.type === "video" || block.type === "embed") && (
        <>
          <input
            type="url"
            value={block.url || ""}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="Enter media URL"
            className="w-full border border-gray-300 rounded-md p-2 text-sm mb-2"
          />
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </>
      )}

      {/* Quote */}
      {block.type === "quote" && (
        <textarea
          value={block.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Enter quote text"
          rows={3}
          className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
        />
      )}

      {/* List */}
      {block.type === "list" && (
        <textarea
          value={(block.items || []).join("\n")}
          onChange={(e) => onUpdate({ items: e.target.value.split("\n") })}
          placeholder="Enter list items (one per line)"
          rows={3}
          className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
        />
      )}
    </div>
  )
}
