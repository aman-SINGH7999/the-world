"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { ITopic} from "@/lib/types"
import { TopicForm } from "@/components/topic-form"
import axios from "axios"

export default function EditTopicPage() {
  const params = useParams()
  const [topic, setTopic] = useState<ITopic | null>(null)
  const [loading, setLoading] = useState(true)

  console.log("Id: ", params)

  const loadTopic = async () => {
    try {
      const { data } = await axios.get(`/api/admin/topics/${params.id}`)
      setTopic(data.topic)
    } catch (err) {
      console.error("Failed to load topic", err)
      setTopic(null)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
     if (params?.id) loadTopic()
  }, [params?.id])

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
