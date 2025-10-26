// models/Topic.ts
import mongoose, { Schema, type Document } from "mongoose";

export type BlockType = "paragraph" | "heading" | "image" | "video" | "embed" | "quote" | "list";

export interface IContentBlock {
  _id?: mongoose.Types.ObjectId;
  type: BlockType;
  text?: string;             // sanitized HTML or plain text
  items?: string[];          // for list blocks
  url?: string;              // for image/video/embed - only URL stored
  mediaId?: mongoose.Types.ObjectId; // optional reference to Media doc
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
  category?: string[];   // e.g., ["history","geography"]
  timeline?: string;     // e.g., "1859" or "221 BCE"
  era?: string;          // e.g., "ancient"
  location?: string;     // e.g., "Mesopotamia"
  subtitle?: string;
  summary?: string;
  overview?: string;     // long HTML/text sanitized
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

const ContentBlockSchema = new Schema<IContentBlock>(
  {
    type: { type: String, enum: ["paragraph","heading","image","video","embed","quote","list"], required: true },
    text: { type: String }, // sanitized server-side
    items: [{ type: String }],
    url: { type: String }, // image/video/embed url (only)
    mediaId: { type: Schema.Types.ObjectId, ref: "Media" },
    caption: { type: String },
    altText: { type: String },
    meta: { type: Schema.Types.Mixed }
  },
  { _id: true },
);

const ChapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String },
    order: { type: Number, default: 0 },
    blocks: { type: [ContentBlockSchema], default: [] },
    media: [{ type: Schema.Types.ObjectId, ref: "Media" }]
  },
  { _id: true, timestamps: true },
);

const SourceSimpleSchema = new Schema<ISourceSimple>(
  {
    title: { type: String, required: true },
    url: { type: String }
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
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
    heroMediaUrl: { type: String },
    status: { type: String, enum: ["draft","published","archived"], default: "draft", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
    revisionNumber: { type: Number, default: 1 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true },
);

// Text index (title + summary + chapter texts)
TopicSchema.index({ title: "text", summary: "text", "chapters.blocks.text": "text", "sources.title": "text" });

// Pre-validate slug generation (if not provided)
TopicSchema.pre<ITopic>("validate", function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  }
  next();
});

// Helper for publish
TopicSchema.methods.publish = async function(userId?: mongoose.Types.ObjectId) {
  this.status = "published";
  this.publishedAt = new Date();
  if (userId) this.updatedBy = userId;
  this.revisionNumber = (this.revisionNumber || 0) + 1;
  return this.save();
};

export const Topic = mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
