import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users with pagination and optional search
export const get = query({
    args: {
        page: v.optional(v.number()),
        pageSize: v.optional(v.number()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const page = args.page ?? 1;
        const pageSize = args.pageSize ?? 50;
        const search = args.search ?? "";

        // Get all users first (Convex handles this efficiently)
        let allUsers = await ctx.db.query("appUsers").collect();

        // Apply search filter if provided
        if (search) {
            const searchLower = search.toLowerCase();
            allUsers = allUsers.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
            );
        }

        const total = allUsers.length;
        const totalPages = Math.ceil(total / pageSize);

        // Apply pagination
        const offset = (page - 1) * pageSize;
        const users = allUsers.slice(offset, offset + pageSize);

        return {
            users,
            meta: {
                page,
                pageSize,
                total,
                totalPages,
            },
        };
    },
});

// Get a single user by ID
export const getById = query({
    args: {
        id: v.id("appUsers"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Seed sample users data
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if data already exists
        const existing = await ctx.db.query("appUsers").first();
        if (existing) {
            return { message: "Data already exists", count: 0 };
        }

        // Turkish names for sample data
        const turkishNames = [
            "Ahmet Yılmaz", "Mehmet Kaya", "Ayşe Demir", "Fatma Çelik", "Ali Şahin",
            "Zeynep Öztürk", "Mustafa Arslan", "Emine Koç", "Hüseyin Özkan", "Hatice Aydın",
            "İbrahim Yıldız", "Elif Kılıç", "Hasan Doğan", "Merve Polat", "Ömer Erdoğan",
            "Esra Özdemir", "Yusuf Çetin", "Büşra Güneş", "Murat Aksoy", "Selin Korkmaz",
            "Emre Aktaş", "Deniz Yavuz", "Canan Tekin", "Burak Şimşek", "Gamze Ünal"
        ];

        const roles = ["Admin", "User", "Editor"];
        const statuses = ["Aktif", "Pasif"];

        const now = Date.now();
        let count = 0;

        for (const name of turkishNames) {
            const email = name
                .toLowerCase()
                .replace(/ş/g, "s")
                .replace(/ı/g, "i")
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .replace(/ /g, ".")
                + "@example.com";

            await ctx.db.insert("appUsers", {
                name,
                email,
                role: roles[Math.floor(Math.random() * roles.length)],
                status: statuses[Math.floor(Math.random() * 4) === 0 ? 1 : 0], // 75% Aktif
                createdAt: now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                updatedAt: now,
            });
            count++;
        }

        return { message: "Seed completed", count };
    },
});
