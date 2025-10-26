"use client"

import { TopicForm } from "@/components/topic-form"

export default function NewTopicPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Topic</h1>
      <TopicForm />
    </div>
  )
}
