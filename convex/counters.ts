import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const counter = await ctx.db
            .query("counters")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();
        return counter?.value ?? 0;
    },
});

export const recalcUserCount = mutation({
    args: {},
    handler: async (ctx) => {
        const count = await ctx.db.query("appUsers").collect().then(users => users.length);

        const existing = await ctx.db
            .query("counters")
            .withIndex("by_key", (q) => q.eq("key", "appUsers_count"))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { value: count });
        } else {
            await ctx.db.insert("counters", { key: "appUsers_count", value: count });
        }

        return count;
    },
});
