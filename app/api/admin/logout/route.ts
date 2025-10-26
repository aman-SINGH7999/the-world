import { clearTokenCookie } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await clearTokenCookie()

    return NextResponse.json({ ok: true, message: "Logged out successfully" }, { status: 200 })
  } catch (error) {
    console.error("[Logout Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
