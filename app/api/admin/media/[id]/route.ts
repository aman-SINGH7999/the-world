import { connectDB } from "@/lib/db"
import { withAdminRole } from "@/lib/middleware"
import { Media } from "@/models/Media"
import { type NextRequest, NextResponse } from "next/server"

async function handleDELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params
    const media = await Media.findByIdAndDelete(id)

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Media deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("[Media DELETE Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const DELETE = withAdminRole(handleDELETE)
