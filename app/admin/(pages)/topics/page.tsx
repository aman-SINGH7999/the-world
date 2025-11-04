"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Plus, Edit, Trash2, Search as SearchIcon } from "lucide-react"

import { ITopic } from "@/models/Topic"
import { useToast } from "@/components/toast"
import { ConfirmModal } from "@/components/confirm-modal"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

const DEFAULT_LIMIT = 20

export default function TopicsPage() {
  const [topics, setTopics] = useState<ITopic[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; topicId?: string }>({
    isOpen: false,
  })
  const { addToast } = useToast()

  // pagination state returned by API
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT)
  const [total, setTotal] = useState<number>(0)
  const totalPages = Math.max(1, Math.ceil(total / limit))

  // error state
  const [error, setError] = useState<string | null>(null)

  // build query params
  const buildParams = useCallback(() => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(limit))
    if (search.trim()) params.set("q", search.trim())
    // you can add status/category filters here if UI adds them later
    return params.toString()
  }, [page, limit, search])

  const loadTopics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = buildParams()
      const { data } = await axios.get(`/api/admin/topics?${query}`)
      // API returns topics, total, totalPages, page, limit
      setTopics(Array.isArray(data.topics) ? data.topics : [])
      setTotal(typeof data.total === "number" ? data.total : 0)
      // sync page/limit from server if provided
      if (typeof data.page === "number") setPage(data.page)
      if (typeof data.limit === "number") setLimit(data.limit)
    } catch (err) {
      console.error("Failed to load topics", err)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || "Failed to load topics")
      } else {
        setError("Unexpected error occurred while loading topics")
      }
      setTopics([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  // initial load + when page/limit/search changes
  useEffect(() => {
    loadTopics()
  }, [loadTopics])

  // Search handler — reset to page 1 when searching
  const onSearchSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setPage(1)
    // loadTopics will run because page changes OR call explicitly
    await loadTopics()
  }

  // Delete handler
  const handleDelete = async () => {
    const id = deleteConfirm.topicId
    if (!id) return

    try {
      setLoading(true)
      // call real API delete — adjust endpoint if you use soft-delete/archive instead
      await axios.delete(`/api/admin/topics/${id}`)
      addToast("Topic deleted successfully", "success")
      // reload current page (ensure if last item removed and page becomes empty, go to previous page)
      // naive reload:
      await loadTopics()
      setDeleteConfirm({ isOpen: false })
    }catch (err) {
      console.error("Failed to delete topic", err)
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Unexpected error occurred while deleting topic"

      addToast(message, "error")
      setDeleteConfirm({ isOpen: false })
      setLoading(false)
    }
  }

  // render page numbers (compact with ellipsis)
  const paginationRange = useMemo(() => {
    const current = page
    const last = totalPages
    const delta = 2 // show 2 pages around current
    const range: (number | "..." )[] = []
    let l = 0

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        if (l + 1 !== i) {
          // gap — add ellipsis
          if (range[range.length - 1] !== "...") range.push("...")
        }
        range.push(i)
        l = i
      }
    }
    return range
  }, [page, totalPages])

  // small helpers
  const goToPage = (p: number) => {
    if (p < 1) p = 1
    if (p > totalPages) p = totalPages
    setPage(p)
  }
  const onPrev = () => goToPage(page - 1)
  const onNext = () => goToPage(page + 1)

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
      <form onSubmit={onSearchSubmit} className="mb-6">
        <div className="relative">
          <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </form>

      {/* error */}
      {error && <p className="text-sm text-error mb-4">{error}</p>}

      {/* Topics Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading topics...</p>
        ) : topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No topics found</p>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Updated</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => {
            
                  return (
                    <tr key={topic._id!.toString()} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">{topic.title}</td>
                      <td className="px-4 py-3 text-muted-foreground text-sm flex flex-wrap items-center">
                        {
                          topic?.category?.map((cat,i)=> <div key={i} className="mr-1 opacity-90">{cat}, </div>)
                        }
                      </td>
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
                        {topic.updatedAt ? new Date(topic.updatedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/topics/${topic._id}/edit`}
                            className="p-2 hover:bg-muted rounded-md transition-colors text-primary"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, topicId: topic._id as string })}
                            className="p-2 hover:bg-muted rounded-md transition-colors text-error"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
              </div>

              <Pagination aria-label="Pagination" className="mt-2 sm:mt-0">
                <PaginationContent>
                  <PaginationPrevious onClick={onPrev} aria-disabled={page <= 1} />
                  {paginationRange.map((p, idx) =>
                    p === "..." ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => goToPage(Number(p))}
                          isActive={p === page}
                          href="#"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationNext onClick={onNext} aria-disabled={page >= totalPages} />
                </PaginationContent>
              </Pagination>
            </div>
          </>
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
