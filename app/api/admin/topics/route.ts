import { connectDB } from "@/lib/db";
import { withAdminRole } from "@/lib/middleware";
import { Topic, type ITopic, type IChapter, type IContentBlock, type ISourceSimple } from "@/models/Topic";
import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Utility to make slugs
function makeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

// ---------- GET (pagination + search + filters) ----------
async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || undefined;
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const timeline = searchParams.get("timeline") || undefined;
    const era = searchParams.get("era") || undefined;
    const location = searchParams.get("location") || undefined;

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (category) {
      const cats = category.split(",").map((s) => s.trim()).filter(Boolean);
      query.category = cats.length > 1 ? { $in: cats } : cats[0];
    }
    if (timeline) query.timeline = timeline;
    if (era) query.era = era;
    if (location) query.location = location;

    if (q && q.trim()) {
      query.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { summary: { $regex: q.trim(), $options: "i" } },
        { "chapters.blocks.text": { $regex: q.trim(), $options: "i" } },
        { "sources.title": { $regex: q.trim(), $options: "i" } },
      ];
    }

    const total = await Topic.countDocuments(query);
    const topics = await Topic.find(query)
      .select("_id title slug summary status heroMediaUrl category era publishedAt createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({ topics, total, totalPages, page, limit }, { status: 200 });
  } catch (err) {
    console.error("[Topics GET Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------- POST ----------
async function handlePOST(request: NextRequest) {
  try {
    await connectDB();
    const reqBody = await request.json();

    const user = (request as unknown as { user?: { userId?: string } }).user;

    const {
      title,
      slug: rawSlug,
      summary,
      overview,
      subtitle,
      timeline,
      era,
      location,
      chapters = [],
      sources = [],
      keyPoints = [],
      category = [],
      extraInfo = {},
      heroMediaUrl,
      heroMediaId,
      status = "draft",
      metaTitle,
      metaDescription,
    } = reqBody as Partial<ITopic> & { heroMediaId?: string };

    if (!title?.trim() || !summary?.trim()) {
      return NextResponse.json({ error: "Title and summary are required" }, { status: 400 });
    }

    const slug = rawSlug ? makeSlug(rawSlug) : makeSlug(title);
    const existing = await Topic.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const makeClientBlockId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const normalizedChapters: IChapter[] = Array.isArray(chapters)
      ? chapters.map((ch, idx) => ({
          title: ch?.title?.trim() || `Chapter ${idx + 1}`,
          subtitle: ch?.subtitle || "",
          order: typeof ch?.order === "number" ? ch.order : idx,
          blocks: Array.isArray(ch?.blocks)
            ? ch.blocks.map((b: IContentBlock) => ({
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
            ? ch.media
                .map((m) => {
                  if (typeof m === "string" && mongoose.Types.ObjectId.isValid(m)) {
                    return new mongoose.Types.ObjectId(m);
                  }
                  if (m instanceof mongoose.Types.ObjectId) {
                    return m;
                  }
                  return undefined;
                })
                .filter((m): m is mongoose.Types.ObjectId => !!m)
            : [],
        }))
      : [];

    const cleanSources: ISourceSimple[] = Array.isArray(sources)
      ? sources
          .filter((s): s is ISourceSimple => !!s?.title?.trim())
          .map((s) => ({
            title: s.title.trim(),
            url: s.url?.trim(),
          }))
      : [];

    const topicData: Partial<ITopic> & { createdBy?: mongoose.Types.ObjectId; updatedBy?: mongoose.Types.ObjectId } = {
      title: title.trim(),
      slug,
      summary,
      overview,
      subtitle,
      timeline,
      era,
      location,
      chapters: normalizedChapters,
      sources: cleanSources,
      keyPoints,
      category,
      extraInfo,
      heroMediaUrl,
      status,
      metaTitle,
      metaDescription,
      createdBy: user?.userId ? new mongoose.Types.ObjectId(user.userId) : undefined,
      updatedBy: user?.userId ? new mongoose.Types.ObjectId(user.userId) : undefined,
    };

    if (heroMediaId) {
      topicData.extraInfo = { ...extraInfo, heroMediaId };
    }

    if (status === "published") {
      topicData.publishedAt = new Date();
    }

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
