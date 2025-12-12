import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    appUsers: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.string(),       // "Admin" | "User" | "Editor"
        status: v.string(),     // "Aktif" | "Pasif"
        createdAt: v.number(),  // timestamp in milliseconds
        updatedAt: v.number(),
    }).index("by_email", ["email"]),
});
