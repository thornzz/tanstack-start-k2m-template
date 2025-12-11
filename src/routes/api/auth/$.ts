import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../../../lib/auth'

export const Route = createFileRoute('/api/auth/$')({
    // @ts-ignore - server handlers are supported in TanStack Start but types might need update or ignore if conflict
    server: {
        handlers: {
            GET: ({ request }) => {
                return auth.handler(request)
            },
            POST: ({ request }) => {
                return auth.handler(request)
            },
        }
    }
})
