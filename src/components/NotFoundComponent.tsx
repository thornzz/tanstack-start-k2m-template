import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundComponent() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-center max-w-md">
                <CardHeader>
                    <CardTitle className="text-8xl font-bold text-cyan-500">404</CardTitle>
                    <CardDescription className="text-3xl font-semibold text-white mt-4">
                        Sayfa Bulunamadı
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-400">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                    </p>
                    <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                        <Link to="/">
                            Ana Sayfaya Dön
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
