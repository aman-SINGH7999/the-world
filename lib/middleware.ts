import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export interface AuthPayload {
  userId: string;
  role: "user" | "admin" | "superadmin";
  email?: string;
  iat?: number;
  exp?: number;
}

// Extend NextRequest to safely hold `user`
export interface AuthenticatedRequest extends NextRequest {
  user: AuthPayload;
}

type RouteHandler<T = unknown> = (
  request: AuthenticatedRequest,
  context?: { params?: Record<string, string> }
) => Promise<T> | T;

export function withAuth<T>(handler: RouteHandler<T>) {
  return async (request: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      const token = request.cookies.get("token")?.value;
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const authedRequest = Object.assign(request, { user: payload as AuthPayload });
      return handler(authedRequest, context);
    } catch (err) {
      console.error("[withAuth] error:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}

export function withAdminRole<T>(handler: RouteHandler<T>) {
  return withAuth(async (request, context) => {
    const user = request.user;
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
    return handler(request, context);
  });
}

export function withSuperAdminRole<T>(handler: RouteHandler<T>) {
  return withAuth(async (request, context) => {
    const user = request.user;
    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden: Superadmin access required" }, { status: 403 });
    }
    return handler(request, context);
  });
}
