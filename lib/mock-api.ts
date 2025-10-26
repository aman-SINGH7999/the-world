// Mock API layer - simulates backend responses with delay
// In production, replace fetch calls with real API endpoints

import type { Topic, MediaItem, User } from "./types"

const DELAY = 300 // ms

// Seed data
const seedTopics: Topic[] = [
  {
    id: "1",
    title: "The Fall of the Berlin Wall",
    slug: "fall-berlin-wall",
    subtitle: "A pivotal moment in modern history",
    category: ["History", "Cold War"],
    era: "1989",
    timeline: "1961-1989",
    location: "Berlin, Germany",
    summary: "The collapse of the Berlin Wall marked the end of the Cold War era.",
    overview:
      "The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War and the beginning of German reunification.",
    heroMediaId: "media-1",
    keyPoints: ["Cold War", "German Reunification", "Political Change"],
    sources: [
      { title: "History.com", url: "https://history.com" },
      { title: "BBC History", url: "https://bbc.com/history" },
    ],
    chapters: [
      {
        id: "ch-1",
        title: "The Construction",
        blocks: [{ id: "b-1", type: "paragraph", content: "The Berlin Wall was constructed in 1961..." }],
      },
    ],
    status: "published",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    title: "The Moon Landing",
    slug: "moon-landing",
    subtitle: "Humanity reaches the moon",
    category: ["Science", "Space"],
    era: "1969",
    timeline: "1961-1972",
    location: "Moon",
    summary: "Apollo 11 successfully landed humans on the moon.",
    overview:
      "On July 20, 1969, Apollo 11 astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the moon.",
    heroMediaId: "media-2",
    keyPoints: ["Space Exploration", "NASA", "Technology"],
    sources: [{ title: "NASA", url: "https://nasa.gov" }],
    chapters: [
      {
        id: "ch-2",
        title: "The Mission",
        blocks: [{ id: "b-2", type: "paragraph", content: "Apollo 11 was launched on July 16, 1969..." }],
      },
    ],
    status: "draft",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-05T11:20:00Z",
  },
]

const seedMedia: MediaItem[] = [
  {
    id: "media-1",
    url: "/berlin-wall.jpg",
    caption: "Berlin Wall",
    altText: "The Berlin Wall dividing East and West Berlin",
    provider: "upload",
    type: "image",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "media-2",
    url: "/moon-landing.jpg",
    caption: "Moon Landing",
    altText: "Apollo 11 astronauts on the moon",
    provider: "upload",
    type: "image",
    createdAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "media-3",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    caption: "Historical Documentary",
    altText: "Documentary video",
    provider: "youtube",
    type: "video",
    createdAt: "2024-01-14T12:00:00Z",
  },
  {
    id: "media-4",
    url: "/historical-archive.jpg",
    caption: "Archive Photo",
    altText: "Historical archive photograph",
    provider: "upload",
    type: "image",
    createdAt: "2024-01-16T14:00:00Z",
  },
]

const seedUsers: User[] = [
  {
    id: "user-1",
    email: "admin@worlddoc.com",
    name: "Admin User",
    role: "superadmin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "editor@worlddoc.com",
    name: "Editor User",
    role: "editor",
    createdAt: "2024-01-05T00:00:00Z",
  },
]

// In-memory storage (simulates database)
let topics = [...seedTopics]
let media = [...seedMedia]
const users = [...seedUsers]

// Helper: simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth API
export async function mockLogin(email: string, password: string) {
  await delay(DELAY)

  // Mock validation
  if (email === "admin@worlddoc.com" && password === "password") {
    return {
      success: true,
      user: seedUsers[0],
      token: "mock-jwt-token-" + Date.now(),
    }
  }

  return {
    success: false,
    error: "Invalid credentials",
  }
}

// Topics API
export async function mockGetTopics() {
  await delay(DELAY)
  return topics
}

export async function mockGetTopic(id: string) {
  await delay(DELAY)
  return topics.find((t) => t.id === id)
}

export async function mockCreateTopic(topic: Omit<Topic, "id" | "createdAt" | "updatedAt">) {
  await delay(DELAY)
  const newTopic: Topic = {
    ...topic,
    id: "topic-" + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  topics.push(newTopic)
  return newTopic
}

export async function mockUpdateTopic(id: string, updates: Partial<Topic>) {
  await delay(DELAY)
  const index = topics.findIndex((t) => t.id === id)
  if (index === -1) return null

  topics[index] = {
    ...topics[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return topics[index]
}

export async function mockDeleteTopic(id: string) {
  await delay(DELAY)
  topics = topics.filter((t) => t.id !== id)
  return { success: true }
}

// Media API
export async function mockGetMedia() {
  await delay(DELAY)
  return media
}

export async function mockUploadMedia(file: File, caption: string, altText: string) {
  await delay(DELAY + 500) // Simulate upload time

  const newMedia: MediaItem = {
    id: "media-" + Date.now(),
    url: URL.createObjectURL(file),
    caption,
    altText,
    provider: "upload",
    type: file.type.startsWith("image") ? "image" : "video",
    createdAt: new Date().toISOString(),
  }
  media.push(newMedia)
  return newMedia
}

export async function mockDeleteMedia(id: string) {
  await delay(DELAY)
  media = media.filter((m) => m.id !== id)
  return { success: true }
}

// Users API
export async function mockGetUsers() {
  await delay(DELAY)
  return users
}

export async function mockUpdateUserRole(id: string, role: string) {
  await delay(DELAY)
  const user = users.find((u) => u.id === id)
  if (user) {
    user.role = role as any
  }
  return user
}
