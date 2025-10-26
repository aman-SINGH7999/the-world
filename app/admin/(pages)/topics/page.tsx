"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import type { Topic } from "@/lib/types"
import { mockGetTopics, mockDeleteTopic } from "@/lib/mock-api"
import { useToast } from "@/components/toast"
import { ConfirmModal } from "@/components/confirm-modal"

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; topicId?: string }>({ isOpen: false })
  const { addToast } = useToast()

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    setLoading(true)
    const data = await mockGetTopics()
    setTopics(data)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.topicId) return

    await mockDeleteTopic(deleteConfirm.topicId)
    setTopics(topics.filter((t) => t.id !== deleteConfirm.topicId))
    setDeleteConfirm({ isOpen: false })
    addToast("Topic deleted successfully", "success")
  }

  const filteredTopics = topics.filter(
    (t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Topics</h1>
        <Link href="/admin/topics/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Topic
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Topics Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading topics...</p>
        ) : filteredTopics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No topics found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Updated</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map((topic) => (
                <tr key={topic.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{topic.title}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{topic.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        topic.status === "published" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                      }`}
                    >
                      {topic.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {new Date(topic.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/topics/${topic.id}/edit`}
                        className="p-2 hover:bg-muted rounded-md transition-colors text-primary"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, topicId: topic.id })}
                        className="p-2 hover:bg-muted rounded-md transition-colors text-error"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Topic"
        message="Are you sure you want to delete this topic? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
      />
    </div>
  )
}
