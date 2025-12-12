import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useQuery, useConvexAuth } from 'convex/react'
import { useAuthActions } from "@convex-dev/auth/react"
import { api } from '../../../convex/_generated/api'
import { LogOut } from 'lucide-react'

export const Route = createFileRoute('/_authed/')({ component: App })

function App() {
    const { signOut } = useAuthActions()
    const { isAuthenticated, isLoading } = useConvexAuth()
    const user = useQuery(api.users.currentUser)
    const router = useRouter()

    const [tokenStatus, setTokenStatus] = React.useState<string>('Checking...')

    React.useEffect(() => {
        const token = localStorage.getItem('__convexAuthToken') // Default key for Convex Auth
        setTokenStatus(token ? 'Present' : 'Missing')
    }, [])

    const handleLogout = async () => {
        await signOut()
        router.navigate({ to: '/login' })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            {/* Top Bar */}
            <div className="w-full bg-slate-950/50 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center px-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/20 rounded-full" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        K2M
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {user === undefined && <span className="text-sm text-slate-500">Yükleniyor...</span>}
                    {user === null && <span className="text-sm text-red-500">Kullanıcı bulunamadı</span>}
                    {user && (
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-medium text-white">{user.name || 'İsimsiz Kullanıcı'}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Çıkış Yap"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <h1 className="text-6xl md:text-8xl font-bold text-white">
                    Merhaba Dünya
                </h1>
                <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 px-6 py-3 h-auto text-base">
                    <Link to="/users">
                        Kullanıcıları Görüntüle
                    </Link>
                </Button>

                {/* Debug Info */}
                <div className="p-4 bg-slate-800/50 rounded text-xs font-mono text-slate-400 mt-4">
                    <p>Auth Status Debug:</p>
                    <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
                    <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
                    <p>Convex URL: {import.meta.env.VITE_CONVEX_URL}</p>
                    <p>Token in Storage: {tokenStatus}</p>
                </div>
            </div>
        </div>
    )
}
