import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

// TODO: Re-enable when Convex Auth is implemented
// Server middleware for SSR protection - DISABLED
export const authMiddleware = createMiddleware().server(
    async ({ next }) => {
        // Auth temporarily disabled - allow all requests
        return await next()
    }
);

// Server function to get session - returns mock session for now
export const getSessionFn = createServerFn({ method: "GET" }).handler(
    async () => {
        // Return a mock session until Convex Auth is implemented
        return {
            user: {
                id: 'temp-user',
                name: 'Geçici Kullanıcı',
                email: 'temp@example.com',
                emailVerified: true,
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        };
    }
);
