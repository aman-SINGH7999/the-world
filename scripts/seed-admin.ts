import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { User } from "../models/User"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log("Connected to MongoDB")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@worlddoc.com" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("admin123", 10)

    const admin = new User({
      email: "admin@worlddoc.com",
      passwordHash,
      name: "Admin User",
      role: "admin",
    })

    await admin.save()
    console.log("Admin user created successfully")
    console.log("Email: admin@worlddoc.com")
    console.log("Password: admin123")
  } catch (error) {
    console.error("Seed error:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedAdmin()
