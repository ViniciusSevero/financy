import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { AuthLayout } from '@/layouts/auth-layout'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'sonner'

export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const loginMutate = await login({
                email,
                password,
            })
            console.log(loginMutate)
            if (loginMutate) {
                toast.success("Login realizado com sucesso!")
            }
        } catch (error) {
            toast.success("Falha ao realizar o login!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout>

            <div className="w-full max-w-[480px] bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                        Fazer login
                    </h2>
                    <p className="text-sm text-gray-500 mt-1.5">
                        Entre na sua conta para continuar
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="mail@exemplo.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            icon={<Mail className="w-5 h-5" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Digite sua senha"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            icon={<Lock className="w-5 h-5" />}
                            rightElement={
                                showPassword ? (
                                    <EyeOff className="w-5 h-5 text-gray-400" onClick={() => setShowPassword(false)} />
                                ) : (
                                    <Eye className="w-5 h-5 text-gray-400" onClick={() => setShowPassword(true)} />
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4.5 h-4.5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            Lembrar-me
                        </label>
                        <a
                            href="#recuperar"
                            className="font-medium text-[#1b623b] hover:underline"
                        >
                            Recuperar senha
                        </a>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#1b623b] hover:bg-[#154d2e] text-white font-medium rounded-xl transition-all"
                    >
                        {isLoading ? 'Conectando...' : 'Entrar'}
                    </Button>
                </form>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-wider">ou</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div className="space-y-4 text-center">
                    <p className="text-sm text-gray-500">Ainda não tem uma conta?</p>
                    <a href="/cadastro">
                        <Button
                            variant="outline"
                            className="w-full h-12 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all"
                        >
                            <UserPlus className="w-5 h-5 text-gray-500" />
                            Criar conta
                        </Button>
                    </a>
                </div>
            </div>
        </AuthLayout>
    )
}