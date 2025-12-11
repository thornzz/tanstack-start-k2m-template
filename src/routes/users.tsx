import { createFileRoute, Link } from '@tanstack/react-router'
import { getUsers } from '../functions/users'
import { authMiddleware } from '../lib/middleware'

export const Route = createFileRoute('/users')({
    loader: () => getUsers(),
    component: UsersPage,
    // @ts-ignore
    server: {
        middleware: [authMiddleware]
    }
})

function UsersPage() {
    const users = Route.useLoaderData()

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-white">Kullanıcılar</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        Ana Sayfa
                    </Link>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
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
                            {users.map((user) => (
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
                                        <Link
                                            to="/users/$userId"
                                            params={{ userId: String(user.id) }}
                                            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors text-sm"
                                        >
                                            Detay
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="mt-6 text-gray-500 text-center text-sm">
                    Server function ile {users.length} kullanıcı yüklendi
                </p>
            </div>
        </div>
    )
}
