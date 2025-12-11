import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authMiddleware, getSessionFn } from '../lib/middleware'

/**
 * Protected routes layout
 * - server.middleware: Protects SSR (initial page load, hard refresh)
 * - beforeLoad: Protects client-side navigation (link clicks)
 */
export const Route = createFileRoute('/_authed')({
    beforeLoad: async () => {
        const session = await getSessionFn();
        if (!session) {
            throw redirect({ to: "/login" });
        }
        // Provide user data to child routes via context
        return { user: session.user };
    },
    component: AuthedLayout,
    server: {
        middleware: [authMiddleware],
    },
})

function AuthedLayout() {
    return <Outlet />
}

