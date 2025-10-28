// lib/middleware.ts
import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

// handler may accept (request, context) — support both sync/async handlers
type RouteHandler = (request: NextRequest, context?: any) => Promise<any> | any

export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest, context?: any) => {
    try {
      const token = request.cookies.get("token")?.value

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // await works whether verifyToken is sync or async
      const payload = await verifyToken(token)

      if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Attach user to request for handler to use
      ;(request as any).user = payload

      // forward both request and context to the wrapped handler
      return handler(request, context)
    } catch (err) {
      console.error("[withAuth] error:", err)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
}

export function withAdminRole(handler: RouteHandler) {
  return withAuth(async (request: NextRequest, context?: any) => {
    const user = (request as any).user

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    // forward context to original handler
    return handler(request, context)
  })
}

export function withSuperAdminRole(handler: RouteHandler) {
  return withAuth(async (request: NextRequest, context?: any) => {
    const user = (request as any).user

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden: Superadmin access required" }, { status: 403 })
    }

    return handler(request, context)
  })
}
