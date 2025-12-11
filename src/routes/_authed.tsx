import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '../lib/middleware'

/**
 * Protected routes layout
 * Better Auth TanStack documentation: Use server middleware for route protection
 * All routes under /_authed/ will be automatically protected
 */
export const Route = createFileRoute('/_authed')({
    component: AuthedLayout,
    server: {
        middleware: [authMiddleware],
    },
})

function AuthedLayout() {
    return <Outlet />
}
