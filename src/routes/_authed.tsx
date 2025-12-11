import { createFileRoute, Link, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { authMiddleware, getSessionFn } from '../lib/middleware'
import { authClient } from '../lib/auth-client'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authed')({
    beforeLoad: async () => {
        const session = await getSessionFn();
        if (!session) {
            throw redirect({ to: "/login" });
        }
        return { user: session.user };
    },
    component: AuthedLayout,
    server: {
        middleware: [authMiddleware],
    },
})

function AuthedLayout() {
    const { data: session } = authClient.useSession()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await authClient.signOut()
            router.navigate({ to: '/login' })
        } catch (error) {
            console.error('Logout error:', error)
            router.navigate({ to: '/login' })
        }
    }

    return (
        <>
            <nav className="p-3 flex gap-2 text-lg border-b border-slate-700 items-center justify-between bg-slate-900/80 backdrop-blur-sm">
                <div className="flex gap-4">
                    <Link to="/" className="[&.active]:text-cyan-400 text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                        Ana Sayfa
                    </Link>
                    <Link to="/users" className="[&.active]:text-cyan-400 text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                        Kullanıcılar
                    </Link>
                </div>
                {session && (
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <div className="font-bold text-white">{session.user.name}</div>
                            <div className="text-gray-400">{session.user.email}</div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogout}
                        >
                            Çıkış
                        </Button>
                    </div>
                )}
            </nav>
            <Outlet />
        </>
    )
}
