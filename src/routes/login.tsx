import { createFileRoute, useRouter, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthActions } from "@convex-dev/auth/react"
import { Authenticated, AuthLoading } from 'convex/react'
import { translateAuthError } from '@/lib/authErrorTranslations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
    component: Login,
})

function Login() {
    return (
        <>
            <AuthLoading>
                <LoadingScreen />
            </AuthLoading>
            <Authenticated>
                <RedirectToHome />
            </Authenticated>
            {/* Unauthenticated durumunda form gösterilecek */}
            <LoginForm />
        </>
    )
}

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
    )
}

function RedirectToHome() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate({ to: '/' })
    }, [navigate])

    return <LoadingScreen />
}

function LoginForm() {
    const { signIn } = useAuthActions()
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

        const flow = isSignUp ? "signUp" : "signIn"

        try {
            // signUp ise name'i de gönder, değilse boş string
            await signIn("password", { email, password, flow, name: isSignUp ? name : "" })
            router.navigate({ to: '/' })
        } catch (err: any) {
            setError(translateAuthError(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-900">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-slate-950">
                <div className="w-full max-w-sm mx-auto space-y-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white/20 rounded-full" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            K2M Tanstack Şablon
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {isSignUp ? 'Hesap oluştur' : 'Hesabınıza giriş yapın'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isSignUp ? 'Hesabınızı oluşturmak için bilgilerinizi girin' : 'Lütfen bilgilerinizi girin'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="name">İsim</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Adınız"
                                    className="h-11"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-posta adresiniz"
                                className="h-11"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-cyan-700 hover:bg-cyan-800 text-white shadow-sm transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            {loading ? 'İşleniyor...' : isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-slate-500">
                            {isSignUp ? 'Zaten hesabınız var mı?' : "Hesabınız yok mu?"}
                        </span>{' '}
                        <Button
                            variant="link"
                            className="p-0 h-auto font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Giriş Yap' : 'Kayıt Ol'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block w-1/2 relative bg-slate-900">
                <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply z-10" />
                <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="Network Connection"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-20" />

                <div className="absolute bottom-0 left-0 right-0 p-16 z-30 text-white font-light">
                    <h2 className="text-4xl font-medium leading-tight max-w-lg mb-4">
                        Geleceğin Teknolojisi ile Bağlanın
                    </h2>
                    <p className="text-lg text-slate-300 max-w-md">
                        Güvenli, hızlı ve modern altyapı çözümleri.
                    </p>
                </div>
            </div>
        </div>
    )
}
