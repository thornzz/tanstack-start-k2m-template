import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

// Mock user data (same as users.index.tsx - in real app this would be in a shared file)
const mockUsers = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Admin', status: 'Aktif' },
    { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', role: 'User', status: 'Aktif' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', role: 'Editor', status: 'Pasif' },
    { id: 4, name: 'Fatma Çelik', email: 'fatma@example.com', role: 'User', status: 'Aktif' },
    { id: 5, name: 'Ali Öztürk', email: 'ali@example.com', role: 'Admin', status: 'Aktif' },
]

// Server function to fetch user by ID - returns user or null
const getUserById = createServerFn()
    .inputValidator((data: { userId: string }) => data)
    .handler(async ({ data }) => {
        // Simulate server delay
        await new Promise((resolve) => setTimeout(resolve, 100))
        console.log(`[Server] Fetching user with ID: ${data.userId}`)

        const user = mockUsers.find((u) => u.id === Number(data.userId))
        return user || null
    })

export const Route = createFileRoute('/users/$userId')({
    loader: async ({ params }) => {
        const user = await getUserById({ data: { userId: params.userId } })

        // Kullanıcı bulunamazsa hata fırlat - Error Boundary yakalayacak
        if (!user) {
            throw new Error(`Kullanıcı bulunamadı: #${params.userId} ID'li kullanıcı mevcut değil.`)
        }

        return { user, userId: params.userId }
    },
    component: UserDetailPage,
})

function UserDetailPage() {
    const { user } = Route.useLoaderData()

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/users"
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        ← Geri
                    </Link>
                    <h1 className="text-4xl font-bold text-white">Kullanıcı Detayı</h1>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
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
                </div>

                <p className="mt-6 text-gray-500 text-center text-sm">
                    Server function ile kullanıcı #{user.id} yüklendi
                </p>
            </div>
        </div>
    )
}
