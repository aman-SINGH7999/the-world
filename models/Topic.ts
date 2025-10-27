// models/Topic.ts
import mongoose, { Schema, type Document } from "mongoose";

export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "video"
  | "embed"
  | "quote"
  | "list";

export interface IContentBlock {
  _id?: string | mongoose.Types.ObjectId;
  type: BlockType;
  text?: string;
  items?: string[];
  url?: string;
  mediaId?: mongoose.Types.ObjectId;
  caption?: string;
  altText?: string;
  meta?: Record<string, unknown>;
}

export interface IChapter {
  title: string;
  subtitle?: string;
  order?: number;
  blocks: IContentBlock[];
  media?: mongoose.Types.ObjectId[];
}

export interface ISourceSimple {
  title: string;
  url?: string;
}

export interface ITopic extends Document {
  title: string;
  slug: string;
  category?: string[];
  timeline?: string;
  era?: string;
  location?: string;
  subtitle?: string;
  summary?: string;
  overview?: string;
  chapters: IChapter[];
  sources: ISourceSimple[];
  keyPoints?: string[];
  extraInfo?: Record<string, unknown>;
  heroMediaUrl?: string;
  status?: "draft" | "published" | "archived";
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  publishedAt?: Date;
  revisionNumber?: number;
  createdAt?: Date;
  updatedAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
}

// ---------------- SCHEMAS ---------------- //

const ContentBlockSchema = new Schema<IContentBlock>(
  {
    _id: { type: String, required: true }, // accept client-generated IDs
    type: {
      type: String,
      enum: ["paragraph", "heading", "image", "video", "embed", "quote", "list"],
      required: true,
    },
    text: String,
    items: [{ type: String }],
    url: String,
    mediaId: { type: Schema.Types.ObjectId, ref: "Media" },
    caption: String,
    altText: String,
    meta: Schema.Types.Mixed,
  },
  { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: String,
    order: { type: Number, default: 0 },
    blocks: { type: [ContentBlockSchema], default: [] },
    media: [{ type: Schema.Types.ObjectId, ref: "Media" }],
  },
  { timestamps: true }
);

const SourceSimpleSchema = new Schema<ISourceSimple>(
  {
    title: { type: String, required: true },
    url: String,
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    category: [{ type: String, index: true }],
    timeline: { type: String, index: true },
    era: { type: String, index: true },
    location: { type: String, index: true },
    subtitle: String,
    summary: String,
    overview: String,
    chapters: { type: [ChapterSchema], default: [] },
    sources: { type: [SourceSimpleSchema], default: [] },
    keyPoints: [{ type: String }],
    extraInfo: { type: Schema.Types.Mixed },
    heroMediaUrl: String,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
    revisionNumber: { type: Number, default: 1 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

// Index for text search
TopicSchema.index({
  title: "text",
  summary: "text",
  "chapters.blocks.text": "text",
  "sources.title": "text",
});

// Auto-generate slug
TopicSchema.pre<ITopic>("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  }
  next();
});

// Publish helper
TopicSchema.methods.publish = async function (userId?: mongoose.Types.ObjectId) {
  this.status = "published";
  this.publishedAt = new Date();
  if (userId) this.updatedBy = userId;
  this.revisionNumber = (this.revisionNumber || 0) + 1;
  return this.save();
};

export const Topic =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
