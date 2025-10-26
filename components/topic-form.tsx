"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Topic, Chapter } from "@/lib/types"
import { mockCreateTopic, mockUpdateTopic } from "@/lib/mock-api"
import { useToast } from "./toast"
import { SlugInput } from "./slug-input"
import { TagInput } from "./tag-input"
import { RepeaterFields } from "./repeater-fields"
import { MediaLibraryModal } from "./media-library-modal"
import { ConfirmModal } from "./confirm-modal"
import { ChapterEditor } from "./chapter-editor"
import { Plus } from "lucide-react"

interface TopicFormProps {
  initialTopic?: Topic
}

export function TopicForm({ initialTopic }: TopicFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [heroMediaId, setHeroMediaId] = useState(initialTopic?.heroMediaId || "")

  const [formData, setFormData] = useState({
    title: initialTopic?.title || "",
    slug: initialTopic?.slug || "",
    subtitle: initialTopic?.subtitle || "",
    category: initialTopic?.category || [],
    era: initialTopic?.era || "",
    timeline: initialTopic?.timeline || "",
    location: initialTopic?.location || "",
    summary: initialTopic?.summary || "",
    overview: initialTopic?.overview || "",
    keyPoints: initialTopic?.keyPoints || [],
    sources: initialTopic?.sources || [],
    chapters: initialTopic?.chapters || [{ id: "ch-1", title: "Chapter 1", blocks: [] }],
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.slug) {
      addToast("Title and slug are required", "error")
      return
    }

    setSaving(true)
    try {
      if (initialTopic) {
        await mockUpdateTopic(initialTopic.id, {
          ...formData,
          status: "draft",
          heroMediaId,
        })
      } else {
        await mockCreateTopic({
          ...formData,
          status: "draft",
          heroMediaId,
        })
      }
      addToast("Topic saved as draft", "success")
      router.push("/admin/topics")
    } catch (error) {
      addToast("Failed to save topic", "error")
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.title || !formData.slug || formData.chapters.length === 0) {
      addToast("Title, slug, and at least one chapter are required", "error")
      return
    }

    setSaving(true)
    try {
      if (initialTopic) {
        await mockUpdateTopic(initialTopic.id, {
          ...formData,
          status: "published",
          heroMediaId,
        })
      } else {
        await mockCreateTopic({
          ...formData,
          status: "published",
          heroMediaId,
        })
      }
      addToast("Topic published successfully", "success")
      router.push("/admin/topics")
    } catch (error) {
      addToast("Failed to publish topic", "error")
    } finally {
      setSaving(false)
      setShowPublishConfirm(false)
    }
  }

  const addChapter = () => {
    const newChapter: Chapter = {
      id: "ch-" + Date.now(),
      title: `Chapter ${formData.chapters.length + 1}`,
      blocks: [],
    }
    handleInputChange("chapters", [...formData.chapters, newChapter])
  }

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8 ">
  {/* Basic Information */}
  <section className="shadow-md rounded-xl p-6">
    <h2 className="text-2xl font-semibold  mb-6">Basic Information</h2>
    <div className="space-y-5">
      <div className="flex flex-col">
        <label className=" font-medium mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Topic title"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      <SlugInput
        title={formData.title}
        value={formData.slug}
        onChange={(slug) => handleInputChange("slug", slug)}
      />

      <div className="flex flex-col">
        <label className=" font-medium mb-1">Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
          placeholder="Brief subtitle"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className=" font-medium mb-1">Era</label>
          <input
            type="text"
            value={formData.era}
            onChange={(e) => handleInputChange("era", e.target.value)}
            placeholder="e.g., 1989"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label className=" font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="e.g., Berlin, Germany"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className=" font-medium mb-1">Timeline</label>
        <input
          type="text"
          value={formData.timeline}
          onChange={(e) => handleInputChange("timeline", e.target.value)}
          placeholder="e.g., 1961-1989"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
    </div>
  </section>

  {/* Content */}
  <section className=" shadow-md rounded-xl p-6">
    <h2 className="text-2xl font-semibold  mb-6">Content</h2>
    <div className="space-y-5">
      <div className="flex flex-col">
        <label className=" font-medium mb-1">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(e) => handleInputChange("summary", e.target.value)}
          placeholder="Brief summary of the topic"
          rows={3}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
        />
      </div>

      <div className="flex flex-col">
        <label className=" font-medium mb-1">Overview</label>
        <textarea
          value={formData.overview}
          onChange={(e) => handleInputChange("overview", e.target.value)}
          placeholder="Detailed overview"
          rows={5}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
        />
      </div>

      <TagInput label={"Category"} value={formData.category} onChange={(tags) => handleInputChange("category", tags)} />
      <TagInput label={"Key Points"} value={formData.keyPoints} onChange={(tags) => handleInputChange("keyPoints", tags)} />
    </div>
  </section>

  {/* Hero Media */}
  <section className=" shadow-md rounded-xl p-6">
    <h2 className="text-2xl font-semibold  mb-4">Hero Media</h2>
    <button
      type="button"
      onClick={() => setShowMediaModal(true)}
      className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition"
    >
      Choose from Media Library
    </button>
    {heroMediaId && <p className="text-sm  mt-2">Media selected: {heroMediaId}</p>}
  </section>

  {/* Sources */}
  <section className=" shadow-md rounded-xl p-6 border">
    <h2 className="text-2xl font-semibold  mb-4">Sources</h2>
    <RepeaterFields
      value={formData.sources}
      onChange={(sources) => handleInputChange("sources", sources)}
      label="Sources"
    />
  </section>

  {/* Chapters */}
  <section className=" shadow-md rounded-xl p-6 pb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold ">Chapters</h2>
      {/* <button
        type="button"
        onClick={addChapter}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
      >
        <Plus size={16} />
        Add Chapter
      </button> */}
    </div>

    <div className="space-y-4">
      {formData.chapters.map((chapter, index) => (
        <ChapterEditor
          key={chapter.id}
          chapter={chapter}
          index={index}
          onUpdate={(updated) => {
            const updated_chapters = [...formData.chapters];
            updated_chapters[index] = updated;
            handleInputChange("chapters", updated_chapters);
          }}
          onDelete={() => {
            handleInputChange(
              "chapters",
              formData.chapters.filter((_, i) => i !== index),
            );
          }}
        />
      ))}
    </div>
    <button
      type="button"
      onClick={addChapter}
      className="flex items-center float-end m-3 gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
    >
      <Plus size={16} />
      Add Chapter
    </button>
  </section>

  {/* Actions */}
  <div className="flex gap-4 justify-end">
    <button
      type="button"
      onClick={() => router.back()}
      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-600 transition"
    >
      Cancel
    </button>
    <button
      type="button"
      onClick={handleSaveDraft}
      disabled={saving}
      className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save Draft"}
    </button>
    <button
      type="button"
      onClick={() => setShowPublishConfirm(true)}
      disabled={saving}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
    >
      {saving ? "Publishing..." : "Publish"}
    </button>
  </div>

  {/* Modals */}
  <MediaLibraryModal
    isOpen={showMediaModal}
    onClose={() => setShowMediaModal(false)}
    onSelect={(media) => setHeroMediaId(media.id)}
  />

  <ConfirmModal
    isOpen={showPublishConfirm}
    title="Publish Topic"
    message="Are you sure you want to publish this topic? It will be visible to the public."
    confirmText="Publish"
    cancelText="Cancel"
    onConfirm={handlePublish}
    onCancel={() => setShowPublishConfirm(false)}
  />
</div>

  )
}
