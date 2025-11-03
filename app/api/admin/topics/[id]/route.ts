import { connectDB } from "@/lib/db";
import { withAdminRole } from "@/lib/middleware";
import {
  Topic,
  type ITopic,
  type IChapter,
  type IContentBlock,
  type ISourceSimple,
} from "@/models/Topic";
import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

/** Utility: slugify */
function makeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

/** Ensure client block id generator */
const makeClientBlockId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Normalize content blocks safely */
function normalizeBlocks(blocks: unknown[] = []): IContentBlock[] {
  return blocks
    .filter((b): b is Partial<IContentBlock> => typeof b === "object" && b !== null)
    .map((b) => ({
      _id: b._id ? String(b._id) : makeClientBlockId(),
      type: b.type || "paragraph",
      text: typeof b.text === "string" ? b.text : "",
      items: Array.isArray(b.items) ? b.items.map(String) : [],
      url: b.url ? String(b.url) : undefined,
      caption: b.caption ? String(b.caption) : undefined,
      altText: b.altText ? String(b.altText) : undefined,
      meta: typeof b.meta === "object" && b.meta !== null ? b.meta : {},
    }));
}

/** Normalize chapters safely */
function normalizeChapters(chapters: unknown[] = []): IChapter[] {
  return chapters
    .filter((ch): ch is Partial<IChapter> => typeof ch === "object" && ch !== null)
    .map((ch, idx) => {
      const media =
        Array.isArray(ch.media)
          ? ch.media
              // .filter(
              //   (m): m is string | mongoose.Types.ObjectId =>
              //     typeof m === "string" || m instanceof mongoose.Types.ObjectId
              // )
              .map((m) => {
                if (typeof m === "string" && mongoose.Types.ObjectId.isValid(m)) {
                  return new mongoose.mongo.ObjectId(m);
                }
                if (m instanceof mongoose.mongo.ObjectId) return m;
                return undefined;
              })
              .filter((m): m is mongoose.Types.ObjectId => !!m)
          : [];

      return {
        title: ch.title?.trim() || `Chapter ${idx + 1}`,
        subtitle: ch.subtitle ? String(ch.subtitle) : undefined,
        order: typeof ch.order === "number" ? ch.order : idx,
        blocks: normalizeBlocks(Array.isArray(ch.blocks) ? ch.blocks : []),
        media,
      };
    });
}

/** Normalize sources safely */
function normalizeSources(sources: unknown[] = []): ISourceSimple[] {
  return sources
    .filter(
      (s): s is Partial<ISourceSimple> =>
        typeof s === "object" && s !== null && !!(s as ISourceSimple).title
    )
    .map((s) => ({
      title: String(s.title).trim(),
      url: s.url ? String(s.url).trim() : undefined,
    }));
}

// ---------- GET single topic ----------
async function handleGET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const topic = await Topic.findOne(query).select("-__v").lean();

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic }, { status: 200 });
  } catch (err) {
    console.error("[Topic GET Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------- PUT (update topic) ----------
async function handlePUT(
  request: NextRequest,
  context?: { params?: Record<string, string> }   // ✅ same here
) {
  try {
    await connectDB();
    const user = (request as unknown as { user?: { userId?: string } }).user;

    // ✅ Fix: unwrap the async params
    const rawParams = context?.params;
    const params = await (rawParams as Promise<{ id?: string }> | { id?: string } | undefined);
    const id = params?.id;


    if (!id) {
      return NextResponse.json({ error: "Missing topic id" }, { status: 400 });
    }

    const topic = await Topic.findById(id);
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const body = (await request.json()) as Partial<ITopic> & {
      heroMediaId?: string;
    };

    const update: Partial<ITopic> = {};

    if (body.title) update.title = String(body.title).trim();

    // Handle slug changes
    if (body.slug || body.title) {
      const desired = makeSlug(body.slug || update.title || topic.title);
      if (desired !== topic.slug) {
        const existing = await Topic.findOne({ slug: desired });
        if (existing && String(existing._id) !== String(topic._id)) {
          return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        update.slug = desired;
      }
    }

    // --- NEW: timeline/era/location/metaTitle/metaDescription ---
    if (typeof body.timeline === "string") update.timeline = body.timeline;
    if (typeof body.era === "string") update.era = body.era;
    if (typeof body.location === "string") update.location = body.location;
    if (typeof body.metaTitle === "string") update.metaTitle = body.metaTitle;
    if (typeof body.metaDescription === "string") update.metaDescription = body.metaDescription;

    if (typeof body.summary === "string") update.summary = body.summary;
    if (typeof body.overview === "string") update.overview = body.overview;
    if (typeof body.subtitle === "string") update.subtitle = body.subtitle;
    if (Array.isArray(body.keyPoints)) update.keyPoints = body.keyPoints;
    if (Array.isArray(body.category)) update.category = body.category;

    if (typeof body.extraInfo === "object" && body.extraInfo !== null) {
      update.extraInfo = { ...(topic.extraInfo || {}), ...body.extraInfo };
    }

    if (typeof body.heroMediaUrl === "string") update.heroMediaUrl = body.heroMediaUrl;
    if (body.heroMediaId) {
      update.extraInfo = update.extraInfo || { ...(topic.extraInfo || {}) };
      (update.extraInfo as Record<string, unknown>).heroMediaId = body.heroMediaId;
    }

    if (Array.isArray(body.chapters)) update.chapters = normalizeChapters(body.chapters);
    if (Array.isArray(body.sources)) update.sources = normalizeSources(body.sources);

    // Status / publish
    if (body.status && ["draft", "published", "archived"].includes(body.status)) {
      update.status = body.status;
      if (body.status === "published" && !topic.publishedAt) {
        update.publishedAt = new Date();
      }
    }

    update.updatedBy = user?.userId
      ? new mongoose.mongo.ObjectId(user.userId)
      : topic.updatedBy;
    update.revisionNumber = (topic.revisionNumber || 0) + 1;
    update.updatedAt = new Date();

    const updated = await Topic.findByIdAndUpdate(topic._id, update, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ topic: updated }, { status: 200 });
  } catch (err) {
    console.error("[Topic PUT Error]", err);
    if (err instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(err.errors || {}).map((e) => e.message);
      return NextResponse.json({ error: messages.join("; ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// ---------- PATCH (archive topic) ----------
async function handlePATCH(
  request: NextRequest,
  context?: { params?: Record<string, string> }
) {
  try {
    await connectDB();
    const user = (request as unknown as { user?: { userId?: string } }).user;

    const id = context?.params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing topic id" }, { status: 400 });
    }

    // Find topic
    const topic = await Topic.findById(id);
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Update only the status
    topic.status = "archived";
    topic.updatedBy = user?.userId
      ? new mongoose.mongo.ObjectId(user.userId)
      : topic.updatedBy;
    topic.updatedAt = new Date();
    topic.revisionNumber = (topic.revisionNumber || 0) + 1;

    await topic.save();

    return NextResponse.json(
      { message: "Topic archived successfully", topic },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Topic PATCH Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




/** Exported handlers */
export const GET = handleGET;
export const PUT = withAdminRole(handlePUT);  // ✅ clean type match
export const PATCH = withAdminRole(handlePATCH);