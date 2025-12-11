import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center max-w-md">
                <CardHeader>
                    <div className="text-6xl mb-2">⚠️</div>
                    <CardTitle className="text-3xl font-bold text-red-400">Bir Hata Oluştu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-400 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        {error.message}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={reset}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                        >
                            Tekrar Dene
                        </Button>
                        <Button asChild variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white">
                            <Link to="/">
                                Ana Sayfaya Dön
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
