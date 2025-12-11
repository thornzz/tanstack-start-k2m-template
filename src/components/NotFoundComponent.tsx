import { Link } from '@tanstack/react-router'

export function NotFoundComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <h1 className="text-8xl font-bold text-cyan-500 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-white mb-4">Sayfa Bulunamadı</h2>
                <p className="text-gray-400 mb-8">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium inline-block"
                >
                    Ana Sayfaya Dön
                </Link>
            </div>
        </div>
    )
}
