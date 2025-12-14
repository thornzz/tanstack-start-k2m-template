import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { DefaultErrorComponent } from '@/components/DefaultErrorComponent'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { type AuthUser } from '../../../types'

/**
 * User detail page - Protected by _authed layout
 * Uses Convex for data fetching
 */
export const Route = createFileRoute('/_authed/users/$userId')({
    component: UserDetailPage,
    errorComponent: DefaultErrorComponent,
})

function UserDetailPage() {
    const { userId } = Route.useParams()
    // Get authenticated user from parent route context
    const { user: authUser } = Route.useRouteContext() as { user: AuthUser }

    const { data: user, isLoading, error } = useQuery({
        ...convexQuery(api.appUsers.getById, { id: userId as Id<"appUsers"> }),
        enabled: !!userId,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-red-400 mb-4">Kullanıcı Bulunamadı</h1>
                    <p className="text-gray-400 mb-8">ID: {userId} ile eşleşen kullanıcı bulunamadı.</p>
                    <Button asChild variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
                        <Link to="/users">← Kullanıcılara Dön</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button asChild variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
                        <Link to="/users">
                            ← Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Kullanıcı Detayı</h1>
                        <p className="text-gray-400 text-sm">Görüntüleyen: {authUser?.name || authUser?.email}</p>
                    </div>
                </div>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 overflow-hidden">
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-700/50">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Alan</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Değer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-medium">ID</td>
                                    <td className="px-6 py-4 text-white font-mono text-sm">{user._id}</td>
                                </tr>
                                <tr className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-medium">İsim</td>
                                    <td className="px-6 py-4 text-white font-semibold">{user.name}</td>
                                </tr>
                                <tr className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-medium">Email</td>
                                    <td className="px-6 py-4 text-white">{user.email}</td>
                                </tr>
                                <tr className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-medium">Rol</td>
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
                                </tr>
                                <tr className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-medium">Durum</td>
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
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <p className="mt-6 text-gray-500 text-center text-sm">
                    Convex'ten kullanıcı yüklendi
                </p>
            </div>
        </div>
    )
}
