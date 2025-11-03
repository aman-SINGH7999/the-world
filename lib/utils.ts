import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

