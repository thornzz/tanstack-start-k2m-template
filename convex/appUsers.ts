import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

// Get all app users with pagination - Using index for efficient ordering
export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        // IMPORTANT: withIndex kullanarak sıralama yapmalıyız
        // Aksi halde 1M kayıt için timeout olur
        return await ctx.db
            .query("appUsers")
            .withIndex("by_createdAt")
            .order("desc")
            .paginate(args.paginationOpts);
    },
});

// Search users with pagination
export const search = query({
    args: {
        search: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("appUsers")
            .withSearchIndex("search_name_email", (q) =>
                q.search("name", args.search)
            )
            .paginate(args.paginationOpts);
    },
});

// Get total count of users
export const count = query({
    args: {
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.search) {
            // Search count is expensive/approximate. Return 0 for now.
            return 0;
        }

        // Efficient Scalable Count from 'counters' table
        const counter = await ctx.db
            .query("counters")
            .withIndex("by_key", (q) => q.eq("key", "appUsers_count"))
            .unique();

        return counter?.value ?? 0;
    }
});

// DEPRECATED: Get all app users with pagination and optional search (Offset-based)
export const get = query({
    args: {
        page: v.optional(v.number()),
        pageSize: v.optional(v.number()),
        search: v.optional(v.string()),
    },
    handler: async (_ctx, _args) => {
        throw new Error("This query is deprecated. Please use 'list' or 'search' with cursor pagination.");
    },
});

// Get a single app user by ID
export const getById = query({
    args: {
        id: v.id("appUsers"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Seed sample app users data (Recursive for large datasets)
export const seed = mutation({
    args: {
        targetTotal: v.optional(v.number()),
        batchSize: v.optional(v.number()),
        currentBatch: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const targetTotal = args.targetTotal ?? 100000; // Default 100k
        const batchSize = args.batchSize ?? 1000; // Safe batch size per transaction
        const currentBatch = args.currentBatch ?? 0;

        // Check current count to avoid over-seeding if run multiple times
        // But for performance, we rely on the recursive loop state.
        // Let's just trust the process or check counter once at start?
        // For simplicity: We just add 'batchSize' records until we hit the 'targetTotal' limit relative to THIS execution sequence.
        // Actually, let's check the COUNTER.

        let currentTotal = 0;
        const counter = await ctx.db
            .query("counters")
            .withIndex("by_key", (q) => q.eq("key", "appUsers_count"))
            .unique();

        if (counter) {
            currentTotal = counter.value;
        }

        if (currentTotal >= targetTotal) {
            return { message: "Target total reached", count: currentTotal };
        }

        const names = [
            "Ahmet", "Mehmet", "Ayşe", "Fatma", "Ali", "Zeynep", "Mustafa", "Emine", "Hüseyin", "Hatice",
            "İbrahim", "Elif", "Hasan", "Merve", "Ömer", "Esra", "Yusuf", "Büşra", "Murat", "Selin",
            "Emre", "Deniz", "Canan", "Burak", "Gamze", "Kaan", "Ceren", "Volkan", "Derya", "Ozan"
        ];
        const surnames = [
            "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Öztürk", "Arslan", "Koç", "Özkan", "Aydın",
            "Yıldız", "Kılıç", "Doğan", "Polat", "Erdoğan", "Özdemir", "Çetin", "Güneş", "Aksoy", "Korkmaz",
            "Aktaş", "Yavuz", "Tekin", "Şimşek", "Ünal", "Keskin", "Güler", "Yüksel", "Avcı", "Bulut"
        ];

        let addedInThisBatch = 0;

        for (let i = 0; i < batchSize; i++) {
            if (currentTotal + addedInThisBatch >= targetTotal) break;

            const name = names[Math.floor(Math.random() * names.length)];
            const surname = surnames[Math.floor(Math.random() * surnames.length)];
            const fullName = `${name} ${surname}`;
            const email = `${name.toLowerCase()}.${surname.toLowerCase()}.${Math.floor(Math.random() * 999999)}@example.com`;

            await ctx.db.insert("appUsers", {
                name: fullName,
                email: email,
                role: Math.random() > 0.9 ? "Admin" : (Math.random() > 0.8 ? "Editor" : "User"),
                status: Math.random() > 0.2 ? "Aktif" : "Pasif",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            addedInThisBatch++;
        }

        // Update counter incrementally
        const newTotal = currentTotal + addedInThisBatch;
        if (counter) {
            await ctx.db.patch(counter._id, { value: newTotal });
        } else {
            await ctx.db.insert("counters", { key: "appUsers_count", value: newTotal });
        }

        // Recursive call if not finished
        if (newTotal < targetTotal) {
            await ctx.scheduler.runAfter(0, api.appUsers.seed, {
                targetTotal,
                batchSize,
                currentBatch: currentBatch + 1
            });
            return { message: `Batch ${currentBatch} processed. Added ${addedInThisBatch}. Continuing...`, count: newTotal, status: "IN_PROGRESS" };
        }

        return { message: "Seeding completed!", count: newTotal, status: "DONE" };
    },
});

// Clear all app users (recursive for large datasets)
export const clearAll = mutation({
    args: {},
    handler: async (ctx) => {
        const batchSize = 1000; // Delete in batches to avoid timeout

        // Get batch of records to delete
        const records = await ctx.db
            .query("appUsers")
            .take(batchSize);

        if (records.length === 0) {
            // All deleted, reset counter
            const counter = await ctx.db
                .query("counters")
                .withIndex("by_key", (q) => q.eq("key", "appUsers_count"))
                .unique();

            if (counter) {
                await ctx.db.patch(counter._id, { value: 0 });
            }

            return { message: "All appUsers deleted!", status: "DONE" };
        }

        // Delete batch
        for (const record of records) {
            await ctx.db.delete(record._id);
        }

        // Schedule next batch
        await ctx.scheduler.runAfter(0, api.appUsers.clearAll, {});

        return {
            message: `Deleted ${records.length} records. Continuing...`,
            status: "IN_PROGRESS"
        };
    },
});
