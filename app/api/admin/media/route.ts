// app/api/admin/media/route.ts

import { connectDB } from "@/lib/db"
import { withAdminRole } from "@/lib/middleware"
import { Media } from "@/models/Media"
import { type NextRequest, NextResponse } from "next/server"

async function handleGET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const provider = searchParams.get("provider")
    const search = searchParams.get("search") || ""

    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 12

    // ✅ Build query
    const query: any = {}
    if (type) query.type = type
    if (provider) query.provider = provider
    if (search) {
      query.$or = [
        { caption: { $regex: search, $options: "i" } },
        { altText: { $regex: search, $options: "i" } },
      ]
    }

    const media = await Media.find(query)
      .select("_id type url provider thumbnailUrl caption altText uploadedAt")
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await Media.countDocuments(query)
    return NextResponse.json({ media, total, page, limit }, { status: 200 })

  } catch (error) {
    console.error("[Media GET Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handlePOST(request: NextRequest) {
  try {
    await connectDB()

    const user = (request as any).user
    const body = await request.json()

    const { type, url, provider, thumbnailUrl, caption, altText } = body

    if (!type || !url || !provider) {
      return NextResponse.json({ error: "Type, URL, and provider are required" }, { status: 400 })
    }

    const media = new Media({
      type,
      url,
      provider,
      thumbnailUrl: thumbnailUrl || undefined,
      caption: caption || undefined,
      altText: altText || undefined,
      uploadedBy: user.userId,
      uploadedAt: new Date(),
      processing: {
        status: "completed",
      },
    })

    await media.save()

    return NextResponse.json(
      {
        media: {
          _id: media._id,
          type: media.type,
          url: media.url,
          provider: media.provider,
          thumbnailUrl: media.thumbnailUrl,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Media POST Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = withAdminRole(handleGET)
export const POST = withAdminRole(handlePOST)
