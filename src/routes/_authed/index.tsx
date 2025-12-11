import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authed/')({ component: App })

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center gap-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white">
                Merhaba Dünya
            </h1>
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 px-6 py-3 h-auto text-base">
                <Link to="/users">
                    Kullanıcıları Görüntüle
                </Link>
            </Button>
        </div>
    )
}
