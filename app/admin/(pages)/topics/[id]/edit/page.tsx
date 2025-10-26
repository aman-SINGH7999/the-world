"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Topic } from "@/lib/types"
import { mockGetTopic } from "@/lib/mock-api"
import { TopicForm } from "@/components/topic-form"

export default function EditTopicPage() {
  const params = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTopic = async () => {
      const data = await mockGetTopic(params.id as string)
      setTopic(data || null)
      setLoading(false)
    }

    loadTopic()
  }, [params.id])

  if (loading) {
    return <p className="text-muted-foreground">Loading topic...</p>
  }

  if (!topic) {
    return <p className="text-error">Topic not found</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Edit Topic</h1>
      <TopicForm initialTopic={topic} />
    </div>
  )
}
