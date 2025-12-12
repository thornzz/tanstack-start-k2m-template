/**
 * User-related TypeScript types
 */

// User roles (use for validation/UI)
export type UserRole = 'Admin' | 'User' | 'Editor'

// User status (use for validation/UI)
export type UserStatus = 'Aktif' | 'Pasif'

// App user type (from app_users table)
// Note: role and status are strings in DB, use UserRole/UserStatus for strict typing where needed
export type AppUser = {
    id: number
    name: string
    email: string
    role: string
    status: string
    createdAt: Date
    updatedAt: Date
}

// Auth user type (from Convex Auth users table)
export type AuthUser = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    createdAt: Date
    updatedAt: Date
}

// Create user input
export type CreateUserInput = {
    name: string
    email: string
    role: UserRole
    status?: UserStatus
}

// Update user input
export type UpdateUserInput = Partial<CreateUserInput>
