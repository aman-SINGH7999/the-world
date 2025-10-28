import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url);

    // pagination params
    const pageRaw = parseInt(searchParams.get("page") || "1", 10);
    const limitRaw = parseInt(searchParams.get("limit") || "20", 10);

    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const MAX_LIMIT = 100;
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, MAX_LIMIT)
        : 20;

    const skip = (page - 1) * limit;

    const users = await User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    
    // total count (matching filters)
    const total = await User.countDocuments();

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        users,
        total,
        totalPages,
        page,
        limit,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("[User GET Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
