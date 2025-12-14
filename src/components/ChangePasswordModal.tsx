import { useState } from 'react'
import { useAuthActions } from "@convex-dev/auth/react"
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { translateAuthError } from '@/lib/authErrorTranslations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Key, X, Loader2, CheckCircle } from 'lucide-react'

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string
}

export function ChangePasswordModal({ isOpen, onClose, userEmail }: ChangePasswordModalProps) {
    const { signIn } = useAuthActions()
    const changePassword = useAction(api.passwordChange.changePassword)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalıdır')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler eşleşmiyor')
            return
        }

        setLoading(true)

        // Aşama 1: Mevcut şifre doğrulaması
        let currentPasswordValid = false
        try {
            await signIn("password", {
                email: userEmail,
                password: currentPassword,
                flow: "signIn"
            })
            currentPasswordValid = true
        } catch (signInErr: any) {
            // ConvexError ile gelen hata kodunu çevir
            console.error("Sign in error:", signInErr)
            setError(translateAuthError(signInErr))
            setLoading(false)
            return
        }

        // Aşama 2: Şifre değiştirme
        if (currentPasswordValid) {
            try {
                const result = await changePassword({
                    currentPassword,
                    newPassword,
                })

                if (result.success) {
                    setSuccess(true)
                    setTimeout(() => {
                        onClose()
                        resetForm()
                    }, 2000)
                } else {
                    setError(result.error || 'Şifre değiştirilemedi')
                }
            } catch (changeErr: any) {
                console.error("Password change error:", changeErr?.message)
                setError("Şifre değiştirme işlemi başarısız oldu. Lütfen tekrar deneyin.")
            }
        }

        setLoading(false)
    }

    const resetForm = () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError(null)
        setSuccess(false)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <Key className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Şifre Değiştir</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {success ? (
                    <div className="flex flex-col items-center py-8 gap-4">
                        <CheckCircle className="w-16 h-16 text-green-400" />
                        <p className="text-green-400 font-medium">Şifreniz başarıyla değiştirildi!</p>
                        <p className="text-slate-400 text-sm text-center">
                            Yeni şifrenizle giriş yapabilirsiniz.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-slate-300">
                                Mevcut Şifre
                            </Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-slate-800 border-slate-700 text-white"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-slate-300">
                                Yeni Şifre
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-slate-800 border-slate-700 text-white"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-300">
                                Yeni Şifre (Tekrar)
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-slate-800 border-slate-700 text-white"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/30">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Şifreyi Değiştir
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
