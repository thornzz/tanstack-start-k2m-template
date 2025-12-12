import { createServerFn } from '@tanstack/react-start'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'

// Create a Convex HTTP client for server-side requests
const getConvexClient = () => {
    const CONVEX_URL = process.env.VITE_CONVEX_URL
    if (!CONVEX_URL) {
        throw new Error('VITE_CONVEX_URL environment variable is not set')
    }
    return new ConvexHttpClient(CONVEX_URL)
}

// Server function to fetch users from Convex and return JSON
export const getConvexUsers = createServerFn({ method: 'GET' })
    .inputValidator((data: unknown): { page?: number; pageSize?: number; search?: string } => {
        return {
            page: (data as any)?.page ?? 1,
            pageSize: (data as any)?.pageSize ?? 50,
            search: (data as any)?.search ?? '',
        }
    })
    .handler(async ({ data }) => {
        const client = getConvexClient()

        const result = await client.query(api.users.get, {
            page: data.page,
            pageSize: data.pageSize,
            search: data.search,
        })

        return {
            users: result.users,
            meta: result.meta,
        }
    })
