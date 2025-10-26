import { connectDB } from "@/lib/db"
import { withAdminRole } from "@/lib/middleware"
import { Topic } from "@/models/Topic"
import { Chapter } from "@/models/Chapter"
import { type NextRequest, NextResponse } from "next/server"

async function handleGET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const query: any = {}
    if (status) {
      query.status = status
    }

    const topics = await Topic.find(query)
      .select("_id title slug summary status publishedAt createdAt")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ topics }, { status: 200 })
  } catch (error) {
    console.error("[Topics GET Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handlePOST(request: NextRequest) {
  try {
    await connectDB()

    const user = (request as any).user
    const body = await request.json()

    const { title, slug, summary, heroMediaId, chapters, timelineItems, places, sources, status } = body

    if (!title || !slug || !summary) {
      return NextResponse.json({ error: "Title, slug, and summary are required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingTopic = await Topic.findOne({ slug })
    if (existingTopic) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    // Create chapters if provided
    let chapterIds: any[] = []
    if (chapters && Array.isArray(chapters)) {
      const createdChapters = await Chapter.insertMany(chapters)
      chapterIds = createdChapters.map((ch) => ch._id)
    }

    const topic = new Topic({
      title,
      slug: slug.toLowerCase().trim(),
      summary,
      heroMedia: heroMediaId || undefined,
      chapters: chapterIds,
      timelineItems: timelineItems || [],
      places: places || [],
      sources: sources || [],
      status: status || "draft",
      authors: [user.userId],
      publishedAt: status === "published" ? new Date() : undefined,
    })

    await topic.save()

    return NextResponse.json(
      {
        topic: {
          _id: topic._id,
          title: topic.title,
          slug: topic.slug,
          status: topic.status,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Topics POST Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAdminRole(handleGET)
export const POST = withAdminRole(handlePOST)
