import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IChapter, IContentBlock } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


export function isValidImageSrc(src?: string) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/")) return true; // root-relative

  try {
    const url = new URL(trimmed);
    return ["http:", "https:", "data:"].includes(url.protocol);
  } catch {
    return false;
  }
}


/**
 * Extract media (images/videos) from data shaped like the user's input.
 * - chapters: array of chapters; each chapter has blocks: []
 * Returns: { images: [], videos: [] }
 */

// Helper output type
export interface IMediaItem {
  id: string | null;
  type: "image" | "video" | "audio" | "embed";
  url: string;
  title?: string | null;
  description?: string | null;
}

// Main function
export function extractMedia(chapters: IChapter[] | null | undefined): IMediaItem[] {
  const media: IMediaItem[] = [];
  if (!chapters) return media;
  for (const chapter of chapters) {
    if (!chapter.blocks?.length) continue;

    for (const block of chapter.blocks) {
      if (!block.type) continue;

      const id = block._id ?? null;
      const text = block.text?.trim() ?? "";

      switch (block.type) {
        case "image":
          media.push({
            id,
            type: "image",
            url: block.url ?? "",
            title: block.caption?.trim() || text || null,
            description: text || null,
          });
          break;

        case "video":
          media.push({
            id,
            type: "video",
            url: block.url ?? "",
            title: block.caption?.trim() || text || null,
            description: text || null,
          });
          break;
      }

      // items[] can contain nested blocks (if typed like that)
      if (Array.isArray(block.items)) {
        for (const item of block.items) {
          // Ensure the item is an object & matches IContentBlock
          if (
            typeof item === "object" &&
            item !== null &&
            "type" in item &&
            (item as IContentBlock).type !== undefined
          ) {
            const nested = item as IContentBlock;
            const nestedId = nested._id ?? null;
            const nestedText = nested.text?.trim() ?? "";

            if (nested.type === "image" || nested.type === "video") {
              media.push({
                id: nestedId,
                type: nested.type,
                url: nested.url ?? "",
                title: nested.caption?.trim() || nestedText || null,
                description: nestedText || null,
              });
            }
          }
        }
      }
    }
  }

  return media;
}
