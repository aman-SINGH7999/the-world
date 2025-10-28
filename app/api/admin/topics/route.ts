import { connectDB } from "@/lib/db";
import { withAdminRole } from "@/lib/middleware";
import { Topic } from "@/models/Topic";
import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// slugify utility
function makeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}


// ---------- GET (pagination + title search + filters) ----------
async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // filters
    const status = searchParams.get("status") || undefined;
    const q = searchParams.get("q") || undefined; // search term
    const category = searchParams.get("category") || undefined;
    const timeline = searchParams.get("timeline") || undefined;
    const era = searchParams.get("era") || undefined;
    const location = searchParams.get("location") || undefined;

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

    // build query
    const query: any = {};
    if (status) query.status = status;
    if (category) {
      const cats = category.split(",").map((s) => s.trim()).filter(Boolean);
      if (cats.length === 1) query.category = cats[0];
      else if (cats.length > 1) query.category = { $in: cats };
    }
    if (timeline) query.timeline = timeline;
    if (era) query.era = era;
    if (location) query.location = location;

    // search logic — title partial match (case-insensitive)
    if (q && q.trim()) {
      query.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { summary: { $regex: q.trim(), $options: "i" } },
        { "chapters.blocks.text": { $regex: q.trim(), $options: "i" } },
        { "sources.title": { $regex: q.trim(), $options: "i" } },
      ];
    }

    // total count (matching filters)
    const total = await Topic.countDocuments(query);

    // fetch page
    const topics = await Topic.find(query)
      .select("_id title slug summary status publishedAt createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        topics,
        total,
        totalPages,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Topics GET Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ---------- POST ----------
async function handlePOST(request: NextRequest) {
  try {
    await connectDB();
    const user = (request as any).user;
    const body = await request.json();

    const {
      title,
      slug: rawSlug,
      summary,
      heroMediaUrl,
      heroMediaId,
      chapters,
      sources,
      keyPoints,
      extraInfo,
      status,
    } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { error: "Title and summary are required" },
        { status: 400 }
      );
    }

    const slug = rawSlug ? makeSlug(rawSlug) : makeSlug(title);

    const existing = await Topic.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    // normalize blocks & chapters
    const makeClientBlockId = () =>
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const normalizedChapters = Array.isArray(chapters)
      ? chapters.map((ch: any, idx: number) => ({
          title: ch?.title?.trim() || `Chapter ${idx + 1}`,
          subtitle: ch?.subtitle || "",
          order: typeof ch?.order === "number" ? ch.order : idx,
          blocks: Array.isArray(ch?.blocks)
            ? ch.blocks.map((b: any) => ({
                _id: b?._id ? String(b._id) : makeClientBlockId(),
                type: b?.type || "paragraph",
                text: b?.text || "",
                items: Array.isArray(b?.items) ? b.items : [],
                url: b?.url,
                caption: b?.caption,
                altText: b?.altText,
                meta: b?.meta || {},
              }))
            : [],
          media: Array.isArray(ch?.media)
            ? ch.media.map((m: any) =>
                mongoose.Types.ObjectId.isValid(m) ? new mongoose.Types.ObjectId(m) : undefined
              )
            : [],
        }))
      : [];

    const cleanSources = Array.isArray(sources)
      ? sources
          .filter((s: any) => s?.title?.trim())
          .map((s: any) => ({
            title: s.title.trim(),
            url: s.url ? s.url.trim() : undefined,
          }))
      : [];

    const topicData: any = {
      title: title.trim(),
      slug,
      summary,
      overview: body.overview || "",
      subtitle: body.subtitle || "",
      chapters: normalizedChapters,
      sources: cleanSources,
      keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
      category: Array.isArray(body.category) ? body.category : [],
      extraInfo: extraInfo || {},
      heroMediaUrl: heroMediaUrl || "",
      status: status === "published" ? "published" : "draft",
      createdBy: user?.userId,
      updatedBy: user?.userId,
    };

    if (heroMediaId) {
      topicData.extraInfo.heroMediaId = heroMediaId;
    }

    if (status === "published") topicData.publishedAt = new Date();

    const topic = new Topic(topicData);
    await topic.save();

    return NextResponse.json(
      {
        topic: {
          _id: topic._id,
          title: topic.title,
          slug: topic.slug,
          status: topic.status,
          publishedAt: topic.publishedAt || null,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Topics POST Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = handleGET;
export const POST = withAdminRole(handlePOST);
