import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/')({ component: App })

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center gap-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white">
                Merhaba Dünya
            </h1>
            <Link
                to="/users"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
            >
                Kullanıcıları Görüntüle
            </Link>
        </div>
    )
}
