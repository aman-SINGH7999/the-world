import { connectDB } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Topic } from "@/models/Topic";
import { User } from "@/models/User"
import { Media } from "@/models/Media"

async function handleGET(request: NextRequest) {
  try {
    await connectDB();
    const allTopics = await Topic.countDocuments();
    const allUsers = await User.countDocuments();
    const allMedia = await Media.countDocuments();
    const publishedTopics = await Topic.countDocuments({status:"published"});
  return NextResponse.json(
      {
        allTopics,
        allUsers,
        allMedia,
        publishedTopics
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Topics GET Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = handleGET;