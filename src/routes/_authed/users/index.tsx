import { createFileRoute, Link } from '@tanstack/react-router'
import { UserList } from '@/components/UserList'
import { Button } from '@/components/ui/button'
import { type AuthUser } from '../../../types'

/**
 * Users list page - Protected by _authed layout
 * No need for individual auth checks - parent layout handles it
 * 
 * useUsers hook'u kullanılarak veri çekiliyor.
 * Bu sayede TanStack Query'nin cache, refetch ve loading state yönetimi kullanılıyor.
 */
export const Route = createFileRoute('/_authed/users/')({
    component: UsersPage,
})

function UsersPage() {
    // Get user from parent route context
    const { user } = Route.useRouteContext() as { user: AuthUser }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Kullanıcılar</h1>
                        <p className="text-gray-400 mt-1">Hoş geldin, {user?.name || user?.email}</p>
                    </div>
                    <Button asChild variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
                        <Link to="/">
                            Ana Sayfa
                        </Link>
                    </Button>
                </div>

                <UserList />
            </div>
        </div>
    )
}
