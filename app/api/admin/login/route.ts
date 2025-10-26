import { connectDB } from "@/lib/db"
import { generateToken, setTokenCookie } from "@/lib/auth"
import { User } from "@/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save({ validateBeforeSave: false })

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // ✅ Create response first
    const response = NextResponse.json({
      ok: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // ✅ Then set cookie on that response
    setTokenCookie(response, token)

    return response
  } catch (error) {
    console.error("[Login Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
