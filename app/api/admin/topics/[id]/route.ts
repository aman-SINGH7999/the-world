import { connectDB } from "@/lib/db"
import { withAdminRole } from "@/lib/middleware"
import { Topic } from "@/models/Topic"
import { Chapter } from "@/models/Chapter"
import { type NextRequest, NextResponse } from "next/server"

async function handleGET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params
    const topic = await Topic.findById(id).populate("chapters").populate("heroMedia").populate("authors", "name email")

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json({ topic }, { status: 200 })
  } catch (error) {
    console.error("[Topic GET Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handlePUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()

    const topic = await Topic.findById(id)
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    // Update basic fields
    if (body.title) topic.title = body.title
    if (body.slug) {
      const existingTopic = await Topic.findOne({ slug: body.slug, _id: { $ne: id } })
      if (existingTopic) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
      }
      topic.slug = body.slug.toLowerCase().trim()
    }
    if (body.summary) topic.summary = body.summary
    if (body.heroMediaId) topic.heroMedia = body.heroMediaId
    if (body.status) {
      topic.status = body.status
      if (body.status === "published" && !topic.publishedAt) {
        topic.publishedAt = new Date()
      }
    }
    if (body.timelineItems) topic.timelineItems = body.timelineItems
    if (body.places) topic.places = body.places
    if (body.sources) topic.sources = body.sources

    // Handle chapters
    if (body.chapters && Array.isArray(body.chapters)) {
      // Delete old chapters
      await Chapter.deleteMany({ _id: { $in: topic.chapters } })

      // Create new chapters
      const createdChapters = await Chapter.insertMany(body.chapters)
      topic.chapters = createdChapters.map((ch) => ch._id)
    }

    await topic.save()

    return NextResponse.json({ topic }, { status: 200 })
  } catch (error) {
    console.error("[Topic PUT Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleDELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params
    const topic = await Topic.findById(id)

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    // Soft delete by archiving
    topic.status = "archived"
    await topic.save()

    return NextResponse.json({ message: "Topic archived successfully" }, { status: 200 })
  } catch (error) {
    console.error("[Topic DELETE Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAdminRole(handleGET)
export const PUT = withAdminRole(handlePUT)
export const DELETE = withAdminRole(handleDELETE)
