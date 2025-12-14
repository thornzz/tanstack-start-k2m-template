// Auth middleware - Simplified for Convex Auth
// SSR'da auth kontrolü yapılmaz, client-side Authenticated/Unauthenticated bileşenleri kullanılır

import { createMiddleware } from "@tanstack/react-start";

// Server middleware - SSR için auth kontrolü devre dışı
// Convex Auth client-side auth bileşenleri ile çalışır
export const authMiddleware = createMiddleware().server(
    async ({ next }) => {
        // SSR'da auth kontrolü yapılmaz
        // Client-side'da Authenticated/Unauthenticated bileşenleri kullanılır
        return await next()
    }
);
