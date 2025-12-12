import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { getSessionFn } from '../lib/middleware'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authed')({
    beforeLoad: async () => {
        // Get session (currently returns mock user)
        const session = await getSessionFn();
        return { user: session?.user };
    },
    component: AuthedLayout,
    // Auth middleware disabled temporarily
    // server: {
    //     middleware: [authMiddleware],
    // },
})

function AuthedLayout() {
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
                <div className="flex items-center gap-4">
                    <div className="text-sm">
                        <div className="font-bold text-white">Geçici Kullanıcı</div>
                        <div className="text-gray-400 text-xs">Auth devre dışı</div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}
