import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "nahi-hai-koi-secret"

export interface JWTPayload {
  userId: string
  email: string
  role: "superadmin" | "admin" | "editor" | "author" | "viewer"
  iat?: number
  exp?: number
}

export function generateToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value
}

// ✅ Correct: this version uses the response object
export function setTokenCookie(response: NextResponse, token: string) {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
}

export function clearTokenCookie(response: NextResponse) {
  response.cookies.delete("token")
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookie()
  if (!token) return null
  return verifyToken(token)
}

export function requireAdminRole(user: JWTPayload | null) {
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    throw new Error("Unauthorized: Admin access required")
  }
}

export function requireSuperAdminRole(user: JWTPayload | null) {
  if (!user || user.role !== "superadmin") {
    throw new Error("Unauthorized: Superadmin access required")
  }
}
