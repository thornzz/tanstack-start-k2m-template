import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    files: defineTable({
        storageId: v.id("_storage"),
        name: v.string(),
        type: v.string(),
        size: v.optional(v.number()),
        author: v.string(),
        createdAt: v.number(),
    }).index("by_createdAt", ["createdAt"]),
    appUsers: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.string(),       // "Admin" | "User" | "Editor"
        status: v.string(),     // "Aktif" | "Pasif"
        createdAt: v.number(),  // timestamp in milliseconds
        updatedAt: v.number(),
    })
        .index("by_email", ["email"])
        .index("by_createdAt", ["createdAt"])  // Pagination için sıralama index'i
        .searchIndex("search_name_email", {
            searchField: "name",
            filterFields: ["email"],
        }),
    counters: defineTable({
        key: v.string(),
        value: v.number(),
    }).index("by_key", ["key"]),
});
