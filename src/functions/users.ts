import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { appUsers } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { AppUser } from '../types'

// Re-export type for backward compatibility
export type { AppUser }

// Server function to fetch all users from database
import { sql, like, or } from 'drizzle-orm'

// Server function to fetch all users from database with pagination and search
export const getUsers = createServerFn({ method: 'GET' })
    .inputValidator((data: unknown): { page?: number; pageSize?: number; search?: string } => {
        return {
            page: (data as any)?.page ?? 1,
            pageSize: (data as any)?.pageSize ?? 50,
            search: (data as any)?.search ?? '',
        }
    })
    .handler(async ({ data }) => {
        const page = data.page || 1
        const pageSize = data.pageSize || 50
        const search = data.search || ''
        const offset = (page - 1) * pageSize

        console.log(`[Server] Fetching users page:${page} size:${pageSize} search:${search}`)

        let whereClause = undefined
        if (search) {
            const searchLower = `%${search.toLowerCase()}%`
            whereClause = or(
                like(appUsers.name, searchLower),
                like(appUsers.email, searchLower)
            )
        }

        // Parallel queries: Data + Count
        const [users, [{ count }]] = await Promise.all([
            db.select().from(appUsers)
                .where(whereClause)
                .limit(pageSize)
                .offset(offset),
            db.select({ count: sql<number>`count(*)` })
                .from(appUsers)
                .where(whereClause)
        ])

        return {
            users,
            meta: {
                page,
                pageSize,
                total: Number(count),
                totalPages: Math.ceil(Number(count) / pageSize)
            }
        }
    })

// Server function to fetch user by ID from database
export const getUserById = createServerFn({ method: 'GET' })
    .inputValidator((data: unknown): { userId: string } => {
        const input = data as { userId: string }
        if (!input || typeof input.userId !== 'string') {
            throw new Error('Invalid userId')
        }
        return input
    })
    .handler(async ({ data }) => {
        console.log(`[Server] Fetching user with ID: ${data.userId}`)

        const userId = Number(data.userId)
        if (isNaN(userId)) {
            return null
        }

        const users = await db.select().from(appUsers).where(eq(appUsers.id, userId))
        return users[0] || null
    })
