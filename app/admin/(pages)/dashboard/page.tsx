"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ImageIcon, Users } from "lucide-react"
import { mockGetTopics, mockGetMedia, mockGetUsers } from "@/lib/mock-api"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const [stats, setStats] = useState({ topics: 0, drafts: 0, media: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadStats = async () => {
      const topics = await mockGetTopics()
      const media = await mockGetMedia()
      const users = user?.role === "superadmin" ? await mockGetUsers() : []

      setStats({
        topics: topics.length,
        drafts: topics.filter((t) => t.status === "draft").length,
        media: media.length,
        users: users.length,
      })
      setLoading(false)
    }

    loadStats()
  }, [user])

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText size={24} />} label="Total Topics" value={stats.topics} href="/admin/topics" />
        <StatCard icon={<FileText size={24} />} label="Draft Topics" value={stats.drafts} href="/admin/topics" />
        <StatCard icon={<ImageIcon size={24} />} label="Media Items" value={stats.media} href="/admin/media" />
        {user?.role === "superadmin" && (
          <StatCard icon={<Users size={24} />} label="Users" value={stats.users} href="/admin/users" />
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/topics/new"
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors text-center"
          >
            <p className="font-medium text-foreground">Create Topic</p>
            <p className="text-sm text-muted-foreground">Add new documentary</p>
          </Link>
          <Link
            href="/admin/media"
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors text-center"
          >
            <p className="font-medium text-foreground">Upload Media</p>
            <p className="text-sm text-muted-foreground">Add images or videos</p>
          </Link>
          <Link
            href="/admin/topics"
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors text-center"
          >
            <p className="font-medium text-foreground">View Topics</p>
            <p className="text-sm text-muted-foreground">Manage all content</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: number
  href: string
}) {
  return (
    <Link href={href} className="card hover:border-primary transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className="text-primary opacity-20">{icon}</div>
      </div>
    </Link>
  )
}
