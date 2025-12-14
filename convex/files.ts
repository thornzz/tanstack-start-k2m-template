import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        // Optional: Check authentication
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveFile = mutation({
    args: {
        storageId: v.id("_storage"),
        name: v.string(),
        type: v.string(),
        size: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await ctx.db.get(userId);
        const name = user?.name || user?.email || "Anonymous";

        await ctx.db.insert("files", {
            storageId: args.storageId,
            name: args.name,
            type: args.type,
            size: args.size,
            author: name,
            createdAt: Date.now(),
        });
    },
});

export const getFiles = query({
    args: {},
    handler: async (ctx) => {
        const files = await ctx.db.query("files").withIndex("by_createdAt").order("desc").collect();

        return Promise.all(
            files.map(async (file) => ({
                ...file,
                url: await ctx.storage.getUrl(file.storageId),
            }))
        );
    },
});

export const deleteFile = mutation({
    args: {
        id: v.id("files"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const file = await ctx.db.get(args.id);
        if (!file) {
            throw new Error("File not found");
        }

        await ctx.storage.delete(file.storageId);
        await ctx.db.delete(args.id);
    },
});
