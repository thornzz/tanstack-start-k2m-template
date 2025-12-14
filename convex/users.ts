import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current authenticated user (from Convex Auth users table)
export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return null;
        }
        return await ctx.db.get(userId);
    },
});
