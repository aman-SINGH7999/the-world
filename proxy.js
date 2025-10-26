import { NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

export default function middleware(request) {
  const { pathname } = request.nextUrl

  // Allow login page without authentication
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check if user has admin role
    if (payload.role !== "admin" && payload.role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
