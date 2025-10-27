// app/api/admin/media/[id]/route.ts

import { connectDB } from "@/lib/db"
import { withAdminRole } from "@/lib/middleware"
import { Media } from "@/models/Media"
import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// ✅ Configure Cloudinary (only once)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

async function handleDELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = await context.params
    const media = await Media.findById(id)

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    const url = media.url
    let publicId: string | null = null

    // ✅ Safe public_id extraction
    try {
      const parts = url.split("/upload/")
      if (parts.length > 1) {
        const pathPart = parts[1].split(".")[0]
        publicId = pathPart.replace(/^v\d+\//, "")
      }
    } catch {
      console.warn("⚠️ Could not extract public_id from URL:", url)
    }

    // ✅ Delete from Cloudinary (if applicable)
    if (media.provider === "cloudinary" && publicId) {
      try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("✅ Cloudinary delete result:", result)
      } catch (cloudErr) {
        console.error("[Cloudinary DELETE Error]", cloudErr)
      }
    }

    // ✅ Delete from MongoDB
    await Media.findByIdAndDelete(id)

    return NextResponse.json({ message: "Media deleted successfully", id }, { status: 200 })
  } catch (error) {
    console.error("[Media DELETE Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ✅ Pass `context` correctly in wrapper
export const DELETE = (request: NextRequest, context: { params: { id: string } }) =>
  withAdminRole(() => handleDELETE(request, context))(request, context)
