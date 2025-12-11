import { Link } from '@tanstack/react-router'

export function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-red-400 mb-4">Bir Hata Oluştu</h1>
                <p className="text-gray-400 mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    {error.message}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Tekrar Dene
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    )
}
