import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Users, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/_authed/')({ component: App })

function App() {
    const user = useQuery(api.users.currentUser)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            {/* Main Content - Top bar artık _authed.tsx'de */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-12 h-12 text-cyan-400" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white text-center">
                    Merhaba{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                </h1>
                <p className="text-slate-400 text-lg text-center max-w-md">
                    Convex Auth ile güvenli oturum açtınız. Artık korumalı sayfalara erişebilirsiniz.
                </p>
                <Button
                    asChild
                    className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 px-6 py-3 h-auto text-base"
                >
                    <Link to="/users">
                        <Users className="w-5 h-5 mr-2" />
                        Kullanıcıları Görüntüle
                    </Link>
                </Button>
            </div>
        </div>
    )
}
