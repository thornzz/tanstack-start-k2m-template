import { createFileRoute, Link } from '@tanstack/react-router'
import { useUsers } from '../../../hooks/useUsers'
import { type AppUser } from '../../../functions/users'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// User type from auth server
type AuthUser = {
    userId: string
    email?: string
    name?: string
    role?: string
}

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
    // useUsers hook'u ile veri çekme
    const { users, isLoading, error, refetch } = useUsers()
    // Get user from parent route context
    const { user } = Route.useRouteContext() as { user: AuthUser }

    // Loading durumu
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
                    <p className="text-gray-400">Kullanıcılar yükleniyor...</p>
                </div>
            </div>
        )
    }

    // Error durumu
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
                <div className="text-center bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-md">
                    <p className="text-red-400 font-semibold mb-2">Hata Oluştu</p>
                    <p className="text-gray-400 text-sm mb-4">{error.message}</p>
                    <Button
                        onClick={() => refetch()}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    >
                        Tekrar Dene
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Kullanıcılar</h1>
                        <p className="text-gray-400 mt-1">Hoş geldin, {user?.name || user?.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => refetch()}
                            variant="secondary"
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                        >
                            Yenile
                        </Button>
                        <Button asChild variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
                            <Link to="/">
                                Ana Sayfa
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 overflow-hidden">
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-700/50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">İsim</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Rol</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Durum</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.map((user: AppUser) => (
                                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 text-gray-300">{user.id}</td>
                                        <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Admin'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : user.role === 'Editor'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Aktif'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                                            >
                                                <Link
                                                    to="/users/$userId"
                                                    params={{ userId: String(user.id) }}
                                                >
                                                    Detay
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <p className="mt-6 text-gray-500 text-center text-sm">
                    Database'den {users.length} kullanıcı yüklendi (useUsers hook ile)
                </p>
            </div>
        </div>
    )
}
