import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    // Attach user to request for handler to use
    ;(request as any).user = payload

    return handler(request)
  }
}

export function withAdminRole(handler: Function) {
  return withAuth(async (request: NextRequest) => {
    const user = (request as any).user

    if (user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    return handler(request)
  })
}

export function withSuperAdminRole(handler: Function) {
  return withAuth(async (request: NextRequest) => {
    const user = (request as any).user

    if (user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden: Superadmin access required" }, { status: 403 })
    }

    return handler(request)
  })
}
