// Type definitions for WorldDoc Admin

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "editor" | "superadmin"
  createdAt: string
}

export type MediaItem = {
  _id: string
  type: "image" | "video" | "audio" | "embed"
  url: string
  provider: "cloudinary" | "youtube" | "vimeo" | "other"
  thumbnailUrl?: string
  caption?: string
  altText?: string
  uploadedAt?: string
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




// this is added by me
// ------------------------------
// UI-safe Type Definitions
// ------------------------------

export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "video"
  | "embed"
  | "quote"
  | "list"

// Represents a content block (text, image, video, etc.)
export interface IContentBlock {
  _id?: string
  type: BlockType
  text?: string
  items?: string[]
  url?: string
  mediaId?: string
  caption?: string
  altText?: string
  meta?: Record<string, unknown>
}

// Represents a chapter of a topic
export interface IChapter {
  title: string
  subtitle?: string
  order?: number
  blocks: IContentBlock[]
  media?: string[]
}

// Simple source (for references, bibliography, etc.)
export interface ISourceSimple {
  title: string
  url?: string
}

// The main Topic interface used in UI
export interface ITopic {
  _id?: string
  title: string
  slug: string
  category?: string[]
  timeline?: string
  era?: string
  location?: string
  subtitle?: string
  summary?: string
  overview?: string
  chapters: IChapter[]
  sources: ISourceSimple[]
  keyPoints?: string[]
  extraInfo?: Record<string, unknown>
  heroMediaUrl?: string
  status?: "draft" | "published" | "archived"
  createdBy?: string
  updatedBy?: string
  publishedAt?: string
  revisionNumber?: number
  createdAt?: string
  updatedAt?: string
  metaTitle?: string
  metaDescription?: string
}
