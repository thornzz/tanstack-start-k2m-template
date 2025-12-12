import { createFileRoute } from '@tanstack/react-router'

// Auth API route - DISABLED until Convex Auth is implemented
// Returns 503 Service Unavailable

export const Route = createFileRoute('/api/auth/$')({
    // @ts-ignore
    server: {
        handlers: {
            GET: () => {
                return new Response(
                    JSON.stringify({ error: 'Auth service temporarily disabled. Convex Auth will be implemented soon.' }),
                    { status: 503, headers: { 'Content-Type': 'application/json' } }
                )
            },
            POST: () => {
                return new Response(
                    JSON.stringify({ error: 'Auth service temporarily disabled. Convex Auth will be implemented soon.' }),
                    { status: 503, headers: { 'Content-Type': 'application/json' } }
                )
            },
        }
    }
})
