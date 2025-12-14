/**
 * Custom Password Provider - Hata kodlarını ConvexError ile client'a aktarır
 * 
 * Convex Auth'un yerleşik Password provider'ı basit Error fırlatıyor ve
 * production'da bunlar "Server Error" olarak sanitize ediliyor.
 * 
 * Bu custom provider, ConvexError kullanarak hata kodlarını client'a gönderir.
 */

import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import {
    GenericActionCtxWithAuthConfig,
    createAccount,
    retrieveAccount,
} from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { Value } from "convex/values";
import { DataModel } from "./_generated/dataModel";

// Hata kodları - client'ta da kullanılacak
export const AuthErrorCodes = {
    INVALID_PASSWORD: "INVALID_PASSWORD",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    ACCOUNT_EXISTS: "ACCOUNT_EXISTS",
    ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
    MISSING_PASSWORD: "MISSING_PASSWORD",
    MISSING_EMAIL: "MISSING_EMAIL",
    PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
    INVALID_FLOW: "INVALID_FLOW",
} as const;

export type AuthErrorCode = typeof AuthErrorCodes[keyof typeof AuthErrorCodes];

// Custom ConvexError fırlatma
function throwAuthError(code: AuthErrorCode, message: string): never {
    throw new ConvexError({ code, message });
}

// Şifre doğrulama
function validatePassword(password: string | undefined): string {
    if (!password) {
        throwAuthError(AuthErrorCodes.MISSING_PASSWORD, "Şifre gereklidir");
    }
    if (password.length < 6) {
        throwAuthError(AuthErrorCodes.PASSWORD_TOO_SHORT, "Şifre en az 6 karakter olmalıdır");
    }
    return password;
}

interface PasswordProfile {
    email: string;
    name?: string;
}

interface PasswordConfig {
    profile?: (
        params: Record<string, Value | undefined>,
        ctx: GenericActionCtxWithAuthConfig<DataModel>
    ) => PasswordProfile;
}

/**
 * Custom Password provider - ConvexError ile hata kodlarını client'a gönderir
 */
export function CustomPassword(config: PasswordConfig = {}) {
    const provider = "password";

    return ConvexCredentials<DataModel>({
        id: "password",
        authorize: async (params, ctx) => {
            const flow = params.flow as string;

            // Profile bilgilerini al
            const profile = config.profile?.(params, ctx) ?? {
                email: params.email as string,
                name: params.name as string || "",
            };

            const { email } = profile;

            if (!email) {
                throwAuthError(AuthErrorCodes.MISSING_EMAIL, "E-posta adresi gereklidir");
            }

            const secret = params.password as string | undefined;

            if (flow === "signUp") {
                const validPassword = validatePassword(secret);

                try {
                    const { user } = await createAccount(ctx, {
                        provider,
                        account: { id: email, secret: validPassword },
                        profile: profile as any,
                        shouldLinkViaEmail: false,
                        shouldLinkViaPhone: false,
                    });
                    return { userId: user._id };
                } catch (error: any) {
                    // Hesap zaten varsa
                    if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
                        throwAuthError(AuthErrorCodes.ACCOUNT_EXISTS, "Bu e-posta adresi zaten kullanımda");
                    }
                    throw error;
                }

            } else if (flow === "signIn") {
                if (!secret) {
                    throwAuthError(AuthErrorCodes.MISSING_PASSWORD, "Şifre gereklidir");
                }

                try {
                    const retrieved = await retrieveAccount(ctx, {
                        provider,
                        account: { id: email, secret },
                    });

                    if (retrieved === null) {
                        throwAuthError(AuthErrorCodes.INVALID_CREDENTIALS, "Geçersiz e-posta veya şifre");
                    }

                    const { user } = retrieved;
                    return { userId: user._id };
                } catch (error: any) {
                    // "InvalidSecret" veya "InvalidAccountId" hatalarını yakala
                    if (error.message?.includes("InvalidSecret")) {
                        throwAuthError(AuthErrorCodes.INVALID_PASSWORD, "Şifre yanlış");
                    }
                    if (error.message?.includes("InvalidAccountId")) {
                        throwAuthError(AuthErrorCodes.ACCOUNT_NOT_FOUND, "Bu e-posta ile kayıtlı hesap bulunamadı");
                    }
                    // Eğer zaten ConvexError ise tekrar fırlat
                    if (error instanceof ConvexError) {
                        throw error;
                    }
                    throwAuthError(AuthErrorCodes.INVALID_CREDENTIALS, "Geçersiz e-posta veya şifre");
                }

            } else {
                throwAuthError(AuthErrorCodes.INVALID_FLOW, "Geçersiz işlem türü");
            }
        },
        crypto: {
            async hashSecret(password: string) {
                // Lucia Scrypt kullan
                const { Scrypt } = await import("lucia");
                return await new Scrypt().hash(password);
            },
            async verifySecret(password: string, hash: string) {
                const { Scrypt } = await import("lucia");
                return await new Scrypt().verify(hash, password);
            },
        },
    });
}
