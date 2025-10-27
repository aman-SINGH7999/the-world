// app/api/admin/media/presign/route.ts
import crypto from "crypto"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { withAdminRole } from "@/lib/middleware" // uncomment if you want admin-only

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "" // optional

    // deterministic signing using sorted params
    const paramsToSign: Record<string, string | number> = { timestamp }
    if (uploadPreset) paramsToSign.upload_preset = uploadPreset

    const stringToSign =
      Object.keys(paramsToSign)
        .sort()
        .map((k) => `${k}=${paramsToSign[k]}`)
        .join("&") + apiSecret

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

// If you want to protect this endpoint so only admins can presign,
// uncomment the following and comment out the above `export`:
// async function handlePOST(request: NextRequest) { /* same body as above */ }
// export const POST = withAdminRole(handlePOST)
