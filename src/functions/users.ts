import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { appUsers } from '../db/schema'
import { eq } from 'drizzle-orm'

// Type for app users from database
export type AppUser = {
    id: number
    name: string
    email: string
    role: string
    status: string
    createdAt: Date
    updatedAt: Date
}

// Server function to fetch all users from database
export const getUsers = createServerFn().handler(async () => {
    console.log('[Server] Fetching all users from database...')
    const users = await db.select().from(appUsers)
    return users
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
