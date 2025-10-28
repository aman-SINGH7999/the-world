// models/Media.ts
import mongoose, { Schema, type Document } from "mongoose";

export interface IMedia extends Document {
  _id: string;
  type: "image" | "video" | "audio" | "embed";
  url: string;
  provider: "cloudinary" | "youtube" | "vimeo" | "other";
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  processing: {
    status: "pending" | "completed" | "failed";
    error?: string;
  };
}

const mediaSchema = new Schema<IMedia>(
  {
    type: {
      type: String,
      enum: ["image", "video", "audio", "embed"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["cloudinary", "youtube", "vimeo", "other"],
      default: "other",
    },
    thumbnailUrl: String,
    caption: String,
    altText: String,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    processing: {
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed",
      },
      error: String,
    },
  },
  { timestamps: true },
);

export const Media = mongoose.models.Media || mongoose.model<IMedia>("Media", mediaSchema);
