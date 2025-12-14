import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'
import { useQuery } from 'convex/react'
import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from '@/components/ui/button'
import { ChangePasswordModal } from '@/components/ChangePasswordModal'
import { api } from '../../convex/_generated/api'
import { LogOut, Loader2, Key } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_authed')({
    component: AuthedLayout,
})

function AuthedLayout() {
    return (
        <>
            <AuthLoading>
                <LoadingScreen />
            </AuthLoading>
            <Unauthenticated>
                <RedirectToLogin />
            </Unauthenticated>
            <Authenticated>
                <AuthedContent />
            </Authenticated>
        </>
    )
}

// Loading ekranı
function LoadingScreen() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <p className="text-slate-400">Yükleniyor...</p>
            </div>
        </div>
    )
}

// Giriş yapmamış kullanıcıları login'e yönlendir
function RedirectToLogin() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate({ to: '/login' })
    }, [navigate])

    return <LoadingScreen />
}

// Giriş yapmış kullanıcılar için içerik
function AuthedContent() {
    const { signOut } = useAuthActions()
    const user = useQuery(api.users.currentUser)
    const navigate = useNavigate()
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    const handleLogout = async () => {
        await signOut()
        navigate({ to: '/login' })
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
                    <Link to="/files" className="[&.active]:text-cyan-400 text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                        Dosyalar
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    {user === undefined && (
                        <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                    )}
                    {user && (
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-medium text-white">{user.name || 'İsimsiz Kullanıcı'}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Şifre Değiştir"
                    >
                        <Key className="w-5 h-5" />
                    </Button>
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
            </nav>
            <Outlet />

            {/* Şifre Değiştirme Modalı */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                userEmail={user?.email || ''}
            />
        </>
    )
}
