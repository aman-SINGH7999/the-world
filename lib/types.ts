// Type definitions for WorldDoc Admin

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "editor" | "superadmin"
  createdAt: string
}

export interface MediaItem {
  id: string
  url: string
  caption: string
  altText: string
  provider: "cloudinary" | "youtube" | "vimeo" | "upload"
  type: "image" | "video" | "embed"
  createdAt: string
}

export interface Block {
  id: string
  type: "paragraph" | "heading" | "image" | "video" | "list"
  content: string
  mediaId?: string
}

export interface Chapter {
  id: string
  title: string
  blocks: Block[]
}

export interface Topic {
  id: string
  title: string
  slug: string
  subtitle: string
  category: string[]
  era: string
  timeline: string
  location: string
  summary: string
  overview: string
  heroMediaId?: string
  keyPoints: string[]
  sources: Array<{ title: string; url: string }>
  chapters: Chapter[]
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
