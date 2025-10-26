import { withAdminRole } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

async function handlePOST(request: NextRequest) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "worlddoc-admin"

    // Create signature for signed upload
    const stringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`
    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex")

    return NextResponse.json(
      {
        timestamp,
        signature,
        apiKey,
        cloudName,
        uploadPreset,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Presign Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = withAdminRole(handlePOST)
