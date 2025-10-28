// app/api/topics/[id]/route.ts
import { connectDB } from "@/lib/db";
import { withAdminRole } from "@/lib/middleware";
import { Topic } from "@/models/Topic";
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

/** Normalizers (re-used in POST and PUT) */
function normalizeBlocks(blocks: any[] = []) {
  return blocks.map((b: any) => ({
    _id: b?._id ? String(b._id) : makeClientBlockId(),
    type: b?.type || "paragraph",
    text: typeof b?.text === "string" ? b.text : "",
    items: Array.isArray(b?.items) ? b.items.map(String) : [],
    url: b?.url || undefined,
    caption: b?.caption || undefined,
    altText: b?.altText || undefined,
    meta: typeof b?.meta === "object" && b?.meta !== null ? b.meta : {},
  }));
}

function normalizeChapters(chapters: any[] = []) {
  return chapters.map((ch: any, idx: number) => {
    const mediaArr =
      Array.isArray(ch?.media) ?
        ch.media
          .filter((m: any) => mongoose.Types.ObjectId.isValid(m))
          .map((m: any) => new mongoose.Types.ObjectId(m))
        : [];

    return {
      title: (ch?.title && String(ch.title).trim()) || `Chapter ${idx + 1}`,
      subtitle: ch?.subtitle ? String(ch.subtitle) : undefined,
      order: typeof ch?.order === "number" ? ch.order : idx,
      blocks: normalizeBlocks(Array.isArray(ch?.blocks) ? ch.blocks : []),
      media: mediaArr,
    };
  });
}

function normalizeSources(sources: any[] = []) {
  return sources
    .filter((s: any) => s && String(s.title || "").trim())
    .map((s: any) => ({
      title: String(s.title).trim(),
      url: s?.url ? String(s.url).trim() : undefined,
    }));
}

// ---------- GET single topic ----------
async function handleGET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;
    console.log("Called and params id: ", id)
    // allow both ObjectId and slug (if not a valid ObjectId)
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const topic = await Topic.findOne(query)
      .select("-__v")
      .lean();

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic }, { status: 200 });
  } catch (err) {
    console.error("[Topic GET Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------- PUT (update) ----------
async function handlePUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(" Done hai ji")
  try {
    await connectDB();
    const user = (request as any).user;
    const { id } = await params;

    console.log("User :", user)
    // check exists
    const topic = await Topic.findById(id);
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const body = await request.json();
    console.log("BODY: ",body)

    // build update object only from provided fields (partial update)
    const update: any = {};
    if (body.title) update.title = String(body.title).trim();

    // slug logic: if client provided slug or title changed, compute new slug and ensure uniqueness
    if (body.slug || body.title) {
      const desired = body.slug ? makeSlug(String(body.slug)) : makeSlug(update.title || topic.title);
      if (desired !== topic.slug) {
        const existing = await Topic.findOne({ slug: desired });
        if (existing && String(existing._id) !== String(topic._id)) {
          return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        update.slug = desired;
      }
    }

    if (typeof body.summary === "string") update.summary = body.summary;
    if (typeof body.overview === "string") update.overview = body.overview;
    if (typeof body.subtitle === "string") update.subtitle = body.subtitle;
    if (Array.isArray(body.keyPoints)) update.keyPoints = body.keyPoints;
    if (Array.isArray(body.category)) update.category = body.category;
    if (typeof body.extraInfo === "object" && body.extraInfo !== null) {
      // merge with existing extraInfo (shallow)
      update.extraInfo = { ...(topic.extraInfo || {}), ...body.extraInfo };
    }
    if (typeof body.heroMediaUrl === "string") update.heroMediaUrl = body.heroMediaUrl;
    if (body.heroMediaId) {
      update.extraInfo = update.extraInfo || { ...(topic.extraInfo || {}) };
      update.extraInfo.heroMediaId = body.heroMediaId;
    }

    // chapters normalization if provided
    if (Array.isArray(body.chapters)) {
      update.chapters = normalizeChapters(body.chapters);
    }

    // sources normalization if provided
    if (Array.isArray(body.sources)) {
      update.sources = normalizeSources(body.sources);
    }

    // status/publish
    if (body.status) {
      if (["draft", "published", "archived"].includes(body.status)) {
        update.status = body.status;
        if (body.status === "published" && !topic.publishedAt) {
          update.publishedAt = new Date();
        }
        if (body.status !== "published" && topic.status === "published" && body.status === "draft") {
          // if moving back to draft, keep publishedAt but it's acceptable to clear if you want:
          // update.publishedAt = undefined;
        }
      }
    }

    // meta fields
    update.updatedBy = user?.userId || topic.updatedBy;
    update.revisionNumber = (topic.revisionNumber || 0) + 1;
    update.updatedAt = new Date();

    // apply update
    const updated = await Topic.findByIdAndUpdate(topic._id, update, { new: true, runValidators: true }).lean();

    return NextResponse.json({ topic: updated }, { status: 200 });
  } catch (err: any) {
    console.error("[Topic PUT Error]", err);
    // send mongoose validation messages as 400 when possible
    if (err?.name === "ValidationError") {
      const messages = Object.values(err.errors || {}).map((e: any) => e.message);
      return NextResponse.json({ error: messages.join("; ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Exported handlers wrapped with auth middleware (same pattern as your file) */
export const GET = handleGET;
export const PUT = withAdminRole(handlePUT);
