import { createFileRoute, Link } from '@tanstack/react-router'
import { getUserById, type AppUser } from '../../../functions/users'
import { DefaultErrorComponent } from '@/components/DefaultErrorComponent'
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
 * User detail page - Protected by _authed layout
 * Workaround: Using Error + errorComponent instead of notFound() due to TanStack Start SSR bug #5960
 */
export const Route = createFileRoute('/_authed/users/$userId')({
    loader: async ({ params: { userId } }) => {
        const user = await getUserById({ data: { userId } })
        if (!user) {
            throw new Error(`User with ID ${userId} not found`)
        }
        return user
    },
    component: UserDetailPage,
    errorComponent: DefaultErrorComponent,
})

function UserDetailPage() {
    const user = Route.useLoaderData() as AppUser
    // Get authenticated user from parent route context
    const { user: authUser } = Route.useRouteContext() as { user: AuthUser }

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
                                    <td className="px-6 py-4 text-white">{user.id}</td>
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
                    Database'den kullanıcı #{user.id} yüklendi
                </p>
            </div>
        </div>
    )
}
