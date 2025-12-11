import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '../lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
    component: Login,
})

function Login() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                await authClient.signUp.email({
                    email,
                    password,
                    name,
                }, {
                    onRequest: () => {
                        setLoading(true)
                    },
                    onSuccess: () => {
                        setLoading(false)
                        setIsSignUp(false)
                    },
                    onError: (ctx) => {
                        setLoading(false)
                        setError(ctx.error.message)
                    }
                })
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                }, {
                    onRequest: () => {
                        setLoading(true)
                    },
                    onSuccess: () => {
                        setLoading(false)
                        router.navigate({ to: '/' })
                    },
                    onError: (ctx) => {
                        setLoading(false)
                        setError(ctx.error.message)
                    }
                })
            }
        } catch (err: any) {
            setLoading(false)
            setError(err.message || "An error occurred")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white">
                            {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {isSignUp ? 'Yeni hesabınız için bilgilerinizi girin' : 'Hesabınıza erişmek için giriş yapın'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-300">İsim</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Adınız"
                                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@email.com"
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">Şifre</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 focus-visible:ring-cyan-500"
                                />
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                            >
                                {loading ? 'İşleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-slate-800/50 px-2 text-gray-500">
                                        veya
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="w-full border-slate-600 text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                >
                                    {isSignUp ? 'Mevcut hesaba giriş yap' : 'Yeni hesap oluştur'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
