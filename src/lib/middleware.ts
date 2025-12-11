import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./auth";

// Server middleware for SSR protection
export const authMiddleware = createMiddleware().server(
    async ({ next, request }) => {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) {
            throw redirect({ to: "/login" })
        }
        return await next()
    }
);

// Server function to get session - callable from beforeLoad for client-side protection
export const getSessionFn = createServerFn({ method: "GET" }).handler(
    async () => {
        const request = getRequest();
        const session = await auth.api.getSession({ headers: request.headers });
        return session;
    }
);

