import { v } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { getAuthUserId, modifyAccountCredentials } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Internal query - kullanıcı email'ini al
export const getUserEmail = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.email;
    },
});

// Şifre değiştirme action'ı
export const changePassword = action({
    args: {
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
        // Kullanıcının oturum açmış olması gerekiyor
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return { success: false, error: "Oturum açmanız gerekiyor" };
        }

        // Kullanıcı email'ini al
        const email = await ctx.runQuery(internal.passwordChange.getUserEmail, { userId });

        if (!email) {
            return { success: false, error: "Kullanıcı email'i bulunamadı" };
        }

        try {
            // Yeni şifreyi kaydet
            await modifyAccountCredentials(ctx, {
                provider: "password",
                account: {
                    id: email,
                    secret: args.newPassword,
                },
            });

            return { success: true };
        } catch (error: any) {
            console.error("Şifre değiştirme hatası:", error);
            return { success: false, error: error.message || "Şifre değiştirilemedi" };
        }
    },
});
