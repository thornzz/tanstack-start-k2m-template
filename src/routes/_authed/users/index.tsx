import { createFileRoute } from '@tanstack/react-router'
import { UserList } from '@/components/UserList'
import { type AuthUser } from '../../../types'
import { z } from 'zod'

// URL search params için validation schema
const usersSearchSchema = z.object({
    page: z.number().optional().default(0),
    pageSize: z.number().optional().default(25),
    search: z.string().optional().default(''),
})

/**
 * Users list page - Protected by _authed layout
 * Sayfa state'i URL'de tutulur, böylece geri dönüşte state korunur
 */
export const Route = createFileRoute('/_authed/users/')({
    component: UsersPage,
    validateSearch: usersSearchSchema,
})

function UsersPage() {
    // Get user from parent route context
    const { user } = Route.useRouteContext() as { user: AuthUser }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Kullanıcılar</h1>
                    <p className="text-slate-500 mt-1">Hoş geldin, {user?.name || user?.email}</p>
                </div>

                <UserList />
            </div>
        </div>
    )
}
