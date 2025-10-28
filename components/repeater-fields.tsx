"use client"

import { Plus, X } from "lucide-react"

interface RepeaterItem {
  title: string
  url?: string
}

interface RepeaterFieldsProps {
  value: RepeaterItem[]
  onChange: (items: RepeaterItem[]) => void
  label?: string
}

export function RepeaterFields({ value, onChange, label = "Items" }: RepeaterFieldsProps) {
  const addItem = () => {
    onChange([...value, { title: "", url: "" }])
  }

  const updateItem = (index: number, field: keyof RepeaterItem, val: string) => {
    const updated = [...value]
    updated[index][field] = val
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="input-group">
      <div className="flex items-center justify-between mb-2">
        <label className="input-label">{label}</label>
        <button
          onClick={addItem}
          type="button"
          className="flex items-center gap-1 text-sm text-primary hover:text-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              placeholder="Title"
              className="flex-1 border px-2 rounded-lg"
            />
            <input
              type="url"
              value={item.url}
              onChange={(e) => updateItem(index, "url", e.target.value)}
              placeholder="URL"
              className="flex-1 border px-2 rounded-lg"
            />
            <button
              onClick={() => removeItem(index)}
              type="button"
              className="p-2 hover:bg-muted rounded-md transition-colors text-error"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
